import { getCosplayPostList } from '@/actions/scrape'
import { db } from '@/db'
import { itemTable, type ItemSchema } from '@/db/schema/items'

export async function GET() {
  const res = await getCosplayPostList(1)

  const batchData: Omit<ItemSchema, 'id' | 'createdAt' | 'updatedAt'>[] = res.map((v) => ({
    sourceType: 'cosplaytele',
    sourceId: v.id,
    title: v.title,
    coverImage: v.coverImage,
    imageList: null
  }))

  await db.insert(itemTable).values(batchData).onConflictDoNothing()
  return Response.json({ message: 'insert success' })
}
