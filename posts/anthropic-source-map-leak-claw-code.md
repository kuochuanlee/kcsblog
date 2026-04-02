---
title: Anthropic Source Map 洩漏事件：Claude Code 原始碼外洩與 claw-code 的誕生
date: 2026-04-01 10:30
categories: [技術, 安全]
tags: [Anthropic, Claude Code, Source Map, 安全漏洞, claw-code, OpenClaw]
---

## Claude Code Harness Engineering
https://claude-code-harness-blog.vercel.app/

## 一、 洩漏根因：Source Map 打包失誤
Anthropic 於 npm 發佈 Claude Code (v2.1.88) 時，CI/CD 流程未在 `.npmignore` 中排除除錯用的 Source Map 檔案。
* **技術機制**：`.map` 檔案本質上是 JSON 格式，其內部的 `sourcesContent` 陣列完整保留了編譯前的原始代碼。
* **影響範圍**：高達 60MB 的 `cli.js.map` 被公開下載，導致超過 51 萬行高品質 TypeScript 原始碼（含系統 Prompt、工具呼叫邏輯與底層架構）完全曝光。

## 二、 曝光的核心技術資產
本次外洩形同公開了 Anthropic 的產品藍圖與 Agent 核心架構：
1.  **次世代模型代號**：
    * **Capybara**：對應 Claude 4.6。
    * **Fennec**：對應頂級模型 Claude 4.6 Opus。
    * **Numbat**：全新超輕量化測試模型。
2.  **自我修復記憶架構 (Self-Healing Memory)**：
    * 外洩代碼揭露了 Claude Code 的高穩定性來源：一套能自動偵測並修正上下文記憶矛盾的 Agent 系統。

## 三、 社群反應：AI 輔助重構與「龍蝦（Claw）」迷因的延續
原始碼外洩後，開源社群並未直接抄襲，而是利用 AI 工具鏈展現了極高效率的反向工程。

1. 極速淨室重構：透過如 OmX 等 AI Agent 協作，開發者 @instructkr 在數小時內將 Claude Code 的核心邏輯以 Python 重新實作，完成傳統需要數月的「淨室重構 (Clean-room rewrite)」以規避版權爭議。

2. 「Claw」社群生態系的成形：該重構專案被命名為 claw-code。這延續了今年初另一個開源專案 OpenClaw（原名 Clawdbot，因 Anthropic 商標警告而改名並衍生出龍蝦迷因）的命名傳統。「Claw」已然成為社群中對抗或開源替代 Claude 技術的代名詞。儘管 Anthropic 正全力發起 DMCA 下架，但核心架構早已隨著這些 Claw 系專案在社群中生根發芽。

## 四、 產業與工程啟示
1.  **發布管線審查**：生產環境部署必須嚴格攔截 `.map` 檔案，自動化 CI/CD 需加入敏感檔掃描機制。
2.  **護城河的消失**：在 AI 輔助編程時代，純應用層的架構優勢（如 Prompt 鏈與 Agent 邏輯）一旦暴露，開源社群能在 24 小時內完成複製與語言移植。未來的競爭將完全取決於基礎模型能力與基礎設施算力。
