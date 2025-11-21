'use server'

import { chromium } from 'playwright'
import UserAgent from 'user-agents'

export type PostItemData = { id: string; title: string; coverImage: string }
export type PostDetail = { id: string; title: string; imageList: string[] }

// 爬取 cosplaytele 的分页内容
export async function getCosplayPostList(page: number): Promise<PostItemData[]> {
  const targetUrl = `https://cosplaytele.com/page/${page}/`

  let browser
  const randomUA = new UserAgent({ platform: 'Win32' }).toString()

  try {
    browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage({ userAgent: randomUA })
    await page.goto(targetUrl, { timeout: 30000 })

    try {
      await page.waitForSelector('#post-list .post-item', { timeout: 5000 })
    } catch (err) {
      console.warn('未找到元素', err)
      return []
    }

    const list: PostItemData[] = await page.$$eval('#post-list .post-item', (els) => {
      return els.map((el) => {
        const title = el.querySelector('.post-title a')?.textContent?.trim() || ''
        const url = el.querySelector('.image-cover a')?.getAttribute('href') || ''
        const id = url.split('/').findLast((v) => v.trim() !== '') || ''
        const coverImage = el.querySelector('.image-cover img')?.getAttribute('src') || ''
        return { title, id, coverImage }
      })
    })

    return list.filter((v) => v.id.trim() !== '')
  } catch (error) {
    console.error('爬取失败：', error)
    throw new Error(`爬取失败：${(error as Error).message}`)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// 爬取 cosplaytele 的文章详情
export async function getCosplayPostDetail(id: string): Promise<PostDetail | null> {
  const targetUrl = `https://cosplaytele.com/${id}/`

  let browser
  const randomUA = new UserAgent({ platform: 'Win32' }).toString()

  try {
    browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage({ userAgent: randomUA })

    console.log('/n开始爬取', targetUrl)
    await page.goto(targetUrl, { timeout: 30000 })
    console.log('/n进入页面')

    try {
      // 预检元素是否存在
      await page.waitForSelector('.entry-title', { timeout: 5000 })
      await page.waitForSelector('.gallery-item', { timeout: 5000 })
      console.log('/n元素存在')
    } catch (err) {
      console.warn('未找到元素', err)
      return null
    }

    const title = await page.$eval('.entry-title', (el) => el.textContent?.trim() || '')
    console.log('/n获取标题', title)

    const imageList = await page.$$eval('.gallery-item img', (imgs) =>
      imgs.map((img) => img.getAttribute('src')).filter((src) => src !== null)
    )
    console.log('/n获取图片列表', imageList)

    const detail = { id, title, imageList }
    return detail
  } catch (error) {
    console.error('爬取失败：', error)
    throw new Error(`爬取失败：${(error as Error).message}`)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
