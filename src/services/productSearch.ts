import { db, products, Product } from '../db';
import { like, and, gte, lte, or, sql, ilike, inArray } from 'drizzle-orm';
import { ParsedQuery } from './queryParser';

export class ProductSearchService {
  async searchProducts(parsedQuery: ParsedQuery): Promise<Product[]> {
    try {
      let whereConditions: any[] = [];

      // Category filter
      if (parsedQuery.product_category) {
        whereConditions.push(
          ilike(products.category, `%${parsedQuery.product_category}%`)
        );
      }

      // Price range filter
      if (parsedQuery.price_range) {
        if (parsedQuery.price_range.min) {
          whereConditions.push(
            gte(products.price, parsedQuery.price_range.min.toString())
          );
        }
        if (parsedQuery.price_range.max) {
          whereConditions.push(
            lte(products.price, parsedQuery.price_range.max.toString())
          );
        }
      }

      // Search terms - search in name and specifications
      if (parsedQuery.search_terms && parsedQuery.search_terms.length > 0) {
        const searchConditions = parsedQuery.search_terms.map((term) =>
          or(
            ilike(products.name, `%${term}%`),
            ilike(products.specifications, `%${term}%`)
          )
        );
        whereConditions.push(or(...searchConditions));
      }

      // Key features search
      if (parsedQuery.key_features && parsedQuery.key_features.length > 0) {
        const featureConditions = parsedQuery.key_features.map((feature) =>
          or(
            ilike(products.name, `%${feature}%`),
            ilike(products.specifications, `%${feature}%`)
          )
        );
        whereConditions.push(or(...featureConditions));
      }

      // Build the query
      let query = db.select().from(products);

      if (whereConditions.length > 0) {
        query = query.where(and(...whereConditions)) as typeof query;
      }

      // Limit results to prevent overwhelming the AI
      const results = await query.limit(10).orderBy(products.price);

      return results;
    } catch (error) {
      console.error('Product search failed:', error);
      return [];
    }
  }

  async getProductsByIds(ids: number[]): Promise<Product[]> {
    try {
      const results = await db
        .select()
        .from(products)
        .where(inArray(products.id, ids));
      return results;
    } catch (error) {
      console.error('Get products by IDs failed:', error);
      return [];
    }
  }

  async searchByExactNames(names: string[]): Promise<Product[]> {
    try {
      const searchConditions = names.map((name) =>
        ilike(products.name, `%${name}%`)
      );

      const results = await db
        .select()
        .from(products)
        .where(or(...searchConditions))
        .limit(10);

      return results;
    } catch (error) {
      console.error('Search by exact names failed:', error);
      return [];
    }
  }
}
