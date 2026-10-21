import React, { useState, useMemo } from 'react';
import { REPOSITORY_DATABASE, RepositoryItem, filterRepositories } from '../data/repoCatalog.ts';
import { CURRICULUM_MODULES } from '../data/curriculumData.ts';
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
} from 'lucide-react';

interface RepoMatrixViewProps {
  initialModuleId?: string;
  onVerifyRepo: (repo: RepositoryItem) => void;
}

export const RepoMatrixView: React.FC<RepoMatrixViewProps> = ({
  initialModuleId = 'ALL',
  onVerifyRepo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minCorrelation, setMinCorrelation] = useState(70);
  const [minStars, setMinStars] = useState(4000);
  const [selectedModule, setSelectedModule] = useState(initialModuleId);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedHarnessLayer, setSelectedHarnessLayer] = useState('ALL');
  const [harnessOnly, setHarnessOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'stars-desc' | 'stars-asc' | 'corr-desc' | 'name'>('stars-desc');

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

        {/* Row 2: Sliders & Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-800/80 text-xs font-mono">
          {/* Correlation Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Min Correlation:</span>
              <span className="text-sky-400 font-bold">{minCorrelation}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={minCorrelation}
              onChange={(e) => setMinCorrelation(Number(e.target.value))}
              aria-label="Minimum correlation threshold percentage"
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>50%</span>
              <span className="text-sky-500 font-semibold">70% (Default)</span>
              <span>95%</span>
            </div>
          </div>

          {/* Min Stars Filter */}
          <div className="space-y-1.5">
            <label htmlFor="min-stars-select" className="text-slate-400 block">Min Stars Filter:</label>
            <select
              id="min-stars-select"
              value={minStars}
              onChange={(e) => setMinStars(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value={0}>All Repos (0+ stars)</option>
              <option value={4000}>4,000+ stars (B69 Rule)</option>
              <option value={10000}>10,000+ stars</option>
              <option value={25000}>25,000+ stars</option>
              <option value={50000}>50,000+ stars</option>
              <option value={100000}>100,000+ stars</option>
            </select>
          </div>

          {/* Module Filter */}
          <div className="space-y-1.5">
            <label htmlFor="module-filter-select" className="text-slate-400 block">Curriculum Module:</label>
            <select
              id="module-filter-select"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="ALL">All Modules (NM01 - NM60)</option>
              {CURRICULUM_MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id}: {m.title.slice(0, 32)}...
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <label htmlFor="status-filter-select" className="text-slate-400 block">Intake Status:</label>
            <select
              id="status-filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="STUDY_ONLY">STUDY_ONLY (Karpathy / Nanobot)</option>
              <option value="ADD_STUDY_EDU">ADD_STUDY_EDU (Reliable Sources)</option>
              <option value="PENDING_RELEASE">PENDING_RELEASE (Stars &gt;= 4k)</option>
              <option value="PENDING_STARS">PENDING_STARS (Release Verified)</option>
              <option value="PENDING_EDU_REVIEW">PENDING_EDU_REVIEW</option>
              <option value="PENDING_STARS_AND_RELEASE">PENDING_STARS_AND_RELEASE</option>
              <option value="PENDING_TOPIC_UNKNOWN">PENDING_TOPIC_UNKNOWN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <div>
          Showing <span className="text-white font-bold">{filteredRepos.length}</span> repositories matching criteria (Threshold: &gt;={minCorrelation}%, Stars: &gt;={minStars.toLocaleString()})
        </div>
        <div className="text-slate-500 hidden sm:block">
          Zero-pill typography · Verified Provenance
        </div>
      </div>

      {/* Repositories Matrix List */}
      <div className="space-y-3">
        {filteredRepos.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-lg">
            <AlertTriangle className="w-8 h-8 text-amber-500/80 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-200">No repositories found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting the minimum correlation slider or lowering the star count filter.
            </p>
          </div>
        ) : (
          filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="p-4 bg-slate-900/70 border border-slate-800 rounded-lg hover:border-slate-700 transition space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-sky-400">
                      [{repo.module}]
                    </span>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-white hover:text-sky-400 transition inline-flex items-center space-x-1"
                    >
                      <span>{repo.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>

                  {/* Zero-pill metadata text separated by middots */}
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
                        <span className="text-slate-400">Release: {repo.releaseDate} ({repo.releaseSource})</span>
                      </>
                    )}
                    <span className="text-slate-600 mx-1.5">·</span>
                    <span className="text-sky-300/90">{repo.harnessLayer}</span>
                  </div>
                </div>

                {/* Live verification button */}
                <div className="shrink-0 flex items-center space-x-2">
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
                  Matching Tokens: {repo.keywords.join(', ')}
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
