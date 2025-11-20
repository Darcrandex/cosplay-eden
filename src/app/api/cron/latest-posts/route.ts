import { getCosplayPostList } from '@/actions/scrape'
import { db } from '@/db'
import { itemTable, type ItemSchema } from '@/db/schema/items'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  // 获取最新的帖子
  const res = await getCosplayPostList(1)
  const batchData: Omit<ItemSchema, 'id' | 'createdAt' | 'updatedAt'>[] = res.map((v) => ({
    sourceType: 'cosplaytele',
    sourceId: v.id,
    title: v.title,
    coverImage: v.coverImage,
    imageList: null
  }))

  await db.insert(itemTable).values(batchData).onConflictDoNothing()

  return Response.json({ success: true })
}
