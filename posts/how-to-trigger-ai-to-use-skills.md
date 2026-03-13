---
title: 要如何觸發AI使用skill
date: 2026-03-14 14:35
categories: [AI 技術]
tags: [Gemini CLI, Skill, AI]
---

在現代的 AI 輔助開發流程中，「Skill（技能）」是提升生產力的核心。本文將深入探討在 Gemini CLI 環境下，如何精準地觸發並善用這些強大的專家功能。

## 什麼是 AI Skill？

Skill 是預先定義的一組「專家指令」與「執行邏輯」，是一份寫給 AI 看的「專業說明書」。不同於一般的對話，Skill 針對特定任務（如：程式碼重構、單元測試生成、或部落格文章創作）進行了深度優化。當您觸發一個 Skill 時，AI 會進入該領域的專家狀態，調用相關工具並遵循嚴謹的工作流。

## Skill 的兩種觸發方式

### 主動觸發
```
你：使用 playwright skill 幫我寫登入測試
→ AI 知道要去讀哪份 Skill
```

### 被動觸發（靠 GEMINI.md 設定）
```
GEMINI.md 寫：
「遇到 Playwright 相關任務時，
  自動讀取 ~/.gemini/skills/playwright-skill/SKILL.md」
    ↓
你：幫我寫一個 Playwright 測試
AI：自動去讀 Skill，你不用特別說
```

## Skill 和 GEMINI.md 的差別
```
GEMINI.md：
→ 永遠生效的全域規範
→ 放最重要、最常用的規則

Skill：
→ 按需載入的專業知識
→ 放特定任務才需要的深度內容
→ 不會每次都佔用 AI 的注意力（context window）
```

這就是為什麼要分開——GEMINI.md 太長會稀釋 AI 的注意力，Skill 是需要時才載入。

## 被動觸發存在的問題（靠 GEMINI.md 設定）
```
Skill 越多
    ↓
GEMINI.md 觸發規則越多
    ↓
規則之間可能衝突
AI 判斷越來越模糊
Context window 被規則佔用
    ↓
整體效果反而變差
```

## 實際上怎麼處理

### 方法一：Skill 索引檔

```
GEMINI.md 只寫一條規則：
「需要專業知識時，先查 ~/.gemini/awesome-skills-index.md
  找到對應 Skill 提出建議」

不是列出所有觸發條件
而是讓 AI 自己去查目錄
```

```
你：幫我寫 Playwright 測試
AI：這需要專業知識
    → 查索引
    → 找到 playwright-skill
    → 建議載入
    → 執行
```

### 方法二：主動觸發為主，被動為輔

```
被動觸發：只留最核心、最常用的 2-3 個 Skill
主動觸發：其他 Skill 都靠你明確說「使用 XX skill」
```

```
常用到值得被動觸發：
→ 你的程式碼風格 Skill（幾乎每次都需要）

不值得被動觸發：
→ Playwright Skill（只有寫測試時才需要）
→ 靠你主動說就好
```

### 方法三：Skill 本身寫觸發條件

```
在 SKILL.md 開頭寫：
「當使用者提到 Playwright、e2e測試、瀏覽器自動化時載入此 Skill」

GEMINI.md 只需要寫：
「載入 Skill 前先讀該 Skill 的觸發條件」
```

---

## 你目前的設計其實已經是正確方向

```
你的 GEMINI.md 寫的是：
「需要某個 skill 時，先查索引找到對應 GitHub 連結」

這是最聰明的做法：
→ GEMINI.md 保持精簡
→ 觸發判斷交給 AI 自己看索引決定
→ 不需要列出每個 Skill 的觸發條件
```

---

## 一句話總結

> Skill 越多越需要一個「目錄索引」而不是越來越長的觸發規則，讓 AI 自己查目錄建議該用哪個 Skill，自己再決定，比在 GEMINI.md 裡列出所有觸發條件更乾淨也更準確。