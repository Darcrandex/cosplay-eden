'use client'

import { getItemDetail } from '@/actions/item'
import PageLoading from '@/components/PageLoading'
import TopHeader from '@/components/TopHeader'
import { SourceType } from '@/constant/common'
import { useQuery } from '@tanstack/react-query'
import { useTitle } from 'ahooks'
import { isNil, isNotNil } from 'es-toolkit'
import { ArrowUpFromLine } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import LazyLoad from 'react-lazyload'
import ScrollToTop from 'react-scroll-to-top'

import { useEffect } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

export default function PostItem() {
  const { id = '' } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', 'item', id],
    queryFn: () => getItemDetail(id)
  })

  useEffect(() => {
    console.log('debug post detail', data)
  }, [data])

  useTitle(data?.data?.title || 'Cosplay Eden')
  const sourceUrl = [SourceType.label(data?.data?.sourceType), data?.data?.sourceId].join('/')

  return (
    <>
      <section className="min-h-screen bg-sky-50/25 pb-1">
        <TopHeader />

        {isLoading && <PageLoading />}
        {isError && <p className="my-12 text-center text-lg text-red-500">error</p>}
        {!isLoading && !isError && isNil(data?.data) && (
          <p className="my-12 text-center text-lg text-gray-500">no data</p>
        )}

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

              <ol className="space-y-12">
                {data?.data?.imageList?.map((v) => (
                  <li key={v}>
                    <LazyLoad height={500} offset={100} once>
                      <PhotoProvider>
                        <PhotoView src={v}>
                          <img
                            src={v}
                            alt=""
                            className="block h-auto w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </PhotoView>
                      </PhotoProvider>
                    </LazyLoad>
                  </li>
                ))}
              </ol>
            </section>

            <ScrollToTop
              smooth
              top={800}
              component={
                <div className="group/back-top flex h-full w-full items-center justify-center">
                  <ArrowUpFromLine className="h-6 w-6 text-gray-800 transition-colors group-hover/back-top:text-pink-600" />
                </div>
              }
            />
          </>
        )}
      </section>
    </>
  )
}
