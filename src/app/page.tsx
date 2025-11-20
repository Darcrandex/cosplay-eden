'use client'

import { getItemPage } from '@/actions/item'
import PageLoading from '@/components/PageLoading'
import Pagination from '@/components/Pagination'
import TopHeader from '@/components/TopHeader'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [page, setPage] = useState(1)
  const pageSize = 12

  const { data, isLoading, isError } = useQuery({
    queryKey: ['home', 'item', 'page', page],
    queryFn: () => getItemPage({ page, pageSize })
  })

  if (isLoading) return <PageLoading />
  if (isError) return <p className="text-center text-lg text-red-500">error</p>
  if (!data) return <p className="text-center text-lg text-gray-500">no data</p>

  return (
    <section className="min-h-screen bg-sky-50/25 pb-1">
      <TopHeader />

      <section className="mx-auto w-5xl">
        <ol className="my-12 grid grid-cols-3 gap-x-6 gap-y-12">
          {data?.records.map((v) => (
            <li key={v.id} className="group/item">
              <Link href={`/post/${v.id}`} target="_blank">
                <img
                  src={v.coverImage || ''}
                  alt={v.title}
                  className="h-48 w-full rounded-lg bg-gray-200 object-cover transition-shadow group-hover/item:shadow-lg"
                />
                <p className="mt-2 text-base text-gray-800 transition-colors group-hover/item:text-pink-600">
                  {v.title}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <Pagination total={data?.total || 0} pageSize={pageSize} page={page} onPageChange={(page) => setPage(page)} />
    </section>
  )
}
