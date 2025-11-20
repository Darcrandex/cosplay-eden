import QueryProvider from '@/lib/QueryProvider'
import './globals.css'
import { Suspense } from 'react';

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<p>loading...</p>}>
          <QueryProvider>{children}</QueryProvider>
        </Suspense>
      </body>
    </html>
  )
}
