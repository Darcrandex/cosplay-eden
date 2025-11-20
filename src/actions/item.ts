'use server'

import { db } from '@/db'
import { itemTable } from '@/db/schema/items'

export async function getItemPage(page = 1) {
  const itemsPerPage = 10
  const offset = (page - 1) * itemsPerPage

  const res = await db.select().from(itemTable).limit(itemsPerPage).offset(offset)
  return { data: res }
}

export async function getItemDetail(id: string) {}
