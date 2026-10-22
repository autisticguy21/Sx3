# B65: NVIDIA-first routes after an early online CS degree

**Date:** 10 Oct 2026. **Model:** 22 candidates, 55 adverse plays, 19 rounds. All runs use the O3x curriculum unless marked O3h.

## 1. What changed in the model

- **Degree screening (ATS) effect.** Once you hold a degree, remote job offers come 1.3× as often and remote pay is ×1.10. This is my judgement. The evidence that degrees still filter candidates: an MIT/Harvard study found most firms that dropped degree requirements from job ads kept hiring mainly degree holders, and skills-based hiring was under 1 in 700 hires.
  - **Result:** gross pay at plan year 8 is **EUR 57.5k** on the online-degree route, against EUR 44.8k on the Barcelona grado route (+28%). Your point is confirmed.
- **New routes after the online degree**, each with Spain as the fallback if the main path fails:

| Route | Key inputs |
|---|---|
| RWTH in-person master's (next to NVIDIA Würselen) | Tuition-free (RWTH, earlier notes). German blocked account EUR 11,904 a year (verified). |
| ISTA PhD (Austria) | Accepts bachelor's holders. About EUR 2,095 gross a month in year 1, 5-year contracts (verified). Admission 10–15% on a third-party page; I use 8% for an online-degree applicant. |
| ETH direct doctorate | Entry from a bachelor's: 2 years on scholarship, then salary (verified). Admission chance assumed at 4% (no official rate found). |
| UW Allen School PhD | More than 3,000 applicants and 150 offers in 2023, about 5% (verified). No master's needed; 3 years of guaranteed funding. I use 4% for you, with 25% for other funded US PhDs. |
| Unimore (Modena) | Hosts NVIDIA's AI Technology Center hub in Italy (verified). **Federico II's academies are Apple, Cisco, Deloitte, FS and KPMG; no NVIDIA academy found**, so Unimore is probably the Italian pipeline you meant. |
| Poland | Warsaw job with a Blue Card. NVIDIA has an office in Warsaw (verified). |
| PhD "ladder" | Apply to ETH, then ISTA, then Unimore, and take the best offer. |

- **NVIDIA-first score** = robust grade + 0.5 if at NVIDIA by plan year 20 + 0.25 if at NVIDIA in Seattle by year 30. The weights are my judgement.
- **The criteria index now depends on whether the main path happened.** People who fall back to Spain are scored on the online/Spain criteria, not on the PhD school's.

## 2. Results

- **Robust:** grade under the 19 adverse plays.
- **Main path:** probability that the main route happens (admission, job, master's).
- **NV:** at NVIDIA by plan year 20 / year 30. **NV-Seattle:** at NVIDIA in Seattle by year 30.
- **LTR:** long-term residence by year 15. **NW:** median net worth at year 30.

| Route | Robust | NVIDIA-first | Main path | NV yr 20 / 30 | NV-Seattle | LTR | NW |
|---|---|---|---|---|---|---|---|
| **Online CS + Spain nomad residence → passport → TUM master's → Zurich** | **6.668** | **6.976** | — | 41% / 81% | 52% | 98% | 4.95M |
| Barcelona grado (languages not costed) | 6.608 | 6.923 | — | 42% / 79% | 50% | 98% | 5.14M |
| Barcelona grado with Spanish + Catalan + exams | 6.601 | 6.907 | — | 40% / 79% | 50% | 98% | 5.10M |
| **Online CS → RWTH master's (Würselen) → Germany → Zurich** | 6.587 | **6.935 (2nd)** | 72% | **46%** / 79% | 52% | 94% | 4.70M |
| Poland Warsaw full-time (in person) | 6.541 | 6.917 | — | **50% / 84%** | 54% | 68% | 4.46M |
| Online CS + Spain, no master's | 6.473 | 6.805 | — | 45% / 82% | 53% | 98% | 5.34M |
| Online CS → German Blue Card with the degree | 6.420 | 6.779 | — | 48% / 82% | 53% | 90% | 4.71M |
| Online CS → PhD ladder (ETH → ISTA → Unimore) | 6.405 | 6.747 | 36% | 46% / 83% | 53% | 85% | 4.65M |
| Online CS → UW / US funded PhD | 6.384 | 6.719 | 19% | 44% / 81% | **56%** | 85% | 5.23M |
| Online CS → Poland Warsaw job | 6.358 | 6.698 | 41% | 45% / 82% | 54% | 74% | 5.14M |
| Online CS → ETH direct doctorate | 6.353 | 6.663 | 3% | 41% / 81% | 51% | 91% | 5.19M |
| Online CS → ISTA PhD | 6.351 | 6.664 | 6% | 41% / 81% | 51% | 92% | 5.14M |
| Online CS → Unimore | 6.339 | 6.676 | 33% | 45% / 82% | 52% | 88% | 4.71M |
| US hybrid (save USD 170k first) | 4.930 | 5.131 | 76% | 23% / 43% | 39% | 9% | 3.82M |

### When the main path succeeds (people who got in)

| Route | NV yr 20 if in | NV yr 20 if fallback | NV-Seattle yr 30 if in | NW if in |
|---|---|---|---|---|
| ETH direct doctorate | **63%** | 40% | 47% | 4.81M |
| Poland Warsaw job | 57% | 37% | 60% | 5.19M |
| ISTA PhD | 58% | 40% | 46% | 3.87M |
| Unimore | 56% | 39% | 55% | 3.65M |
| UW / US funded PhD | 52% | 42% | **74%** | 4.98M |
| RWTH master's | 51% | 35% | 53% | 4.46M |

- **The PhDs are the strongest NVIDIA pipelines when they hit.** ETH is the best for NVIDIA anywhere; UW is the best for NVIDIA in Seattle.
- **As stand-alone first steps they lose.** Few applicants get in (3–19%), and the rejection year pushes the Spain fallback back about a year.
- **The fix is to apply while the passport clock is already running in Spain**, and treat the PhD and master's applications as parallel options.

## 3. Your points, tested

1. **"CS sooner beats ATS, so better-paid jobs earlier."** Yes. Pay at year 8 is +28%, and the online routes lead on early income. Net worth by year 30 is similar, because the master's years cost income.
2. **"Spain citizenship gives no higher odds."** Partly wrong:
   - In the model the passport is the main value driver. It gives unrestricted EU and Swiss work rights: no sponsorship, no lottery, no permit renewals, and a fast route to Zurich, where NVIDIA has an office and an L-1 transfer route to the US.
   - Without it, Zurich needs a Swiss non-EU quota permit.
   - You are right that Spain's local market and its languages add little for NVIDIA.
   - With the online-degree route you **get no Spanish degree at all**, so there is no "weak stamp". Spain is only your residence and passport.
3. **"Germany or Poland offer stronger opportunities."** On NVIDIA odds, yes:
   - RWTH master's main path: 51% at NVIDIA by year 20, against 35% in its Spain fallback.
   - Poland in person: 50% by year 20.
   - Both are slower to a passport. German citizenship takes 5+ years and Polish permanent residence takes 5 years. Both score below route #1 on the robust grade, but are close on the NVIDIA-first score.
4. **"Direct-entry PhD at UW (Paul Allen School) with CPT and OPT toward Seattle and NVIDIA."** It is the best NVIDIA-Seattle route if you are admitted (74%). Admission is about 5% overall, and probably lower for an online-degree applicant. Use it as a lottery ticket, not as the plan.
5. **ISTA, ETH, Federico:**
   - ETH direct doctorate and ISTA are real bachelor's-entry PhDs.
   - No NVIDIA academy found at Federico II. NVIDIA's Italian hub is at Unimore.
   - Austria and Italy have no NVIDIA office in the official list, so those pipelines run through internships.

## 4. The 19 rounds (opponent's best play each round)

| Round | Play added | Eliminated | Score |
|---|---|---|---|
| 1 | P31 Swiss free movement ends | Stay in Brazil | 3.81 |
| 2 | P02 remote offers halved | Online degree, stay in Brazil | 3.92 |
| 3 | P03 remote pay −30% | Online → US master's | 4.27 |
| 4 | P05 experience inflation ×2 | Canada | 4.71 |
| 5 | P15 investment return −2 pts | US hybrid | 4.86 |
| 6 | P32 Spanish nationality +2 years | Unimore | 6.29 |
| 7 | P25 Zurich offers halved | ETH direct doctorate | 6.29 |
| 8 | P23 AI bust | ISTA | 6.30 |
| 9 | P27 Swiss pay −15% | Online → Poland job | 6.33 |
| 10 | P16 job loss ×2 | RWTH bachelor's | 6.34 |
| 11 | P01 first Brazil job ×2 slower | UW / US PhD | 6.35 |
| 12 | P54 online degree not accepted | Munich job, no degree | 6.36 |
| 13 | P29 US pay −20% | PhD ladder | 6.38 |
| 14 | P42 tier-A hazards halved | Online → German Blue Card | 6.40 |
| 15 | P30 merged projects worthless | Online + Spain, no master's | 6.45 |
| 16 | P18 contractor net −10% | O3h online → RWTH master's | 6.48 |
| 17 | P33 nomad income bar +30% | Poland in person | 6.53 |
| 18 | P21 pulled-forward tasks 25% slower | O3h online + Spain + master's | 6.58 |
| 19 | P51 language hours ×1.6 | Online → RWTH master's | 6.59 |

## 5. Three best scenarios (+8 to −8)

| Rank | Scenario | Robust | 90% CI | EV | NVIDIA-first |
|---|---|---|---|---|---|
| **1** | **Online CS (OSU) + Spain nomad residence → passport → TUM master's → Zurich → NVIDIA → L-1 to Seattle** | **+6.67** | 6.66–6.68 | 6.73 | 6.98 |
| 2 | Barcelona grado → passport → Zurich | +6.61 | 6.59–6.62 | 6.67 | 6.92 |
| 3 | Barcelona with languages and exams costed | +6.60 | 6.59–6.61 | 6.66 | 6.91 |

- **NVIDIA-first top 3:** #1 (6.98), then online CS → RWTH master's (6.94), then Barcelona (6.92), then Poland in person (6.92).
- **QRE:** #1 takes 39% of play at λ=16 and **88% at λ=50**. Its main threat is P31 (end of Swiss free movement).

## 6. Statistics

- **ANOVA** (curriculum × route among the top online routes):
  - Route 1.2% of variance (p=7e−7); curriculum 0.7% (p=1e−4); interaction not significant (p=0.48).
  - Levene p=9e−7 shows unequal variances, so I checked the curriculum effect with Kruskal–Wallis, which agrees (p=1e−6).
- **Matrix shares:** candidate 99.4%, play 0.38%, interaction 0.27%.
- **Regression:** R² 0.04–0.15.
  - 5-fold cross-validation error, linear vs null: 0.332 vs 0.351 for #1, and 0.618 vs 0.627 for the RWTH master's route.
  - The quadratic model is always worse, so it would overfit.
  - Errors are heteroscedastic (Breusch–Pagan p 1e−5 to 0.015), handled with HC3 errors. Residuals are non-normal, so confidence intervals come from a bootstrap.
- **Error:** 90% CI half-width 0.19–0.33%.
- **Sensitivity:** #1 stays first with H3 weights off, ×0.5 or ×2; net worth ×0.5 or ×1.5; and relocation ×0 or ×2.

## 7. Parameters vs B64

| Parameter | B64 | B65 | Better? |
|---|---|---|---|
| Best robust grade | 6.645 | **6.668** (ATS effect) | yes |
| Technology Pace (lower is better) | 1.4156 | 1.4156 | same |
| H3x at year 10 | 5.96 | 5.96 | same |
| Gross pay at year 8, best route | — | EUR 57.5k (Barcelona 44.8k) | new |
| NVIDIA-first score | — | 6.976 | new |
| NVIDIA by year 20, best NVIDIA route | 41% | 63% (ETH DD, if admitted); 50% (Poland, in person) | new |
| NVIDIA in Seattle by year 30, best | 52% | 74% (UW, if admitted) | new |

## 8. Limits

These inputs are judgement, not data:
- The ATS multipliers (1.3× offers, 1.10× pay).
- PhD admission for an online-degree applicant (ETH 4%, ISTA 8%, UW 4%, other US 25%, Unimore 45%).
- The NVIDIA internship rate during a PhD (18–30% a year).
- The post-PhD tier-A rate (50%).
- The UW stipend.
- The NVIDIA-first weights.

Not checked:
- An ISTA or Unimore hiring pipeline into NVIDIA.
- Whether ETH or ISTA admit online-degree holders.

## Sources

- [ETH direct doctorate in CS](https://inf.ethz.ch/doctorate/direct-doctorate-computer-science.html)
- [UW Allen School PhD admissions FAQ](https://www.cs.washington.edu/academics/phd/admissions/faq)
- [ISTA PhD positions (FWF job board)](https://www.fwf.ac.at/aktuelles/jobboerse/jobdetail/fully-funded-phd-positions-in-astronomy-biology-computer-science-chemistry-materials-data-science-scientific-computing-earth-science-mathematics-neuroscience-and-physics)
- [ISTA salary and acceptance (third party)](https://www.migrationvisportal.com/2025/10/ista-scholarship-austria-complete-guide.html)
- [NVIDIA AI Technology Center Italy / Unimore](https://blogs.nvidia.com/?p=44700)
- [Federico II academies](https://www.international.unina.it/education/academies/)
- [MIT: degree requirements vs actual hiring](https://gof.mit.edu/when-firms-drop-college-degree-requirements-does-hiring-change-a-new-study-gives-stark-answers)
- [Germany blocked account 2026](https://www.expatrio.com/about-germany/blocked-amount-2024)
- [NVIDIA Europe offices](https://www.nvidia.com/en-gb/contact/europe/)
