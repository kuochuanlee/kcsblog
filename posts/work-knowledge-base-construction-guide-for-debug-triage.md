---
title: 工作知識庫建構指南（Debug / Triage 工程師適用）
date: 2026-04-16 11:15
categories: [工程實踐]
tags: [Debug, Triage, Knowledge Base, AI Workflow, Troubleshooting]
---

# 工作知識庫建構指南（Debug / Triage 工程師適用）

## 核心原則

| 原則 | 說明 |
|------|------|
| **結構化優先** | 放棄流水帳純文字，改用 YAML + Markdown，讓腳本/AI 讀得懂 |
| **本地端優先** | 科技大廠網管嚴格，禁用 Notion 等雲端工具，資料不離開公司內網 |
| **一 Issue 一檔** | 資料原子化，利於 Python 批次解析與 Git 管理 |
| **知識 vs. 證據分離** | MD 筆記是知識（進 Git）；Log 大檔是證據（不進 Git，另立備份） |
| **點面雙軌連結** | Issue（點）與 Module（面）透過 Markdown 內部連結串成地圖 |

---

## 標準工具鏈

```
VS Code  +  Local Git  +  Markdown/YAML  +  Python（分析）
```

- **VS Code**：編輯器兼搜尋工具（Regex 全文搜尋）
- **Local Git**：版本控制，只需 `commit`，不需 `push` 到外部
- **Git Bare Repo on NAS**：推送至公司 Z:\ 槽做備份（IT 每日快照加持）
- **Python + SQLite**：進階自動化分析，零授權、免伺服器

---

## YAML Frontmatter 標準欄位

每份 Issue MD 開頭必須包含：

```yaml
---
date: 2026-04-16
platform: MTK_Chip_X
symptom: "WiFi random disconnect under heavy load"
error_code: "ERR_WLAN_099"
root_cause_category: "Driver Timeout"
status: "Resolved"          # Resolved / WIP / Pending
owner: "CK"
---
```

---

## 檔案命名規則

```
YYYYMMDD_專案/平台_現象描述_錯誤碼.md
```

**範例：**
```
20260416_ProjectX_WiFi_Drop_0x009.md
20260501_Audio_DSP_Crash_ERR005.md
```

- 日期開頭 → 自動按時間排序
- 平台 + 描述 → 不開檔就看懂內容
- 加錯誤碼 → 幾乎不會撞名

---

## 建議的 Git 知識庫目錄結構

### Commit message 可以加前綴規範
- Add:    新增 issue 或 module
- Update: 補充資訊、更新狀態
- Fix:    修正筆記錯誤
- Close:  Issue 標記為 Resolved

```
My_Debug_KB/
│
├── README.md                        # 知識庫首頁/Dashboard
├── .gitignore                       # 宣告哪些資料夾不進 Git
│
├── issues/                          # ── Issue 紀錄區（進 Git）──
│   ├── 20260416_WiFi_Drop_0x009.md
│   ├── 20260501_Audio_DSP_Crash.md
│   └── ...
│
├── modules/                         # ── Module 知識區（進 Git）──
│   ├── Mod_WiFi.md
│   ├── Mod_Audio.md
│   ├── Mod_Bluetooth.md
│   ├── assets_WiFi/                 # WiFi 模組專屬附件
│   │   ├── WiFi_Spec_v1.2.pdf
│   │   └── 20260416_Internal_Triage_Guide.pdf
│   └── assets_Audio/
│       └── Audio_DSP_Register_Map.pdf
│
├── attachments/                     # ── 跨 Issue 共用附件（進 Git）──
│   └── 20260416_Email_CK_Timeout_Confirm.pdf
│
├── logs/                            # ── 原始 Log 區（不進 Git）──
│   ├── 20260416_WiFi_raw.log
│   └── experiment_data_0501.csv
│
└── scripts/                         # ── 自動化腳本（進 Git）──
    ├── parse_yaml.py
    └── export_report.py
```

---

## 各目錄與檔案說明

### `README.md` — 知識庫首頁
- **用法：** 開啟知識庫的第一個入口
- 列出所有 Module 的連結
- 列出近期處理中的 Issue
- 記錄整體知識庫的使用規範與欄位說明
- 每次 issue status 改為 Resolved，必須回頭確認 Mod_XXX.md 的「常見病徵對照表」是否需要新增一行。

```
## 🔴 WIP Issues，可以用 parse_yaml.py 來生成這區塊
 [20260416 WiFi Drop](./issues/20260416_WiFi_Drop_0x009.md) — 等 CK 回覆
 [20260501 Audio Crash](./issues/20260501_Audio_DSP_Crash.md) — 待復現
```

---

### `.gitignore` — Git 排除清單
- **用法：** 防止大檔案意外進入 Git，保持倉庫輕巧
- 必寫內容：
```
logs/
*.log
*.db
*.csv        # 實驗數據大檔
*.zip
*.7z
__pycache__/
```

---

### `issues/` — Issue 紀錄（每案一檔）
- issues/ 旁邊放一個 _template_issue.md，新增時避免欄位漏填。
**每個 `.md` 檔的結構：**

```markdown
---
opened_date: 2026-04-10
resolved_date: 2026-04-16
platform: MTK_Chip_X
symptom: "WiFi random disconnect under heavy load"
error_code: "ERR_WLAN_099"
root_cause_category: "Driver Timeout"
status: "Resolved"
owner: "CK"
---

# 問題背景
(簡述復現條件、環境)

# 關鍵 Log 節錄
(最核心的 3~5 行，不要貼千行)

[ERR] WLAN Timeout at 0x099, retry failed


# 實驗數據
| 參數 | 數值 |
|------|------|
| Timeout 設定 | 10ms |
| 復現率 | 80% |

* 完整數據：`../logs/20260416_WiFi_raw.log`

# 解決方案
與 CK 確認，Workaround：將 Timeout 參數從 10ms 放寬至 20ms。

# 佐證資料
* 確認信：`../attachments/20260416_Email_CK_Timeout_Confirm.pdf`

# 相關模組知識
* `../modules/Mod_WiFi.md`
```

---

### `modules/` — Module 知識地圖（長期累積）
- modules/ 旁邊放一個 _template_module.md，新增時避免欄位漏填。
**每個 `Mod_XXX.md` 的結構：**

```markdown
# Module：WiFi

## Owner 資訊
| 角色 | 姓名 | 負責範圍 |
|------|------|----------|
| Driver | CK | Kernel Driver、Timeout 機制 |
| Firmware | TV | FW 燒錄、暫存器初始化 |

## 收案標準（丟給 Owner 前必備）
- [ ] 附上完整電壓數據
- [ ] 附上關鍵 Log 前後各 20 行
- [ ] 確認韌體版本號

## 常見病徵對照
| 症狀 | 可能原因 | 先找誰 |
|------|----------|--------|
| ERR_WLAN_099 | Driver Timeout | CK |
| Disconnect 無 Log | FW 未初始化 | TV |

## 參考文獻
* `./assets_WiFi/WiFi_Spec_v1.2.pdf`
    * Key Takeaway：第 45 頁 State Machine 圖是分析斷線的核心
    * 來源：CK 提供（2026/04）
* `./assets_WiFi/20260416_Reg_Read_Guide.pdf`
    * 說明：原始網頁 http://internal.wiki/xxx，存為 PDF 備份

## 相關 Issue 紀錄
* `../issues/20260416_WiFi_Drop_0x009.md`
* `../issues/20260501_WiFi_Hang_0x021.md`
```

---

### `assets_XXX/` — Module 專屬附件資料夾
- **用法：** 存放 Owner 提供的 PDF 規格書、內部 Wiki 列印版
- 命名規則：`YYYYMMDD_描述.pdf`
- **網頁務必列印成 PDF**（`Ctrl + P`），防止連結失效

---

### `attachments/` — 跨 Issue 信件與截圖
- **用法：** 存放與 Owner 的關鍵確認信件（另存為 PDF）
- 命名規則：`YYYYMMDD_Email_對象_主題.pdf`
- 信件只存「決策/結論」的那封，日常往返不需存

---

### `logs/` — 原始 Log 大檔（不進 Git）
- **用法：** 原始 Terminal Log、波形檔、大型 CSV 實驗數據
- 此資料夾在 `.gitignore` 中被排除
- 備份方式：用 `.bat` 腳本定期 `xcopy` 至公司 NAS 的獨立資料夾

```bat
xcopy C:\My_Debug_KB\logs\* Z:\Debug_Logs_Backup\ /D /E /C /I /H /R /Y /K
```

---

### `scripts/` — 自動化分析腳本
- **用法：** 批次讀取 issues/ 的 YAML 欄位，產生分析報表
- 進 Git，與知識庫一起版控

**入門腳本範例（parse_yaml.py）：**
```python
import os, yaml

kb_path = "./issues"
records = []

for fname in os.listdir(kb_path):
    if fname.endswith(".md"):
        with open(os.path.join(kb_path, fname), encoding="utf-8") as f:
            content = f.read()
        # 擷取 YAML frontmatter
        parts = content.split("---")
        if len(parts) >= 3:
            meta = yaml.safe_load(parts[1])
            records.append(meta)

# 統計各平台 Issue 數量
from collections import Counter
print(Counter(r.get("platform") for r in records))
```

---

## Git 日常操作流程

```bash
# 每次新增/修改筆記後
git add .
git commit -m "Add: 20260416 WiFi Drop issue resolved"

# 定期備份到公司 NAS（第一次需設定）
git remote add backup_nas Z:\My_Debug_KB.git
git push backup_nas master
```

> **重點：** 只需 `commit` + `push` 到公司內部 NAS，絕對不 push 到 GitHub/GitLab 等外部平台。

---

## 雙軌備份策略總覽

| 資料類型 | 進 Git？ | 備份方式 |
|----------|----------|----------|
| MD 筆記、Module 知識 | ✅ | Git push → 公司 NAS Bare Repo |
| 信件 PDF、截圖 | ✅ | 同上 |
| .gitignore、腳本 | ✅ | 同上 |
| 原始 Log 大檔 | ❌ | xcopy → NAS 獨立資料夾 |
| 實驗 CSV 大檔 | ❌ | xcopy → NAS 獨立資料夾 |


## Git 設定實例

雲端硬碟 I:\我的雲端硬碟\backup_nas\kuo.git
```powershell
# backup_nas是新建命名的資料夾，當作遠端git倉庫
# kuo.git資料夾，.git是命名慣例
# --bare唯讀純倉庫
git init --bare
```

本地端電腦 D:\kuo
```powershell
# kuo是本地資料夾，應對到雲端硬碟kuo.git
# 將遠端備份節點一般取名為 origin
# -u（--set-upstream）的意思是「建立預設追蹤」
git remote add origin I:\我的雲端硬碟\backup_nas\kuo.git
git push -u origin main
```
