'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const searchParams = useSearchParams()
  const page = Number.parseInt(searchParams.get('page') || '1')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['home', 'item', 'page', page],
    // queryFn: () => getItemPage(page)
    queryFn: () => {
      return { data: [] }
    }
  })

  if (isLoading) return <p>loading...</p>
  if (isError) return <p>error</p>
  if (!data) return <p>no data</p>

  return (
    <>
      <h1>home</h1>
      <p>page: {page}</p>

      <Link href={`/post/eowrd9f`}>
        <p>first item</p>
      </Link>
    </>
  )
}
