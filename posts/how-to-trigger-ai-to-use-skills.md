---
title: 要如何觸發 AI 使用 Skill
date: 2026-03-14 14:35
categories: [AI 技術]
tags: [Gemini CLI, Skill, AI]
---

在現代的 AI 輔助工作流程中，「Skill（技能）」是提升生產力的核心。本文將深入探討在 Gemini CLI 環境下，如何精準地觸發並善用這些專家功能。

## 什麼是 AI Skill？

Skill 是一份寫給 AI 看的**純文字說明文件**（SKILL.md），針對特定任務（如整理會議記錄、撰寫客戶回信、產出分析報告）提供深度的步驟指引與注意事項。不同於一般對話，Skill 讓 AI 在該領域有明確的工作方式可以遵循。當你觸發一個 Skill 時，AI 會讀入這份文件，並照著裡面的指引執行任務，AI儼然像是該領域的專家。

## Skill 的兩種觸發方式

### 主動觸發
```
你：使用 meeting-skill 幫我整理剛才的會議內容
→ AI 知道要去讀哪份 Skill
```

### 被動觸發（靠 GEMINI.md 設定）
```
GEMINI.md 寫：
「遇到會議記錄相關任務時，
  自動讀取 ~/.gemini/skills/meeting-skill/SKILL.md」
    ↓
你：幫我把這段逐字稿整理成會議記錄
AI：自動去讀 meeting-skill，你不用特別說
```

## Skill 和 GEMINI.md 的差別
```
GEMINI.md：
→ 永遠生效的全域規範
→ 放最重要、最常用的規則

Skill：
→ 按需載入的專業知識
→ 放特定任務才需要的深度內容
→ 不會每次都佔用 context window
```

這就是為什麼要分開——GEMINI.md 太長會壓縮 context window 的有效空間，讓 AI 能處理的實際任務內容變少，Skill 是需要時才載入，避免浪費。

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
  找到對應 Skill 後建議載入」

不是列出所有觸發條件
而是讓 AI 自己去查目錄
```

索引檔裡列出每個 Skill 的名稱、用途與適用時機，AI 查完自己判斷要用哪個：
```
你：幫我把這段逐字稿整理成會議記錄
AI：這需要專業知識
    → 查索引，找到 meeting-skill 及其適用時機
    → 判斷符合，建議載入
    → 載入 SKILL.md，執行任務
```

### 方法二：主動觸發為主，被動為輔
```
被動觸發：只留最核心、最常用的 2-3 個 Skill
主動觸發：其他 Skill 都靠你明確說「使用 XX skill」
```
```
值得被動觸發：
→ 你的寫作風格 Skill（幾乎每次寫東西都需要）

不值得被動觸發：
→ 會議記錄 Skill（只有整理會議才需要）
→ 客戶回信 Skill（只有寫信時才需要）
→ 靠你主動說就好
```

## 一句話總結

> Skill 越多越需要一個「目錄索引」而不是越來越長的觸發規則，讓 AI 自己查目錄決定該用哪個 Skill，比在 GEMINI.md 裡列出所有觸發條件更精簡也更準確。