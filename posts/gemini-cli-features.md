---
title: Gemini CLI 主要功能表：打造你的 AI 驅動開發工作流
date: 2026-03-11 10:48
categories: [工具, 技術]
tags: [Gemini CLI, AI]
---

## Gemini CLI 功能全覽

| 指令 | 功能層級 | 核心用途 | 你是在做什麼 | 讀取 / 使用的檔案 | 一句話記住它 |
|------|---------|---------|------------|-----------------|------------|
| `/memory` | **情境層** Context | 管理 AI 的背景知識與持久指令 | 告訴 AI「你是誰、規則是什麼」 | `GEMINI.md`（全域 `~/.gemini/` + 專案目錄 + 子目錄，階層合併） | 你的身份證與工作守則 |
| `/commands` | **指令層** Shortcuts | 定義可重複使用的自訂 slash 指令 | 把常用 prompt 包裝成一個快捷鍵 | `.toml` 檔（放在 `.gemini/commands/` 目錄下） | 你的個人 prompt 快捷選單 |
| `/skill` | **技能層** Skills | 載入並執行專項工作流程 | 讓 AI 依照預設 SOP 完成特定任務 | `skills/SKILL.md`（放在 extension 子目錄內） | 你的 AI 工作說明書 |
| `/extensions` | **封裝層** Extensions | 安裝、管理、分享整包功能組合 | 把 skills、commands、hooks、MCP 打包成一個單元 | `extension.json` + 子目錄內的所有相關檔案 | 你的 App Store，裝一包就有全套能力 |
| `/mcp` | **連接層** Connectors | 管理外部工具與服務的連線 | 讓 AI 能操作 Gmail、Drive、Slack 等外部系統 | `settings.json`（`mcpServers` 區塊） | 你的外部世界插座 |
| `/tools` | **工具檢視層** Tool Registry | 列出目前所有可用工具 | 確認有哪些內建工具 + MCP 工具已就緒 | 無（唯讀，顯示目前已載入的工具清單） | 你的能力清單，確認武器庫有什麼 |
| `/hooks` | **行為攔截層** Hooks | 在工具執行前後插入自訂邏輯 | 攔截、過濾、排序 AI 的行動 | `hooks.json` 或 extension 內的 hook 設定 | 你的 AI 行為守門員 |
| `/policies` | **規則執行層** Policy Engine | 定義 AI 工具執行的允許／拒絕規則 | 決定哪些操作需要確認、哪些直接執行、哪些永遠禁止 | `~/.gemini/policies/*.toml`（四層優先級：Default → Workspace → User → Admin） | 你的 AI 行動法規，allow / deny / ask |
| `/privacy` | **資料治理層** Privacy Control | 查看隱私聲明與管理資料收集設定 | 控制你的 prompt 和資料是否被 Google 用於模型訓練 | `settings.json`（`privacy.usageStatisticsEnabled` 欄位） | 你的資料開關，決定 Google 能不能看你的對話 |

---

### 層級關係一句話版

> `/memory` 是你的身份與規則 → `/commands` 是你的快捷鍵 → `/skill` 是你的工作流程 → `/extensions` 是打包以上三者的容器 → `/mcp` + `/tools` 是連接外部世界的管道 → `/hooks` 是在這一切之上的行為攔截器 → `/policies` 是系統層級的行為邊界與限制 → `/privacy` 是控制哪些資料可以被模型看見的開關。