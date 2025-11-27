'use client'

import ScrollToTop from 'react-scroll-to-top'
import { ArrowUpFromLine } from 'lucide-react'

export default function ScrollToTopButton() {
  return (
    <ScrollToTop
      smooth
      top={800}
      component={
        <div className="group/back-top flex h-full w-full items-center justify-center">
          <ArrowUpFromLine className="h-6 w-6 text-gray-800 transition-colors group-hover/back-top:text-pink-600" />
        </div>
      }
    />
  )
}