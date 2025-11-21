'use server'

import { SourceType } from '@/constant/common'
import { db } from '@/db'
import { itemTable } from '@/db/schema/items'
import { count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm'
import { omit } from 'es-toolkit'
import { getCosplayPostDetail } from './scrape'

export async function getItemPage(params: { page?: number; pageSize?: number; keyword?: string }) {
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const condition = params.keyword ? ilike(itemTable.title, `%${params.keyword}%`) : sql`true`

  const offset = (page - 1) * pageSize
  const columns = omit(getTableColumns(itemTable), ['imageList'])
  const records = await db
    .select(columns)
    .from(itemTable)
    .limit(pageSize)
    .offset(offset)
    .orderBy(desc(itemTable.createdAt))
    .where(condition)

  const [{ total }] = await db.select({ total: count() }).from(itemTable).where(condition)

  return { records, total }
}

export async function getItemDetail(id: string) {
  try {
    const [data] = await db.select().from(itemTable).where(eq(itemTable.id, id))

    if (data && !Array.isArray(data.imageList) && data.sourceType === SourceType.Cosplaytele) {
      const res = await getCosplayPostDetail(data.sourceId)
      const imageList = res?.imageList || []

      await db.update(itemTable).set({ imageList }).where(eq(itemTable.id, id))
      data.imageList = imageList
    }

    return { data }
  } catch (error) {
    console.error('getItemDetail error', error)
    return { data: null, error }
  }
}
