# KC's Blog

一個基於 VitePress 構建的極簡、優雅且具質感的技術部落格。

## ✨ 特色 (Features)

- 🎨 **自定義視覺設計**
  - **黑灰白色調**: 採黑、灰、白極簡配色，符合現代審美。
  - **毛玻璃導覽列**: 具備 `20px` 的模糊質感與半透明灰色背景。
  - **日夜模式優化**: 針對不同模式調整灰階對比，確保閱讀舒適度。
  - **優化排版**: 標題加大加粗 (800 weight)，搜尋框左移至導覽列最左方。

- 📖 **豐富的文章元數據 (Post Meta)**
  - 文章標題下方自動顯示：`📖 文章標題 | 📂 分類 🏷️ 標籤 🕒 最後修改日期`。
  - 採用**灰階 SVG 圖示**，移除彩色 Emoji，保持視覺純粹。

- 🗂️ **強大的內容管理**
  - **歸檔 (Archive)**: 按年份自動分組排列文章。
  - **分類 (Categories)**: 卡片式設計，快速篩選大類內容。
  - **標籤 (Tags)**: 標籤雲設計，支援點擊篩選關鍵字文章。
  - **自動統計**: 自動掃描 `posts/*.md` 並計算閱讀預估時間與生成摘要。

- 🔍 **內建搜尋**: 本地化全文搜尋功能，並自定義搜尋按鈕文字。

## 🚀 快速開始 (Quick Start)

### 1. 安裝環境
```bash
npm install
```

### 2. 本地開發
```bash
npm run dev
```

### 3. 建置靜態網站
```bash
npm run build
```

## 📝 撰寫指引 (Writing Guide)

新文章請放置於 `posts/` 目錄，並在 Markdown 開頭定義 Frontmatter：

```markdown
---
title: 您的文章標題
date: 2026-03-10
categories: [技術, 生活]
tags: [Vue, CSS, 日記]
---
```

## 🛠️ 技術架構 (Technical Stack)

- **核心**: VitePress (Vue 3 + Vite)
- **樣式**: 純 CSS (不使用 Tailwind，保持依賴最小化)
- **佈局**: 高特異性 CSS 選擇器覆蓋，確保樣式在所有模式下穩定。

## 📄 授權 (License)

Released under the [MIT License](LICENSE.md).
