import QueryProvider from '@/lib/QueryProvider'
import './globals.css'
import { Suspense } from 'react';
import PageLoading from '@/components/PageLoading';

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
