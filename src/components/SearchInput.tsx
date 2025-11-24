'use client'

import { cls } from '@/utils/cls'
import { CircleX, Search } from 'lucide-react'
import { useState } from 'react'

export default function SearchInput(props: {
  keyword?: string
  onSearch?: (keyword: string) => void
  className?: string
}) {
  const [search, setSearch] = useState(props.keyword || '')

  return (
    <div className={cls('relative mx-auto my-6 w-xl', props.className)}>
      <Search className="absolute top-1/2 left-3 h-6 w-6 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        placeholder="type and press enter"
        className="block w-full rounded-md border border-gray-300 px-4 py-2 indent-8 text-lg text-gray-800 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-pink-500"
        maxLength={20}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            props.onSearch?.(search)
          }
        }}
      />

      {!!search && (
        <CircleX
          className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-400 transition-colors hover:text-gray-500"
          onClick={() => {
            setSearch('')
            props.onSearch?.('')
          }}
        />
      )}
    </div>
  )
}
