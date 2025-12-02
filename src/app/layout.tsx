import PageLoading from '@/components/PageLoading'
import ProgressBar from '@/components/ProgressBar'
import QueryProvider from '@/lib/QueryProvider'
import { Metadata } from 'next'
import { PropsWithChildren, Suspense } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cosplay Eden',
  description: 'Cosplay Eden is a cosplay community where you can share your cosplay creations with others.',
}

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<PageLoading />}>
          <ProgressBar />
          <QueryProvider>{props.children}</QueryProvider>
        </Suspense>
      </body>
    </html>
  )
}
