// 套图的数据库模型

import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const itemTable = pgTable('items', {
  sourceType: text().notNull(), // 套图的来源
  sourceId: text().notNull().unique(), // 套图的原始 id
  title: text().notNull(),
  coverImage: text(), // 套图的封面图片
  imageList: text().array(), // 套图的图片列表

  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export type ItemSchema = typeof itemTable.$inferSelect
