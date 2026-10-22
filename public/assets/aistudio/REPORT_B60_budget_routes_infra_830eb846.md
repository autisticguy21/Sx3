# B60: EUR 90k budget, infra fallback track, Canada and Poland (10 Oct 2026)

**Status:** evaluation only, no new curriculum version.

**Data:** your two CSVs, fresh research on Canada and Poland, and the earlier cache. No recruiter salary guides. No US as the first move; India and Israel are never considered.

**Files:** the machine-readable version is `evaluation_B60_budget_routes.json`. Scripts m15–m18 are in the archive.

## 1. Your budget numbers, checked
The rule I applied: you move only once you hold EUR 90k (Aachen or Dresden) or EUR 180k (Munich/TUM, read as double) **and** a signed contract of at least 3 years.

**Relocation year under that rule (Aachen or Dresden):**

| Curriculum | P10 | Median | P85 | Mean (95% CI) | P(≤7) | P(≤9) | P(≤13) |
|---|---|---|---|---|---|---|---|
| Brazil-first + changes + infra track | 6.5 | **9.25** | 13 | 9.98 (9.84–10.12) | 16% | 47% | 86% |
| Current order | 8.0 | 13.25 | 17 | 13.08 (12.90–13.26) | 4% | 17% | 50% |
| Munich/TUM at EUR 180k | 8.5 | 11.25 | 14.75 | 11.86 (11.72–12.00) | 1% | 17% | 73% |

- **Your own estimates line up with the model.** Your optimistic (under 7), base (9) and worst (12–13) sit at about our P15, P47 and P80–86. Separately, the "current order" median of 13.25 matches your worst case.
- **Your CSV checks out.** Your net pay (EUR 4,004 a month at 80k, 4,836 at 100k) matches the model's German net to within 0.3%. Your spending works out to EUR 1,535 a month.
- **The Google Munich postings** (Senior: EUR 128–131k + 15% bonus; Staff: 156–159k + 20%) sit above the model's average for top-tier employers (about EUR 118–138k). The model is therefore conservative for Google-level offers.

**What the 90k rule costs.** Compared with job-first with a 20k buffer (the legal route needs no 90k), Aachen → Zürich:

| | 90k rule | 20k buffer |
|---|---|---|
| Relocation, median | 9.25 years | 7.5 years |
| Grade | 6.35 | 6.56 |
| Net worth at year 30, nominal | 5.74M | 6.06M |

So holding 90k delays the move by about 1.75 years and costs about 0.2 grade points and USD 0.3M. The 90k only pays for itself if you plan to study without a job.

## 2. Hyperscaler, data-centre and infra parameters (fallback, start S0, peak S6)
Scores are 0–10, from the hours credited per stage. Each cell reads current order / Brazil-first / Brazil-first + track.

| Parameter | S1 | S3 | S6 | S14 |
|---|---|---|---|---|
| Hyperscaler cloud | 8.50 / 8.88 / **9.32** | 9.03 / 9.28 / 9.56 | 9.61 / 9.61 / **9.82** | ~10 |
| **Data centre** | 0 / 0 / 0 | 0 / 0 / 2.95 | **0 / 0 / 8.65** | 9.11 / 9.11 / 9.60 |
| Infra / SRE | 9.30 / 9.69 / 9.71 | 9.84 / 9.93 / 9.94 | 9.97 / 9.97 / 9.98 | 10 |

- **Cloud and SRE were already strong early.** Data centre was the gap: zero until S7, and it only reached 9 by S14.
- **The track adds 340 h in S0–S6:**

  | Item | Stage | Hours | Content |
  |---|---|---|---|
  | INF-01 | S0 | 30 | Cloud foundations |
  | INF-02 | S1 | 60 | Associate architect level + Terraform (AWS SAA or Google ACE) |
  | INF-03 | S2 | 50 | *The Datacenter as a Computer* |
  | INF-04 | S3 | 60 | Kubernetes admin level (CKA scope) + leaf-spine/BGP/EVPN |
  | INF-05 | S5 | 40 | GPU-cluster design (SuperPOD, OCP, InfiniBand/RoCE) |
  | INF-07 | S6 | 40 | Facilities: power, cooling, PUE |
  | INF-06 | S6 | 60 | Fleet-operations capstone |

  It also pulls three existing fabric items forward into S6 (P-FABRIC@S7, P-FABRIC@S9, A2-P4DPU); these are moves, not new hours.
- **Engine result:** grade with the persona index rises 5.5536 → 5.5759 (+0.0223). After the calendar cost, the net is **+0.0185**, so the track passes. It also hits the persona atoms for data-centre switching and RDMA.
- **Career value:** +0.03 to +0.04 grade on every route, and frontier odds by year 15 rise by 2–4 points. It also protects you when AI hiring cools; if cloud/data-centre hiring itself cools (fallback worth half), the routes still hold.

## 3. Routes under your budget rule

| Route (recommended curriculum) | Grade, robust | Net worth at year 30, nominal (median / p90) | Relocation P10 / P50 / P90 | P(by 7 / 9 / 13) | Relocation sticks | Frontier job by year 10 / 15 / 30 | Bachelor's by year 20 |
|---|---|---|---|---|---|---|---|
| **Spain nomad visa + online bachelor's → Zürich** (EUR 10k) | **+6.83** | **7.31M / 9.43M** | 4.3 / 6.0 / 9.0 | 72 / 90 / 99% | 100% | 14 / 66 / 99.6% | 62% (online) |
| **Aachen job-first with a 20k buffer → Zürich** | **+6.56** | 6.06M / 8.07M | 5.0 / 7.5 / 12.0 | 45 / 71 / 93% | 100% | 3 / 36 / 99% | 39% |
| Aachen with the 90k rule → Zürich | +6.35 | 5.74M / 7.62M | 6.5 / 9.25 / 14.25 | 16 / 47 / 86% | 100% | 2 / 21 / 98% | 35% |
| Poland Blue Card → Polish citizenship (~9 years) → Zürich | +6.28 | 5.08M / 6.82M | 6.25 / 9.0 / 14.25 | 20 / 50 / 86% | 100% | 10 / 37 / 98% | 57% (online) |
| Dresden with the 90k rule → Zürich | +6.27 | 5.22M / 7.11M | 6.5 / 9.25 / 14.25 | 16 / 47 / 86% | 100% | 3 / 21 / 97% | 26% (Diplom) |
| Poland → Germany after 2 years → Zürich | +6.26 | 4.98M / 6.76M | 6.25 / 9.0 / 14.25 | 20 / 50 / 86% | 100% | 10 / 27 / 97% | 57% (online) |
| Munich/TUM with 180k → Zürich → US | +6.26 | 5.95M / 7.72M | 8.5 / 11.25 / 15.75 | 1 / 17 / 73% | 100% | 3 / 42 / 99% | 36% |
| Aachen with 90k, no Zürich step | +5.85 | 2.97M / 3.80M | 6.5 / 9.25 / 14.25 | 16 / 47 / 86% | 100% | 2 / 8 / 33% | 36% |
| Canada with French (MacEwan → PR → US by TN) | +5.41 | 4.20M / 6.19M | 6.0 / 10.25 / never | 26 / 46 / 52% | **53%** | 0.5 / 18 / 56% | 80% |
| Canada, English only | +5.02 | 3.87M / 5.77M | 6.5 / never | | **33%** | 0.5 / 15 / 40% | 80% |
| Stay in Brazil | +4.66 | 5.04M / 6.49M | never | 0% | — | — | — |

**Poland:**
- The Blue Card salary bar is lower: PLN 13,355 a month, about EUR 37.7k a year (vs EUR 45.9k in Germany). IT workers without a degree qualify with 3 years of experience.
- **But processing is slow:** Mazowieckie averages 394 days. Moving on to Germany needs 12 months on the Polish card (24 months to skip the qualification check), and Polish citizenship takes about 8 years plus B1 Polish.
- **Net effect:** it ties with Aachen + 90k on time, but pays less. Its best use is as a fallback if no German offer arrives, not as a faster bridge.

**Canada:**
- **Only MacEwan fits a EUR 45–90k budget.** It costs CAD 941 per credit (about CAD 29.8k a year with fees), plus CAD 23,448 proof of funds. Waterloo and McGill (about CAD 68–70k a year, almost no transfer places) are out; Université de Montréal is cheap but French-taught.
- **Permanent residence is the bottleneck.** At ages 37–40 your Express Entry score with English would be about 464–480, against 2026 cut-offs of 507–523. French at NCLC 7 lifts it to about 531–542.
- **In the model,** only 33% (English) or 53% (with French) of runs end with a permanent stay; the rest return to Brazil when the post-graduation work permit ends. Edmonton also lost DeepMind in 2023.
- **Net effect:** last among the relocation routes.

## 4. Game: 22 candidates × 38 adverse plays, 19 rounds
**The plays:** the earlier 33, plus:
- Budget targets +20%.
- Polish permit takes 2 years.
- Canadian PR odds halved.
- Canadian tuition +26% and CAD −10%.
- Data-centre/cloud hiring cools.

**Elimination order:**
1. Brazil-stay and Canada-English (rounds 1–2).
2. The current order and Canada-French (rounds 3–7).
3. The no-Zürich German route (round 8).
4. Munich 180k, Poland, Dresden and Aachen 90k (rounds 9–18).

**Three best scenarios (grade on +8 to −8):**

| # | Scenario | Point grade | 90% CI | Worst play |
|---|---|---|---|---|
| 1 | **Spain nomad visa + online bachelor's → Zürich**, Brazil-first + changes **+ infra track** | **+6.83** | 6.82–6.84 | Swiss free movement ends, 6.63 |
| 2 | Same route without the infra track | **+6.80** | 6.79–6.81 | 6.59 |
| 3 | **Aachen job-first with a 20k buffer → Zürich**, + infra track | **+6.56** | 6.54–6.57 | 6.37 |

**How sure is this?**
- QRE at λ=16 gives 62% / 37% / 1%. #1 beats #2 in 99.6% of draws and #3 in 87%.
- **Two-way ANOVA (curriculum × route):**
  - The route explains η² = 0.24 and the curriculum 0.17 (both p < 1e-100). The interaction is tiny (0.003, p = 0.047).
  - Variances are unequal (Levene p ≈ 1e-28), so Kruskal–Wallis tests confirm both effects.
- **Regression (5-fold cross-validation):**
  - Error: null 0.31, linear 0.29, quadratic 0.29. No under- or overfitting.
  - Residuals are heteroskedastic, so HC3 standard errors were used.
  - Pay level, remote-offer rate and first-job rate drive the Spain route; the German offer rate drives the Aachen route.
- **Margins:** the 90% half-width is 0.16–0.22%. The same top two hold under all six weight changes.

## 5. Before → after

| Goal / parameter | B59 best (Spain → Zürich, no budget rule, no infra track) | B60 #1 (with the infra track) | B60 German best (Aachen, 20k → Zürich) |
|---|---|---|---|
| **Technology Pace** (lower is better) | 1.4156 | 1.4156 | 1.4156 |
| Engine grade with persona index | 5.5777 | **5.5962** | 5.5962 |
| Data-centre skill at S6 | 0 | **8.65** | 8.65 |
| Hyperscaler / infra at S6 | 9.61 / 9.97 | 9.82 / 9.98 | 9.82 / 9.98 |
| Relocation median | 6.0 | 6.0 | 7.5 |
| Net worth, nominal median / p90 | 7.24M / 9.38M | **7.31M / 9.43M** | 6.06M / 8.07M |
| Frontier job by year 15 | 63% | **66%** | 36% |
| Combined grade (robust) | +6.80 | **+6.83** | +6.56 |

## 6. Verified vs assumed
- **Verified (10 Oct 2026):**
  - **Poland:** Blue Card threshold, the no-degree ICT rule, processing backlog, the citizenship path, mobility to Germany under §18i (see `web_poland.json`).
  - **Canada:** MacEwan, Waterloo and McGill fees; proof of funds; PAL/TAL; the post-graduation work permit; Express Entry cut-offs; the citizenship rule; Glassdoor pay (see `web_canada.json`).
  - **Earlier passes:** German naturalisation; the Swiss vote; Spain's nomad-visa income bar; Zürich and Seattle pay.
- **Assumed (judgment):**
  - Offer, PR and transfer rates.
  - CAD and PLN exchange rates.
  - Reading the TUM budget as 180k.
  - The infra track's effect on hiring odds.
  - The keyword-based skill scores.
- **Must verify:**
  - Whether nomad-visa years count toward the 2-year Spanish nationality rule.
  - Whether you can work in Poland while the permit is pending.
  - University of Alberta fees: that page was blocked.
