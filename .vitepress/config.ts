import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "KC's Blog",
  description: "技術隨筆與生活點滴",
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://yourname.github.io' // 部署後請修改為實際 URL
  },
  themeConfig: {
    search: {
      provider: 'local',
      options: {
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
      { text: '標籤', link: '/tags' }
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
