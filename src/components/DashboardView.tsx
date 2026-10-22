import React, { useState } from 'react';
import {
  CurriculumModule,
  ModuleCompletionStatus,
  computeCurriculumStats,
  HourMetricMode,
  FULL_BUILD_REFINE_HOURS,
  AUDITED_LIFECYCLE_HOURS,
  CORE_MILESTONE_HOURS,
  NORMALIZED_LIFETIME_HOURS,
  BUILD_REFINE_PHASES,
  AUDITED_LIFECYCLE_PHASES,
} from '../data/curriculumData.ts';
import { REPOSITORY_DATABASE, RepositoryItem } from '../data/repoCatalog.ts';
import { CURRICULUM_PERSONAS } from '../data/personaData.ts';
import { D3CompletionChart } from './D3CompletionChart.tsx';
import { D3PathwayMap } from './D3PathwayMap.tsx';
import { CompletionTrendsChart } from './CompletionTrendsChart.tsx';
import { D3KnowledgeHeatmap } from './D3KnowledgeHeatmap.tsx';
import { D3RadarChart } from './D3RadarChart.tsx';
import { downloadCurriculumDocx } from '../lib/docxExport.ts';
import { downloadProgressReportPdf } from '../lib/pdfExport.ts';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileDown,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Terminal,
  ExternalLink,
  ChevronRight,
  Filter,
  GitBranch,
  Gauge,
  Check,
  Flame,
  RotateCcw,
  Sliders,
  Radar,
  Star,
  Building2,
  UserCheck,
  Boxes,
  Workflow,
  Lock,
} from 'lucide-react';

interface DashboardViewProps {
  modules: CurriculumModule[];
  onUpdateModuleStatus: (moduleId: string, status: ModuleCompletionStatus) => void;
  onNavigateToModule: (moduleId: string) => void;
  onNavigateToTab: (tab: any) => void;
  onInspectRepo: (repo: RepositoryItem) => void;
  onResetBaseline?: () => void;
  onOpenFeatureFlags?: () => void;
  useNormalizedHours?: boolean;
  onToggleNormalizedHours?: () => void;
  hourMetricMode?: HourMetricMode;
  onSetHourMetricMode?: (mode: HourMetricMode) => void;
  featureFlags?: Record<string, boolean>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  modules,
  onUpdateModuleStatus,
  onNavigateToModule,
  onNavigateToTab,
  onInspectRepo,
  onResetBaseline,
  onOpenFeatureFlags,
  useNormalizedHours = false,
  onToggleNormalizedHours,
  hourMetricMode = 'build_refine',
  onSetHourMetricMode,
  featureFlags = {},
}) => {
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportSuccessToast, setExportSuccessToast] = useState<string | null>(null);
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('ALL');

  const activeMode: HourMetricMode = hourMetricMode || (useNormalizedHours ? 'normalized' : 'build_refine');
  const stats = computeCurriculumStats(modules, activeMode);

  // Big Tech Canonical Stacks (Huawei, Qualcomm, Tencent, Apple, NVIDIA) with 4k+ stars
  const bigTechFeaturedRepos = [
    {
      company: 'Huawei',
      repoName: 'mindspore-ai/mindspore',
      module: 'NM24',
      stars: 17400,
      persona: 'Zhifeng Chen (MindSpore Chief Architect)',
      role: 'Core Model & Training',
      skills: ['Auto-Parallelism', 'Ascend CANN', 'Graph Optimization', 'All-Scenario AI'],
      description: 'Unified deep learning computing framework providing dynamic-static graph unification and multi-device auto-parallelism.',
    },
    {
      company: 'Qualcomm',
      repoName: 'quic/aimet',
      module: 'NM37',
      stars: 4320,
      persona: 'Chirag Patel (Qualcomm AI Research)',
      role: 'Serving & Inference Engine',
      skills: ['Data-Free Quantization', 'AdaRound', 'Hexagon DSP', 'Snapdragon NPU'],
      description: 'AI Model Efficiency Toolkit: Advanced neural network compression, adaptive rounding, and fixed-point acceleration.',
    },
    {
      company: 'Tencent',
      repoName: 'Tencent/ncnn',
      module: 'NM26',
      stars: 19850,
      persona: 'Nihui (Tencent Principal Engineer)',
      role: 'Serving & Inference Engine',
      skills: ['Mobile ARM NEON', 'Vulkan Compute', 'Zero-Dependency C++', 'Edge Inference'],
      description: 'Blisteringly fast neural network inference framework optimized for mobile devices and embedded platforms.',
    },
    {
      company: 'Apple',
      repoName: 'ml-explore/mlx',
      module: 'NM24',
      stars: 21500,
      persona: 'Awni Hannun & Johny Srouji',
      role: 'Core Model & Training',
      skills: ['Apple Silicon Metal', 'Unified Memory', 'Dynamic Graphs', 'Zero-Copy Autograd'],
      description: 'Machine learning array framework designed natively for Apple Silicon unified memory and Metal GPU pipelines.',
    },
    {
      company: 'NVIDIA',
      repoName: 'NVIDIA/cutlass',
      module: 'NM32',
      stars: 7850,
      persona: 'Bill Dally & Ian Buck',
      role: 'Serving & Inference Engine',
      skills: ['CUDA C++ Templates', 'Tensor Cores', 'Blackwell/Hopper', 'GEMM Microkernels'],
      description: 'CUDA C++ template abstractions for implementing high-performance matrix multiplication and tensor kernels.',
    },
    {
      company: 'NVIDIA',
      repoName: 'NVIDIA/TensorRT-LLM',
      module: 'NM36',
      stars: 11200,
      persona: 'Ian Buck (NVIDIA VP Hyperscale)',
      role: 'Serving & Inference Engine',
      skills: ['Paged KV-Cache', 'In-Flight Batching', 'FP8 Kernels', 'Tensor Parallelism'],
      description: 'State-of-the-art inference engine optimizing large language model throughput on NVIDIA GPUs.',
    },
  ];

  // Demanded tools and canonical repositories (Haystack, Robusta, LangGraph, Langfuse, LiteLLM, Robustness, etc.)
  const demandedToolsList = [
    {
      name: 'robustadev/robusta',
      module: 'NM08',
      role: 'Layer 1: Host Sandbox & Execution',
      description: 'Kubernetes autonomous troubleshooting, multi-agent remediation, and container sandbox execution.',
      stars: 4950,
      match: 94,
      skills: ['Kubernetes CRDs', 'Alertmanager Webhooks', 'Controller Loops', 'Container SRE'],
    },
    {
      name: 'deepset-ai/haystack',
      module: 'NM26',
      role: 'Layer 3: Memory & Context Windows',
      description: 'Modular LLM pipeline orchestration, dense passage retrieval (DPR), and production semantic search.',
      stars: 18400,
      match: 92,
      skills: ['RAG Topologies', 'DocumentStore DAGs', 'Dense Embeddings', 'Hybrid Retrieval'],
    },
    {
      name: 'langchain-ai/langgraph',
      module: 'NM28',
      role: 'Layer 4: Agent Orchestrator & Planner',
      description: 'Build resilient language agents as cyclic state machines, multi-agent workflows, and bounded human-in-the-loop graphs.',
      stars: 19500,
      match: 98,
      skills: ['Cyclic State Machines', 'Checkpoints & Replay', 'Multi-Agent Routing', 'Human-in-the-Loop'],
    },
    {
      name: 'langfuse/langfuse',
      module: 'NM26',
      role: 'Layer 5: Safety, Guardrails & Evaluation',
      description: 'Open source LLM engineering platform: observability, metrics, prompt management, and automated evals.',
      stars: 14200,
      match: 95,
      skills: ['Distributed Tracing', 'OpenTelemetry Spans', 'LLM Cost Accounting', 'Evals Matrix'],
    },
    {
      name: 'BerriAI/litellm',
      module: 'NM37',
      role: 'Serving & Inference Engine',
      description: 'Unified low-latency proxy gateway, load balancing, circuit breakers, and fallbacks across 100+ LLMs.',
      stars: 21300,
      match: 94,
      skills: ['Gateway Load Balancing', 'Circuit Breakers', 'SSE Delta Streaming', 'Provider Fallbacks'],
    },
    {
      name: 'MadryLab/robustness',
      module: 'NM27',
      role: 'Layer 5: Safety, Guardrails & Evaluation',
      description: 'Rigorous library for evaluating neural network adversarial robustness and representation vulnerability.',
      stars: 3800,
      match: 91,
      skills: ['PGD Adversarial Attacks', 'Certified Defenses', 'Gradient Masking', 'Robust Optimization'],
    },
    {
      name: 'karpathy/micrograd',
      module: 'NM24',
      role: 'Foundations & Math',
      description: 'Tiny scalar autograd engine with reverse-mode automatic differentiation DAG and transparent backpropagation.',
      stars: 42500,
      match: 96,
      skills: ['Reverse-Mode Autodiff', 'Computation Graphs', 'Chain Rule Jacobian', 'C++ Porting'],
    },
  ];

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      await downloadCurriculumDocx(modules, REPOSITORY_DATABASE);
      setExportSuccessToast('Curriculum Syllabus (.docx) downloaded successfully!');
      setTimeout(() => setExportSuccessToast(null), 4000);
    } catch (err) {
      console.error('Failed to export DOCX:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      await downloadProgressReportPdf(modules, REPOSITORY_DATABASE, {
        useNormalizedHours: activeMode === 'normalized',
        hourMetricMode: activeMode,
        targetHours:
          activeMode === 'normalized'
            ? 69168
            : activeMode === 'build_refine'
            ? 50400
            : activeMode === 'audited'
            ? 12600
            : 7200,
      });
      setExportSuccessToast('Executive Progress Report (.pdf) downloaded successfully!');
      setTimeout(() => setExportSuccessToast(null), 4000);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Higher harness readiness score
  const harnessModules = modules.filter((m) => ['NM08', 'NM26', 'NM27', 'NM28', 'NM36'].includes(m.id));
  const harnessDoneCount = harnessModules.filter((m) => m.completionStatus === 'completed').length;
  const harnessInFlightCount = harnessModules.filter((m) => m.completionStatus === 'in_progress').length;
  const harnessReadinessScore = Math.round(((harnessDoneCount * 1.0 + harnessInFlightCount * 0.5) / harnessModules.length) * 100);

  const filteredModulesList = selectedStageFilter === 'ALL'
    ? modules
    : modules.filter((m) => m.stage === selectedStageFilter);

  const filteredBigTechList = selectedCompanyFilter === 'ALL'
    ? bigTechFeaturedRepos
    : bigTechFeaturedRepos.filter((r) => r.company === selectedCompanyFilter);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {exportSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-medium">{exportSuccessToast}</span>
        </div>
      )}

      {/* Hero / Header Section */}
      <div className="p-5 sm:p-6 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
              <TrendingUp className="w-4 h-4" />
              <span>
                {activeMode === 'build_refine'
                  ? '50,400-HOUR COMPREHENSIVE BUILD & REFINE HORIZON (~50K HOURS)'
                  : activeMode === 'audited'
                  ? '12,600-HOUR FULL AUDITED ENGINEERING LIFECYCLE'
                  : activeMode === 'normalized'
                  ? '69,168-HOUR NORMALIZED TRAJECTORY (UNCAPPED)'
                  : '7,200-HOUR SYSTEMS CURRICULUM MILESTONE'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Autonomous Systems &amp; Frontier Engineering Dashboard
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Production telemetry across Stages N0 to N11. Realistic engineering lifecycle estimated towards ~50,000 hours: deep theory (7.2k), from-scratch multi-stack reproduction (14.4k), kernel micro-optimization (10.8k), verification gates G01–G19 (9.0k), distributed SRE (5.4k), and microVM threat auditing (3.6k).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Download PDF Progress Report Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 disabled:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold font-mono transition shadow-md"
              title="Download executive PDF summary of completed modules, D01-D18 proficiencies, and B65/B67 scan scores"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExportingPdf ? 'Generating PDF...' : 'Download Progress Report (.pdf)'}</span>
            </button>

            {/* Download DOCX Button */}
            <button
              onClick={handleDownloadDocx}
              disabled={isExportingDocx}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white px-3.5 py-2 rounded-lg text-xs font-semibold font-mono transition shadow-md"
              title="Export complete curriculum syllabus in Word (.docx) format"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExportingDocx ? 'Generating .DOCX...' : 'Export DOCX'}</span>
            </button>

            {/* Feature Flags & Modular Code Manager Button */}
            {onOpenFeatureFlags && (
              <button
                onClick={onOpenFeatureFlags}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white px-3.5 py-2 rounded-lg text-xs font-mono transition border border-cyan-500/30 hover:border-cyan-500/60"
                title="Toggle platform features ON/OFF and inspect implementation code to expand the app"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Feature Flags &amp; Code</span>
              </button>
            )}

            {onResetBaseline && (
              <button
                onClick={onResetBaseline}
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-lg text-xs font-mono transition border border-slate-700/80"
                title="Reset curriculum progression to assumed 11% baseline"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset (11%)</span>
              </button>
            )}
          </div>
        </div>

        {/* 4-Mode Accounting Horizon Selector */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col xl:flex-row xl:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">Accounting Horizon:</span>
            <div className="inline-flex flex-wrap rounded-lg bg-slate-950 p-1 border border-slate-800 gap-1">
              <button
                onClick={() => onSetHourMetricMode ? onSetHourMetricMode('build_refine') : onToggleNormalizedHours && onToggleNormalizedHours()}
                className={`px-3 py-1 rounded-md font-mono text-xs transition flex items-center space-x-1.5 ${
                  activeMode === 'build_refine'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Comprehensive ~50k-hour horizon: completely building from scratch, profiling, micro-optimizing, verifying, and refining all 566+ repositories"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Build &amp; Refine (50.4k h)</span>
              </button>

              <button
                onClick={() => onSetHourMetricMode ? onSetHourMetricMode('audited') : onToggleNormalizedHours && onToggleNormalizedHours()}
                className={`px-3 py-1 rounded-md font-mono text-xs transition flex items-center space-x-1.5 ${
                  activeMode === 'audited'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Full audited production lifecycle (12,600h): learning, build, operating, verification, and security"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Audited Lifecycle (12.6k h)</span>
              </button>

              <button
                onClick={() => onSetHourMetricMode ? onSetHourMetricMode('core') : onToggleNormalizedHours && onToggleNormalizedHours()}
                className={`px-3 py-1 rounded-md font-mono text-xs transition flex items-center space-x-1.5 ${
                  activeMode === 'core'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Core theoretical curriculum milestone (7,200h) across stages N0-N11"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Core Milestone (7.2k h)</span>
              </button>

              <button
                onClick={() => onSetHourMetricMode ? onSetHourMetricMode('normalized') : onToggleNormalizedHours && onToggleNormalizedHours()}
                className={`px-3 py-1 rounded-md font-mono text-xs transition flex items-center space-x-1.5 ${
                  activeMode === 'normalized'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Normalized higher value trajectory (69,168h) uncapped average"
              >
                <Gauge className="w-3.5 h-3.5 text-purple-400" />
                <span>Normalized (69.2k h)</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            {activeMode === 'build_refine'
              ? '~50k-hour complete build & refine horizon: theory (7.2k) + multi-stack build (14.4k) + optimization (10.8k) + gates (9k) + SRE (5.4k) + security (3.6k)'
              : activeMode === 'audited'
              ? 'Audited production lifecycle: theory (7.2k) + build (2.16k) + SRE (1.44k) + gates (1.08k) + security (0.72k)'
              : activeMode === 'normalized'
              ? 'Normalizing against B61 O3h (68,715h) & B62 O3x (69,620h) average higher value'
              : 'Core 360 active weeks @ 20h/week syllabus (11% baseline = 792h)'}
          </div>
        </div>

        {/* Progress Bar & Stage Notches */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Total Completion Trajectory</span>
            <span className="text-emerald-400 font-bold">
              {stats.completedPercent}% ({stats.completedHours.toLocaleString()}h / {stats.totalHours.toLocaleString()}h)
            </span>
          </div>

          {/* Segmented Progress Track */}
          <div className="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden flex border border-slate-800 p-0.5">
            <div
              className="bg-emerald-500 h-full rounded-l-full transition-all duration-500 shadow-sm"
              style={{ width: `${stats.completedPercent}%` }}
              title={`Completed: ${stats.completedHours}h (${stats.completedPercent}%)`}
            />
            <div
              className="bg-sky-400 h-full transition-all duration-500"
              style={{ width: `${stats.inProgressPercent}%` }}
              title={`In Progress: ${stats.inProgressHours}h (${stats.inProgressPercent}%)`}
            />
            <div
              className="bg-slate-800 h-full transition-all duration-500"
              style={{ width: `${Math.max(0, 100 - stats.completedPercent - stats.inProgressPercent)}%` }}
              title={`Remaining: ${stats.remainingHours}h`}
            />
          </div>

          {/* Stage Milestones Mini-Notches */}
          <div className="grid grid-cols-6 sm:grid-cols-11 gap-1 pt-1 text-[10px] font-mono">
            {stats.stageBreakdown.map((st) => {
              const isDone = st.percent === 100;
              const hasStarted = st.inProgressHours > 0 || st.completedHours > 0;
              return (
                <div
                  key={st.stage}
                  onClick={() => setSelectedStageFilter(st.stage)}
                  className={`p-1 rounded text-center cursor-pointer transition border ${
                    isDone
                      ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                      : hasStarted
                      ? 'bg-sky-950/60 border-sky-500/30 text-sky-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                  title={`${st.stage}: ${st.stageName} (${st.completedHours}/${st.totalHours}h)`}
                >
                  <div className="font-bold">{st.stage}</div>
                  <div className="text-[9px] opacity-80">{st.percent}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full Engineering Lifecycle & Build-Refine Breakdown Panel */}
        <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800/90 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-mono font-bold text-white tracking-wide">
                {activeMode === 'build_refine'
                  ? 'COMPREHENSIVE BUILD & REFINE LIFECYCLE (50,400 HOURS)'
                  : activeMode === 'audited'
                  ? 'FULL AUDITED PRODUCTION LIFECYCLE BREAKDOWN (12,600 HOURS)'
                  : 'CURRICULUM LIFECYCLE PHASES'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {activeMode === 'build_refine'
                ? 'Realistic ~50k-hour deep engineering estimate: multi-stack reproduction, kernel profiling & refinement'
                : 'Complete engineering accountability: theory + build + SRE + correctness + threat auditing'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
            {stats.lifecyclePhases.map((phase) => {
              // Proportional completed hours in this phase
              const phaseCompleted = Math.round((stats.completedPercent / 100) * phase.hours);
              return (
                <div
                  key={phase.id}
                  className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 flex flex-col justify-between space-y-2 hover:border-slate-700 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-slate-200 line-clamp-1">{phase.shortName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-sky-300">
                        {phase.percentage}%
                      </span>
                    </div>
                    <div className="text-base font-bold font-mono text-white">
                      {phase.hours.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">h</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {phase.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${stats.completedPercent}%`,
                          backgroundColor: phase.color,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{phaseCompleted}h done</span>
                      <span>{stats.completedPercent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Total Hours Runway</span>
              <Clock className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {stats.totalHours.toLocaleString()} <span className="text-xs text-sky-400 font-normal">h</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {stats.remainingHours.toLocaleString()}h remaining ({100 - stats.completedPercent}%)
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Verified Completed</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {stats.completedHours.toLocaleString()} <span className="text-xs text-slate-400 font-normal">h</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {stats.completedPercent}% achieved ({stats.completedModulesCount} modules)
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Active Under Study</span>
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
              {stats.inProgressHours.toLocaleString()} <span className="text-xs text-slate-400 font-normal">h</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {stats.inProgressModulesCount} modules in flight
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Harness Readiness</span>
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
              {harnessReadinessScore}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              L1-L5 Agent Core Readiness Index
            </div>
          </div>
        </div>
      </div>

      {/* D3 Radar Chart: Core Engineering Domains (D01-D18) */}
      {featureFlags.d3_radar_chart !== false && (
        <D3RadarChart
          modules={modules}
          onSelectModule={(modId) => onNavigateToModule(modId)}
        />
      )}

      {/* D3 Circular Completion Chart Section */}
      <D3CompletionChart
        modules={modules}
        onSelectStage={(st) => setSelectedStageFilter(st)}
      />

      {/* Completion Trends Dashboard using Recharts */}
      <CompletionTrendsChart stats={stats} totalModulesCount={modules.length} />

      {/* Visual Pathway Map using D3 */}
      {featureFlags.d3_pathway_map !== false && (
        <D3PathwayMap
          modules={modules}
          repositories={REPOSITORY_DATABASE}
          onSelectModule={(modId) => onNavigateToModule(modId)}
          onInspectRepo={(repo) => onInspectRepo(repo)}
        />
      )}

      {/* 30-Day Knowledge Activity Heatmap using D3 */}
      {featureFlags.knowledge_activity_heatmap !== false && (
        <D3KnowledgeHeatmap
          modules={modules}
          onSelectTrack={(stageId) => setSelectedStageFilter(stageId)}
        />
      )}

      {/* Big Tech 4k+ Canonical Stacks (Huawei, Qualcomm, Tencent, Apple, NVIDIA) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs font-mono text-cyan-400 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>BIG TECH 4K+ STARS ECOSYSTEM &amp; LIVING PERSONAS</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Huawei CANN/MindSpore, Qualcomm AIMET, Tencent NCNN, Apple MLX &amp; NVIDIA CUTLASS
            </h3>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-mono">
            {['ALL', 'Huawei', 'Qualcomm', 'Tencent', 'Apple', 'NVIDIA'].map((comp) => (
              <button
                key={comp}
                onClick={() => setSelectedCompanyFilter(comp)}
                className={`px-2.5 py-1 rounded transition whitespace-nowrap ${
                  selectedCompanyFilter === comp
                    ? 'bg-cyan-600 text-white font-medium'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredBigTechList.map((item) => {
            const catalogRepo = REPOSITORY_DATABASE.find(
              (r) => r.name.toLowerCase() === item.repoName.toLowerCase()
            );

            return (
              <div
                key={item.repoName}
                className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                      [{item.company}]
                    </span>
                    <span className="text-xs font-mono text-amber-400 flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{item.stars.toLocaleString()}</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{item.repoName}</h4>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Module: <span className="text-cyan-300 font-bold">{item.module}</span> • {item.role}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                      <UserCheck className="w-3 h-3 text-cyan-400" />
                      <span>Living Architect: <strong className="text-slate-300">{item.persona}</strong></span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {item.skills.map((sk) => (
                        <span
                          key={sk}
                          className="text-[9.5px] font-mono bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      if (catalogRepo) {
                        onInspectRepo(catalogRepo);
                      } else {
                        onInspectRepo({
                          id: item.repoName,
                          name: item.repoName,
                          module: item.module,
                          status: 'ADD_STUDY_EDU',
                          stars: item.stars,
                          starsSource: 'official',
                          url: `https://github.com/${item.repoName}`,
                          harnessLayer: item.role as any,
                          description: item.description,
                          keywords: item.skills,
                          correlationScore: 92,
                          isHarnessStack: true,
                        });
                      }
                    }}
                    className="flex items-center space-x-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Study Guide &amp; Code</span>
                  </button>

                  <a
                    href={`https://github.com/${item.repoName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-cyan-400 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Demanded Materials, Tools (Haystack, Robusta, LangGraph, etc.) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs font-mono text-amber-400">DEMANDED TOOLS &amp; EDUCATIONAL CONTENT</div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Production Stacks: Haystack, Robusta, LangGraph, Langfuse &amp; Agent Infrastructure
            </h3>
          </div>
          <button
            onClick={() => onNavigateToTab('repos')}
            className="flex items-center space-x-1.5 text-xs font-mono text-sky-400 hover:text-sky-300 transition"
          >
            <span>View All 442+ Repositories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {demandedToolsList.map((tool) => {
            const catalogRepo = REPOSITORY_DATABASE.find(
              (r) => r.name.toLowerCase() === tool.name.toLowerCase()
            );

            return (
              <div
                key={tool.name}
                className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold">
                      [{tool.module}]
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ★ {tool.stars.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{tool.name}</h4>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {tool.role}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-mono text-slate-500 uppercase">Acquired Skills:</div>
                    <div className="flex flex-wrap gap-1">
                      {tool.skills.map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-mono bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      if (catalogRepo) {
                        onInspectRepo(catalogRepo);
                      } else {
                        onInspectRepo({
                          id: tool.name,
                          name: tool.name,
                          module: tool.module,
                          status: 'PENDING_RELEASE',
                          stars: tool.stars,
                          starsSource: 'verified',
                          url: `https://github.com/${tool.name}`,
                          harnessLayer: tool.role as any,
                          description: tool.description,
                          keywords: tool.skills,
                          correlationScore: tool.match,
                          isHarnessStack: true,
                        });
                      }
                    }}
                    className="flex items-center space-x-1 text-xs font-mono text-amber-400 hover:text-amber-300 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>2 Books, Lectures &amp; Roadmap</span>
                  </button>

                  <a
                    href={`https://github.com/${tool.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-sky-400 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Completion Manager & Interactive State Toggles */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs font-mono text-sky-400">INTERACTIVE INTERACTION TRACKER</div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Module Status Matrix &amp; Progress Toggles
            </h3>
            <p className="text-xs text-slate-400">
              Click buttons to update your real-time completion state. Changes dynamically update D3 metrics, Trends, Radar, and PDF/DOCX exports.
            </p>
          </div>

          {/* Stage Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-mono">
            {['ALL', 'N0', 'N1', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10', 'N11'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStageFilter(st)}
                className={`px-2.5 py-1 rounded transition whitespace-nowrap ${
                  selectedStageFilter === st
                    ? 'bg-sky-600 text-white font-medium'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Table List */}
        <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
          {filteredModulesList.map((mod) => (
            <div
              key={mod.id}
              className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sky-400">{mod.id}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{mod.stage}</span>
                  <span className="text-slate-500">·</span>
                  <span className="font-bold text-white text-sm font-sans">{mod.title}</span>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 font-sans">
                  {mod.goal}
                </div>
                <div className="text-[11px] text-slate-500">
                  <span>{mod.hours}h</span>
                  <span className="mx-1 text-slate-700">·</span>
                  <span>Tools: {(mod.keyTools || []).slice(0, 4).join(', ')}</span>
                </div>
              </div>

              {/* Status & Toggle Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onUpdateModuleStatus(mod.id, 'not_started')}
                  className={`px-2.5 py-1 rounded text-[11px] transition border ${
                    mod.completionStatus === 'not_started'
                      ? 'bg-slate-800 text-slate-300 border-slate-600 font-bold'
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                >
                  Backlog
                </button>
                <button
                  onClick={() => onUpdateModuleStatus(mod.id, 'in_progress')}
                  className={`px-2.5 py-1 rounded text-[11px] transition border ${
                    mod.completionStatus === 'in_progress'
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/50 font-bold'
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => onUpdateModuleStatus(mod.id, 'completed')}
                  className={`px-2.5 py-1 rounded text-[11px] transition border ${
                    mod.completionStatus === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 font-bold'
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                  }`}
                >
                  Completed
                </button>

                <button
                  onClick={() => onNavigateToModule(mod.id)}
                  className="p-1.5 text-slate-400 hover:text-white transition rounded hover:bg-slate-800"
                  title="Inspect module in curriculum view"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
