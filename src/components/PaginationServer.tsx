'use client'

import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ReactPaginate from 'react-paginate'

interface PaginationServerProps {
  pageCount: number
  currentPage: number
  keyword?: string
}

export default function PaginationServer({ pageCount, currentPage, keyword = '' }: PaginationServerProps) {
  const router = useRouter()

  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1 // react-paginate使用0索引
    const url = new URL(window.location.href)
    url.searchParams.set('page', newPage.toString())

    if (keyword) {
      url.searchParams.set('keyword', keyword)
    } else {
      url.searchParams.delete('keyword')
    }

    router.replace(url.pathname + url.search)
  }

  if (pageCount <= 1) return null

  return (
    <ReactPaginate
      className="my-6 flex items-center justify-center gap-2 truncate select-none"
      previousLabel={<ChevronLeft className="h-6 w-6" />}
      nextLabel={<ChevronRight className="h-6 w-6" />}
      breakLabel={<Ellipsis className="h-4 w-4 transition-colors" />}
      breakLinkClassName="flex items-center justify-center w-8 text-center py-1 text-gray-500 hover:text-pink-600 cursor-pointer"
      pageLinkClassName="block min-w-8 text-center py-1 px-2 rounded-md truncate shrink-0 cursor-pointer text-gray-800 hover:text-pink-600 transition-colors hover:bg-pink-200"
      activeLinkClassName="bg-pink-600 text-white pointer-events-none"
      previousLinkClassName="flex items-center justify-center text-center px-2 min-w-8 h-8 text-gray-800 hover:text-pink-600 hover:bg-pink-200 cursor-pointer rounded-md transition-colors"
      nextLinkClassName="flex items-center justify-center text-center px-2 min-w-8 h-8 text-gray-800 hover:text-pink-600 hover:bg-pink-200 cursor-pointer rounded-md transition-colors"
      disabledClassName="cursor-not-allowed"
      disabledLinkClassName="pointer-events-none"
      pageRangeDisplayed={5}
      pageCount={pageCount}
      renderOnZeroPageCount={null}
      forcePage={currentPage - 1} // react-paginate使用0索引
      onPageChange={handlePageChange}
    />
  )
}
