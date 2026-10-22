import React, { useState } from 'react';
import {
  CurriculumModule,
  ModuleCompletionStatus,
  computeCurriculumStats,
  HourMetricMode,
} from '../data/curriculumData.ts';
import { REPOSITORY_DATABASE, RepositoryItem } from '../data/repoCatalog.ts';
import { downloadCurriculumDocx } from '../lib/docxExport.ts';
import { PomodoroStudyTimer } from './PomodoroStudyTimer.tsx';
import { ModuleProficiencyGauge } from './ModuleProficiencyGauge.tsx';
import { InactivityReminderToast } from './InactivityReminderToast.tsx';
import {
  Clock,
  Layers,
  ArrowRight,
  ExternalLink,
  Sparkles,
  BookOpen,
  ChevronRight,
  FileDown,
  CheckCircle2,
  CircleDot,
  Check,
  Filter,
  Wrench,
  BookMarked,
  Timer,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Award,
} from 'lucide-react';

interface CurriculumViewProps {
  modules: CurriculumModule[];
  onUpdateModuleStatus: (moduleId: string, status: ModuleCompletionStatus) => void;
  onSelectModuleForSynthesis: (mod: CurriculumModule, synthesisPrompt?: string) => void;
  onExploreModuleRepos: (moduleId: string) => void;
  onInspectRepo?: (repo: RepositoryItem) => void;
  onResetBaseline?: () => void;
  hourMetricMode?: HourMetricMode;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  modules,
  onUpdateModuleStatus,
  onSelectModuleForSynthesis,
  onExploreModuleRepos,
  onInspectRepo,
  onResetBaseline,
  hourMetricMode = 'audited',
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [activeModuleId, setActiveModuleId] = useState<string>('NM28');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ModuleCompletionStatus>('ALL');
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [showStudyTimer, setShowStudyTimer] = useState<boolean>(true);

  const stats = computeCurriculumStats(modules, hourMetricMode);

  const stages = [
    { id: 'ALL', label: 'All Stages' },
    { id: 'N0', label: 'N0 Systems Foundations' },
    { id: 'N1', label: 'N1 Data Infrastructure' },
    { id: 'N3', label: 'N3 Distributed' },
    { id: 'N4', label: 'N4 Deep Learning Core' },
    { id: 'N5', label: 'N5 Model Systems & Agents' },
    { id: 'N6', label: 'N6 GPU & Kernels' },
    { id: 'N7', label: 'N7 Inference Engines' },
    { id: 'N8', label: 'N8 Distributed Scale' },
    { id: 'N9', label: 'N9 Compilers' },
    { id: 'N10', label: 'N10 Embodied AI' },
    { id: 'N11', label: 'N11 Frontier Research' },
  ];

  const filteredModules = modules.filter((m) => {
    if (selectedStage !== 'ALL' && m.stage !== selectedStage) return false;
    if (statusFilter !== 'ALL' && m.completionStatus !== statusFilter) return false;
    return true;
  });

  const activeModule = modules.find((m) => m.id === activeModuleId) || modules[0];
  const activeModuleRepos = REPOSITORY_DATABASE.filter((r) => r.module === activeModule.id);

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      await downloadCurriculumDocx(modules, REPOSITORY_DATABASE);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const getStatusBadge = (status: ModuleCompletionStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center space-x-1 text-[11px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
            <CircleDot className="w-3 h-3" />
            <span>In Progress</span>
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            Backlog
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Progress Bar */}
      <div className="p-4 sm:p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
              <Layers className="w-3.5 h-3.5" />
              <span>
                {hourMetricMode === 'audited'
                  ? '12,600-HOUR AUDITED PRODUCTION LIFECYCLE // INTERACTIVE BENCHMARK'
                  : hourMetricMode === 'normalized'
                  ? '69,168-HOUR NORMALIZED TRAJECTORY // UNCAPPED'
                  : '7,200-HOUR SYSTEMS CURRICULUM // CORE MILESTONE'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">Engineering Syllabus &amp; Module Matrix</h2>
            <div className="text-xs text-slate-400 font-mono">
              <span>{stats.completedHours.toLocaleString()}h completed</span>
              <span className="mx-2 text-slate-600">·</span>
              <span className="text-emerald-400 font-bold">{stats.completedPercent}% overall</span>
              <span className="mx-2 text-slate-600">·</span>
              <span>{stats.remainingHours.toLocaleString()}h remaining</span>
              {stats.inProgressHours > 0 && (
                <>
                  <span className="mx-2 text-slate-600">·</span>
                  <span className="text-sky-400 font-medium">{stats.inProgressHours}h in progress</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center space-x-2 shrink-0">
            {/* Inactivity Reminder Toast and Desktop Notification Controls */}
            <InactivityReminderToast
              activeModule={activeModule}
              onResumeStudy={() => setShowStudyTimer(true)}
            />

            {/* Toggle Study Timer Button */}
            <button
              onClick={() => setShowStudyTimer(!showStudyTimer)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 px-3 py-1.5 rounded-lg text-xs font-mono transition border border-slate-700"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{showStudyTimer ? 'Hide Timer' : 'Pomodoro Timer'}</span>
              {showStudyTimer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Reset to Baseline Button */}
            {onResetBaseline && (
              <button
                onClick={onResetBaseline}
                className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-mono transition border border-slate-700"
                title="Reset curriculum progression to assumed 11% baseline"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span className="hidden md:inline">Reset 11%</span>
              </button>
            )}

            {/* Export .docx Button */}
            <button
              onClick={handleDownloadDocx}
              disabled={isExportingDocx}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-mono transition shadow-sm"
              title="Download full curriculum syllabus in Microsoft Word (.docx) format"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isExportingDocx ? 'Generating...' : 'Export .docx'}</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar Track */}
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden flex border border-slate-800 p-0.5">
          <div
            className="bg-emerald-500 h-full rounded-l-full transition-all duration-300"
            style={{ width: `${stats.completedPercent}%` }}
            title={`Completed: ${stats.completedHours}h (${stats.completedPercent}%)`}
          />
          <div
            className="bg-sky-400 h-full transition-all duration-300"
            style={{ width: `${stats.inProgressPercent}%` }}
            title={`In Progress: ${stats.inProgressHours}h (${stats.inProgressPercent}%)`}
          />
        </div>

        {/* Progress Breakdown Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 pt-1">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>{stats.completedModulesCount} Completed</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
              <span>{stats.inProgressModulesCount} In Progress</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
              <span>{stats.notStartedModulesCount} Backlog</span>
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500">Filter Status:</span>
            {(['ALL', 'completed', 'in_progress', 'not_started'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded text-[11px] transition capitalize ${
                  statusFilter === st
                    ? 'bg-slate-800 text-white font-medium border border-slate-700'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {st === 'ALL' ? 'All' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pomodoro Study Timer */}
      {showStudyTimer && (
        <PomodoroStudyTimer
          activeModule={activeModule}
          modules={modules}
          onSelectModule={(m) => setActiveModuleId(m.id)}
          onTriggerGeminiSynthesis={(m, prompt) => onSelectModuleForSynthesis(m, prompt)}
          onUpdateModuleStatus={onUpdateModuleStatus}
        />
      )}

      {/* Stage timeline tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-mono scrollbar-thin">
        {stages.map((st) => (
          <button
            key={st.id}
            onClick={() => setSelectedStage(st.id)}
            className={`px-3 py-1.5 whitespace-nowrap rounded transition ${
              selectedStage === st.id
                ? 'bg-slate-800 text-white font-medium border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* Main split: Module list & Deep Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Master List (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
          {filteredModules.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-slate-500 bg-slate-900/40 border border-slate-800 rounded-lg">
              No modules match current stage and status filters.
            </div>
          ) : (
            filteredModules.map((mod) => {
              const repoCount = REPOSITORY_DATABASE.filter((r) => r.module === mod.id).length;
              const isSelected = mod.id === activeModuleId;

              return (
                <div
                  key={mod.id}
                  onClick={() => setActiveModuleId(mod.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition text-left space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 border-sky-500/80 shadow-md ring-1 ring-sky-500/30'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-sky-400">{mod.id}</span>
                        <span className="text-[11px] font-mono text-slate-500">[{mod.stage}]</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white leading-snug">{mod.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <ModuleProficiencyGauge module={mod} size="sm" showLabel={false} />
                      {getStatusBadge(mod.completionStatus)}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{mod.goal}</p>

                  <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-900">
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{mod.hours}h</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{repoCount} repos</span>
                    </div>

                    {/* Quick status switch */}
                    <div
                      className="flex items-center space-x-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onUpdateModuleStatus(mod.id, 'not_started')}
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          mod.completionStatus === 'not_started'
                            ? 'bg-slate-800 text-white font-bold'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title="Mark not started"
                      >
                        Backlog
                      </button>
                      <button
                        onClick={() => onUpdateModuleStatus(mod.id, 'in_progress')}
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          mod.completionStatus === 'in_progress'
                            ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/40'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title="Mark in progress"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => onUpdateModuleStatus(mod.id, 'completed')}
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          mod.completionStatus === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title="Mark completed"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Deep Inspector Panel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          {/* Header */}
          <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
                <span>{activeModule.stage}: {activeModule.stageName}</span>
                <span className="text-slate-600">//</span>
                <span>{activeModule.hours} HOURS</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {activeModule.id}: {activeModule.title}
              </h2>
            </div>

            {/* Toggle Status */}
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-slate-500 text-[11px]">Status:</span>
              {(['not_started', 'in_progress', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateModuleStatus(activeModule.id, st)}
                  className={`px-2.5 py-1 rounded text-xs transition capitalize ${
                    activeModule.completionStatus === st
                      ? st === 'completed'
                        ? 'bg-emerald-600 text-white font-bold'
                        : st === 'in_progress'
                        ? 'bg-sky-600 text-white font-bold'
                        : 'bg-slate-700 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Per-Module Skill Proficiency Gauge with Radial Bar */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-sky-400">
                <Award className="w-4 h-4 text-sky-400" />
                <span>SKILL PROFICIENCY &amp; COMPETENCY GAUGE</span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Estimated competency level derived from module completion, verification state, and active Pomodoro focus time.
              </p>
            </div>
            <div className="shrink-0 flex items-center justify-end">
              <ModuleProficiencyGauge module={activeModule} size="lg" showLabel={true} />
            </div>
          </div>

          {/* Goal & Description */}
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Module Objective &amp; Invariants
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">{activeModule.goal}</p>
          </div>

          {/* Key Tools & Demanded Materials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1.5">
              <div className="text-amber-400 text-[11px] uppercase flex items-center space-x-1">
                <Wrench className="w-3 h-3" />
                <span>Demanded Tools &amp; Engines</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {(activeModule.keyTools || []).map((tool) => (
                  <span
                    key={tool}
                    className="bg-amber-950/40 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded text-[11px]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1.5">
              <div className="text-sky-400 text-[11px] uppercase flex items-center space-x-1">
                <BookMarked className="w-3 h-3" />
                <span>Demanded Materials</span>
              </div>
              <div className="text-slate-300 text-[11px] space-y-0.5">
                {(activeModule.demandedMaterials || []).slice(0, 2).map((mat, i) => (
                  <div key={i} className="line-clamp-1 text-slate-400">
                    • {mat}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prerequisites & Goal Keywords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <div className="text-slate-500 text-[11px] uppercase mb-1">Prerequisites</div>
              <div className="text-slate-300">{activeModule.prerequisites.join(', ')}</div>
            </div>
            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <div className="text-slate-500 text-[11px] uppercase mb-1">Goal Keywords (&gt;=70% Match)</div>
              <div className="text-slate-300 truncate">{activeModule.coreKeywords.join(' · ')}</div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectModuleForSynthesis(activeModule)}
              className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 rounded text-xs font-medium transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Synthesize with Gemini 4</span>
            </button>
            <button
              onClick={() => onExploreModuleRepos(activeModule.id)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded text-xs font-mono transition border border-slate-700"
            >
              <span>Explore All {activeModuleRepos.length} Repos in Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Correlated Repos in this module */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">Correlated Repositories ({activeModuleRepos.length}) · 133+ Catalog Portfolio (≥70% Match)</span>
              <span className="text-slate-500">Sorted by Stars &amp; Correlation Index</span>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {activeModuleRepos.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center font-mono">
                  No direct repository matched in this slice.
                </div>
              ) : (
                activeModuleRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="p-3 bg-slate-950 rounded border border-slate-800/80 hover:border-slate-700 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-slate-100 hover:text-sky-400 flex items-center space-x-1 transition"
                          >
                            <span>{repo.name}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </a>
                        </div>
                        {/* Zero-pill metadata text */}
                        <div className="text-[11px] font-mono text-slate-400 mt-1">
                          <span>{repo.stars.toLocaleString()} stars</span>
                          <span className="mx-1 text-slate-600">·</span>
                          <span className="text-sky-400 font-semibold">{repo.correlationScore}% match</span>
                          <span className="mx-1 text-slate-600">·</span>
                          <span>{repo.status}</span>
                          {repo.releaseDate && (
                            <>
                              <span className="mx-1 text-slate-600">·</span>
                              <span className="text-slate-500">Rel: {repo.releaseDate}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Study Guide Inspector Button */}
                      {onInspectRepo && (
                        <button
                          onClick={() => onInspectRepo(repo)}
                          className="flex items-center space-x-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded text-[11px] font-mono transition border border-amber-500/30 shrink-0"
                          title="View 2 complementary books, lectures, and reproduction guide"
                        >
                          <BookOpen className="w-3 h-3 text-amber-400" />
                          <span>Study Guide</span>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
