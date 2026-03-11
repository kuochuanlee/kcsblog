import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/kcsblog/',
  title: "KC's Blog",
  description: "技術隨筆與生活點滴",
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md', 'GEMINI.md', 'LICENSE.md'],
  head: [
    ['meta', { name: 'robots', content: 'noindex' }]
  ],
  sitemap: {
    hostname: 'https://kuochuanlee.github.io/kcsblog/'
  },
  themeConfig: {
    logo: '/logo.png',
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: (str) => {
              const tokens = new Set<string>()
              // 使用 Intl.Segmenter 進行初步分詞
              const segmenter = new Intl.Segmenter('zh-TW', { granularity: 'word' })
              for (const { segment, isWordLike } of segmenter.segment(str)) {
                if (isWordLike) {
                  tokens.add(segment.toLowerCase())
                  // 針對中文字符，額外拆解成單字索引（提高匹配成功率）
                  if (/\p{Script=Han}/u.test(segment)) {
                    for (const char of segment) {
                      tokens.add(char.toLowerCase())
                    }
                  }
                }
              }
              return Array.from(tokens)
            },
            process: (term) => term.toLowerCase(),
          },
          searchOptions: {
            boost: { title: 10, titles: 5, text: 1 }, // 大幅提升主標題權重
            fuzzy: 0.2,
            prefix: true,
            combineWith: 'AND' // 必須匹配所有關鍵字，搜尋結果會更精確
          }
        },
        translations: {
          button: {
            buttonText: '搜尋文件',
            buttonAriaLabel: '搜尋文件'
          },
          modal: {
            noResultsText: '無法找到相關結果',
            resetButtonTitle: '清除查詢條件',
            footer: {
              selectText: '選擇',
              navigateText: '切換',
              closeText: '關閉'
            }
          }
        }
      }
    },
    nav: [
      { text: '首頁', link: '/' },
      { text: '歸檔', link: '/archive' },
      { text: '分類', link: '/categories' },
      { text: '標籤', link: '/tags' },
      { text: '關於', link: '/about' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present'
    }
  }
})
