# CwaWeather Frontend 🌤️

臺灣氣象預報 Web App，串接中央氣象署（CWA）開放資料，提供 iOS 風格的天氣查詢介面。

---

## 功能特色

- 🌍 **目前位置偵測**：自動取得 GPS 座標並查詢當地天氣
- 📍 **多城市切換**：支援臺北市、苗栗縣、臺中市、彰化縣、高雄市等地區
- 🏘️ **鄉鎮級查詢**：臺中市、彰化縣等縣市可進一步切換至特定行政區
- 📅 **多日預報**：顯示未來數天的天氣資訊（溫度、天氣、降雨）
- 🌡️ **詳細資訊**：顯示體感溫度、濕度、風速、穿搭建議與降雨預報
- 🎨 **動態背景**：根據天氣狀況切換晴天／多雲／雨天／雷雨視覺效果
- 📌 **Sticky Header**：捲動時 Header 自動縮小（iOS Weather 風格）

---

## 技術棧

| 類別     | 技術                                                                                          |
| -------- | --------------------------------------------------------------------------------------------- |
| 框架     | Vue 3.5（`<script setup lang="ts">`）                                                         |
| 語言     | TypeScript（嚴格模式）                                                                        |
| 樣式     | Tailwind CSS 4.x + Vanilla CSS                                                                |
| 建構工具 | Vite 6.x                                                                                      |
| 後端 API | [CwaWeather Backend](https://github.com/MengtingKu/CwaWeather-backend)（自製，部署於 Zeabur） |

---

## 專案結構

```
src/
├── App.vue                    # 根元件，負責佈局與狀態管理
├── index.css                  # 全域樣式、設計 token、Glassmorphism 元件
├── main.ts                    # 應用程式進入點
├── composables/
│   └── useWeather.ts          # 天氣資料取得與狀態管理（Composable）
└── components/
    ├── HeroCard.vue           # 主要 Hero 區塊：城市切換、溫度顯示、鄉鎮 Navbar
    ├── ForecastCard.vue       # 單日預報卡片
    ├── WeatherDetails.vue     # 詳細資訊格(濕度、風速、穿搭建議等)
    ├── WeatherBackground.vue  # 動態天氣背景動畫
    └── LoadingScreen.vue      # 載入中畫面
```

---

## 本地開發

### 環境需求

- Node.js >= 18
- npm >= 9

### 啟動步驟

```bash
# 1. 安裝依賴
npm install

# 2. 啟動開發伺服器
npm run dev
```

開發伺服器預設運行於 `http://localhost:5173`

### 其他指令

```bash
# 型別檢查 + 建構生產版本
npm run build

# 預覽生產版本
npm run preview
```

---

## API 串接

本專案串接自製後端，後端負責呼叫 CWA 開放資料 API 並整理回傳格式。

- **後端 Repo**：[MengtingKu/CwaWeather-backend](https://github.com/MengtingKu/CwaWeather-backend)
- **正式環境 API**：`https://kuku-cwaweather-backend.zeabur.app/api/weather`

### API 查詢範例

| 查詢方式 | 範例                         |
| -------- | ---------------------------- |
| 縣市查詢 | `?county=臺中市`             |
| 鄉鎮查詢 | `?city=烏日區&county=臺中市` |
| 座標查詢 | `?lat=24.1&lng=120.6`        |

---

## 變更日誌

| 日期       | 版本   | 說明                                                                        |
| ---------- | ------ | --------------------------------------------------------------------------- |
| 2026-02-24 | v1.1.0 | 修正 Header 固定、下拉選單 z-index 遮擋、捲動時自動收起選單、優化選單透明度 |
| 2026-02-24 | v1.0.0 | 初始版本：建立 Vite + Vue 3.5 前端架構，整合 CWA 氣象 API，實作 iOS 風格 UI |

---

## 授權

MIT License
