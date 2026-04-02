---
title: 相同 LLM，為何開發感受不同？Agent 才是關鍵！
date: 2026-04-01 16:30
categories: [技術, 深度解析]
tags: [LLM, AI Agent, Claude Code, Cursor, 開發體驗, 系統工程]
---

## 引言

你有沒有過這種感覺？

同樣調用 **Claude 4.6 Sonnet**，在不同環境開發時，似乎面對的不是同一個 AI。

「底層模型不是同一個嗎？」

模型是同一個，但 **「模型只是引擎，Agent 是決定整台跑車性能的關鍵。」** 
真正決定開發感受的，是圍繞在模型之外的 **Agentic Workflow (代理人工作流)**。

---

## Agent 不等於 LLM

**LLM** 是純推理引擎——給它文字，它輸出文字。它看不到你的檔案，不能跑測試，不知道你的專案長什麼樣。

**Agent** 是 LLM 的指揮系統，負責 Orchestration：

- **資訊蒐集**：決定讀哪些檔案、搜尋哪些關聯程式碼
- **Prompt 組裝**：把蒐集到的 context 打包給 LLM
- **工具編排**：定義 LLM 可以呼叫哪些工具（寫檔、跑命令、開瀏覽器）
- **錯誤恢復**：測試失敗時自動重試還是停下來等人
- **多工協調**：複雜任務要不要拆分並行

同一個 LLM，Agent 蒐集的資訊越完整、編排邏輯越貼近模型特性，輸出品質就越高。

---

## AI 開發環境三大分類

### IDE 內建 Agent

Agent 與 IDE 深度整合，非插件，通常是 VS Code 的 fork。

| Cursor | Cursor Inc. |
| Antigravity | Google |

### Agent 是 IDE 的插件

Agent 以插件形式運行在現有 IDE 內（主要是 VS Code）。

| Cline | 開源社群 |
| Roo Code | 開源社群（fork 自 Cline）|
| GitHub Copilot | Microsoft / GitHub |
| Continue | 開源社群 |
| Aider（VS Code 整合模式）| 開源社群 |

### Agent 是 CLI

Agent 運行在終端機，無 GUI，直接操作作業系統與檔案系統。

| Claude Code | Anthropic |
| Aider | 開源社群 |
| OpenHands（CLI 模式）| 開源社群 |
| Codex CLI | OpenAI |
| Gemini CLI | Google |

**備註**：部分工具橫跨多類，例如 Aider 可以純 CLI 使用，也能整合進 VS Code；Claude Code 原本是純 CLI，現在也有 VS Code 插件版本。分類以其最主要的使用形式為準。

---

## 五種開發環境比較

| 環境 | Agent 位置 | 優點 | 缺點 |
|---|---|---|---|
| **Antigravity + Sonnet 4.6** | Google 原生（IDE 深度整合） | 多 Agent 並行、瀏覽器自動測試、editor/terminal/browser 三面感知 | Agent 針對 Gemini 設計，Claude 是次選；閉源 |
| **VS Code + Cline + Sonnet 4.6** | 開源插件 | 輕量快速、自動抓 error 重試、BYOK | 單線程、context 蒐集靠 LLM 自己猜、無多 Agent |
| **VS Code + Roo Code + Sonnet 4.6** | 開源插件（fork 自 Cline） | 可自訂角色 Modes（Architect/Code/Debug）、工具權限分離、最靈活 | 設定複雜、同樣無視覺化 Tab 補全 |
| **Cursor + Sonnet 4.6** | Cursor Inc.（IDE 深度整合） | 向量索引自動找關聯檔、Tab 補全最強、日常體驗最流暢 | Agent 非針對 Claude 優化；計費模式複雜易超支 |
| **Claude Code CLI + Sonnet 4.6** | Anthropic 官方（終端機） | Anthropic 針對 Claude 量身設計、OS 層 grep 不漏關聯、token 效率最高、multi-agent 並行 | 無 GUI、無 Tab 補全、純終端機操作門檻較高 |


---

## 結語：選擇 Agent 比選擇模型更重要

在 2026 年的今天，LLM 的能力已經逐漸趨同。未來開發者的核心課題將不再是「哪個模型比較強」，而是：

**「哪個 Agent 工具的工作流，最契合我的開發習慣？」**

換更新的 LLM 版本是升引擎，換 Agent 是換底盤。Agent 決定 LLM 能「看到多少」、「做多少步」——這才是同一個模型在不同工具裡表現差異的根本原因。

**模型決定了 AI 的智商上限，但 Agent 決定了 AI 的生產力下限。**

---
