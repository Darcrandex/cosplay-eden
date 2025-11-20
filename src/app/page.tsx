'use client'

import { getCosplayPostList, type PostItemData } from '@/actions/scrape'
import Link from 'next/link'
import { useState } from 'react'

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [cosplayList, setCosplayList] = useState<PostItemData[]>([])

  const onSubmit = async () => {
    if (loading) {
      return
    }

    try {
      setLoading(true)
      const list = await getCosplayPostList(page)
      console.log('res ==>', list)
      setCosplayList(list)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1>爬取 cosplay</h1>

      <input
        type="number"
        value={page}
        onChange={(e) => setPage(Number(e.target.value))}
        className="rounded-md border border-gray-300 px-2 py-1"
        disabled={loading}
      />

      <button className="rounded-md bg-blue-500 px-4 py-2 text-white" onClick={onSubmit} disabled={loading}>
        爬取
      </button>

      <hr />

      <ol className="grid grid-cols-4 gap-4">
        {cosplayList.map((item) => (
          <li key={item.id}>
            <img src={item.coverImage} alt="" className="block h-48 w-full object-cover" />

            <Link href={`/post/${item.id}`} target="_blank">
              {item.title}
            </Link>
          </li>
        ))}
      </ol>
    </>
  )
}
