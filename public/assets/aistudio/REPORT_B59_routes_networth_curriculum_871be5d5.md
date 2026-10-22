# B59: merged capstones, patch margin, and two higher-net-worth routes (10 Oct 2026)

**What this checks:** your goals file (curriculum_goals_tasks.json) is the yardstick. Nothing here creates a new curriculum version.

**Files:** the machine-readable version is `evaluation_B59_routes_curriculum.json`. Scripts m10–m13 and results are in the archive.

## 1. Why net worth fell to "London level", and the fix
- **Same plan, different measurement.** Last pass's career model kept you in Germany for good: there was no German passport and no Zürich step. It also reported **real** dollars (inflation-adjusted). The earlier engine reported **nominal** dollars:

  | Route (earlier engine) | Nominal USD |
  |---|---|
  | Germany then Zürich | 5.90M (upside about 9M) |
  | Germany stay | 3.61M |
  | London | 3.47–3.54M |

- Last pass's Germany-stay figure, USD 1.51M real, is **3.16M nominal**. That is exactly the London/Germany-stay level.
- **The fix:** put back the passport, then the Zürich step (and optionally the US). Every figure below is shown in both units.

## 2. Curriculum changes, judged against your goals JSON
"Net" below means the engine's content change plus the calendar credit for freed hours (0.0011 grade per 100 h).

| Change | Hours saved | Years saved | Engine (content) | Calendar credit | **Net** |
|---|---|---|---|---|---|
| **Patch hours budgeted at 85%** (patch items v50–A2, 20.7k h; assumed need U(65%, 95%)) | 3,105 | 1.49 | −0.0081 | +0.0342 | **+0.026** |
| Patch hours at 90% / 80% | 2,070 / 4,140 | 1.0 / 2.0 | −0.002 / −0.020 | +0.023 / +0.046 | +0.021 / +0.026 (half the items run short at 80%) |
| **Merge S7–S14 capstones + projects into one integrated project per stage, 25% overlap** (72 items, 4,380 h) | 1,095 | 0.53 | −0.0167 | +0.0120 | **−0.005** |
| Merge at 15% / 35% overlap | 657 / 1,533 | 0.32 / 0.74 | −0.010 / −0.024 | +0.007 / +0.017 | −0.003 / −0.007 |
| Merge capstones only (826 h) | 207 | 0.10 | −0.004 | +0.002 | −0.002 |
| JSON T06: flat 9% trim of S7–S14 | 2,198 | 1.06 | −0.0355 | +0.0242 | **−0.011** |
| JSON T02: S0–S1 hackathons cut to 25% | 619 | 0.30 | −0.004 | +0.007 | +0.003 |
| **Package: Kochenderfer + merge 25% + patch 85%** | **4,025** | **1.94** | −0.020 | +0.044 | **+0.024** |

**Reading the table:**
- **Merging beats the JSON's flat trim** (−0.005 vs −0.011), as you expected. On its own it is still slightly negative, unless the integrated project adds at least 0.005 of value that the engine can't see.
  - An earlier round found that pooling separate projects into one kept only about a quarter of their adoption value.
  - So: integrate the work, but keep each sub-skill as its own public module of the stage project.
- **The patch margin is the strongest lever.** 85% gives the same net as 80% with half the overrun risk: about one patch item in three runs about 5% short.
- **Technology Pace stays at 1.4156** in every variant.
- **Plan length falls from 32.5 to 30.6 years** (67,657 → 63,668 h). Stages finish earlier:

  | Stage | Before (year) | After (year) |
  |---|---|---|
  | GPU (S7) | 13.4 | 12.8 |
  | Research engineer (S10) | 17.9 | 16.8 |
  | S14 | 22.9 | 21.4 |

**The rest of your goals JSON:**
- **T03 products:** 9 products before S6 (S6 starts in year 10.7) = the flagship + 8 hackathon-born products shipped inside the business/product hours. That is why the hackathon cut conflicts with T03.
- **T04 YOE5:** 48 months ends in Oct 2030. Five years of experience arrive at about year 6.8.
- **T05 theses:**
  - Bachelor-level in year 6 falls in S3.
  - Master-level at S9 falls around year 14.7.
  - **Conflict:** the PhD-level thesis in year 14 collides with S9. I'd move it to S13 (year 19.5).
- **T07 weights, normalized to 100:**

  | Block | With hackathons | Without hackathons |
  |---|---|---|
  | Learning block (exercises inside) | 35 | 35 |
  | Hackathons with products | 15 | — |
  | Projects, OSS, capstones, research, interview prep | 30 | 40 |
  | Papers, reproductions, experiments, writing | 20 | 25 |

## 3. Routes: net worth to plan year 30 (about age 63) and odds of a frontier-level job
All rows use the recommended curriculum (Brazil-first + changes) unless marked. "Frontier-level" means a tier-A or frontier employer (NVIDIA, Google/DeepMind, OpenAI, Anthropic, Meta, Apple, AMD, Huawei and similar), on the same scale as earlier passes.

| Route | Grade (robust) | Net worth, nominal USD (median / p90 / p95) | Real median | Relocation year | Frontier job by year 10 / 15 / 30 | Industry of first frontier job (AI labs / GPU-semis / quantum / robotics) |
|---|---|---|---|---|---|---|
| **Spain nomad visa + online bachelor → Spanish passport → Zürich** | **+6.80** | **7.24M / 9.38M / 10.0M** | 3.45M | 6.4 (Zürich ~10.9) | 14% / 63% / 99% | 55 / 11 / 19 / 15% |
| **Scenario B: Germany (TUM) → Zürich → US (L-1)** | **+6.61** | **6.39M / 8.52M / 9.01M** | 3.05M | 8.1 (Zürich ~14.8; US 81%) | 23% / 65% / 99% | 43 / 29 / 14 / 14% |
| **Scenario A: Germany (TUM) → Zürich** | +6.58 | 6.17M / 8.20M / 8.69M | 2.94M | 8.1 (Zürich ~14.8) | 23% / 65% / 99% | 43 / 29 / 14 / 14% |
| Germany (RWTH, NOVAS) → Zürich | +6.51 | 5.93M / 7.99M / 8.47M | 2.83M | 8.1 | 3% / 33% / 98% | 52 / 15 / 18 / 13% |
| Germany (TUM) → US (L-1), no Zürich | +6.43 | 5.12M / 8.39M / 9.45M | 2.44M | 8.1 | 23% / 59% / 96% | 34 / 38 / 10 / 14% |
| Germany (TU Dresden Diplom) → Zürich | +6.43 | 5.40M / 7.46M / 8.11M | 2.57M | 8.1 | 5% / 29% / 97% | 45 / 22 / 17 / 13% |
| Germany stay (TUM), last pass's winner | +6.07 | 3.16M / 4.11M / 4.41M | 1.51M | 8.1 | 23% / 59% / 96% | 34 / 38 / 10 / 14% |
| Belgium Blue Card job | +5.59 | 3.25M / 4.58M / 5.04M | 1.55M | 13.6 | not modelled | — |
| Stay in Brazil, remote | +4.64 | 5.04M / 6.49M / 6.96M | 2.40M | never | not modelled | — |
| *Current curriculum order, Germany stay* | +5.41 | 2.41M / 3.18M / 3.46M | 1.15M | 12.8 | 2% / 16% / 93% | |
| *Current curriculum order, Germany → Zürich* | +5.82 | 4.05M / 5.90M / 6.65M | 1.93M | 12.8 | 2% / 19% / 97% | |

**What this shows:**
- **Net worth is back to, and above, the earlier level.** Germany → Zürich reaches 6.2M (8.2M p90); with the US step, 6.4M (8.5M p90). The Spain bridge reaches 7.2M median and **10.0M at p95**.
- **The 30-year frontier odds saturate** (96–99% on every German or Zürich route), so the 10- and 15-year columns are the ones that separate routes.
- **The curriculum order matters as much as the country.** With the current order, the same Germany → Zürich route reaches only 4.05M.
- **USD 80M is not reachable from salary and index investing** in any route; the best p95 is 10M. Getting there needs founder equity: an earlier pass put the chance of USD 100M at about 0.4–1.1% with the founder ladder.

**Trade-offs of the Spain bridge:**
- **What it gains:** the lowest upfront cost (about EUR 10k plus a remote income of at least EUR 2,849 a month). It also moves you earliest (30% by year 5) and gets you an EU passport about 4 years sooner.
- **What it costs:**
  - The degree is only an online bachelor's (62% finish by year 20) and no master's.
  - The first frontier job is unlikely before year 10 (14% vs 23%).
  - It depends on a mid-level remote foreign contract.
- **Must verify:**
  - Whether nomad-visa years count toward the 2-year Spanish nationality rule.
  - Real processing times; I assumed 1.5 years.

**Trade-offs of the Zürich routes:**
- **What they cost:**
  - Moving to Zürich at passport time usually drops the TUM master's: the master's-by-year-20 rate falls from 24% to 3%. Finishing the master's first costs 1–2 years of Zürich pay.
- **What could break them:**
  - Swiss pay 15% lower or Zürich offers at half: both are in the game, and the routes survive both.
  - An end to Swiss free movement: the routes' worst case. Voters rejected the cap in June 2026.

## 4. Game: 22 candidates × 33 adverse plays, 19 rounds
**The 33 plays:** the 24 earlier plays plus 9 new ones:
- Zürich offers at half.
- No L-1 transfers.
- Swiss pay −15%.
- German passport 2 years late.
- US pay −20% with US layoffs doubled.
- The merge and patch savings fail.
- Swiss free movement ends.
- Spanish nationality 2 years slower.
- The nomad-visa income bar +30%.

**Elimination order:**
1. Staying in Brazil, the current order, and Belgium (rounds 1–7).
2. The German-stay routes (rounds 8–9).
3. Dresden, RWTH and US-direct (rounds 11–16).
4. Germany → Zürich (rounds 17–19).

**Three best scenarios (grade on +8 to −8):**

| # | Scenario | Point grade | 90% CI | Worst play |
|---|---|---|---|---|
| 1 | **Spain nomad visa + online bachelor → Spanish passport → Zürich**, on the recommended curriculum | **+6.80** | 6.79–6.81 | Swiss free movement ends, 6.58 |
| 2 | Same route on the B58 order (no merge/patch changes) | **+6.76** | 6.75–6.77 | same, 6.54 |
| 3 | **Germany (TUM) → Zürich → US by L-1**, on the recommended curriculum | **+6.61** | 6.59–6.62 | German offers at half, 6.42 |

**How sure is this?**
- QRE at λ=16 gives 62% / 35% / 3%. #1 beats #3 in 72% of draws.
- **Two-way ANOVA (curriculum × route):**
  - The curriculum explains η² = 0.31 (p ≈ 1e-176). The route explains 0.14 (p ≈ 1e-86). The interaction is not significant (p = 0.47).
  - Variances are unequal (Levene), so Kruskal–Wallis tests confirm both effects.
- **Regression:**
  - 5-fold CV error: null 0.32, linear 0.30, quadratic 0.30. No under- or overfitting.
  - Pay level and the remote-offer rate dominate the Spain route; the German offer rate dominates the Germany route.
  - Residuals are heteroskedastic, so HC3 standard errors were used.
- **Error margins:** the Monte Carlo half-width is 0.17–0.22%. The spread between individual outcomes is ±0.35.
- **Weight sensitivity:** the same top three survive these six changes:
  1. Net-worth weight ×0.5.
  2. Net-worth weight ×1.5.
  3. Relocation weight 0.
  4. Relocation weight ×2.
  5. An added frontier-job term.
  6. Degree points ×3.

## 5. Before → after (last pass's winner → this pass's best)

| Goal / parameter | Before (B58 winner: Brazil-first, TUM, Germany stay) | After (#1 Spain → Zürich) | After (#3 Germany → Zürich → US) |
|---|---|---|---|
| **Technology Pace** (lower is better) | 1.4156 | 1.4156 | 1.4156 |
| Engine grade with persona index (content + calendar) | 5.5581 | 5.5777 | 5.5777 |
| Plan hours / years | 67,657 / 32.5 | 63,668 / 30.6 | 63,668 / 30.6 |
| Net worth, nominal median / p90 | 3.16M / 4.11M | **7.24M / 9.38M** | **6.39M / 8.52M** |
| Net worth, real median | 1.51M | 3.45M | 3.05M |
| Relocation year; chance by year 5 | 8.1; 13% | **6.4; 30%** | 8.1; 13% |
| EU passport | year ~13.6 | **year ~9.9** | year ~13.6 |
| Frontier job by year 10 / 15 | 23% / 59% | 14% / 63% | 23% / 65% |
| Bachelor's / master's by year 20 | 43% / 24% | 62% (online) / 0% | 42% / 3% |
| Combined grade (robust) | +6.07 | **+6.80** | +6.61 |

## Sources
- [The Local: German three-year citizenship track repealed](https://www.thelocal.de/20251031/law-repealing-germanys-three-year-citizenship-track-takes-effect)
- [Anadolu: Swiss voters reject 10-million cap](https://www.aa.com.tr/en/politics/nearly-55-swiss-voters-reject-10m-population-cap-initiative/3966646)
- [Clark Hill: $100,000 H-1B fee guidance](https://www.clarkhill.com/news-events/news/the-latest-guidance-on-the-100000-h-1b-fee/)
- [Migratiolex: Spain nomad visa income 2026](https://migratiolex.com/spain-digital-nomad-visa-minimum-income-requirement-for-2026)
- [Legal Fournier: Spain residency for Brazilians](https://legalfournier.com/en/spain-residency/brazil/)
- [upreer.ch: Zurich software engineer salaries](https://upreer.ch/en/salaries/software-engineer-salary-switzerland/)
- [Glassdoor: Seattle software engineer pay](https://www.glassdoor.com/Salaries/seattle-software-engineer-salary-SRCH_IL.0,7_IM781_KO8,25.htm)
- [CountryTaxCalc: Zurich take-home pay](https://www.countrytaxcalc.com/tax-guides/zurich-salary-take-home-pay-2026/)
