import { createContentLoader } from 'vitepress'

interface Post {
  title: string
  url: string
  date: {
    time: number
    string: string
  }
  excerpt: string | undefined
  tags: string[]
  categories: string[]
  readingTime: number
}

declare const data: Post[]
export { data }

export default createContentLoader('posts/*.md', {
  excerpt: true,
  // 包含原始內容以便生成摘要
  includeSrc: true,
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter, excerpt, src }) => {
        // 如果沒有定義 excerpt，則從內容中抓取前 600 字作為摘要
        const contentExcerpt = excerpt 
          ? excerpt.replace(/<[^>]+>/g, '') 
          : (src || '').replace(/[#*`]/g, '').replace(/---[\s\S]*?---/, '').trim().slice(0, 600)

        // 計算閱讀時間 (以每分鐘 300 字為基準)
        const wordCount = (src || '').length
        const readingTime = Math.ceil(wordCount / 300) || 1

        return {
          title: frontmatter.title,
          url,
          excerpt: contentExcerpt + '...',
          date: formatDate(frontmatter.date),
          tags: frontmatter.tags || [],
          categories: frontmatter.categories || [],
          readingTime
        }
      })
      .sort((a, b) => b.date.time - a.date.time)
  }
})

function formatDate(raw: string | number | Date) {
  const date = new Date(raw)
  date.setUTCHours(12)
  return {
    time: +date,
    string: date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}
