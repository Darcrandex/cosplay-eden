'use server'

import axios from 'axios'
import * as cheerio from 'cheerio'
import { isNotNil } from 'es-toolkit'
import UserAgent from 'user-agents'

export type PostItemData = { id: string; title: string; coverImage: string }
export type PostDetail = { id: string; title: string; imageList: string[] }

// 爬取 cosplaytele 的分页内容
export async function getCosplayPostList(page: number): Promise<PostItemData[]> {
  const targetUrl = `https://cosplaytele.com/page/${page}/`
  const randomUA = new UserAgent({ platform: 'Win32' }).toString()

  try {
    const response = await axios(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': randomUA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    })

    if (!response.status || response.status !== 200) {
      throw new Error(`请求失败，状态码：${response.status}`)
    }

    const html = await response.data
    const $ = cheerio.load(html)

    const $postItems = $('#post-list .post-item')

    const list: PostItemData[] = $postItems
      .map((_, el) => {
        const $el = $(el) // 单个 post-item 元素
        const title = $el.find('.post-title a').text().trim() || ''
        const url = $el.find('.image-cover a').attr('href') || ''
        const id = url.split('/').findLast((v) => v.trim() !== '') || ''
        const coverImage = $el.find('.image-cover img').attr('src') || ''

        return { title, id, coverImage }
      })
      .get()

    return list.filter((v) => v.id.trim() !== '')
  } catch (error) {
    console.error('爬取失败：', error)
    throw new Error(`爬取失败：${(error as Error).message}`)
  }
}

// 爬取 cosplaytele 的文章详情
export async function getCosplayPostDetail(id: string): Promise<PostDetail | null> {
  const targetUrl = `https://cosplaytele.com/${id}/`
  const randomUA = new UserAgent({ platform: 'Win32' }).toString()

  try {
    const response = await axios(targetUrl, {
      method: 'GET',
      timeout: 30000,
      headers: {
        'User-Agent': randomUA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    })

    if (!response.status || response.status !== 200) {
      throw new Error(`请求失败，状态码：${response.status}`)
    }

    const html = await response.data
    const $ = cheerio.load(html)

    // 预检元素是否存在
    const hasTitle = $('.entry-title').length > 0
    const hasGallery = $('.gallery-item').length > 0
    if (!hasTitle || !hasGallery) {
      console.warn('未找到元素（.entry-title 或 .gallery-item）')
      return null
    }

    const title = $('.entry-title').text().trim() || ''

    const imageList: string[] = $('.gallery-item img')
      .map((_, imgEl) => $(imgEl).attr('src'))
      .get()
      .filter((src) => isNotNil(src))

    const detail: PostDetail = { id, title, imageList }
    return detail
  } catch (error) {
    console.error('爬取失败：', error)
    throw new Error(`爬取失败：${(error as Error).message}`)
  }
}
