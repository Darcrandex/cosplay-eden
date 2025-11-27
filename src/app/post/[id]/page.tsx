import { getItemDetail } from '@/actions/item'
import PostImageViewer from '@/components/PostImageViewer'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import TopHeader from '@/components/TopHeader'
import { SourceType } from '@/constant/common'
import { isNil, isNotNil } from 'es-toolkit'
import type { Metadata } from 'next'
import Link from 'next/link'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const data = await getItemDetail(id)
  return { title: data?.data?.title || 'Cosplay Eden' }
}

export default async function PostItem({ params }: Props) {
  const { id = '' } = await params
  const data = await getItemDetail(id)
  const sourceUrl = [SourceType.label(data?.data?.sourceType), data?.data?.sourceId].join('/')

  return (
    <>
      <section className="min-h-screen bg-sky-50/25 pb-1">
        <TopHeader />

        {isNil(data?.data) && <p className="my-12 text-center text-lg text-gray-500">no data {id}</p>}

        {isNotNil(data?.data) && (
          <>
            <div className="relative flex h-96 items-center justify-center py-12">
              {isNotNil(data?.data?.coverImage) && (
                <img
                  src={data?.data?.coverImage}
                  alt=""
                  className="absolute top-0 left-0 block h-full w-full object-cover brightness-50"
                  referrerPolicy="no-referrer"
                />
              )}

              <h1 className="relative z-10 w-3xl text-center text-4xl leading-loose font-bold text-gray-100">
                {data?.data?.title}
              </h1>
            </div>

            <section className="mx-auto my-12 w-3xl">
              <article className="my-6 text-xl font-bold">
                <p>
                  <span className="mr-2">source</span>
                  <Link href={sourceUrl} target="_blank" className="text-pink-600 underline">
                    {sourceUrl}
                  </Link>
                </p>

                <p>
                  <span className="mr-2">photos</span>
                  <span>{data?.data?.imageList?.length}P</span>
                </p>
              </article>

              <PostImageViewer imageList={data.data.imageList || []} />

              <nav>
                {(data.data.imageList || []).map((url, index) => (
                  <img
                    key={url}
                    src={url}
                    alt={`${data.data.title} - Image ${index + 1}`}
                    referrerPolicy="no-referrer"
                    loading="eager"
                    className="invisible hidden h-0 w-0"
                  />
                ))}
              </nav>
            </section>

            <ScrollToTopButton />
          </>
        )}
      </section>
    </>
  )
}
