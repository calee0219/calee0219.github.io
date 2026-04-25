# Lex Situs — Technical Architecture & Build Plan
### A Spatial Evidence Layer for the UK Building Safety Act

> **Audience**: London VCs evaluating PropTech / InsurTech / DeepTech at pre-seed and seed stage
> **Reading time**: 12 minutes for the full document; 90 seconds for §0
> **Position**: This is a *technical architecture* paired with a *build plan*. The commercial deck and financial model live in separate documents.

---

## §0 The One-Page Thesis

The **Building Safety Act 2022** has created a **30-year liability window** on every UK Higher-Risk Building (HRB) — roughly **12,500 residential towers** [1] [2]. Responsible Persons (RPs), Tier-1 developers and latent-defect insurers must now maintain a *Golden Thread*: a digital, version-controlled, GDPR-compliant evidentiary record of how the building was actually constructed [3]. Today this record lives in PDF binders. **Insurers cannot price against it. Surveyors cannot navigate it. Regulators cannot audit it at scale.**

**Lex Situs is the spatial evidence layer that turns the Golden Thread into a queryable, insurable, 30-year asset.** We are *not* another reality-capture tool competing with **OpenSpace** (Series D, $902M post-money [4]) or **Buildots** in the GC workflow market — that race is already lost. We sit one tier deeper, serving **RPs, latent-defect insurers, and RICS surveyors**, where every captured photograph is cryptographically anchored to a BIM GUID and locked into 30-year WORM storage as court-admissible evidence.

The architecture is engineered around **one anti-fragile principle**: *The photograph is the evidence; the 3D model is only the index.* This single design choice is what allows us to promise 30-year defensibility under the BSA without exposing ourselves to the "AI-hallucinated geometry" attack that any generative-reconstruction competitor will face in court.

We deliver in **four disciplined phases** — Phase 0 PoC (3 months, prove accuracy); Phase 1 Pre-seed MVP (6 months, one paid pilot); Phase 2 Seed Production (15 months, SOC 2 Type I + 5–10 customers); Phase 3 A-round Scale (24 months, insurance-pricing API and cross-jurisdiction expansion). Each phase has explicit exit criteria and an explicit list of things we are *not* building yet. **This document is, deliberately, an exercise in restraint.**

---

## §1 Why This Is Hard (and Why That Is the Moat)

The temptation in this category is to throw LiDAR, generative AI, and dense photogrammetry at the problem. We have rejected all three, because each one weakens the legal defensibility of the resulting evidence under a 30-year liability window.

| Tempting choice | Why we reject it |
|---|---|
| LiDAR scanning rigs (Matterport, NavVis) | £30k–£100k hardware barrier per crew; unfit for weekly capture cadence on active sites |
| Dense MVS / NeRF reconstruction | 80%+ GPU cost overhead [5]; geometry is reconstructed, hence challengeable in court |
| Generative inpainting / completion | Any AI-hallucinated pixel is a 30-year litigation attack surface |
| Public blockchain as Layer-1 compliance | Not required by the BSR Golden Thread guidance [3]; introduces cross-border, gas-cost and 30-year-survival liabilities that enterprise legal teams will not approve |

What we keep is the smallest set of techniques that pass three tests: (1) it works with sub-£1k consumer hardware, (2) it produces evidence a barrister can defend in court 25 years from now, (3) it can be cost-engineered to deliver gross margin above 90% at scale.

---

## §2 The Four Red Lines (Product Constitution)

Across every phase and every customer conversation, the following four principles are non-negotiable. They appear in the engineering specification, in the customer-facing legal terms, and in every job description we publish.

> **R1 — The Photo IS the Evidence.** The original 5.7K RAW capture, with intact EXIF, timestamp and camera fingerprint, is the audited artefact. The SfM reconstruction, the 3DGS skin, the BIM mapping — these are indices and visual interfaces, never the evidence itself.

> **R2 — Non-Generative Mandate.** No neural inpainting, no generative completion, no AI-hallucinated pixels enter the pipeline. This forecloses the "is this image real or model-generated?" attack that every competitor using NeRF or generative 3D will face.

> **R3 — Rigid-Only Transformation.** SfM-to-BIM alignment is constrained to 6-DOF rigid transformation (rotation + translation). When alignment error exceeds the published threshold, the system raises an audit flag and dispatches a RICS surveyor — it *does not* warp the geometry to fit.

> **R4 — Photo-as-Audit, Not Model-as-Audit.** All compliance, litigation and insurance disputes resolve back to the original photograph. Every product, API, and contract is engineered around this asymmetry.

These four lines are the reason Lex Situs is investable as a PropTech-grade evidence platform rather than a Web3-tinted reality-capture novelty.

---

## §3 The Pipeline, Phased

### §3.1 Phase 0 — Proof of Concept (Months 0–3)

The first 90 days exist to answer one question, and one question only: **Can a £600 consumer 360 camera plus paper AprilTags, processed through pure Sparse SfM, hit accuracy that two independent RICS surveyors will sign off as evidence-grade?** Nothing else gets built. No 3DGS, no heatmap, no edge app, no multi-tenancy. We capture one floor of one building, run it through COLMAP, align with Procrustes-SVD against AprilTag fiducials, validate with door-width and floor-height check-points, and produce an RMSE histogram.

The exit criterion is **end-to-end RMSE ≤ 8 cm at 95% confidence**, with cloud cost per floor ≤ £30 and two RICS surveyor sign-offs. If we cannot pass this gate, the entire thesis is wrong and Phase 1 should not be funded. We would rather know in month 3 than month 18.

### §3.2 Phase 1 — Pre-seed MVP (Months 3–9)

Phase 1 productionises Phase 0. We add a Flutter edge app that runs Variance-of-Laplacian blur detection and frustum-to-BIM coverage masking on the 1080p proxy stream while leaving the 5.7K RAW untouched on the SD card. The cloud pipeline stays Sparse-only (no MVS) and writes every photograph into S3 Object Lock in Compliance Mode for 30 years, paired with an RFC 3161 timestamp from a public TSA. The Postgres index stores the triple `(BIM_GUID, IFC_revision_hash, captured_at)` together with the SHA-256 evidence hash.

The exit criterion is **one paid pilot signed with either a UK latent-defect insurer or a Tier-1 developer**, end-to-end SLA of 24 hours from upload to indexed evidence, and marginal cloud cost per floor below £15. By the end of Phase 1 the audited evidence database contains at least 5,000 photographs across three floors. We have, deliberately, built nothing that the pilot customer does not need.

### §3.3 Phase 2 — Seed Production (Months 9–24)

Phase 2 introduces the four capabilities that turn Lex Situs from a proof into a platform. We add **construction-specialised semantic masking** to remove transient objects (workers, ladders, scaffolding) before ray-casting, fine-tuned on 10–30k UK-site-labelled images. We add a **truncated 3DGS visual interface** at 5,000–7,000 iterations [6] [7] — explicitly framed in our product copy as a *navigation surface, not a measurement surface*. We add **multi-primitive deviation heatmapping** (point, line, surface) that triages divergences from the as-planned BIM and pairs every flag with the original photograph for human verification.

Critically, Phase 2 also delivers **the governance layer that enterprise customers require**: per-tenant S3 prefixes with row-level Postgres security, IFC revision diff/patch and GUID alias tables to handle the fact that Revit IFC GUIDs can mutate across export sessions [8] [9] [10], RPO 1 hour / RTO 4 hour disaster recovery, and SOC 2 Type I certification. Without these, no UK insurer will sign a seven-figure contract; we have explicitly *not* deferred them.

The exit criterion is **5–10 paying customers, ARR ≥ £300k, gross margin ≥ 70% at the customer level, SOC 2 Type I delivered**.

### §3.4 Phase 3 — A-round Scale (Months 24–48)

Phase 3 is when the moat thickens. We extend semantic masking across building methodologies (steel frame for the US, CLT for the Nordics) — this is recurring OpEx, not auto-scaling work, and we are honest with investors about that. We launch the **Insurance Pricing Data Layer**: 30 years of `Photo × GUID × Audit-Flag-distribution` becomes a fine-tunable underwriting feature set, accessed by partner insurers through a metered API. This is the moment the business stops looking like a SaaS comparable and starts looking like a fintech-margin data company. We add a mobile field-viewer for surveyors and, **only for cross-border or sovereignty-sensitive customers**, optional public-chain notarisation as a paid add-on rather than a Layer-1 dependency.

Exit criterion: **50+ buildings live, ARR ≥ £3M, net revenue retention ≥ 120%, SOC 2 Type II + ISO 27001, at least one insurer underwriting against our Pricing API**.

---

## §4 Accuracy Envelope — The Number That Closes Diligence

We publish, and contract on, the following SLA from Phase 1 onwards:

> *Under capture conditions of (i) at least one AprilTag-36h11 fiducial per 150 m² affixed to Level-1 primary structure at 1.5 m ± 0.2 m, (ii) interior single-floor footprint ≤ 30 m × 30 m, (iii) loop closure scanned against the same opening AprilTag, Lex Situs commits to BIM-aligned point RMSE ≤ 8 cm at 95% confidence. Captures exceeding this envelope **will not be warped**; they will trigger an audit flag and a RICS surveyor remediation visit.*

This number is the answer to the very first question any technical diligence partner will ask. It is also the boundary that protects us from over-promising into measurement-grade work that requires terrestrial laser scanning. We compete on **evidence-grade accuracy**, not survey-grade accuracy, and we are clear with customers about which is which [11] [12].

---

## §5 Unit Economics

| Cost line per floor (Phase 1, marginal) | £ |
|---|---|
| Sparse SfM on A100 spot GPU (~30 min) | 0.85 |
| WORM storage write + RFC 3161 TSA token | 1.20 |
| Glacier Deep Archive, 30-year amortised | 2.07 |
| Postgres + compute overhead | 5.00–10.00 |
| **Cloud subtotal (per floor, year one)** | **£10–15** |
| Human capture (half-day surveyor day-rate) | ~£300 |
| **Fully loaded marginal cost per floor** | **~£310–315** |

OpenSpace prices its GC product at roughly $0.05–0.10 per square foot per month [13]. A 30-storey, 24,000 m² (≈258,000 sqft) tower at the midpoint nets ~$217k of annual OpenSpace ACV. Even at one-third of that price point — appropriate for our deeper insurance positioning — Lex Situs clears 95%+ gross margin from Phase 1 forwards. **The unit economics are positive at the first paying customer; they do not require Phase 3 scale to make sense.**

---

## §6 Competitive Positioning

The construction-tech rear-view mirror is full of vehicles: OpenSpace, Buildots, StructionSite, Reconstruct, DroneDeploy, and most recently Disperse (acquired by OpenSpace, October 2025) [14]. Every one of them sells progress monitoring to General Contractors. We choose, deliberately, not to compete in that lane.

| Dimension | The GC Lane (OpenSpace etc.) | The Evidence Lane (Lex Situs) |
|---|---|---|
| Buyer | General Contractor / Project Manager | Responsible Person / Insurer / Surveyor |
| KPI optimised | Schedule, cost, RFI velocity | Liability boundary, claims-loss ratio, audit defensibility |
| Pricing structure | $ per square foot per month | Per policy / per incident / per HRB-year |
| Competitive pressure | Red ocean, consolidation underway | Blue ocean, longer sales cycle |
| Moat substrate | Workflow integrations, network effects with PMs | 30-year evidence corpus + insurer pricing model lock-in |

We are realistic about the implication: this is a **slower-burn, higher-quality customer** market. Five paying insurers can equal fifty paying GCs in ARR, but procurement cycles are 9–18 months and require SOC 2 plus FCA-aligned data handling from day one. We have built the phased plan to match that cadence rather than to chase vanity logos.

---

## §7 What We Refuse to Build (and Why That Matters)

Investor diligence will, predictably, ask why we have not added LiDAR, NeRF, public-chain Layer-1, or a generative reconstruction module. The answer in each case is identical: **each option weakens the courtroom defensibility of the resulting evidence under the BSA's 30-year window, in exchange for a feature gain that does not change the customer's purchase decision.** The UK Building Safety Regulator's published Golden Thread guidance [3] requires *digital, secure, version-controlled, GDPR-compliant* records — none of these are blockchain-dependent or AI-reconstruction-dependent.

The discipline of saying *no* to these tempting additions is itself part of the architectural quality, and it is what allows us to make the 30-year SLA promise that the alternatives cannot.

---

## §8 Eighteen-Month Milestone Plan

| Month | Milestone | Evidence at exit |
|---|---|---|
| M1 | Capture hardware procured; pilot building secured | LoI from one HRB owner |
| M3 | Phase 0 RMSE table published | RMSE ≤ 8 cm, two RICS sign-offs |
| M5 | Edge app alpha (QA gating + frustum mask) | Internal testing pack |
| M7 | Cloud SfM + WORM evidence vault live | 24-hour SLA demonstrated |
| M9 | First paid pilot signed | Contract + Stripe MRR |
| M12 | 20,000 photographs anchored in evidence vault | Postgres KPI dashboard |
| M15 | Construction-specialised semantic masking PoC | mIoU ≥ 0.7 on UK sites |
| M18 | Three paying customers; ARR ≥ £100k | Customer references + SOC 2 readiness audit kicked off |

---

## §9 Long-Horizon Optionality

Three optionalities sit outside the 18-month plan but inside the 48-month vision. Each could re-rate the company by an order of magnitude if it lands.

The first is **regulatory standardisation**. If the BSR or RICS chooses to recommend (or mandate) Lex Situs's evidence schema as a reference format, the company shifts from a SaaS comparable to a *de facto standard*, with valuation multiples to match. The path to this is not through engineering — it is through participation in BSI working groups and direct engagement with BSR consultations during Phase 2.

The second is **the Insurance Pricing API**. If a UK latent-defect insurer fine-tunes its underwriting model on Lex Situs evidence, the lock-in is structural and the revenue model becomes per-policy rather than per-seat. This rerates gross margin and customer LTV, and is the principal reason Phase 1's first paying customer should be an insurer rather than a developer wherever optionality permits.

The third is **cross-jurisdictional replication**. The BSA template is being studied in Australia, Canada and Singapore [15]; a successful UK build is directly transferable. We are not pricing this into the seed plan, but it is the reason the cap table should be patient.

---

## §10 Funding Ask Frame (Indicative)

Pre-seed: **£500k–£800k**, 12-month runway, builds Phase 0 + the first half of Phase 1, exits with one paid pilot and a quantified RMSE benchmark.

Seed: **£3M–£5M** at month 9–12, builds Phase 2 (governance layer, semantic masking, 3DGS UI, SOC 2 Type I), exits at 5–10 paying customers and £300k+ ARR.

Series A: **£12M–£20M** at month 24–30, scales Phase 3 (Insurance Pricing API, cross-jurisdiction, SOC 2 Type II), exits at £3M+ ARR and at least one insurer underwriting against the API.

These figures are placeholders for negotiation rather than commitments; the financial model in the separate commercial deck is the authoritative source.

---

## §11 Closing Position for the Reader

Lex Situs is **not** a competitor to OpenSpace, **not** a Web3 PropTech experiment, and **not** a deep-tech research lab. It is a narrowly-scoped, evidence-grade data platform built for a specific 30-year statutory window in the UK, designed from day one for the highest-margin downstream buyer (insurers), and engineered with deliberate restraint to avoid the technology pitfalls that would undermine its courtroom defensibility.

The architecture is small enough to be executed by a 4-person team in 90 days for Phase 0, opinionated enough to be defensible by a barrister in 25 years, and disciplined enough to grow gross margin every phase rather than burn it. **That combination is unusual in this category and is the basis on which we are asking for capital.**

---

## References

[1]: https://www.gov.uk/guidance/find-a-high-rise-residential-building "GOV.UK — find a high-rise residential building"
[2]: https://www.designingbuildings.co.uk/wiki/BSR%20register%20of%20high%20rise%20residential%20buildings "DesigningBuildings: BSR register"
[3]: https://www.gov.uk/guidance/keeping-information-about-a-higher-risk-building-the-golden-thread "GOV.UK — Golden thread guidance"
[4]: https://www.cbinsights.com/research/openspace-competitors-structionsite-matterport-holobuilder-buildots-avvir-ai-clearing/ "CB Insights: OpenSpace $902M valuation"
[5]: https://arxiv.org/html/2510.06802v1 "Rapid 3D Object Acquisition with SfM (arXiv 2025)"
[6]: https://arxiv.org/pdf/2511.04283 "FastGS: Training 3D Gaussian Splatting in 100 Seconds"
[7]: https://github.com/nyu-systems/grendel-gs "Grendel-GS multi-GPU 3DGS training"
[8]: https://forums.autodesk.com/t5/revit-api-forum/ifc-guid-is-different-in-the-ifcguid-parameter-written-by-revit/td-p/12650094 "Revit forum: IFC GUID inconsistency"
[9]: https://github.com/Autodesk/revit-ifc/issues/521 "Revit-IFC: room IfcGUID changes per export"
[10]: https://www.sciencedirect.com/science/article/pii/S0926580523003230 "Diff-and-patch for IFC version control (Esser 2023)"
[11]: https://www.thefuture3d.com/blog/laser-scanning-vs-photogrammetry "Laser Scanning vs Photogrammetry — accuracy benchmarks"
[12]: https://wingtra.com/lidar-drone/lidar-vs-photogrammetry-what-sensor-to-choose/ "LiDAR vs Photogrammetry sensor choice — Wingtra"
[13]: https://www.openspace.ai/request-demo-pricing/ "OpenSpace pricing structure"
[14]: https://www.prnewswire.com/news-releases/openspace-acquires-construction-progress-tracking-leader-disperse-302596167.html "OpenSpace acquires Disperse, October 2025"
[15]: https://www.systemhygienics.co.uk/blog/building-safety-regulator-updates "BSR 2025 updates and overseas adoption interest"
