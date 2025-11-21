'use server'

import axios from 'axios'
import * as cheerio from 'cheerio'
import { chromium } from 'playwright'
import UserAgent from 'user-agents'

export type PostItemData = { id: string; title: string; coverImage: string }
export type PostDetail = { id: string; title: string; imageList: string[] }

const initBrowser = async () => {
  const browserArgs = [
    '--no-sandbox', // 服务器环境必备：禁用沙箱（避免权限不足）
    '--disable-setuid-sandbox', // 禁用 setuid 沙箱
    '--disable-dev-shm-usage', // 禁用 /dev/shm 共享内存（Serverless 环境内存有限）
    '--single-process' // 单进程模式（减少内存占用）
  ]

  return await chromium.launch({ headless: true, args: browserArgs })
}

// 爬取 cosplaytele 的分页内容
export async function getCosplayPostList(page: number): Promise<PostItemData[]> {
  const targetUrl = `https://cosplaytele.com/page/${page}/`

  let browser
  const randomUA = new UserAgent({ platform: 'Win32' }).toString()

  try {
    browser = await chromium.launch({ headless: true })
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

export async function getCosplayPostList2(page: number): Promise<PostItemData[]> {
  const targetUrl = `https://cosplaytele.com/page/${page}/`
  const randomUA = new UserAgent({ platform: 'Win32' }).toString() // 保留随机 UA

  try {
    // 1. 发起 HTTP 请求获取页面 HTML（替代 Playwright 的浏览器访问）
    const response = await axios(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': randomUA, // 模拟浏览器 UA，避免反爬
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    })

    // 检查请求是否成功（对应原代码的页面访问失败）
    if (!response.status || response.status !== 200) {
      throw new Error(`请求失败，状态码：${response.status}`)
    }

    // 2. 获取 HTML 文本，用 cheerio 加载解析（替代 Playwright 的 DOM 查询）
    const html = await response.data
    const $ = cheerio.load(html) // 核心：将 HTML 转为可查询的 DOM 对象

    // 3. 查找目标元素（对应原代码的 #post-list .post-item）
    const $postItems = $('#post-list .post-item')

    // 4. 解析每个元素的数据（完全对齐原代码的 $$eval 逻辑）
    const list: PostItemData[] = $postItems
      .map((_, el) => {
        const $el = $(el) // 单个 post-item 元素
        const title = $el.find('.post-title a').text().trim() || '' // 对应原代码的 textContent.trim()
        const url = $el.find('.image-cover a').attr('href') || '' // 对应原代码的 getAttribute('href')
        const id = url.split('/').findLast((v) => v.trim() !== '') || '' // 保持原有的 id 提取逻辑
        const coverImage = $el.find('.image-cover img').attr('src') || '' // 对应原代码的 getAttribute('src')

        return { title, id, coverImage }
      })
      .get() // cheerio 的 map 需调用 get() 转为数组

    // 5. 过滤空 id（和原代码一致）
    return list.filter((v) => v.id.trim() !== '')
  } catch (error) {
    console.error('爬取失败：', error)
    throw new Error(`爬取失败：${(error as Error).message}`)
  }
}

// 爬取 cosplaytele 的文章详情
export async function getCosplayPostDetail(id: string): Promise<PostDetail | null> {
  const targetUrl = `https://cosplaytele.com/${id}/`

  let browser
  const randomUA = new UserAgent({ platform: 'Win32' }).toString()

  try {
    browser = await initBrowser()
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

export async function getCosplayPostDetail2(id: string): Promise<PostDetail | null> {
  const targetUrl = `https://cosplaytele.com/${id}/`
  const randomUA = new UserAgent({ platform: 'Win32' }).toString() // 保留随机 UA

  try {
    console.log('\n开始爬取', targetUrl)

    // 1. 发起 HTTP 请求获取页面 HTML（替代浏览器访问）
    const response = await axios(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': randomUA, // 模拟浏览器 UA
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      },
      timeout: 30000 // 和原代码一致的 30 秒超时
    })

    if (!response.status || response.status !== 200) {
      throw new Error(`请求失败，状态码：${response.status}`)
    }

    const html = await response.data
    const $ = cheerio.load(html) // 加载 HTML 解析
    console.log('\n进入页面')

    // 2. 预检元素是否存在（对应原代码的 waitForSelector，失败返回 null）
    const hasTitle = $('.entry-title').length > 0
    const hasGallery = $('.gallery-item').length > 0
    if (!hasTitle || !hasGallery) {
      console.warn('未找到元素（.entry-title 或 .gallery-item）')
      return null
    }
    console.log('\n元素存在')

    // 3. 提取标题（对应原代码的 $eval）
    const title = $('.entry-title').text().trim() || ''
    console.log('\n获取标题', title)

    // 4. 提取图片列表（对应原代码的 $$eval，过滤 null 值）
    const imageList: string[] = $('.gallery-item img')
      .map((_, imgEl) => $(imgEl).attr('src')) // 提取 src 属性
      .get() // 转为数组
      .filter((src): src is string => src !== null && src.trim() !== '') // 过滤 null/空值

    console.log('\n获取图片列表', imageList)

    // 5. 返回结果（结构和原代码一致）
    const detail: PostDetail = { id, title, imageList }
    return detail
  } catch (error) {
    console.error('爬取失败：', error)
    throw new Error(`爬取失败：${(error as Error).message}`)
  }
}
