import React, { useState } from 'react';
import { CURRICULUM_MODULES, CurriculumModule, TOTAL_CURRICULUM_HOURS } from '../data/curriculumData.ts';
import { REPOSITORY_DATABASE, RepositoryItem } from '../data/repoCatalog.ts';
import { Clock, Layers, ArrowRight, ExternalLink, Sparkles, BookOpen, ChevronRight } from 'lucide-react';

interface CurriculumViewProps {
  onSelectModuleForSynthesis: (mod: CurriculumModule) => void;
  onExploreModuleRepos: (moduleId: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  onSelectModuleForSynthesis,
  onExploreModuleRepos,
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [activeModuleId, setActiveModuleId] = useState<string>('NM28');

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

  const filteredModules = selectedStage === 'ALL'
    ? CURRICULUM_MODULES
    : CURRICULUM_MODULES.filter((m) => m.stage === selectedStage);

  const activeModule = CURRICULUM_MODULES.find((m) => m.id === activeModuleId) || CURRICULUM_MODULES[0];
  const activeModuleRepos = REPOSITORY_DATABASE.filter((r) => r.module === activeModule.id);

  return (
    <div className="space-y-6">
      {/* Metric accounting banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
        <div>
          <div className="text-xs font-mono text-slate-400">Total Hours Budgeted</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {TOTAL_CURRICULUM_HOURS.toLocaleString()} <span className="text-xs text-sky-400 font-normal">h</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Fixed allocation across 25 modules</div>
        </div>
        <div>
          <div className="text-xs font-mono text-slate-400">Curriculum Scope</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            NM01 <span className="text-slate-500 text-sm">→</span> NM60
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Stages N0 through N11</div>
        </div>
        <div>
          <div className="text-xs font-mono text-slate-400">Indexed Repositories</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {REPOSITORY_DATABASE.length}+
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Min 70% subject correlation</div>
        </div>
        <div>
          <div className="text-xs font-mono text-slate-400">B69 Intake Pointers</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            421 <span className="text-xs text-slate-400 font-normal">items @ 0h</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">No hour inflation preserved</div>
        </div>
      </div>

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
          {filteredModules.map((mod) => {
            const repoCount = REPOSITORY_DATABASE.filter((r) => r.module === mod.id).length;
            const isSelected = mod.id === activeModuleId;

            return (
              <div
                key={mod.id}
                onClick={() => setActiveModuleId(mod.id)}
                className={`p-3.5 rounded-lg border cursor-pointer transition text-left ${
                  isSelected
                    ? 'bg-slate-800/90 border-sky-500/60 shadow-sm'
                    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-sky-400">{mod.id}</span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-xs font-mono text-slate-400">{mod.stage}</span>
                  </div>
                  <div className="text-xs font-mono text-slate-300">
                    {mod.hours}h
                  </div>
                </div>

                <div className="text-sm font-semibold text-slate-100 mt-1.5 line-clamp-1">
                  {mod.title}
                </div>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {mod.goal}
                </p>

                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
                  <span className="truncate max-w-[200px] text-slate-500">{mod.harnessRole}</span>
                  <span className="text-sky-300">{repoCount} repos matched</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Module Inspector & Correlated Repos (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-lg p-5 space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span>{activeModule.stage} · {activeModule.stageName}</span>
              <span className="text-sky-400 font-bold">{activeModule.hours} Hours Allocated</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              {activeModule.id}: {activeModule.title}
            </h2>
            <div className="mt-2 text-xs font-mono text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-slate-500 uppercase">Harness Role:</span> {activeModule.harnessRole}
            </div>
          </div>

          {/* Goal & Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Curriculum Objective</h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded border border-slate-800/80">
              {activeModule.goal}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {activeModule.description}
            </p>
          </div>

          {/* Prerequisites & Keywords */}
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
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => onSelectModuleForSynthesis(activeModule)}
              className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 rounded text-xs font-medium transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Synthesize with Gemini 4 (High Thinking)</span>
            </button>
            <button
              onClick={() => onExploreModuleRepos(activeModule.id)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded text-xs font-mono transition"
            >
              <span>Explore All {activeModuleRepos.length} Repos in Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Correlated Repos in this module */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Correlated Repositories ({activeModuleRepos.length})</span>
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
                    <div className="flex items-start justify-between">
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
