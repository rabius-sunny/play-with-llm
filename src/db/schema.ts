import {
  pgTable,
  serial,
  varchar,
  text,
  decimal,
  timestamp,
  jsonb,
  index
} from 'drizzle-orm/pg-core';

export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    specifications: text('specifications').notNull(),
    category: varchar('category', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow()
  },
  (table) => ({
    categoryIdx: index('category_idx').on(table.category),
    priceIdx: index('price_idx').on(table.price)
  })
);

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 100 }),
  query: text('query').notNull(),
  parsedQuery: jsonb('parsed_query'),
  response: text('response').notNull(),
  timestamp: timestamp('timestamp').defaultNow()
});

export const queryCache = pgTable('query_cache', {
  id: serial('id').primaryKey(),
  queryHash: varchar('query_hash', { length: 64 }).unique().notNull(),
  cachedResponse: text('cached_response').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
