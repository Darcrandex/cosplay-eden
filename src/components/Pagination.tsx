'use client'
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react'
import ReactPaginate from 'react-paginate'

export default function Pagination(props: {
  total: number
  pageSize: number
  page: number
  onPageChange: (page: number) => void
}) {
  const { total, pageSize, page, onPageChange } = props
  const pageCount = Math.ceil(total / pageSize)

  if (pageCount <= 1) return null

  return (
    <ReactPaginate
      className="my-6 flex items-center justify-center gap-2 truncate select-none"
      previousLabel={<ChevronLeft className="h-4 w-4 transition-colors" />}
      nextLabel={<ChevronRight className="h-4 w-4 transition-colors" />}
      breakLabel={<Ellipsis className="h-4 w-4 transition-colors" />}
      breakLinkClassName="flex items-center justify-center w-8 text-center py-1 text-gray-500 hover:text-pink-600 cursor-pointer"
      pageLinkClassName="block min-w-8 text-center py-1 rounded-md truncate shrink-0 cursor-pointer text-gray-800 hover:text-pink-600 transition-colors hover:bg-pink-200"
      activeLinkClassName="bg-pink-600 text-white pointer-events-none"
      previousLinkClassName="flex items-center justify-center text-center w-8 h-8 text-gray-500 hover:text-pink-600 hover:bg-pink-200 cursor-pointer rounded-md"
      nextLinkClassName="flex items-center justify-center text-center w-8 h-8 text-gray-500 hover:text-pink-600 hover:bg-pink-200 cursor-pointer rounded-md"
      disabledClassName="cursor-not-allowed"
      disabledLinkClassName="pointer-events-none"
      pageRangeDisplayed={5}
      pageCount={pageCount}
      renderOnZeroPageCount={null}
      forcePage={page - 1}
      onPageChange={(e) => onPageChange(e.selected + 1)}
    />
  )
}
