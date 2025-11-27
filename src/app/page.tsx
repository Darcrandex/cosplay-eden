import { getItemPage } from '@/actions/item'
import PaginationServer from '@/components/PaginationServer'
import SearchInputServer from '@/components/SearchInputServer'
import TopHeader from '@/components/TopHeader'
import { isArray } from 'es-toolkit/compat'
import Link from 'next/link'

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const page = parseInt((params?.page as string) || '1')
  const keyword = (params?.keyword as string) || ''
  const pageSize = 12

  const { records, total } = await getItemPage({ page, pageSize, keyword })

  return (
    <section className="min-h-screen bg-sky-50/25 pb-1">
      <TopHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-center">
          <SearchInputServer keyword={keyword} />
        </div>

        {(!isArray(records) || records.length === 0) && (
          <p className="my-12 text-center text-lg text-gray-500">no data</p>
        )}

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {records?.map((v) => (
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

        <div className="mt-12">
          <PaginationServer pageCount={Math.ceil(total / pageSize)} currentPage={page} keyword={keyword} />
        </div>
      </div>
    </section>
  )
}
