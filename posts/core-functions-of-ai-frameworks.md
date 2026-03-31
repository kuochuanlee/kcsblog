---
title: AI 框架 (Framework) 核心功能解析
date: 2026-03-30 11:45
categories: [技術, 工具]
tags: [AI 框架, LangChain, LlamaIndex, RAG, Agent, 開發工具]
---

評估要不要導入框架（如 LangChain、LlamaIndex、AutoGen、LangGraph），一份清晰的「功能檢核表」，AI 框架在現代架構中的**七大核心功能**。


### 現代 AI 框架 (Framework) 核心功能總覽

| 核心功能 | 具體運作機制 (它在底層做什麼？) | 解決開發痛點 (為什麼我們需要它？) | 典型技術實作 / 業界慣用語 |
| :--- | :--- | :--- | :--- |
| **1. 模型抽象化**<br>(Model I/O) | 提供統一的 `.invoke()` 或 `.predict()` 介面，自動將你的指令翻譯成 OpenAI, Anthropic 或地端 Ollama 等不同廠商專屬的 API 格式。 | **避免廠商鎖定 (Vendor Lock-in)**：換模型只需改一行設定檔，不用重寫幾百行的 API 呼叫與字串拼接邏輯。 | LLM Wrappers, Structured Output (強制輸出 JSON) |
| **2. 狀態與記憶管理**<br>(State & Memory) | 在記憶體或資料庫中維護一個「全局狀態字典 (State)」。自動攔截對話歷史，超過 Token 上限時自動進行摘要；支援外接向量資料庫 (Vector DB)。 | **解決 LLM 的「失憶症」**：讓 AI 能記住 10 分鐘前說過的話，或檢索數百萬字的企業內部文件 (RAG)。 | Context Window Management, Checkpointer, RAG 整合 |
| **3. 工具註冊與執行**<br>(Tool Registry) | 將開發者寫的 Python 函數（如 `search_google`）轉換成 LLM 看得懂的 Schema。當 LLM 決定呼叫時，框架負責捕捉參數、執行程式，並將結果或 Error 餵回給 LLM。 | **避免自己刻「解析器」**：省去手動寫 `if-else` 去解析 LLM 輸出的文字並對應本地函數的繁瑣工程。 | Function Calling, Tool Sandbox, Error Handling |
| **4. 核心編排與路由**<br>(Orchestration) | 讓開發者定義工作流藍圖（Workflow / Graph）。在執行時，由框架的引擎判斷條件分支，甚至將「下一步該去哪」的決定權交給 LLM (LLM-as-a-Router)。 | **管控 AI 的行為軌跡**：把 LLM 關進「流程圖」裡，防止它漫無目的地亂聊或陷入無限迴圈。 | Conditional Edges, State Machine, ReAct Loop |
| **5. 多智能體協同**<br>(Multi-Agent) | 提供讓多個 AI Agent（如寫手、審查員）互相溝通的通訊協定。決定發言順序（Speaker Selection），並確保 Context 不會互相污染。 | **降低團隊開發門檻**：不用自己寫極度複雜的多執行緒（Multi-threading）與通訊邏輯，就能打造 AI 團隊。 | Agent Personas, Supervisor Pattern, Network Routing |
| **6. 人類介入機制**<br>(Human-in-the-Loop) | 允許在 Workflow 的關鍵節點（如：發送退款、刪除資料）設定「斷點 (Breakpoint)」。系統會暫停，等待人類審核通過後才繼續。 | **確保企業級資安與合規**：為 AI 的自主決策加上一道絕對安全的「保險絲」。 | HITL, State Rewind (狀態回溯/時光機) |
| **7. 觀測與除錯**<br>(Observability) | 內建追蹤機制，詳細記錄 Agent 跑了幾步、每一步的 Prompt 是什麼、呼叫了哪些工具、消耗了多少 Token 與費用。 | **打破 AI 的黑箱**：當系統給出錯誤答案時，讓工程師能像看監視器一樣，找出是哪一個思考環節出錯。 | Tracing, Telemetry (如 LangSmith, Phoenix) |

---

### 💡 科技佈道師的「反向思考」 (Critical Insight)

非常現實的忠告：**「功能越多，代價越重」**。

目前的產業趨勢正在發生微妙的「反彈」。因為像 LangChain 這樣的框架把上述七大功能包裝得**太過緊密、太過黑箱**，導致很多進階開發者在遇到奇怪的 Bug 時，根本找不到底層的原始碼在哪裡。

這也是為什麼現在有兩股新勢力正在崛起：
1. **微型框架 (Micro-frameworks)：** 像 OpenAI 的 Swarm，它只保留了表格中的「第 4 點 (路由)」和「第 5 點 (多智能體)」，其他功能全部要你自己寫，主打極致輕量。
2. **無框架流派 (Vanilla Python + MCP)：** 就是我們上一篇聊的，直接用原生的 Python 寫簡單的 `while` 迴圈來做 Orchestration，然後外接 Anthropic 的 MCP 來處理工具調用，徹底拋棄大型框架。

**以想開發的 AI 應用來說，七大功能裡面，哪個是「絕對必須依賴框架處理」，而哪個是「自己寫程式碼也能搞定」的呢？** 