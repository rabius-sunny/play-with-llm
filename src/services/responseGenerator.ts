import OpenAI from 'openai';
import { Product } from '../db';
import { ParsedQuery } from './queryParser';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class ResponseGeneratorService {
  async generateResponse(
    originalQuery: string,
    parsedQuery: ParsedQuery,
    searchResults: Product[]
  ): Promise<string> {
    if (searchResults.length === 0) {
      return this.generateNoResultsResponse(originalQuery, parsedQuery);
    }

    const systemPrompt = `You are a helpful e-commerce assistant. Present search results naturally and helpfully.

Guidelines:
- Respond in the same language mix as the user's original query
- Highlight products that best match their needs
- For comparisons, create clear comparison tables or lists
- For recommendations, explain why you're suggesting specific products
- Don't ask follow up questions, just provide the information
- Don't mention anything like 'If you have further questions or need more options, let me know!' there won't be any further questions.
- If the user asks about anything unrelated to product, you should politely tell them that you can only help with product info.
- Include prices in the format mentioned by user or default currency
- Keep responses concise but informative

User's Intent: ${parsedQuery.intent}
User's Language: ${parsedQuery.language || 'mixed'}`;

    const userPrompt = `Original user query: "${originalQuery}"

Search results found (${searchResults.length} products):
${searchResults
  .map(
    (product, index) =>
      `${index + 1}. **${product.name}** - $${product.price}
     Category: ${product.category}
     Specifications: ${product.specifications}`
  )
  .join('\n\n')}

Please provide a helpful response that addresses the user's query using these search results.`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return (
        completion.choices[0]?.message?.content ||
        "I apologize, but I couldn't generate a proper response."
      );
    } catch (error) {
      console.error('Response generation failed:', error);
      return this.fallbackResponse(searchResults);
    }
  }

  private generateNoResultsResponse(
    originalQuery: string,
    parsedQuery: ParsedQuery
  ): string {
    const suggestions = [];

    if (parsedQuery.price_range?.max) {
      suggestions.push(
        `Try increasing your budget from $${parsedQuery.price_range.max}`
      );
    }

    if (parsedQuery.product_category) {
      suggestions.push(
        `Look in related categories beyond ${parsedQuery.product_category}`
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        'Try using different search terms or browse our categories'
      );
    }

    return `I couldn't find any products matching. 

Here are some suggestions:
${suggestions.map((s) => `• ${s}`).join('\n')}`;
  }

  private fallbackResponse(searchResults: Product[]): string {
    if (searchResults.length === 0) {
      return 'No products found matching your criteria.';
    }

    return `I found ${searchResults.length} products for you:

${searchResults
  .map(
    (product, index) =>
      `${index + 1}. ${product.name} - $${product.price}
   ${product.specifications.substring(0, 100)}...`
  )
  .join('\n\n')}

Would you like more details about any of these products?`;
  }

  async generateComparisonResponse(products: Product[]): Promise<string> {
    if (products.length < 2) {
      return 'I need at least 2 products to make a comparison.';
    }

    const systemPrompt = `You are an expert product comparison assistant. Create a clear, detailed comparison between the given products. Focus on key differences in specifications, features, and value proposition.`;

    const userPrompt = `Compare these products:

${products
  .map(
    (product, index) =>
      `Product ${index + 1}: ${product.name} - $${product.price}
   Specifications: ${product.specifications}`
  )
  .join('\n\n')}

Provide a detailed comparison highlighting key differences, strengths, and recommendations.`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1200
      });

      return (
        completion.choices[0]?.message?.content ||
        'Unable to generate comparison.'
      );
    } catch (error) {
      console.error('Comparison generation failed:', error);
      return this.fallbackComparison(products);
    }
  }

  private fallbackComparison(products: Product[]): string {
    return `Comparison of ${products.length} products:

${products
  .map(
    (product, index) =>
      `**${product.name}** - $${product.price}
   Key specs: ${product.specifications.substring(0, 150)}...`
  )
  .join('\n\n')}

Each product has its unique strengths. Would you like me to elaborate on any specific aspect?`;
  }
}
