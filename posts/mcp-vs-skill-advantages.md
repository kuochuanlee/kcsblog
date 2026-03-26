---
title: MCP 相較於 Skill 優越之處
date: 2026-03-26 10:30
categories: [技術, AI]
tags: [MCP, Skill, AI Agents, 協議]
---

## MCP 和 Skill 的區別

這兩個是完全不同層面的東西：

### MCP（Model Context Protocol）
**連接外部服務的協議**，讓 Claude 能與第三方「工具」互動。

- 本質是**即時雙向連接**——Claude 可以讀寫外部系統的真實數據
- 例如：連接 Gmail 就能真正發信、讀郵件；連接 Google Calendar 就能查看和新增行程
- 需要授權/認證，數據是即時的、真實的
- 你目前連接的 MCP：**Gmail、Google Calendar**

### Skill（技能文件）
**存放在本地的操作說明書**，告訴 Claude 如何完成特定類型的任務。

- 本質是**靜態的 Markdown 文檔**，存放在 `/mnt/skills/` 目錄下
- 記錄了處理某類任務的最佳實踐、工具用法、注意事項
- 例如：`docx` skill 告訴 Claude 用哪個 Python 庫、怎麼生成 Word 文件
- 不需要網路，不連接外部服務，只是「知識」

---

### 一句話對比

| | MCP | Skill |
|---|---|---|
| 是什麼 | 外部服務連接(工具) | 本地操作手冊(知識) |
| 數據來源 | 即時、真實 | 靜態文字說明 |
| 例子 | 幫你發一封 Gmail | 教 Claude 怎麼做出好看的 PDF |
| 需要授權 | ✅ | ❌ |

簡單說：**MCP 是手臂（能做事）、Skill 是腦子裡的教學筆記（知道怎麼做）**。



## Skill 可用的工具類型（修正版）

| 路徑 | 工具/方式 | 例子 | 認證 | 限制 |
|---|---|---|---|---|
| **bash_tool** | 本地系統工具 | `ffmpeg`, `pandoc`, `libreoffice` | 無 | 需有 bash_tool 環境 |
| **bash_tool** | Python/Node 套件 | `openpyxl`, `playwright` | 無 | 需有 bash_tool 環境 |
| **bash_tool** | 程式內打 REST API（無用戶資料） | requests 打 Gemini API, GPT API | API Key 寫在程式裡 | LLM 先寫程式才能執行 |
| **bash_tool** | 程式內打 REST API（有用戶私人資料） | requests 打 Gmail API | OAuth 完整流程在程式裡跑 | LLM 先寫程式，token 對 Claude 可見 |
| **bash_tool** | 程式內用 SDK / 框架 | Gemini SDK, LangChain | 同上，SDK 幫組規格 | LLM 先寫程式才能執行 |
| **web_fetch** | 直接打 REST API（無用戶資料） | 直接打 Gemini API | LLM 自己組 header 帶 API Key | 不能自組 URL，受平台限制 |
| **web_fetch** | 直接打 REST API（有用戶私人資料） | 直接打 Gmail API | 需事先拿好 token 塞 header，無法自己跑 OAuth | token 對 Claude 可見 |
| **MCP** | 外部服務 | Gmail, Calendar, Notion | 連接時處理，Claude 看不到憑證 | 需平台支援 MCP |
| **Claude 內建** | 平台賦予的工具 | `web_search`, `web_fetch` | 無 | 受平台規則限制 |

---

### 關鍵差異一眼看出

```
有用戶私人資料：
  bash_tool → 能跑 OAuth，但 token 對 Claude 可見
  web_fetch → 連 OAuth 都跑不了
  MCP       → 唯一安全隔離的選擇

沒有 bash_tool 的環境（一般使用者）：
  只剩 web_fetch 和 MCP 可用
  有私人資料的服務 → 只有 MCP
```


---

## MCP 存在的理由

### 1. 你現在用的環境根本沒有 bash_tool

```
claude.ai 一般使用者：
  bash_tool → ❌ 沒有
  MCP       → ✅ 唯一能操作外部服務的路
```

bash_tool 是開發者環境才有的東西。對一般使用者來說 MCP 沒有替代品。

---

### 2. 憑證安全問題

```
bash_tool 那路：
  LLM 寫程式 → token 出現在程式碼裡 → Claude LLM 看得到
                                      → prompt 裡看得到
                                      → log 裡可能留下來

MCP：
  token 在 MCP server 裡，Claude 全程看不到
```

---

### 3. 每次都要重新造輪子

```
bash_tool 那路：
  每個服務都要：
    → LLM 寫一支新程式
    → 處理該服務的 OAuth 流程
    → 處理 token 過期 refresh
    → 處理各種 error

MCP：
  連接即用，這些全部 MCP server 幫你處理好了
```

---

### 一句話總結

| | bash_tool 路 | MCP |
|---|---|---|
| 一般使用者可用 | ❌ | ✅ |
| 憑證安全 | LLM 看得到 | 完全隔離 |
| 開發成本 | 每次重寫 | 連接即用 |

> bash_tool 那路是**工程師自己搭的臨時橋**
> MCP 是**給所有人用的標準橋，而且更安全**


---

## MCP 授權完整流程

```
1. Claude (MCP client) 發 request 給 MCP server

2. MCP server 回 401 Unauthorized
   → 同時告訴 Claude：去這個 URL 做授權

3. 使用者瀏覽器跳轉到 Google 登入頁
   → 顯示「是否允許存取你的 Gmail？」（含 scope 說明）

4. 使用者同意

5. Google 發 Authorization Code 給 MCP server

6. MCP server 用 Authorization Code 向 Google 換取
   → Google Access Token（含 scope）
   → 這個 token 存在 MCP server 裡，Claude 永遠看不到

7. MCP server 另外發一個 MCP client token 給 Claude
   → 這是 Claude 跟 MCP server 之間的通行證
   → 不是 Google token，是 MCP server 自己發的

8. 之後 Claude 每次 request 帶著 MCP client token
   → MCP server 驗證 Claude 身份
   → MCP server 用自己存的 Google token 去操作 Gmail
   → Claude 全程看不到 Google token
```

---

### 兩個 token 的對照

| | MCP client token | Google Access Token |
|---|---|---|
| 誰發的 | MCP server | Google |
| 誰拿到 | Claude | MCP server |
| 用途 | Claude 向 MCP server 證明身份 | MCP server 向 Gmail API 證明有權限 |
| Claude 看得到？ | ✅ | ❌ |

---

### 一句話

> Google token 被鎖在 MCP server 裡，Claude 只拿到一張「進 MCP server 的門票」，從來碰不到真正操作 Gmail 的鑰匙。


---

## 重啟需重登入原因，兩側各自的責任

```
MCP server 側：
  → 存 Google token（Access + Refresh）
  → 如果 in-memory → server 重啟就要重跑 OAuth
  → 要持久化才能避免

MCP client 側（Claude agent）：
  → 存 MCP client token
  → 如果 in-memory → client 重啟就要重新向 MCP server 認證
  → 要持久化才能避免
```

---

### 所以重登入問題的根源有兩個

| 誰重啟 | 哪個 token 消失 | 結果 |
|---|---|---|
| MCP server 重啟 | Google token 不見 | 要重新跑 Google OAuth |
| MCP client 重啟 | MCP client token 不見 | 要重新向 MCP server 認證 |
| 兩個都有持久化 | 都還在 | 完全無感 |

---

### 一句話

> 重登入問題看的是**兩側各自有沒有做好 token 持久化**，不只是 server 怎麼寫。Anthropic 在 claude.ai 上把 client 側處理好了，但如果你自己架 MCP server 沒做持久化，server 重啟一樣要重登入。

## FastMCP

FastMCP 是由 Anthropic 官方推出的 Python SDK，專門用來「極速開發」符合 MCP 協議的伺服器（MCP Servers）。

**MCP server 側。**
FastMCP 預設用 in-memory 儲存 token，但會警告使用者：重啟後 token 會消失
```
MCP server 用 FastMCP 寫的情況下：
  → 預設把 Google token 存在 in-memory
  → server 重啟 → Google token 消失
  → 要重新跑 Google OAuth 流程
```

```
MCP client（Claude agent）
  → 存的是 MCP client token
  → 這側的持久化是另一個問題，跟 FastMCP 無關
```

---

### 現實情況

```
自己架的 MCP client：
  → token 持久化要自己實作
  → 跟 bash_tool 寫 OAuth 程式一樣麻煩

但如果用現成平台：
  → claude.ai → Anthropic 幫你處理好了
  → Claude Code → 也幫你處理好了
  → Cursor、Windsurf 等 IDE → 各自處理好了
  → 你只需要架好 server 側
  → 才真正感受到「連接即用」的方便
```

---

### 所以結論是

MCP 的「方便」**不是協議本身帶來的**，而是**AI平台幫你把麻煩的部分做掉了**。



