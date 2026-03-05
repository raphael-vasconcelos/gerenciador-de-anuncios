import { jest } from '@jest/globals';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Banco SQLite em memória — compartilhado por todos os testes
const sqlite = new Database(':memory:');
export const db = drizzle(sqlite);

// Schema equivalente ao MySQL, mas para SQLite
export const ads = sqliteTable('ads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  price: text('price'),
  imageUrl: text('image_url'),
  category: text('category'),
  status: text('status').default('active').notNull(),
  createdAt: text('created_at'),
  updatedAt: text('updated_at'),
});

// Cria as tabelas
sqlite.exec(`
  CREATE TABLE ads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price TEXT,
    image_url TEXT,
    category TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);



// Substitui os módulos reais (MySQL) pelos de SQLite
jest.unstable_mockModule('../src/db/index.js', () => ({ db }));
jest.unstable_mockModule('../src/db/schema.js', () => ({ ads }));

// Exporta o app e o supertest já prontos para uso
const request = (await import('supertest')).default;
const { default: app } = await import('../src/app.js');

export { request, app, sqlite };
