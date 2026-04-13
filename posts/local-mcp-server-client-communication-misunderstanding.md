---
title: Local MCP Server 與 Client 的通訊誤會
date: 2026-04-13 10:30
categories: [技術, AI]
tags: [MCP, AI Agent, 通訊協議, 開發經驗]
---

在自己電腦開發MCP server給其他程式使用時，常會有連不上的狀況。原因在於Local MCP 主要是走 stdio (標準輸入/標準輸出) 協定，而不是走 HTTP 網路通訊埠！

## 核心通訊機制：STDIO 而非 HTTP

大多數本地運行的 MCP Server（如透過 Claude Desktop 或 Gemini CLI 啟動的）預設使用 **STDIO (Standard Input/Output)** 作為傳輸層。這與傳統的 Web 開發經驗大相徑庭：

- **誤區**：開發者習慣在程式碼中使用 `console.log()` 或 `print()` 來輸出除錯資訊。
- **真相**：在 STDIO 模式下，`stdout` 是專門給 JSON-RPC 訊息使用的通道。如果你隨便輸出一段純文字字串，Client 會因為無法解析為 JSON 而導致連線崩潰。
- **解決方案**：所有的除錯資訊必須導向到 `stderr`。在 Node.js 中使用 `console.error()`，在 Python 中使用 `sys.stderr.write()`。

## 在哪開啟 MCP server 的區別

這三個操作正好完美展示了 **MCP (Model Context Protocol) 架構的核心原理**。

要理解這三者的區別，您必須先記住一個大前提：
**MCP 的連線架構是「客戶端 (AI)」對「伺服器端 (Graphify 工具)」。而且這種連線是透過「標準輸入/輸出 (stdio)」在背景悄悄進行的。**

以下為您詳細拆解這三者的區別：

### 1. `gemini mcp add ...` (寫入 `.gemini\settings.json`)
* **這是什麼？** 這是把設定檔交給 **Gemini CLI** (客戶端)。
* **實際發生的事**：這行指令告訴 Gemini：「嘿，當我（人類）啟動你的時候，請你自己去背景偷跑這行 python 指令，並把它當作你的專屬 MCP 伺服器。」
* **結果**：Gemini CLI 成功接上圖譜工具。

### 2. 編輯 Claude Desktop 的 `claude_desktop_config.json`
* **這是什麼？** 這是把設定檔交給 **Claude Desktop** (另一個客戶端)。
* **實際發生的事**：這是告訴 Claude Desktop：「嘿，當你啟動的時候，請你在背景偷跑這行 python 指令。」
* **結果**：Claude Desktop 成功接上圖譜工具。

### 3. 在 Terminal 手動敲 `python -m graphify.serve ...`
* **這是什麼？** 這是**人類**自己把伺服器跑起來。
* **實際發生的事**：您在終端機啟動了 MCP 伺服器，但因為它是設計來跟 AI 講「機器語」(JSON-RPC) 的，它只會在那邊閃爍游標痴痴地等。**這時候不管是 Gemini 還是 Claude 都沒有連上它**，因為它們根本不知道您在背景開了這個伺服器。
* **結果**：毫無作用。只有工程師在除錯 (Debug) 伺服器封包時才會這樣手動下指令。

---

### 💡 結論：MCP 達成連線的「必要步驟」是哪個？

結論是 **選項 1 或 選項 2 (取決於您當下要用哪個 AI)**，而絕對不是選項 3。

在 MCP 的 `stdio` 架構下，**人類永遠不應該手工去啟動 Server**。
連線的**「唯一必要步驟」**就是：**「寫好設定檔，把它餵給您的 AI 客戶端」**。
很多工程師一開始都以為 MCP 伺服器就像我們常寫的 Web Server (例如 Node.js 或 Django)，只要人在一個視窗敲下指令把 Server 跑起來 (localhost:8000)，Client 就會從網路連過去。

因為 MCP 走的是 stdio 管道，這個管道就像是兩支程式之間的「臍帶」。只有「把 Server 生出來的那個 Client 媽媽」，才能跟這個 Server 說話。 所以您寫設定檔，就是授權給 Gemini CLI 或 Claude Desktop：「嘿，允許你們在自己體內（背景）孕育並啟動 graphify 伺服器，並把管子牽好為你們服務。」

在 Terminal 下指令啟動了 Server，這個 Server 的臍帶（stdio管子）是接在您的鍵盤跟螢幕上！ 這時候 Server 滿心期待要收到 JSON 格式的機器密語，結果聽到的是人打字的咚咚聲，而真正的 AI Client 站在門外根本連不進來，因為沒有開放任何網路 Port 給它連。所以就變成了一灘死水，毫無作用。

