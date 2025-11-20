import PageLoading from '@/components/PageLoading'
import QueryProvider from '@/lib/QueryProvider'
import { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cosplay Eden',
  description: 'Cosplay Eden is a cosplay community where you can share your cosplay creations with others.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<PageLoading />}>
          <QueryProvider>{children}</QueryProvider>
        </Suspense>
      </body>
    </html>
  )
}
