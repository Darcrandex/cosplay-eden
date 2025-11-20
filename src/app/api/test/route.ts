import { getCosplayPostList } from '@/actions/scrape'
import { SourceType } from '@/constant/common'
import { db } from '@/db'
import { itemTable, type ItemSchema } from '@/db/schema/items'
import { delay } from 'es-toolkit'

export async function GET() {
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
        updatedAt: createdAt
      }
    })

    await db.insert(itemTable).values(batchData).onConflictDoNothing()
  }

  const tasks = async () => {
    for (let i = 10; i >= 1; i--) {
      const page = i + 60
      await task(page)
      console.log(`第${page}页数据插入完成`)
      await delay(5 * 1000)
    }
  }

  await tasks()

  return Response.json({ message: 'insert success' })
}
