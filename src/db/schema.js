import { mysqlTable, int, varchar, text, decimal, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';

export const ads = mysqlTable('ads', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }),
  imageUrl: varchar('image_url', { length: 500 }),
  category: varchar('category', { length: 100 }),
  status: mysqlEnum('status', ['active', 'paused', 'finished']).default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
