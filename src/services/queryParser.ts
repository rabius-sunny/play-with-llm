import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Schema for parsed query structure
export const ParsedQuerySchema = z.object({
  product_category: z.string().optional(),
  price_range: z
    .object({
      min: z.number().optional(),
      max: z.number().optional()
    })
    .optional(),
  key_features: z.array(z.string()).optional(),
  search_terms: z.array(z.string()),
  intent: z.enum(['search', 'compare', 'recommend', 'question']),
  currency: z.string().optional(),
  language: z.string().optional()
});

export type ParsedQuery = z.infer<typeof ParsedQuerySchema>;

export class QueryParserService {
  async parseQuery(userInput: string): Promise<ParsedQuery> {
    const systemPrompt = `You are a search query parser for an e-commerce site. Extract structured search parameters from user input in any language.

Extract and return ONLY a valid JSON object with these fields:
- product_category: (electronics, smartphones, laptops, headphones, tablets, etc.)
- price_range: {min: number, max: number} (extract currency amounts, convert if needed)
- key_features: [list of important features mentioned]
- search_terms: [relevant keywords for database search]
- intent: (search, compare, recommend, question)
- currency: (if mentioned: dollars, rupees, euros, etc.)
- language: (detected language: english, hindi, spanish, etc.)

Examples:
Input: "मुझे एक gaming laptop चाहिए under 50000 rupees with good graphics"
Output: {"product_category": "laptops", "price_range": {"min": 0, "max": 50000}, "key_features": ["gaming", "graphics", "performance"], "search_terms": ["laptop", "gaming", "graphics"], "intent": "search", "currency": "rupees", "language": "hindi-english"}

Input: "Compare iPhone 15 with Samsung Galaxy S24"
Output: {"product_category": "smartphones", "key_features": [], "search_terms": ["iPhone 15", "Samsung Galaxy S24"], "intent": "compare", "language": "english"}

Only return the JSON object, no other text.`;

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput }
        ],
        temperature: 0.1,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content?.trim();
      if (!response) throw new Error('No response from AI');

      // Parse JSON response
      const parsed = JSON.parse(response);
      return ParsedQuerySchema.parse(parsed);
    } catch (error) {
      console.error('Query parsing failed:', error);
      // Fallback to simple keyword extraction
      return this.fallbackParse(userInput);
    }
  }

  private fallbackParse(userInput: string): ParsedQuery {
    const words = userInput.toLowerCase().split(/\s+/);

    // Simple keyword extraction
    const categories = [
      'laptop',
      'phone',
      'smartphone',
      'tablet',
      'headphones'
    ];
    const foundCategory = categories.find((cat) =>
      words.some((word) => word.includes(cat))
    );

    // Simple price extraction
    const priceMatch = userInput.match(/(\d+)/g);
    const maxPrice = priceMatch
      ? parseInt(priceMatch[priceMatch.length - 1])
      : undefined;

    return {
      product_category: foundCategory,
      price_range: maxPrice ? { max: maxPrice } : undefined,
      search_terms: words.filter((word) => word.length > 2),
      intent: words.some((w) => ['compare', 'vs', 'versus'].includes(w))
        ? 'compare'
        : 'search',
      key_features: words.filter((word) =>
        ['gaming', 'fast', 'good', 'best', 'cheap', 'budget'].includes(word)
      )
    };
  }
}
