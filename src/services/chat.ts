import { QueryParserService } from './queryParser';
import { ProductSearchService } from './productSearch';
import { ResponseGeneratorService } from './responseGenerator';
import { CacheService } from './cache';
import { db, conversations } from '../db';
import { eq, desc } from 'drizzle-orm';

export class ChatService {
  private queryParser: QueryParserService;
  private productSearch: ProductSearchService;
  private responseGenerator: ResponseGeneratorService;
  private cache: CacheService;

  constructor() {
    this.queryParser = new QueryParserService();
    this.productSearch = new ProductSearchService();
    this.responseGenerator = new ResponseGeneratorService();
    this.cache = new CacheService();
  }

  async processQuery(
    userInput: string,
    userId?: string
  ): Promise<{
    response: string;
    parsedQuery: any;
    productCount: number;
    cached: boolean;
  }> {
    try {
      // Check cache first
      const cached = await this.cache.get(userInput);
      if (cached) {
        return {
          response: cached,
          parsedQuery: null,
          productCount: 0,
          cached: true
        };
      }

      // Stage 1: Parse user query with AI
      console.log('Parsing query:', userInput);
      const parsedQuery = await this.queryParser.parseQuery(userInput);
      console.log('Parsed query:', parsedQuery);

      // Stage 2: Search products in database
      const searchResults = await this.searchProducts(parsedQuery, userInput);
      console.log('Found products:', searchResults.length);

      // Stage 3: Generate AI response
      const response = await this.generateResponse(
        userInput,
        parsedQuery,
        searchResults
      );

      // Stage 4: Cache and store conversation
      await this.cache.set(userInput, response);
      await this.storeConversation(userId, userInput, parsedQuery, response);

      return {
        response,
        parsedQuery,
        productCount: searchResults.length,
        cached: false
      };
    } catch (error) {
      console.error('Chat service error:', error);
      return {
        response:
          'I apologize, but I encountered an error while processing your request. Please try again.',
        parsedQuery: null,
        productCount: 0,
        cached: false
      };
    }
  }

  private async searchProducts(parsedQuery: any, originalQuery: string) {
    // Handle different intents
    switch (parsedQuery.intent) {
      case 'compare':
        // For comparison, try to find specific products mentioned
        if (parsedQuery.search_terms.length >= 2) {
          return await this.productSearch.searchByExactNames(
            parsedQuery.search_terms
          );
        }
        break;

      case 'search':
      case 'recommend':
      default:
        return await this.productSearch.searchProducts(parsedQuery);
    }

    return await this.productSearch.searchProducts(parsedQuery);
  }

  private async generateResponse(
    userInput: string,
    parsedQuery: any,
    searchResults: any[]
  ) {
    if (parsedQuery.intent === 'compare' && searchResults.length >= 2) {
      return await this.responseGenerator.generateComparisonResponse(
        searchResults
      );
    }

    return await this.responseGenerator.generateResponse(
      userInput,
      parsedQuery,
      searchResults
    );
  }

  private async storeConversation(
    userId: string | undefined,
    query: string,
    parsedQuery: any,
    response: string
  ) {
    try {
      await db.insert(conversations).values({
        userId: userId || 'anonymous',
        query,
        parsedQuery: parsedQuery,
        response
      });
    } catch (error) {
      console.error('Failed to store conversation:', error);
    }
  }

  async getConversationHistory(userId: string, limit: number = 10) {
    try {
      return await db
        .select()
        .from(conversations)
        .where(eq(conversations.userId, userId))
        .orderBy(desc(conversations.timestamp))
        .limit(limit);
    } catch (error) {
      console.error('Failed to get conversation history:', error);
      return [];
    }
  }
}
