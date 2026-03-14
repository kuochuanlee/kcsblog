---
title: 弄清 function calling 與 MCP 的區別
date: 2026-03-15 14:00
categories: [技術, AI]
tags: [AI, Function Calling, MCP, 協議]
---

在 AI 代理 (AI Agents) 與大型語言模型 (LLM) 蓬勃發展的今天，「Function Calling」與 「Model Context Protocol (MCP)」是兩個頻繁出現的概念。雖然它們都涉及 LLM 與外部世界的互動，但其設計層次與解決的問題範疇卻大不相同。

## 我的理解與架構圖
```
AI包含兩部分(LLM + Agent)。

LLM才是真正的 AI 主腦，只能輸出文字。

Agent是支固定邏輯的傳統程式，一個執行框架，負責內控流程+執行工具+對外窗口 。

function calling 是LLM告知agent去call function執行內部工具。

MCP 是agent如何使用外部工具的一套協議，MCP server提供外部工具給agent用。
```
<img src="/images/ai_agent_architecture.svg" alt="AI Agent 架構圖" style="width: 100%; border-radius: 8px; margin: 1.5rem 0;">

## Function calling vs MCP 的差別：
```
Function calling：

LLM → Agent → 直接在 Agent 內部呼叫程式碼（in-process）

工具是 Agent 自己的一部分
```

```
MCP：

Agent → 透過標準協議 → 連到外部 MCP Server（out-of-process）

工具跑在另一個進程甚至另一台機器上，Agent 和工具之間是 client-server 關係
```
## 兩者的本質區別與協作方式
1.  **層級不同**：Function Calling 是底層的「執行機制」；MCP 是上層的「封裝協議」。
2.  **可移植性**：Function Calling 通常需要為不同框架硬編碼；MCP 則是跨框架、跨模型的標準。
3.  **生態系統**：MCP 促使工具開發者只需開發一次（MCP Server），即可服務於整個 AI 生態，而非單一應用。

在實際運作中，當你使用一個支援 MCP 的應用程式時，底層依然是透過 **Function Calling** 來命令模型調用由 **MCP Server** 提供的標準化工具。


## Claude Code / Gemini CLI 有無內建 function calling 機制給開發者擴充工具？
好，這個問題的答案是：**兩者都不用 function calling 來擴充工具，而是用 MCP。

**Claude Code / Gemini CLI 本身** 是一個封裝好的 Agent 產品，開發者沒辦法從外部「注入」function calling 定義。它內建的工具（Bash、檔案讀寫、shell 執行等）是它自己 hardcode 進去的，function calling 發生在它的肚子裡，外人看不到也摸不到。

**要擴充工具只有一條路：MCP Server。** 你把自訂工具包成一個 MCP Server（一支小程式），然後在設定檔裡告訴 Claude Code / Gemini CLI「去連這個 server」，它就會透過 MCP 協議把你的工具當成可用工具。這是兩者官方認可的唯一外掛機制。

**如果你想完整掌控 function calling**，就不能用 Claude Code / Gemini CLI，而是要直接呼叫底層 API，自己從頭組 Agent：

- Anthropic API 用 `tools` 欄位定義工具，回應裡會出現 `tool_use` block
- Gemini API 用 `functionDeclarations` 定義工具，回應裡出現 `functionCall` block

這樣你才能自己決定有哪些工具、Agent 的流程邏輯怎麼跑。

<img src="/images/claude_code_gemini_cli_tool_extension.svg" alt="Claude Code / Gemini CLI 對照圖" style="width: 100%; border-radius: 8px; margin: 1.5rem 0;">




