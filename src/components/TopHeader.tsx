'use client'

import { useSize } from 'ahooks'
import Link from 'next/link'
import { useRef } from 'react'

export default function TopHeader() {
  const ref = useRef<HTMLElement>(null)
  const size = useSize(ref)

  return (
    <>
      <header ref={ref} className="fixed top-0 right-0 left-0 z-50 bg-white shadow-lg">
        <div className="mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link href="/" replace className="flex items-center gap-2">
              <img src="/eden-logo.png" alt="" className="h-8 w-8 object-cover" />
              <span className="font-silent-forest text-2xl font-bold text-gray-800">Cosplay Eden</span>
            </Link>
          </div>
        </div>
      </header>

      <div style={{ height: size?.height }}></div>
    </>
  )
}
