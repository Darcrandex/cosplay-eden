import { getCosplayPostList } from '@/actions/scrape'
import { SourceType } from '@/constant/common'
import { db } from '@/db'
import { itemTable, type ItemSchema } from '@/db/schema/items'
import { count } from 'drizzle-orm'
import { delay } from 'es-toolkit'

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return Response.json({ message: 'not allow' })
  }

  const task = async (page = 1) => {
    const res = await getCosplayPostList(page)

    const batchData: Omit<ItemSchema, 'id' | 'createdAt' | 'updatedAt'>[] = res.map((v, index) => {
      const timestamp = new Date().getTime()
      const oneDay = 24 * 60 * 60 * 1000
      const createdAt = new Date(timestamp - index * 1000 - page * oneDay)

      return {
        sourceType: SourceType.Cosplaytele,
        sourceId: v.id,
        title: v.title,
        coverImage: v.coverImage,
        imageList: null,
        createdAt,
        updatedAt: createdAt,
      }
    })

    await db.insert(itemTable).values(batchData).onConflictDoNothing()
  }

  const [{ total }] = await db.select({ total: count() }).from(itemTable)
  const pageSize = 12
  const currentTotalPage = Math.ceil(total / pageSize)
  const targetPage = currentTotalPage + 10

  const tasks = async () => {
    for (let i = targetPage; i > currentTotalPage; i--) {
      await task(i)
      console.log(`第${i}页数据插入完成`)
      await delay(5 * 1000)
    }
  }

  await tasks()

  return Response.json({ message: 'insert success' })
}
