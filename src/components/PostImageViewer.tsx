'use client'

import { isNotNil } from 'es-toolkit'
import LazyLoad from 'react-lazyload'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

interface PostImageViewerProps {
  imageList: string[]
}

export default function PostImageViewer({ imageList }: PostImageViewerProps) {
  if (isNotNil(imageList)) {
    return (
      <ol className="space-y-12">
          {imageList.map((v) => (
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
    )
  }
  return null
}