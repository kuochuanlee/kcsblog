# GEMINI.md - KC's Blog 專案上下文指引

本文件為 Gemini CLI 提供關於 **KC's Blog** 專案的運作脈絡、架構規範及開發慣例，確保後續互動能維持專案的一致性。

## 📋 專案概覽 (Project Overview)

**KC's Blog** 是一個基於 [VitePress](https://vitepress.dev/) 構建的極簡技術部落格，專注於高效能、優雅的排版與深度的文章分類管理。

- **主要技術**: VitePress (Vue 3, Vite, Markdown)
- **視覺風格**: 黑、灰、白極簡主義，具備毛玻璃特效 (`backdrop-filter`) 與自適應日夜模式。
- **關鍵功能**:
    - 自定義文章元數據顯示（標題、分類、標籤、修改日期）。
    - 多維度導覽系統：歸檔 (Archive)、分類 (Categories)、標籤雲 (Tags)。
    - 本地化全站搜尋。

## 🏗️ 系統架構 (Architecture)

專案結構如下：
- `.vitepress/`: 核心配置目錄。
    - `config.ts`: 網站全局配置、導覽列、搜尋功能與 SEO。
    - `theme/`: 自定義主題與樣式。
        - `index.ts`: 主題入口，處理組件註冊與 Layout 插槽注入。
        - `style.css`: 全局樣式覆蓋（高優先權 CSS，不使用 Tailwind）。
        - `components/`: 自定義 Vue 組件 (`PostList`, `PostMeta`, `Archive` 等)。
    - `data/`: 數據提取邏輯 (`posts.data.ts` 自動掃描文章並計算閱讀時間)。
- `posts/`: 存放所有文章 Markdown 檔案。
- `archive.md`, `categories.md`, `tags.md`: 對應的功能專頁。

## ⌨️ 運行與開發指令 (Building and Running)

本專案使用 `npm` 管理依賴，主要腳本如下：

| 指令 | 說明 |
| :--- | :--- |
| `npm run dev` | 啟動本地開發伺服器 (Hot Reload) |
| `npm run build` | 構建靜態網站至 `.vitepress/dist` |
| `npm run preview` | 本地預覽建置後的靜態網站 |

## 🎨 開發規範 (Development Conventions)

### 1. 樣式原則 (Styling)
- **禁止使用 Tailwind**: 為了保持依賴最小化，所有樣式必須在 `style.css` 中使用純 CSS 撰寫。
- **高優先權覆蓋**: 修改導覽列等 VitePress 內建樣式時，應使用 `html body .VPNavBar` 等高特異性選擇器。
- **灰階色調**: 保持黑灰白設計，避免使用彩色 Emoji，改用 SVG 圖示。

### 2. 文章規範 (Content Guidelines)
- 每篇文章必須包含正確的 Frontmatter：
  ```markdown
  ---
  title: 文章標題
  date: YYYY-MM-DD
  categories: [類別]
  tags: [標籤1, 標籤2]
  ---
  ```
- 文章元數據（`PostMeta.vue`）會自動抓取上述欄位並顯示在標題下方。

### 3. 組件開發 (Components)
- 註冊新組件需於 `.vitepress/theme/index.ts` 進行 `app.component` 宣告。
- 若需修改文章內頁佈局，請利用 `doc-before` 或 `doc-after` 插槽。

---

> **Gemini 提示**: 在後續任務中，請務必尊重現有的灰色調視覺風格與「不使用 Tailwind」的約束。
