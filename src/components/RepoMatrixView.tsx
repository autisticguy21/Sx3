import React, { useState, useMemo } from 'react';
import { REPOSITORY_DATABASE, RepositoryItem, filterRepositories } from '../data/repoCatalog.ts';
import { CURRICULUM_MODULES } from '../data/curriculumData.ts';
import { RepoStudyGuideModal } from './RepoStudyGuideModal.tsx';
import {
  Search,
  ExternalLink,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  Layers,
  Globe,
  Loader2,
  BookOpen,
  Code2,
} from 'lucide-react';

interface RepoMatrixViewProps {
  initialModuleId?: string;
  onVerifyRepo: (repo: RepositoryItem) => void;
  onTriggerGeminiAnalysis?: (repo: RepositoryItem) => void;
}

export const RepoMatrixView: React.FC<RepoMatrixViewProps> = ({
  initialModuleId = 'ALL',
  onVerifyRepo,
  onTriggerGeminiAnalysis,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minCorrelation, setMinCorrelation] = useState(70);
  const [minStars, setMinStars] = useState(4000);
  const [selectedModule, setSelectedModule] = useState(initialModuleId);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedHarnessLayer, setSelectedHarnessLayer] = useState('ALL');
  const [harnessOnly, setHarnessOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'stars-desc' | 'stars-asc' | 'corr-desc' | 'name'>('stars-desc');

  // Selected repo for deep study guide modal
  const [inspectedRepo, setInspectedRepo] = useState<RepositoryItem | null>(null);

  const filteredRepos = useMemo(() => {
    let list = filterRepositories({
      minCorrelation,
      minStars,
      moduleId: selectedModule,
      status: selectedStatus,
      harnessLayer: selectedHarnessLayer,
      searchQuery,
      harnessOnly,
    });

    return list.sort((a, b) => {
      if (sortBy === 'stars-desc') return b.stars - a.stars;
      if (sortBy === 'stars-asc') return a.stars - b.stars;
      if (sortBy === 'corr-desc') return b.correlationScore - a.correlationScore;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [minCorrelation, minStars, selectedModule, selectedStatus, selectedHarnessLayer, searchQuery, harnessOnly, sortBy]);

  return (
    <div className="space-y-6">
      {/* Modal for 2 Books, Lectures, Seminal Papers, and Reproduction */}
      <RepoStudyGuideModal
        repo={inspectedRepo}
        isOpen={Boolean(inspectedRepo)}
        onClose={() => setInspectedRepo(null)}
        onTriggerGeminiAnalysis={onTriggerGeminiAnalysis}
      />

      {/* Top Filter and Controls Bar */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4 space-y-4">
        {/* Row 1: Search & Toggles */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repository name, keywords, or technology (e.g. mcp, vllm, swe-bench)..."
              className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setHarnessOnly(!harnessOnly)}
              className={`px-3 py-2 text-xs font-mono rounded transition flex items-center space-x-1.5 border ${
                harnessOnly
                  ? 'bg-sky-600/20 border-sky-500 text-sky-300 font-medium'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Higher Harness Only</span>
            </button>

            <div className="flex items-center space-x-1 border border-slate-800 bg-slate-950 rounded px-2.5 py-1.5 text-xs font-mono text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort repositories by"
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="stars-desc" className="bg-slate-900">Stars (High → Low)</option>
                <option value="stars-asc" className="bg-slate-900">Stars (Low → High)</option>
                <option value="corr-desc" className="bg-slate-900">Correlation %</option>
                <option value="name" className="bg-slate-900">Repository Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Sliders & Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-800/80 text-xs font-mono">
          {/* Minimum Correlation Slider (Rule >= 70%) */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Min Correlation:</span>
              <span className="text-sky-400 font-semibold">{minCorrelation}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={minCorrelation}
              onChange={(e) => setMinCorrelation(parseInt(e.target.value, 10))}
              aria-label="Minimum correlation percentage"
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>50%</span>
              <span className="text-sky-400">Rule Threshold: 70%</span>
              <span>95%</span>
            </div>
          </div>

          {/* Minimum Stars Slider (Rule >= 4,000) */}
          <div className="space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Min Stars:</span>
              <span className="text-emerald-400 font-semibold">{minStars.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={minStars}
              onChange={(e) => setMinStars(parseInt(e.target.value, 10))}
              aria-label="Minimum stars count"
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0 (Edu exempt)</span>
              <span className="text-emerald-400">Rule: 4,000</span>
              <span>100k+</span>
            </div>
          </div>

          {/* Module Selector */}
          <div className="space-y-1">
            <label htmlFor="repo-filter-module-select" className="text-slate-400 block">Filter Module:</label>
            <select
              id="repo-filter-module-select"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-sky-500 truncate"
            >
              <option value="ALL">All 25 Modules (7,200h)</option>
              {CURRICULUM_MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} ({m.stage}) - {m.title.slice(0, 36)}...
                </option>
              ))}
            </select>
          </div>

          {/* Harness Layer Selector */}
          <div className="space-y-1">
            <label htmlFor="repo-filter-layer-select" className="text-slate-400 block">Harness Layer:</label>
            <select
              id="repo-filter-layer-select"
              value={selectedHarnessLayer}
              onChange={(e) => setSelectedHarnessLayer(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 focus:outline-none focus:border-sky-500 truncate"
            >
              <option value="ALL">All Harness Layers</option>
              <option value="Layer 1: Host Sandbox & Execution">Layer 1: Host Sandbox</option>
              <option value="Layer 2: MCP Tool Contracts & Schema">Layer 2: MCP Contracts</option>
              <option value="Layer 3: Memory & Context Windows">Layer 3: Memory & Context</option>
              <option value="Layer 4: Agent Orchestrator & Planner">Layer 4: Agent Orchestrator</option>
              <option value="Layer 5: Safety, Guardrails & Evaluation">Layer 5: Guardrails & Eval</option>
              <option value="Serving & Inference Engine">Serving & Inference</option>
              <option value="Core Model & Training">Core Model & Training</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-400 px-1 gap-2">
        <div className="flex items-center space-x-2">
          <span>Showing <strong className="text-white font-bold">{filteredRepos.length}</strong> repositories</span>
          <span>·</span>
          <span>Filtered from 544 intake candidates</span>
          <span>·</span>
          <span className="text-amber-400">Click any card to inspect 2 Complementary Books &amp; Reproduction</span>
        </div>
        <div className="text-slate-500">
          Max Stars: {filteredRepos[0]?.stars.toLocaleString() || 'N/A'} (
          {filteredRepos[0]?.name || 'N/A'})
        </div>
      </div>

      {/* Repository Cards List */}
      <div className="space-y-3">
        {filteredRepos.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-lg">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-semibold text-slate-200">No repositories found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting the minimum correlation slider or lowering the star count filter.
            </p>
          </div>
        ) : (
          filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="p-4 bg-slate-900/70 border border-slate-800 rounded-lg hover:border-sky-500/50 transition space-y-2.5 cursor-pointer group"
              onClick={() => setInspectedRepo(repo)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-sky-400">
                      [{repo.module}]
                    </span>
                    <span className="text-sm font-bold text-white group-hover:text-sky-300 transition inline-flex items-center space-x-1">
                      <span>{repo.name}</span>
                    </span>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-500 hover:text-sky-400 transition"
                      title="Open GitHub"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Metadata text separated by middots */}
                  <div className="text-xs font-mono text-slate-400 flex items-center flex-wrap gap-y-1">
                    <span className="text-white font-semibold">{repo.stars.toLocaleString()} stars</span>
                    <span className="text-slate-600 mx-1.5">/</span>
                    <span className="text-slate-500">{repo.starsSource}</span>
                    <span className="text-slate-600 mx-1.5">·</span>
                    <span className="text-emerald-400 font-semibold">{repo.correlationScore}% correlation</span>
                    <span className="text-slate-600 mx-1.5">·</span>
                    <span className="text-slate-300">{repo.status}</span>
                    {repo.releaseDate && (
                      <>
                        <span className="text-slate-600 mx-1.5">·</span>
                        <span className="text-slate-400">Release: {repo.releaseDate}</span>
                      </>
                    )}
                    <span className="text-slate-600 mx-1.5">·</span>
                    <span className="text-sky-300/90">{repo.harnessLayer}</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="shrink-0 flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setInspectedRepo(repo)}
                    className="flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded text-xs font-mono transition border border-amber-500/30"
                    title="View 2 complementary books, lectures, and reproduction guide"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Study Guide &amp; Reproduction</span>
                  </button>

                  <button
                    onClick={() => onVerifyRepo(repo)}
                    className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs font-mono transition border border-slate-700"
                    title="Verify live GitHub stars and release via Google Search grounding"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>Verify Live</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {repo.description}
              </p>

              {repo.notes && (
                <div className="text-[11px] font-mono text-amber-300/90 bg-amber-950/30 border border-amber-800/40 px-2.5 py-1.5 rounded">
                  Note: {repo.notes}
                </div>
              )}

              {/* Goal Keywords token overlap */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span className="truncate max-w-[500px]">
                  Goal Overlap Tokens: {repo.keywords.join(', ')}
                </span>
                {repo.isHarnessStack && (
                  <span className="text-sky-400 font-semibold shrink-0">
                    Higher Harness Stack Component
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
