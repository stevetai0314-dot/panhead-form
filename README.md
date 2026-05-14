# 盤頭生產紀錄

手機版生產紀錄表單，支援三種單據、中越雙語切換。

**前端：** GitHub Pages（本 repo 的 `index.html`）  
**後端：** Google Apps Script（讀寫 Google Sheets）

---

## 架構

```
使用者手機瀏覽器
    ↓ 開啟 GitHub Pages URL
index.html（前端）
    ↓ fetch() 呼叫 GAS API
Google Apps Script（後端）
    ↓ 讀/寫
Google Sheets（資料儲存）
```

---

## 三種單據

| 單據 | 顯示欄位 |
|------|---------|
| 1. 整經盤頭生產 | 入庫、生產人員（整經）、紗種、整經條數、盤頭號碼、重量（正數）、長度、批號 |
| 2. 盤頭領料上機 | 出庫、生產人員（織帶）、紗種、整經條數、盤頭號碼、重量（**負數**）、機台號碼 |
| 3. 機上盤頭退料 | 入庫、生產人員（織帶）、紗種、盤頭號碼、重量（正數）、刻度 |

---

## 首次部署

### 1. 建立 Google Sheets

到 [sheets.new](https://sheets.new) 建立「盤頭生產紀錄」試算表。

**Config 分頁（標題列 A1:C1）：**

| A1 整經人員 | B1 織帶人員 | C1 紗種 |
|---|---|---|
| 從 A2 填入整經人員名單 | 從 B2 填入織帶人員名單 | 從 C2 填入紗種清單 |

**Data 分頁（標題列 A1:M1）：**

`時間戳記 / 課別 / 單據別 / 入出庫 / 生產人員 / 紗種 / 整經條數 / 盤頭號碼 / 重量KG / 長度M / 批號 / 機台號碼 / 刻度cm`

> 重量欄：出庫（盤頭領料上機）自動存為負數，入庫為正數。

### 2. 部署 GAS

1. 試算表上方 `Extensions > Apps Script`
2. 將本 repo 的 `Code.gs` 內容貼入編輯器
3. 建立 `index`（HTML 檔），暫時填入任意內容
4. `Deploy > New deployment`
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. 複製產生的 Web App URL

### 3. 填入 GAS URL

開啟 `index.html`，找到第一行 script：

```javascript
var GAS_URL = 'YOUR_GAS_URL_HERE';
```

將 `YOUR_GAS_URL_HERE` 換成你的 Web App URL，推上 GitHub。

### 4. 開啟 GitHub Pages

GitHub repo → **Settings > Pages**  
Source 選 `Deploy from a branch`，Branch 選 `main`，資料夾選 `/ (root)`，Save。

幾分鐘後網址生效：`https://stevetai0314-dot.github.io/panhead-form/`

---

## 日常維護

### 更新下拉名單（人員／紗種）

直接在 Google Sheets 的 **Config 分頁**新增或刪除列，不需要改程式碼。

### 更新表單介面

1. 修改 `index.html`
2. `git add index.html && git commit -m "update" && git push`
3. GitHub Pages 約 1 分鐘後自動更新

### 更新後端邏輯

1. 修改 `Code.gs`
2. 複製貼上到 GAS 編輯器
3. `Deploy > Manage deployments > Edit > New version > Deploy`

---

## 資料流

```
送出表單
  → fetch POST 到 GAS_URL（body: JSON）
  → doPost() 解析 JSON
  → submitForm() 寫入 Sheets Data 分頁
  → 回傳 { success: true }
  → 顯示「送出成功」畫面
```
