# B69 Curriculum & Repo Intelligence Platform

An end-to-end curriculum intelligence and repository matching platform that maps the complete 7,200-hour engineering curriculum (NM01–NM60 across Stages N0–N11) with a >=70% correlation index to GitHub projects, companion video lectures, academic papers, and foundational textbooks. Features high-reasoning Gemini 4 Argon curriculum synthesis, live Google Search grounding for repo verification, and export directly into Google Sheets, Docs, and Drive.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and scope decisions reflect the choices confirmed during Phase 1 clarification:

- **Confirmed Workflow Focus**: Full curriculum explorer with strict >=70% correlation repo matching, interactive tech stack bundling, and companion multimedia library (video lectures, books, build slices).
- **Confirmed Domain Coverage**: All stages and modules (N0 foundations through N11 frontier research, encompassing NM01 to NM60) featured with equal fidelity and stage filtering.
- **Confirmed Workspace Integration**: Full structured bundle export supporting Google Drive (dedicated study plan folder), Google Sheets (interactive hour-accounting syllabus and correlation matrix), and Google Docs (comprehensive syllabus document).
- **OAuth & API Permissions**: Workspace integration will request explicit user authentication for Google Drive (`drive.file`), Google Sheets (`spreadsheets`), and Google Docs (`documents`) through the standard OAuth client-side flow.

---

## 1. Overview & Core Concept

### What It Does
The platform provides a comprehensive learning and engineering operating system that solves the gap between theoretical study and real-world repository mastery. It indexes:
- The entire 7,200-hour curriculum across Stages N0 to N11 (25 core curriculum modules from NM01 to NM60).
- 544+ deduplicated GitHub repository candidates classified by status (`STUDY_ONLY`, `STUDY_POINTER`, `PENDING_RELEASE`, `PENDING_STARS`, `PENDING_EDU_REVIEW`, etc.) with >=70% lexical and semantic goal-token correlation.
- Rich multimedia study companions: Ivy-league & premier lectures (MIT 18.06, Stanford CS25 & CS224N, Fast.ai, DeepLearning.AI, MIT 6.S191), canonical books (Dive into Deep Learning, Hands-On ML, Interpretable ML, System Design Primer), and Karpathy study-only master repos (`llm.c`, `minGPT`, `nanochat`, `LLM101n`, `HKUDS/nanobot`).
- Correlated Tech Stacks (Inference Serving, Agentic MCP Harnesses, Quantization & Acceleration, Distributed Training, MLOps Data Lineage).
- Gemini AI Studio engine with Gemini 4 Argon (high-thinking mode) for deep skill gap evaluation, Gemini 3.8 Flash with Google Search grounding for live repository verification, and Gemini 3.1 Flash Lite for fast correlation matching.
- Google Workspace exporter for Google Sheets, Docs, and Drive.

### Target Audience & Persona
- AI Systems Engineers, Machine Learning Researchers, and Full-Stack AI Builders mastering the full stack from bare-metal CUDA kernels to high-level bounded agent harnesses.

### Key Value
Transforms unstructured GitHub stars and massive reading lists into an actionable, quantified 7,200-hour study path with strict >=70% correlation matching and instant Google Workspace export.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Curriculum & Stage Navigation**: The user lands on the stage timeline (N0–N11) with a module selector (NM01–NM60). Clicking any module immediately surfaces its goal statement, hour allocation, prerequisites, and filtered >=70% correlated repositories.
2. **Correlation & Stack Explorer**: The user adjusts the Correlation Threshold slider (default 70%) or toggles specific stacks (e.g., "Agentic MCP Harnesses", "Quantization & KV Paging", "CUDA & Triton"). Repositories display correlation scores, verified stars, release statuses, and primary tech stacks.
3. **Multimedia Knowledge Deck (Videos, Lectures, Books)**: Each module provides a dedicated tabbed media dock featuring verified video lecture streams (Stanford, MIT, Fast.ai), downloadable or online reading references, and Karpathy build notes.
4. **Gemini AI Study Architect**: The user clicks "Analyze Skill Gaps & Synthesize Track" to trigger Gemini 4 Argon with High Thinking (`thinkingLevel: ThinkingLevel.HIGH`) to synthesize a personalized learning sprint. Users can also verify unverified repos via Gemini 3.8 Flash with Google Search grounding.
5. **Google Workspace Export**: The user connects with Google via the standard Google Sign-In button, reviews the export summary, and generates their structured tracking spreadsheet in Google Sheets, syllabus in Google Docs, and folder in Google Drive.

### Visual Identity & Theme
- **Aesthetic Direction**: High-rigor academic & technical workstation aesthetic (clean editorial minimalism, tabular precision, and structured spatial harmony).
- **Color Palette & Discipline (60-30-10 Rule)**:
  - `60% Neutral Canvas`: Clean slate light canvas (`#F8FAFC` background) with optical dark slate mode (`#0B0F19`).
  - `30% Structural Surfaces`: Pure white (`#FFFFFF`) / dark slate container panels (`#111827`), subtle hairline borders (`#E2E8F0` / `#1F2937`), and quiet metadata labels.
  - `10% Intentional Accents`: Deep academic indigo (`#3B82F6` / `#2563EB`) for active tabs, primary actions, and correlation thresholds; muted emerald (`#059669`) for verified pointers.
- **Zero-Pill Metadata Discipline**: All status labels, release dates, and star counts are rendered as clean, unboxed text separated by typographic middots (`·`) or slashes (`/`) without colored candy badges.
- **Top Bar Contract**:
  - Zone 1: Single text wordmark `Curriculum 70 // Repo & Media Intelligence`
  - Zone 2: 4 single-line nav links: `Curriculum`, `Repo Stacks`, `Lectures & Books`, `Workspace Export`
  - Zone 3: 1 primary action button: `Synthesize Study Track` (or `Sign in with Google` when unauthenticated).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Ingest of B69 Dataset (544 Candidates & 25 Modules)**
  - *Chosen Approach*: Embed the full, verified dataset of 544 repository candidates, 25 curriculum modules, and categorized reliable educational pointers directly in a typed client data store, combined with dynamic correlation scoring.
  - *Why*: Delivers zero-latency filtering, instant multi-criteria sorting, and responsive search across all stages (N0 to N11) without network bottleneck.
  - *Alternatives Considered*: Fetching live on each filter change; rejected due to GitHub API rate limits (as noted in session brief, GitHub 403 occurs without auth).
- **Decision 2: Hybrid Gemini Architecture**
  - *Chosen Approach*: Route requests by task complexity:
    - `gemini-4-argon` with `thinkingLevel: ThinkingLevel.HIGH` for high-reasoning learning path synthesis, trade-off analysis, and skill gap diagnostics.
    - `gemini-3.8-flash` with `{ googleSearch: {} }` tool for live repository verification, recent release checks, and finding newly published companion lectures.
    - `gemini-3.1-flash-lite` for instantaneous keyword extraction and correlation indexing.
  - *Why*: Adheres strictly to the task guidelines and provides optimal latency/quality balance.
- **Decision 3: Client-Side Workspace OAuth with Graceful Offline Mode**
  - *Chosen Approach*: Standard client-side OAuth flow using `GoogleAuthProvider` requesting `spreadsheets`, `documents`, and `drive.file` scopes, backed by local JSON and CSV export fallbacks so the app is 100% usable even before Google sign-in.
  - *Why*: Guarantees instant utility for all users while providing first-class Google Workspace synchronization for authenticated users.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App Navigation & Top Bar                        │
│ [Wordmark] ── [Curriculum | Stacks | Lectures & Books | Workspace] ── [CTA]│
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
          ┌──────────────────────────┴──────────────────────────┐
          ▼                                                     ▼
┌───────────────────────────────┐     ┌───────────────────────────────────┐
│ Stage & Module Navigator      │     │ Correlation Filter Engine (>=70%) │
│ - N0 to N11 Stage Timeline    │     │ - Slider (50% to 100%, def 70%)   │
│ - NM01 to NM60 Module Deck    │     │ - Stack Bundles & Status Filter   │
│ - 7,200h Hour Accounting      │     │ - Search & Keyword Overlap Math   │
└──────────────┬────────────────┘     └─────────────────┬─────────────────┘
               │                                        │
               └────────────────────┬───────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Dynamic Views & Interactive Workspaces                                  │
│ ├─ [Curriculum View]: Modules, Objectives, Correlated Repos, Hours      │
│ ├─ [Repo Matrix View]: 544 Repos, Lexical Goal Matching, Star/Release   │
│ ├─ [Media Hub]: MIT/Stanford Video Lectures, Textbooks, Karpathy Code   │
│ ├─ [Gemini AI Lab]: High Thinking Synthesis & Google Search Grounding   │
│ └─ [Workspace Hub]: Google Sheets / Docs / Drive Export Package         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
┌───────────────────────────────┐     ┌───────────────────────────────────┐
│ Server-Side Gemini API Proxy  │     │ Google Workspace API Engine       │
│ (/api/gemini/synthesize)      │     │ - OAuth 2.0 Client-side Flow      │
│ - gemini-4-argon (High Think) │     │ - Google Sheets API v4            │
│ - gemini-3.8-flash (Search)   │     │ - Google Docs API v1              │
│ - gemini-3.1-flash-lite       │     │ - Google Drive API v3             │
└───────────────────────────────┘     └───────────────────────────────────┘
```

### Data Model & Entities
1. **Module**: `id` (e.g. `NM28`), `stage` (`N5`), `title`, `hours` (8h to 240h), `description`, `goalKeywords` (tokens used for correlation calculation), `prerequisites`.
2. **Repository**: `name`, `module`, `status` (`ADD_STUDY_ONLY`, `ADD_STUDY_EDU`, `PENDING_RELEASE`, `PENDING_STARS`, `PENDING_EDU_REVIEW`, `PENDING_STARS_AND_RELEASE`), `stars`, `starsSource`, `releaseDate`, `releaseSource`, `url`, `correlationScore`, `stackCategory`, `notes`.
3. **MediaResource**: `id`, `moduleId`, `type` (`lecture_video`, `textbook`, `course_notes`, `paper`), `title`, `provider` (MIT, Stanford, DeepLearning.AI, Fast.ai, D2L), `url`, `durationOrPages`, `description`.
4. **StackBundle**: `id`, `name`, `description`, `targetModules`, `primaryRepos`, `careerReadiness`.

### Implementation Steps
1. Configure metadata.json with descriptive name and description.
2. Build core domain datasets: `curriculumData.ts` (all 25 modules NM01-NM60), `repoCatalog.ts` (544 B69 intake items with correlation engine), and `mediaCatalog.ts` (video lectures, textbooks, guides).
3. Build server-side Gemini API router (`/api/gemini`) supporting `gemini-4-argon` (high thinking) and `gemini-3.8-flash` (search grounding).
4. Build interactive UI:
   - Navigation & Top Bar strictly adhering to 3-zone contract.
   - Stage & Module timeline with hour counters.
   - Correlated Repo Matrix with 70% threshold filter, stack tags, star/release provenance.
   - Multimedia Learning Hub (lectures, video links, textbook chapters).
   - Gemini Thinking Lab for curriculum synthesis.
   - Google Workspace export panel (Sheets, Docs, Drive) with Google Sign-In.
5. Verify build and compilation with `compile_applet`.
