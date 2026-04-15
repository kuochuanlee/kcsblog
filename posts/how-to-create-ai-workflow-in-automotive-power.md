---
title: 如何在車用功耗領域創建 AI 工作流
date: 2026-04-16 10:30
categories: [車用電子]
tags: [Automotive, Power Consumption, AI Workflow, LLM, PnP]
---

# 如何在車用功耗領域創建 AI 工作流：從數據剖析到自動化優化

在現代電動車與智能座艙（Smart Cockpit）開發中，功耗（Power Consumption）管理已從單純的硬體規範演變為複雜的系統工程。隨著 SoC 整合度提升，如何利用 AI 工具優化 PnP（Power and Performance）分析流程，已成為資深系統架構師的必修課題。本文將探討如何建立一套適用於車用功耗領域的 AI 工作流。

<!-- excerpt -->
本文探討如何將 AI 與 LLM 技術整合進車用嵌入式系統的功耗分析流程，從 Profiling 數據的自動化解析、Power Budget 異常偵測到跨團隊的協作優化，建立高效且具備領域專業的 AI 工作流。

---

## 1. 建立基於領域知識（Domain Knowledge）的數據處理鏈

車用功耗數據通常來源於各類 Profiling 工具（如 DS-5, Trace32, 或自研的 PMU Monitor）。這些原始數據（Raw Data）龐大且零碎，第一步是建立 AI 友好的處理鏈：

- **結構化日誌分析**：利用 AI 提取不同 Power Domain（如 VDD_CPU, VDD_GPU, VDD_NPU）在不同車輛狀態（Boot, Normal Drive, Sleep）下的電流與電壓變化。
- **特徵工程優化**：定義關鍵指標，例如「每幀渲染功耗」、「待機漏電流斜率」或「NOC 互連頻寬與功耗的相關性」。

## 2. 導入 LLM 輔助的異常偵測與診斷

傳統的 Threshold-based 告警容易產生誤報。AI 工作流應導入更聰明的診斷機制：

- **情境感知分析**：AI 能理解「目前車輛在低溫充電模式」，因此某些 IP 的 Thermal Throttling 行為是正常的，而非異常。
- **自動化根因分析（RCA）**：當 Power Budget 爆掉時，透過餵入系統追蹤（System Trace）日誌，讓 AI 協助判定是驅動程式未進入 Suspend 模式，還是某個背景服務頻繁喚醒（Wakeup）系統。

## 3. 自動化 Power Budget 追蹤與回饋循環

AI 工作流的終極目標是閉環（Closed-loop）優化：

- **預測性建模**：根據當前的軟體變動（PRs），預估其對整車低功耗待機時間的潛在影響。
- **文件與規範生成**：利用 AI 自動更新跨系統的介面規範（如 Power Handshake 流程），確保 BMS 與座艙控制器之間的協商邏輯始終一致。

## 4. 結語：AI 是架構師的放大鏡

在車用領域，AI 並非取代架構師，而是協助我們在海量的信號中抓出隱藏的功耗黑洞。透過建立標準化的 AI 工作流，團隊能從枯燥的數據比對中解放，專注於更核心的系統優化與創新。


# you asked

這是我在網路上看到的回文，請問這個人是怎麼辦到的，可以解釋下他的做法嗎? 用了哪些AI技巧?

===
我一個想法: xxxx 先 /brainstorm 一下來鞏固這個概念，後執行 /sanity-check，過關後寫任務，照著任務跑完後 /github-publish 發表加上 /ci-cd 來 ship 我們的成果
=== 然後以上的流程又可以打包成一個 skill e.g. /lizard-power
那下次我就直接: /lizard-power "下一個有趣的idea"

---

# gemini response

這段網路上看到的回文非常經典，它精準地展示了目前 AI 工程領域最核心的典範轉移：**從「單次對話（Zero-shot Prompting）」進化到「代理型工作流（Agentic Workflow）」與「複合 AI 系統（Compound AI Systems）」。**

作為 AI 策略專家，我可以明確告訴你，這個人並不是在施展什麼魔法，而是利用了現代 AI 開發工具（如 AI-native IDEs 或自定義的 Agent 框架）中的**高階自動化與封裝技巧**。

以下我將為你深度拆解他的做法，以及背後運作的 AI 技術。

---

### 1. 他的做法拆解：這是一條「自動化生產線」

這個人建立了一個自動化的「軟體開發流水線」。在過去，這需要跨越多個工具與人員；現在，他透過定義特定的「斜線指令（Slash Commands）」來觸發不同的 AI 代理（Agents）或工作階段：

* `/brainstorm`：**發散思維節點**。輸入初步想法，讓 LLM 進行擴寫、聯想，產出具體的概念框架。
* `/sanity-check`：**收斂與批判節點**。引入另一個具有批判性（System Prompt 設定為架構師或審查員）的 LLM 實例，對上一步的想法進行邏輯漏洞排查、可行性分析。
* `寫任務`：**任務拆解（Task Breakdown）**。AI 將審查過關的概念，轉化為 Ticket 或待辦清單（如 Jira ticket 或 GitHub Issues 格式）。
* `/github-publish` & `/ci-cd`：**工具調用與執行**。AI 自動生成程式碼，並透過 API 實際與外部環境互動，將程式碼推播至 GitHub，甚至自動配置 CI/CD（如 GitHub Actions）的 YAML 檔。
* `/lizard-power`：**巨集封裝（Macro Encapsulation）**。將上述所有步驟打包成一個全新的、可重複呼叫的母指令。

### 2. 背後支撐的 4 大核心 AI 技巧

他能做到這點，底層依賴了以下幾個成熟的 AI 技術與架構：

#### A. 提示詞串聯 (Prompt Chaining) 與 狀態保持 (Context Management)
這不是一次性的問答，而是**Pipeline（管線）式**的處理。第一個指令 (`/brainstorm`) 的輸出，會自動被系統擷取，並作為第二個指令 (`/sanity-check`) 的輸入 (Context)。系統在背後維持了一個「狀態機（State Machine）」，確保每個步驟的上下文不會斷裂或遺忘。

#### B. 工具調用 / 函數呼叫 (Tool Use / Function Calling)
這是讓 AI 從「只會說話的語言模型」變成「能做事的數位勞工」的關鍵。`/github-publish` 和 `/ci-cd` 絕對不僅僅是生成文字，而是 LLM 透過 **Function Calling** 技術，將自然語言轉化為結構化的 JSON 參數，接著觸發腳本去打 GitHub 的 API，完成 `git commit`、`git push` 等實體動作。這在 Anthropic 的 MCP (Model Context Protocol) 或 OpenAI 的 API 中已經是標準配備。

#### C. 多代理協作 (Multi-Agent Collaboration)
雖然看起來是同一個對話框，但背後極可能切換了不同的 Agent 角色。例如：`/brainstorm` 呼叫的是擅長創意的模型（設定為高 Temperature）；`/sanity-check` 呼叫的是擅長邏輯推理的模型（如 GPT-4o 或 Claude 3.5 Sonnet，Temperature 設為 0），這種**「各司其職」的混合模型架構**，能大幅降低幻覺（Hallucination）並提高產出品質。

#### D. 元提示與技能封裝 (Meta-Prompting & Skill Abstraction)
他將整套流程打包成 `/lizard-power`，這在技術上稱為 **Meta-Prompting（元提示）**。這個新指令本質上是一段「管理級 Prompt」，當他輸入 `/lizard-power "新idea"` 時，系統的編排器（Orchestrator）會自動在背景按順序展開：`執行A -> 檢查B -> 分解C -> 執行D`。這與我們在 LangChain 或 LangGraph 中定義一個 Graph 工作流是相同的概念。

### 3. 科技局勢洞察：我們正處於什麼階段？

從這個案例可以看出，**AI 的應用已經從「Copilot（副駕駛）」走向了「Autopilot（自動駕駛）」的雛形。** 目前市面上的前沿工具（例如：Cursor IDE 的 Composer 系統、Windsurf、或是開源的 AutoGen、CrewAI）都已經強烈支援這種 Agentic Workflow。未來的軟體工程師，其核心能力將不再只是「寫程式」，而是像這位網友一樣，成為「**AI 系統的編排者（Orchestrator）**」，負責定義工作流、設定驗證機制，並將日常 SOP 封裝成一個個強大的 Slash Commands。

不過，這種做法也有**隱憂**：自動化鏈條越長，前期步驟的微小錯誤（Error Propagation）就越容易在後期被放大。因此，像 `/sanity-check` 這樣的人機協作（Human-in-the-loop）或 AI 交叉驗證節點，是確保這套系統不會崩潰的關鍵。

---

這套工作流不僅限於寫程式，它完全可以複製到行銷企劃、商業分析或內容創作上。**請問你目前主要從事哪個領域的工作？我們或許可以來探討，如何為你的日常工作量身打造一個專屬的「`/lizard-power`」工作流？**

---

# you asked

我是工程師，需要看log或實驗數據分析功耗和效能，最後找到負責的owner去做改善，這樣你會怎麼建議？

---

# gemini response

效能與功耗分析（Performance & Power Analysis）是系統工程中最耗時、也最考驗經驗的環節。從看海量的 Log 尋找蛛絲馬跡，到進行根本原因分析（RCA），最後還要「找出戰犯」請負責的 Owner 修正，這往往充滿了繁瑣的苦力活與跨部門溝通成本。

作為 AI 策略專家，我認為你的日常工作是**絕佳的「複合 AI 系統（Compound AI Systems）」落地場景**。我們可以將你的工作流封裝成一個專屬的巨集指令，例如命名為 **`/perf-triage`**。

以下是我為你設計的現代 AI 數據分析工作流，以及它背後的技術實踐。



### 1. 打造專屬的 `/perf-triage` 工作流

你可以透過一個編排器（如開源的 n8n、LangGraph，或企業級內部的 AI 平台）來串聯以下步驟：

* **`/parse-logs` (數據清理與對齊)：** 將雜亂的原始日誌（Raw Logs）或實驗機台跑出的 CSV 丟給 AI。AI 會自動提取關鍵指標（例如：CPU/GPU 頻率、溫度、電壓、各模組耗電百分比），並將時間戳記對齊，轉換為標準化的 JSON 格式。
* **`/anomaly-hunt` (異常檢測與關聯分析)：** AI 代理介入，開始對比歷史基準數據（Baseline）。它不僅是找「哪裡耗電」，還能進行**跨維度關聯**（例如發現「當 Wi-Fi 模組喚醒頻率異常升高時，系統整體功耗突波與之高度重合」）。
* **`/find-owner` (知識庫檢索與責任歸屬)：** 這是最智慧的環節。AI 會拿著出問題的模組名稱（如 `wlan_driver` 或 `thermal_daemon`），自動去比對你們內部的代碼庫 `CODEOWNERS` 檔案，或是透過檢索過去的 Jira/Bugzilla 歷史紀錄，精準定位該模組目前的負責人。
* **`/issue-dispatch` (自動生成報告與分發)：** AI 將上述分析結果打包，自動畫出功耗異常的對比圖表，並草擬一封帶有強大說服力（附帶 Log 截圖、數據分析、推測原因）的 Ticket 給負責人。

---

### 2. 支撐此工作流的 3 大核心 AI 技巧

要實現上述流程，你需要組合以下技術，這已經超越了單純的「ChatGPT 問答」：

* **超長上下文模型 (Long-Context Models)：** 過去的 AI 無法處理動輒幾十 MB 的 Log 檔。現在可以利用支援 100 萬甚至 200 萬 Token 上下文視窗的模型（如 Gemini 1.5 Pro 系列），直接將整份 Log 或追蹤檔（Trace files）餵給 AI，讓它在全域視野下尋找異常節點，不會遺漏上下文。
* **程式碼直譯器 (Code Interpreter / Advanced Data Analysis)：** 面對大量的實驗數據，純語言模型的數學計算能力並不可靠。目前的最佳實踐是讓 AI **「即時寫 Python 程式碼」** 來處理數據。AI 會利用 Pandas 進行數據聚合，用 Matplotlib 畫出功耗趨勢圖，確保計算結果的絕對精準。
* **內部系統的檢索增強生成 (RAG 整合工具)：** 要精準找到 Owner，AI 必須連上你們的內部知識庫。透過建立 RAG 系統（Retrieval-Augmented Generation），讓 AI 可以存取你們的 Git 倉庫目錄結構、組織架構圖或歷史修復紀錄。這樣 AI 就不會亂猜，而是能精確指出「這支 C++ 檔案的修改歷史，最後是 A 部門的 B 工程師負責的」。

---

### 3. 前瞻視野：從「被動分發」到「主動建議」

目前這套流程可以幫你自動完成 80% 的繁瑣調查與派單工作。但放眼未來 1 到 2 年，隨著 **Agentic AI（代理型人工智慧）** 與基礎設施的深度融合，系統將能做到預測性優化。

AI 不僅僅會告訴 Owner「你的模組耗電異常」，具備強大推理能力的模型甚至會自動拉取該模組的源代碼，進行靜態分析，並在 Ticket 中附上**初步的修復建議（例如：建議加上 Sleep 狀態判斷，或調整 Polling 的頻率）**，甚至是自動生成一個 Draft Pull Request。這才是工程生產力的終極進化。

---

要建構這套系統，第一步通常是打通數據輸入的管道。請問你日常處理的 Log 或實驗數據，主要偏向哪一種格式（例如結構化的 CSV 時序數據，還是非結構化的 Linux Kernel dmesg / 系統日誌）？
