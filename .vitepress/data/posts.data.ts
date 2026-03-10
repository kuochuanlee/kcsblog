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
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter, excerpt }) => {
        // 計算閱讀時間 (以每分鐘 300 字為基準)
        const wordCount = excerpt ? excerpt.replace(/<[^>]+>/g, '').length : 0
        const readingTime = Math.ceil(wordCount / 300) || 1

        return {
          title: frontmatter.title,
          url,
          excerpt: excerpt ? excerpt.replace(/<[^>]+>/g, '').slice(0, 150) + '...' : '',
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
