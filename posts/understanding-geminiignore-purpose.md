---
title: .geminiignore 的用途與使用時機
date: 2026-04-13 14:30
categories: [技術, 工具]
tags: [Gemini CLI, 專案管理, AI]
---

用一個最核心的觀念來區分：

**`.gitignore` 的受眾是 Git （用來決定什麼不要傳到 GitHub）**
**`.geminiignore` 的受眾是 Gemini AI （用來決定什麼不要丟給 AI 看）**

正常情況下，Gemini CLI 非常聰明，它預設「會自動參考」你的 `.gitignore` 來知道哪些是被當作垃圾或快取的資料夾（例如 `.venv`），所以你通常不需要再寫一遍給 Gemini 看。

但有時候，我們會需要**讓 Git 和 Gemini 的行為脫鉤**，這時就需要用到 `.geminiignore`。以下列舉兩個最常見的應用情境：

### 情境一：Git 要忽略，但 AI 必須要看（例如：`!graphify-out`）
你剛剛在 `.gitignore` 寫了 `graphify-out/`，因為這份知識圖譜是電腦自動跑出來的，又大又雜，你絕對不希望把它 push 上 GitHub 佔空間。

但矛盾來了：如果你把它忽略了，Gemini AI 預設也就不會去讀它了。偏偏整個專案最需要看這份知識圖譜的就是 Gemini 本身！
這時我們就在 `.geminiignore` 裡面用驚嘆號 `!` 來達成「負面表列 / 解除忽略」的作用：
```gitignore
!graphify-out
!graphify-out/.*
```
這段話就等同於在告訴 AI：「雖然 Git 把 `graphify-out` 當成垃圾忽略了，但你不能忽略它，這對你很重要，請務必去讀取它！」

### 情境二：Git 有追蹤，但不准給 AI 看（避免 Token 爆炸或機密外洩）
假設你的專案裡有一個很大的 `test-data.json` 或者是存測試帳號密碼的 `config.dev.yaml`。這些也許是你自己開發必須用的檔案，也確實被 Git 追蹤著。

但如果這些檔案動輒好幾 MB，或者有資安考量，如果不小心被 AI 掃過去，不僅可能會讓你的 Token 瞬間爆表，還可能引發安全顧慮。這時你就可以在 `.geminiignore` 裡加上：
```gitignore
test-data.json
config.dev.yaml
```
這等同於在告訴 AI：「不用管 Git 怎麼想，總之你裝作沒看到這些檔案就對了。」

簡單來說，這個檔案是用來對 AI 進行**「開特例」**的！