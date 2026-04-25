# Lex Situs — 技術架構與分階段執行計畫
### 為英國《建築安全法》設計的空間化證據資料層

> **讀者**：評估 PropTech / InsurTech / DeepTech 領域 pre-seed 與 seed 階段的倫敦投資機構
> **閱讀時間**：完整版約 12 分鐘；§0 約 90 秒
> **定位**：本文件是**技術架構**與**建構計畫**的合體。商業簡報與財務模型放在另份文件，互不重疊。

---

## §0 一頁讀懂的核心論述

英國《建築安全法 2022》在每一棟英國高風險建築（HRB，全國約 12,500 棟住宅塔樓）之上，疊加了**長達 30 年的法律責任窗口** [1] [2]。責任人（Responsible Person，RP）、Tier-1 建商、潛伏缺陷險（Latent Defect Insurance）承保人因此被法令要求建立並維護 *Golden Thread*——一份數位化、版本受控、符合 GDPR 的施工歷程證據記錄 [3]。然而今天這份「黃金線索」仍以 PDF 卷宗的方式存在：**保險公司無法以此定價、勘測師無法在其中導航、監理機關無法規模化稽核。**

**Lex Situs 是把 Golden Thread 升級為可查詢、可承保、30 年可追溯之空間資產的證據資料層。** 我們**不是**另一個與 OpenSpace（Series D、投後估值約 9.02 億美元 [4]）或 Buildots 在總承包商工作流市場正面競爭的 reality capture 工具——那條跑道已經是紅海。我們選擇下沉一層，服務 **責任人、潛伏缺陷險承保人、與 RICS 勘測師**：每一張被拍下的照片，皆以密碼學錨定到 BIM GUID，並寫入 30 年 WORM 儲存，作為法庭可採信的證據。

整個架構繞著**單一防脆弱原則**展開：*照片才是證據，3D 模型只是索引*。這個設計取捨是我們敢對 BSA 30 年責任窗口承諾「法庭可辯護」的根本原因，也讓我們得以避開所有採用生成式重建的競爭者必然會在法庭上遭遇的「AI 幻覺幾何」攻擊。

我們以**四個有紀律的階段**交付：Phase 0 概念驗證（3 個月，證明精度）；Phase 1 Pre-seed MVP（6 個月，1 家付費 pilot）；Phase 2 Seed 量產（15 個月，SOC 2 Type I + 5–10 家客戶）；Phase 3 A 輪規模化（24 個月，保險定價 API 與跨地區擴張）。**每一階段皆有明確退出條件，與一份明確「現在不做」的清單**——這份文件本身就是一場「節制」的演練。

---

## §1 為何困難？而困難正是護城河

進入這個賽道時，最容易做的事是把 LiDAR、生成式 AI、與 dense photogrammetry 全堆上去。我們三者都拒絕——因為每一項都會在 30 年責任窗口下削弱證據的法庭可辯護性。

| 誘人的選項 | 拒絕的理由 |
|---|---|
| LiDAR 掃描設備（Matterport、NavVis） | 每組工班 3 萬–10 萬英鎊硬體門檻；不適合在活躍工地維持每週掃描節奏 |
| Dense MVS / NeRF 重建 | 額外 80%+ GPU 成本 [5]；幾何被「重建」，因此在法庭上可被質疑 |
| 生成式 inpainting / completion | 任何 AI 補出來的像素都是 30 年訴訟的攻擊面 |
| 公鏈作為合規層 Layer-1 | BSR Golden Thread 指引未要求 [3]；引入跨境傳輸、Gas 費、token 30 年存活等企業法務不會放行的風險 |

我們所保留的是滿足三條檢核的最小技術集合：(一) 可在 1,000 英鎊以內的消費級硬體上運作；(二) 產出的證據在 25 年後仍可由律師為其辯護；(三) 在規模化下可工程化地保有 90% 以上的毛利率。

---

## §2 四條紅線（產品憲法）

跨越所有階段、所有客戶對話，下列四條規則皆不可妥協。它們會出現在工程規格、客戶法律條款、與我們對外公開的 JD 之中。

> **R1 — 照片即證據（The Photo IS the Evidence）。** 帶有 EXIF、時戳、相機指紋的原始 5.7K RAW 影像才是被稽核的唯一物件。SfM 重建、3DGS 蒙皮、BIM 對應——這些都只是索引或視覺介面，永遠不是證據本身。

> **R2 — 禁止生成式（Non-Generative Mandate）。** 整條管線禁止任何神經網路 inpainting、生成式補圖、AI 幻覺像素。這條規則直接堵死所有採用 NeRF 或生成式 3D 的競爭者必然會遭遇的「這張影像是真實的還是模型生成的？」訴訟攻擊。

> **R3 — 僅限剛性變換（Rigid-Only Transformation）。** SfM 對齊到 BIM 的步驟，只允許 6 自由度剛性變換（旋轉與平移）。當對齊誤差超出公開閾值時，系統會升起稽核旗標並派遣 RICS 勘測師到場——**而不是**把幾何「拉直」以套合模型。

> **R4 — 照片稽核而非模型稽核（Photo-as-Audit, Not Model-as-Audit）。** 所有合規、訴訟、保險爭議最終都回歸原始照片。每一個產品功能、每一支 API、每一份合約，都圍繞這個不對稱性設計。

這四條紅線是 Lex Situs 之所以能被視為**證據級 PropTech 平台**、而不是某個 Web3 包裝過的 reality capture 新玩具的根本理由。

---

## §3 分階段管線

### §3.1 Phase 0 — 概念驗證（M0–M3）

最初 90 天只回答一個問題：**一台 600 英鎊的消費級 360 相機，加上紙印 AprilTag 標誌，僅以純 Sparse SfM 處理，能否達到兩位獨立 RICS 勘測師願意背書為「證據級」的精度？** 其他什麼都不做。沒有 3DGS、沒有熱圖、沒有邊緣端 App、沒有多租戶。我們選擇單棟單樓層、走過一遍、餵 COLMAP、用 SVD Procrustes 對 AprilTag 校準到 BIM、用門寬與層高做 ≥ 3 個獨立 check-points、然後產出 RMSE 直方圖。

退出條件是**端對端 RMSE ≤ 8 公分（95% 信心區間）**，每樓雲端成本 ≤ 30 英鎊，並取得兩位 RICS 勘測師的背書。**沒過這關，整個論述就是錯的，Phase 1 不應被融資**。我們寧願在第 3 個月知道，也不要拖到第 18 個月。

### §3.2 Phase 1 — Pre-seed MVP（M3–M9）

Phase 1 把 Phase 0 的人工流程量產化。我們加上 Flutter 邊緣端 App，在 1080p proxy stream 上跑 Variance-of-Laplacian 模糊偵測與 Frustum-to-BIM 覆蓋遮罩，5.7K RAW 仍留在 SD 卡。雲端管線維持 Sparse-only（不做 MVS），並把每一張影像寫入 S3 Object Lock（Compliance Mode）30 年，搭配公共 TSA 的 RFC 3161 時間戳。Postgres 索引儲存三元組 `(BIM_GUID, IFC_revision_hash, captured_at)` 與 SHA-256 證據雜湊。

退出條件是**簽下 1 家付費 pilot——優先順序為英國潛伏缺陷險承保人，其次為 Tier-1 建商**；端對端 SLA 從上傳到索引化證據 ≤ 24 小時；單樓邊際雲端成本 ≤ 15 英鎊。Phase 1 結束時，已上鏈影像 ≥ 5,000 張，分布跨 ≥ 3 個樓層。**我們刻意不做任何 pilot 客戶不需要的功能**。

### §3.3 Phase 2 — Seed 量產（M9–M24）

Phase 2 引入四項把 Lex Situs 從「概念」升級為「平台」的能力。第一，**工地特化語意遮罩**——在射線之前先把 transient 物件（工人、梯子、鷹架）建立 transparency mask，以英國工地 1–3 萬張標注影像 fine-tune。第二，**截斷型 3DGS 視覺介面**——5,000–7,000 iters [6] [7]，產品文案中明確標示為**導覽介面、非量測介面**。第三，**多原語偏差熱圖**（point / line / surface）對 as-planned BIM 做差異 triage，每個高於閾值的旗標必配對原始照片給工程師到場確認。

更關鍵的是，Phase 2 必須交付**企業客戶要求的治理層**：以 tenant 為單位的 S3 prefix + Postgres Row-Level Security、IFC revision diff/patch 與 GUID alias table（用以處理 Revit 在某些設定下匯出 GUID 會變動的事實 [8] [9] [10]）、RPO 1 小時 / RTO 4 小時的災難復原機制、以及 SOC 2 Type I 認證。沒有這些，沒有任何英國保險公司會簽七位數合約；我們明確**不**將其延後。

退出條件：**5–10 家付費客戶、ARR ≥ 30 萬英鎊、單客毛利 ≥ 70%、SOC 2 Type I 取得**。

### §3.4 Phase 3 — A 輪規模化（M24–M48）

Phase 3 是護城河加深的階段。我們把語意遮罩擴展到不同工法（美國的鋼結構、北歐的 CLT 木構）——這是持續性 OpEx，並非自動規模化的工作，我們會誠實向投資人說明此點。我們上線**保險定價資料層**：30 年累積的 `照片 × GUID × 稽核旗標分布` 成為可被 fine-tune 的承保特徵集，透過計次計費 API 提供給合作保險公司。這是商業模式從「SaaS 對標」轉向「fintech 級毛利的資料公司」的轉折點。我們也提供給勘測師現場使用的行動端 viewer，並且**僅針對跨境或具主權敏感性的客戶**提供公鏈錨定作為加值附加項目，而非主架構依賴。

退出條件：**50 棟以上建築上線、ARR ≥ 300 萬英鎊、淨收入留存 ≥ 120%、SOC 2 Type II + ISO 27001、至少 1 家保險公司透過 Pricing API 進行承保**。

---

## §4 精度承諾——能讓技術 DD 收工的那個數字

我們從 Phase 1 開始公開、並在合約中明訂以下 SLA：

> *在以下捕捉條件下：(一) 每 150 m² 至少 1 顆 AprilTag-36h11 貼於 Level-1 主結構、高度 1.5 ± 0.2 公尺；(二) 室內單樓層覆蓋面積 ≤ 30 m × 30 m；(三) 首尾必須掃同一顆起始 AprilTag 形成 Loop Closure。Lex Situs 對 BIM 對齊後的點位承諾 **RMSE ≤ 8 公分（95% 信心區間）**。超出此包絡線的捕捉**不會被 warp**，而是觸發稽核旗標並派遣 RICS 勘測師複測。*

這個數字是任何技術 DD 合夥人會問的第一個問題的答案，同時也是保護我們不過度承諾為「測量級」工作（那需要地面雷射掃描）的邊界。我們競爭的是**證據級精度**，而非**測量級精度**，並且我們會清楚地對客戶區分這兩件事 [11] [12]。

---

## §5 單位經濟學

| 每樓邊際成本（Phase 1 條件下） | 英鎊 |
|---|---|
| Sparse SfM（A100 spot GPU 約 30 分鐘） | 0.85 |
| WORM 儲存寫入 + RFC 3161 TSA token | 1.20 |
| Glacier Deep Archive 30 年攤提 | 2.07 |
| Postgres + 計算 overhead | 5.00–10.00 |
| **單樓首年雲端小計** | **£10–15** |
| 人工 capture（半天 surveyor day-rate） | ~£300 |
| **單樓全載邊際成本** | **~£310–315** |

OpenSpace 對總承包商客戶的定價約為每平方英尺每月 0.05–0.10 美元 [13]。一棟 30 樓、24,000 m²（約 258,000 平方英尺）的建築，依中位數計算 OpenSpace 年合約價值約 21.7 萬美元。即使 Lex Situs 採用 1/3 的定價——以匹配我們更深入的保險業定位——毛利率仍可從 Phase 1 起即超過 95%。**單位經濟學在第一個付費客戶就成立，不需要等 Phase 3 規模化才合理**。

---

## §6 競爭定位

建築科技的後照鏡裡塞滿了車：OpenSpace、Buildots、StructionSite、Reconstruct、DroneDeploy，以及最近被 OpenSpace 收購的 Disperse（2025 年 10 月）[14]。這些對手清一色把進度監控賣給總承包商。我們**刻意不在那條道上競爭**。

| 維度 | GC 賽道（OpenSpace 等） | 證據賽道（Lex Situs） |
|---|---|---|
| 採購方 | 總承包商 / 專案經理 | 責任人 / 保險公司 / 勘測師 |
| 優化的 KPI | 進度、成本、RFI 速度 | 責任邊界、賠付率、稽核可辯護性 |
| 定價結構 | $/平方英尺/月 | per-policy / per-incident / per-HRB-year |
| 競爭壓力 | 紅海，整併進行中 | 藍海，但採購週期長 |
| 護城河基底 | 工作流整合、PM 網絡效應 | 30 年證據語料 + 保險定價模型鎖定 |

我們對其涵義保持務實：這是一個**燒得慢、客戶質量高**的市場。5 家付費保險的 ARR 可能等同於 50 家付費總承包商，但採購週期長達 9–18 個月，且從第一天就要求 SOC 2 與 FCA 對齊的資料處理。我們的階段化計畫是按這個節奏設計的，而不是為了拿虛榮 logo 而衝刺。

---

## §7 我們拒絕做的事——以及為何重要

技術 DD 必然會問：為什麼不加 LiDAR？不上 NeRF？不做公鏈 Layer-1？不做生成式重建？答案在每個案例都一致：**這些選項都會在 BSA 30 年責任窗口下削弱證據的法庭可辯護性，換來一個並不會改變客戶採購決策的功能增量**。BSR 公布的 Golden Thread 指引 [3] 要求的是**數位、安全、版本受控、符合 GDPR**——沒有任何一條依賴區塊鏈或 AI 重建。

**對這些誘人附加功能說「不」的紀律，本身就是架構品質的一部分**——也正是這份紀律讓我們能對 30 年 SLA 做承諾，而其他選項做不到。

---

## §8 18 個月里程碑

| 月份 | 里程碑 | 退出證據 |
|---|---|---|
| M1 | 採購完成；樣品建築鎖定 | 1 棟 HRB 業主 LoI |
| M3 | Phase 0 RMSE 表發佈 | RMSE ≤ 8 公分 + 2 位 RICS 簽字 |
| M5 | Edge App alpha（QA gating + frustum mask） | 內部測試包 |
| M7 | 雲端 SfM + WORM 證據庫上線 | 24 小時 SLA 達成 demo |
| M9 | 第一家付費 pilot 簽約 | 合約 + Stripe MRR |
| M12 | 證據庫累積 20,000 張影像 | Postgres KPI dashboard |
| M15 | 工地特化語意遮罩 PoC | 英國工地 mIoU ≥ 0.7 |
| M18 | 3 家付費客戶；ARR ≥ 10 萬英鎊 | 客戶背書 + SOC 2 readiness audit 啟動 |

---

## §9 長期 optionality

下列三項 optionality 不在 18 個月計畫內，但在 48 個月願景內。任何一項命中，都可能讓估值跳兩級。

第一是**監理標準化**。若 BSR 或 RICS 採納（甚至要求）Lex Situs 的證據結構作為參考格式，公司就從 SaaS 對標升級為**事實標準**，估值乘數隨之改變。通往這條路的方式不是寫 code，而是 Phase 2 期間積極參與 BSI 工作組與 BSR 諮詢。

第二是**保險定價 API**。若英國某家潛伏缺陷險承保人以 Lex Situs 的證據語料 fine-tune 其承保模型，鎖定即為結構性，營收模型由 per-seat 升級為 per-policy；毛利率與客戶 LTV 隨之重估。這也是為什麼**只要選擇權允許，Phase 1 第一家付費客戶應為保險公司而非建商**。

第三是**跨法域複製**。BSA 的範本正在被澳洲、加拿大、新加坡研究 [15]；英國成功的建構可直接移植。我們**不**把這條路徑寫進 Seed 計畫的估值，但這是 cap table 應保持耐心的理由。

---

## §10 募資結構建議（指示性）

Pre-seed：**50–80 萬英鎊**，12 個月跑道，建構 Phase 0 與 Phase 1 前半段，退出時取得 1 家付費 pilot 與量化 RMSE benchmark。

Seed：**300–500 萬英鎊**，於 M9–M12，建構 Phase 2（治理層、語意遮罩、3DGS UI、SOC 2 Type I），退出時 5–10 家付費客戶與 ARR ≥ 30 萬英鎊。

A 輪：**1,200–2,000 萬英鎊**，於 M24–M30，規模化 Phase 3（保險定價 API、跨法域、SOC 2 Type II），退出時 ARR ≥ 300 萬英鎊與至少 1 家保險公司透過 API 承保。

以上數字僅作為談判 placeholder，不構成承諾；以另份商業簡報的財務模型為準。

---

## §11 給讀者的收尾立場

Lex Situs **不是** OpenSpace 的競爭對手、**不是** Web3 PropTech 實驗、**不是**深科技研究室。它是一個範圍極窄、證據級的資料平台，為英國一個明確的 30 年法定窗口而生，從第一天起就為下游毛利最高的買家（保險公司）設計，並以刻意的技術節制避開那些會破壞法庭可辯護性的陷阱。

整個架構**小到能由 4 人團隊在 90 天內交付 Phase 0**、**穩到能讓律師在 25 年後為其辯護**、**有紀律到能在每一階段擴大毛利而非燒毀毛利**。這個組合在這個賽道並不常見——也是我們向投資人請求資本的根本依據。

---

## 參考資料

[1]: https://www.gov.uk/guidance/find-a-high-rise-residential-building "GOV.UK：尋找高樓層住宅"
[2]: https://www.designingbuildings.co.uk/wiki/BSR%20register%20of%20high%20rise%20residential%20buildings "DesigningBuildings：BSR HRB 註冊表"
[3]: https://www.gov.uk/guidance/keeping-information-about-a-higher-risk-building-the-golden-thread "GOV.UK：Golden Thread 指引"
[4]: https://www.cbinsights.com/research/openspace-competitors-structionsite-matterport-holobuilder-buildots-avvir-ai-clearing/ "CB Insights：OpenSpace 9.02 億美元估值"
[5]: https://arxiv.org/html/2510.06802v1 "Sparse SfM 對比 MVS（arXiv 2025）"
[6]: https://arxiv.org/pdf/2511.04283 "FastGS：100 秒訓練 3DGS"
[7]: https://github.com/nyu-systems/grendel-gs "Grendel-GS 多卡 3DGS 訓練"
[8]: https://forums.autodesk.com/t5/revit-api-forum/ifc-guid-is-different-in-the-ifcguid-parameter-written-by-revit/td-p/12650094 "Revit forum：IFC GUID 不一致"
[9]: https://github.com/Autodesk/revit-ifc/issues/521 "Revit-IFC：房間 IfcGUID 每次匯出變動"
[10]: https://www.sciencedirect.com/science/article/pii/S0926580523003230 "IFC 版本控制 Diff/Patch（Esser 2023）"
[11]: https://www.thefuture3d.com/blog/laser-scanning-vs-photogrammetry "雷射掃描 vs 攝影測量精度比較"
[12]: https://wingtra.com/lidar-drone/lidar-vs-photogrammetry-what-sensor-to-choose/ "LiDAR vs Photogrammetry 感測器選擇 — Wingtra"
[13]: https://www.openspace.ai/request-demo-pricing/ "OpenSpace 定價結構"
[14]: https://www.prnewswire.com/news-releases/openspace-acquires-construction-progress-tracking-leader-disperse-302596167.html "OpenSpace 收購 Disperse（2025 年 10 月）"
[15]: https://www.systemhygienics.co.uk/blog/building-safety-regulator-updates "BSR 2025 更新與海外採用興趣"
