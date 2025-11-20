'use client'

import { getItemPage } from '@/actions/item'
import PageLoading from '@/components/PageLoading'
import Pagination from '@/components/Pagination'
import TopHeader from '@/components/TopHeader'
import { useQuery } from '@tanstack/react-query'
import { isArray } from 'es-toolkit/compat'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const pageSize = 12
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [keyword, setKeyword] = useState('')
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setKeyword(search)
      setPage(1)
    }
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['home', 'item', 'page', page, keyword],
    queryFn: () => getItemPage({ page, pageSize, keyword })
  })

  return (
    <section className="min-h-screen bg-sky-50/25 pb-1">
      <TopHeader />

      <section className="mx-auto w-5xl">
        <div className="relative mx-auto my-6 w-96">
          <Search className="absolute top-1/2 left-3 h-6 w-6 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="type and press enter"
            className="block w-full rounded-md border border-gray-300 px-4 py-2 indent-8 text-lg text-gray-800 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-pink-500"
            maxLength={15}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {isLoading && <PageLoading />}
        {isError && <p className="my-12 text-center text-lg text-red-500">error</p>}
        {!isArray(data?.records) ||
          (data?.records.length === 0 && <p className="my-12 text-center text-lg text-gray-500">no data</p>)}

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
