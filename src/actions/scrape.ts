'use server'

import { chromium } from 'playwright'

export type PostItemData = { id: string; title: string; coverImage: string }
export type PostDetail = { id: string; title: string; imageList: string[] }

// 爬取 cosplaytele 的分页内容
export async function getCosplayPostList(page: number): Promise<PostItemData[]> {
  const targetUrl = `https://cosplaytele.com/page/${page}/`
  const itemSelector = '#post-list .post-item'
  const titleSelector = '.post-title a'
  const aSelector = '.image-cover a'
  const imgSelector = '.image-cover img'

  let browser

  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox' // 容器环境（如 Vercel）必需
      ]
    })

    const page = await browser.newPage()

    await page.goto(targetUrl, {
      waitUntil: 'networkidle', // 等待网络空闲（确保页面加载完成）
      timeout: 30000 // 超时时间 30 秒
    })

    try {
      await page.waitForSelector(itemSelector, { timeout: 5000 })
    } catch (err) {
      console.warn('未找到 post-item 元素，返回空数组', err)
      return []
    }

    const list = await page.$$(itemSelector)

    const tasks = list.map(async (item) => {
      const title = (await (await item.$(titleSelector))?.textContent()) || ''
      const url = (await (await item.$(aSelector))?.getAttribute('href')) || ''
      const id = url.split('/').findLast((v) => v.trim() !== '') || ''

      const coverImage = (await (await item.$(imgSelector))?.getAttribute('src')) || ''
      return { title, id, coverImage }
    })
    const items = await Promise.all(tasks)
    return items.filter((v) => v.id.trim() !== '')
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
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox' // 容器环境（如 Vercel）必需
      ]
    })

    const page = await browser.newPage()

    await page.goto(targetUrl, {
      waitUntil: 'networkidle', // 等待网络空闲（确保页面加载完成）
      timeout: 30000 // 超时时间 30 秒
    })

    try {
      console.log('url', targetUrl)

      await page.waitForSelector('.entry-title', { timeout: 5000 })
    } catch (err) {
      console.warn('未找到 post-content 元素，返回空字符串', err)
      return null
    }

    const title = (await (await page.$('.entry-title'))?.textContent()) || ''
    const imageList = (await page.$$('.gallery-item img')).map(async (v) => (await v.getAttribute('src')) || '')

    const detail = {
      id,
      title,
      imageList: await Promise.all(imageList)
    }

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
