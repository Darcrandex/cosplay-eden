'use client'

import { useParams } from 'next/navigation'

export default function PostItem() {
  const { id = '' } = useParams<{ id: string }>()

  return (
    <>
      <h1>post item</h1>
      <p>id: {id}</p>
    </>
  )
}
