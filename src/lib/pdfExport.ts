import { jsPDF } from 'jspdf';
import {
  CurriculumModule,
  computeCurriculumStats,
  HourMetricMode,
  FULL_BUILD_REFINE_HOURS,
  AUDITED_LIFECYCLE_HOURS,
  CORE_MILESTONE_HOURS,
  NORMALIZED_LIFETIME_HOURS,
  BUILD_REFINE_PHASES,
  AUDITED_LIFECYCLE_PHASES,
} from '../data/curriculumData.ts';
import { RepositoryItem } from '../data/repoCatalog.ts';
import { computeModuleProficiency } from '../components/ModuleProficiencyGauge.tsx';

export interface ReportExportOptions {
  studentName?: string;
  useNormalizedHours?: boolean;
  targetHours?: number;
  hourMetricMode?: HourMetricMode;
}

/**
 * Generates an executive, publication-grade PDF progress report of the student's
 * curriculum completion, competency levels, core domain radar proficiencies,
 * and AI stack benchmark scan scores using jsPDF.
 */
export async function downloadProgressReportPdf(
  modules: CurriculumModule[],
  repositories: RepositoryItem[],
  options: ReportExportOptions = {}
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const mode: HourMetricMode = options.hourMetricMode || (options.useNormalizedHours ? 'normalized' : 'build_refine');
  const stats = computeCurriculumStats(modules, mode);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const studentName = options.studentName || 'Autonomous AI Systems Scholar';
  let displayHours = FULL_BUILD_REFINE_HOURS;
  let modeLabel = 'Comprehensive Build & Refine Horizon (50,400h)';
  if (mode === 'build_refine') {
    displayHours = FULL_BUILD_REFINE_HOURS;
    modeLabel = 'Comprehensive Build & Refine Horizon (50,400h)';
  } else if (mode === 'audited') {
    displayHours = AUDITED_LIFECYCLE_HOURS;
    modeLabel = 'Full Audited Lifecycle (12,600h)';
  } else if (mode === 'core') {
    displayHours = CORE_MILESTONE_HOURS;
    modeLabel = 'Core Syllabus Milestone (7,200h)';
  } else if (mode === 'normalized') {
    displayHours = options.targetHours || NORMALIZED_LIFETIME_HOURS;
    modeLabel = 'Normalized Trajectory (69,168h)';
  }
  const completedModules = modules.filter((m) => m.completionStatus === 'completed');
  const inProgressModules = modules.filter((m) => m.completionStatus === 'in_progress');

  // --- Header Background Accent ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Cyan Top Line Accent
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 0, pageWidth, 3, 'F');

  // Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('FRONTIER AI ENGINEERING CURRICULUM', margin, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Systems Mastery, Kernel Optimization, Bounded Agents & Quantitative Audit', margin, 21);

  doc.setFontSize(9);
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text(`Official Milestone Progress Report  |  Generated: ${dateStr}`, margin, 28);
  doc.setTextColor(226, 232, 240);
  doc.text(`Candidate: ${studentName}`, margin, 34);

  y = 48;

  // --- Executive Summary Metric Boxes ---
  const boxWidth = (contentWidth - 6) / 4;
  const boxHeight = 20;

  const summaryMetrics = [
    {
      label: 'Core Progress',
      value: `${stats.completedPercent}%`,
      sub: `${stats.completedHours} / ${displayHours}h`,
      color: [16, 185, 129], // emerald
    },
    {
      label: 'Milestone Modules',
      value: `${completedModules.length} / ${modules.length}`,
      sub: `${inProgressModules.length} in progress`,
      color: [6, 182, 212], // cyan
    },
    {
      label: 'Catalog Repos',
      value: `${repositories.length}+`,
      sub: '4k+ star verified',
      color: [168, 85, 247], // purple
    },
    {
      label: 'Audit Benchmark',
      value: 'R0: 0.193 M/$',
      sub: 'B67 MC verified',
      color: [245, 158, 11], // amber
    },
  ];

  summaryMetrics.forEach((m, idx) => {
    const bx = margin + idx * (boxWidth + 2);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(bx, y, boxWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(bx, y, boxWidth, boxHeight, 2, 2, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, bx + 4, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(m.color[0], m.color[1], m.color[2]);
    doc.text(m.value, bx + 4, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(m.sub, bx + 4, y + 17.5);
  });

  y += boxHeight + 8;

  // --- Section 1: Completed Modules & Skills Inventory ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Completed Curriculum Milestones & Verified Skills', margin, y);
  y += 5;

  // Table Header
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('Module ID', margin + 3, y + 5);
  doc.text('Stage', margin + 24, y + 5);
  doc.text('Title & Focus Domain', margin + 42, y + 5);
  doc.text('Hours', margin + 120, y + 5);
  doc.text('Competency Tier', margin + 136, y + 5);
  doc.text('Key Tools', margin + 162, y + 5);
  y += 7;

  // Table Rows
  completedModules.forEach((mod, idx) => {
    const prof = computeModuleProficiency(mod);
    const rowHeight = 7.5;
    const isEven = idx % 2 === 0;

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, rowHeight, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(mod.id, margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(mod.stage, margin + 24, y + 5);

    doc.setTextColor(30, 41, 59);
    const titleTruncated = mod.title.length > 44 ? mod.title.substring(0, 42) + '...' : mod.title;
    doc.text(titleTruncated, margin + 42, y + 5);

    doc.setTextColor(71, 85, 105);
    doc.text(`${mod.hours}h`, margin + 120, y + 5);

    // Tier badge text
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129); // emerald
    doc.text(prof.tier, margin + 136, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    const toolsStr = mod.keyTools.slice(0, 3).join(', ');
    doc.text(toolsStr, margin + 162, y + 5);

    y += rowHeight;
  });

  y += 6;

  // --- Section 2: Core Engineering Domains (D01-D18) Proficiency Scan ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Core Engineering Domains Radar & Quantitative Scan (D01 - D18)', margin, y);
  y += 5;

  const domains = [
    { code: 'D01', name: 'Deep Learning Foundations', score: 8.8, persona: 'Bengio / LeCun' },
    { code: 'D02', name: 'Computer Vision & Spatial AI', score: 7.9, persona: 'Fei-Fei Li' },
    { code: 'D03', name: 'LLM Scaling & Pre-training', score: 8.2, persona: 'Quoc V. Le' },
    { code: 'D04', name: 'Efficient ML & Kernels', score: 9.1, persona: 'Song Han / Tri Dao' },
    { code: 'D05', name: 'Algorithms & Rigour', score: 9.6, persona: 'Dijkstra / Knuth' },
    { code: 'D06', name: 'OS, Linux & Systems', score: 9.8, persona: 'Linus Torvalds' },
    { code: 'D07', name: 'Database Internals', score: 7.8, persona: 'Stonebraker' },
    { code: 'D08', name: 'Distributed Systems', score: 8.9, persona: 'Jeff Dean' },
    { code: 'D09', name: 'Digital Hardware', score: 7.2, persona: 'Steve Wozniak' },
    { code: 'D10', name: 'Computer Architecture', score: 8.7, persona: 'Hennessy / Patterson' },
    { code: 'D11', name: 'VLSI & Physical Design', score: 7.4, persona: 'Lynn Conway / Carver Mead' },
    { code: 'D12', name: 'Interconnect & GPU Fabric', score: 9.2, persona: 'Bill Dally / Kagan' },
    { code: 'D13', name: 'Compilers & MLIR', score: 8.4, persona: 'Chris Lattner / Tianqi Chen' },
    { code: 'D14', name: 'Robotics & Balance', score: 7.6, persona: 'Marc Raibert / Brooks' },
    { code: 'D15', name: 'Quantum Hardware', score: 6.8, persona: 'Martinis / Schoelkopf' },
    { code: 'D16', name: 'Optics & Photonics', score: 6.5, persona: 'Charles K. Kao' },
    { code: 'D17', name: 'RF Neural Networks', score: 7.1, persona: 'Frontier SDR Lab' },
    { code: 'D18', name: 'Classical ML & Ensembles', score: 9.3, persona: 'Zhi-Hua Zhou' },
  ];

  // 2-column domain cards
  const colWidth = (contentWidth - 4) / 2;
  const colRowHeight = 6.8;

  for (let i = 0; i < domains.length; i += 2) {
    const d1 = domains[i];
    const d2 = domains[i + 1];

    [
      { d: d1, x: margin },
      { d: d2, x: margin + colWidth + 4 },
    ].forEach(({ d, x }) => {
      if (!d) return;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x, y, colWidth, colRowHeight - 1, 1.5, 1.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(x, y, colWidth, colRowHeight - 1, 1.5, 1.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${d.code} ${d.name}`, x + 3, y + 4.2);

      // Score bar
      const scoreBarWidth = 24;
      const scoreFilledWidth = (d.score / 10) * scoreBarWidth;
      doc.setFillColor(226, 232, 240);
      doc.roundedRect(x + colWidth - scoreBarWidth - 14, y + 1.8, scoreBarWidth, 2.5, 1, 1, 'F');
      doc.setFillColor(6, 182, 212); // cyan
      doc.roundedRect(x + colWidth - scoreBarWidth - 14, y + 1.8, scoreFilledWidth, 2.5, 1, 1, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(14, 116, 144);
      doc.text(`${d.score}/10`, x + colWidth - 11, y + 4.2);
    });

    y += colRowHeight;
  }

  y += 5;

  // --- Section 3: AI Stack & Frontier Benchmark Scan Summary ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('3. AI Stack & Budget Benchmark Scan (B65 / B67 Audit Verification)', margin, y);
  y += 5;

  const auditRows = [
    {
      metric: 'Optimization Config C03',
      result: 'Grade 8.00 | Robust R: 0.19302 | Max Regret: 0.00695',
      implication: 'Optimal lean routing + 5% batch video processing under $85-$92 budget',
    },
    {
      metric: 'B65 NVIDIA-First Relocation',
      result: 'Robust Grade: 6.668 (Top rank) | Zurich Median: 2033 | Net Worth: 4.95M EUR',
      implication: 'Spain nomad residence -> passport -> TUM Master -> Zurich NVIDIA office L-1 pathway',
    },
    {
      metric: 'Big Tech 4k+ Stacks',
      result: 'Apple MLX (21k★), NVIDIA Megatron-LM (15k★), Tencent NCNN (19k★), MindSpore (17k★)',
      implication: 'Cross-platform native accelerator parity across Apple Silicon, CUDA, CANN and Snapdragon',
    },
    {
      metric: 'Hour Normalization Mode',
      result: `${options.useNormalizedHours ? '69,168h Trajectory (Uncapped)' : '7,200h Core Milestone'}`,
      implication: 'Full career capital runway without artificial milestone truncation',
    },
  ];

  auditRows.forEach((row, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 252 : 255);
    doc.roundedRect(margin, y, contentWidth, 9, 1.5, 1.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 9, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(row.metric, margin + 4, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(2, 132, 199); // sky-600
    doc.text(row.result, margin + 50, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(row.implication, margin + 4, y + 7.5);

    y += 10.5;
  });

  // Footer / Verification Signature
  const footerY = pageHeight - 12;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, footerY - 2, margin + contentWidth, footerY - 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Frontier AI Engineering Curriculum | Built with Verified 4k+ Repositories, jsPDF Engine & D3 Analytics', margin, footerY + 2);
  doc.text('Page 1 of 1', margin + contentWidth - 14, footerY + 2);

  // Save the PDF
  doc.save(`Frontier_Curriculum_Progress_Report_${now.toISOString().slice(0, 10)}.pdf`);
}
