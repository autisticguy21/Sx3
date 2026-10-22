import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  Sparkles,
  LogOut,
  FolderOpen,
  FileDown,
  LayoutDashboard,
  Search,
  X,
  BookOpen,
  GitBranch,
  Star,
  Layers,
  CheckCircle2,
  CircleDot,
  Clock,
  ArrowRight,
  Sliders,
  WifiOff,
  FileText,
  Gauge,
} from 'lucide-react';
import { CurriculumModule, HourMetricMode } from '../data/curriculumData.ts';
import { RepositoryItem } from '../data/repoCatalog.ts';

export type ActiveTab = 'dashboard' | 'curriculum' | 'repos' | 'harness' | 'media' | 'gemini' | 'workspace';

interface TopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onTriggerSynthesize: () => void;
  onOpenPicker?: () => void;
  onExportDocx?: () => void;
  onExportPdf?: () => void;
  onOpenFeatureFlags?: () => void;
  isOffline?: boolean;
  useNormalizedHours?: boolean;
  hourMetricMode?: HourMetricMode;
  onToggleNormalizedHours?: () => void;
  modules?: CurriculumModule[];
  repositories?: RepositoryItem[];
  onSelectModule?: (mod: CurriculumModule) => void;
  onInspectRepo?: (repo: RepositoryItem) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onSignIn,
  onSignOut,
  onTriggerSynthesize,
  onOpenPicker,
  onExportDocx,
  onExportPdf,
  onOpenFeatureFlags,
  isOffline = false,
  useNormalizedHours = false,
  hourMetricMode = 'audited',
  onToggleNormalizedHours,
  modules = [],
  repositories = [],
  onSelectModule,
  onInspectRepo,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: '/' or 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter modules
  const q = searchQuery.trim().toLowerCase();
  const matchedModules = q
    ? modules.filter(
        (m) =>
          m.id.toLowerCase().includes(q) ||
          m.title.toLowerCase().includes(q) ||
          m.goal.toLowerCase().includes(q) ||
          m.stage.toLowerCase().includes(q) ||
          m.stageName.toLowerCase().includes(q) ||
          m.coreKeywords.some((k) => k.toLowerCase().includes(q)) ||
          m.keyTools?.some((t) => t.toLowerCase().includes(q))
      ).slice(0, 5)
    : [];

  // Filter repositories
  const matchedRepos = q
    ? repositories.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.module.toLowerCase().includes(q) ||
          r.harnessLayer.toLowerCase().includes(q) ||
          r.keywords.some((k) => k.toLowerCase().includes(q))
      ).slice(0, 6)
    : [];

  const hasMatches = matchedModules.length > 0 || matchedRepos.length > 0;

  const handleSelectModuleResult = (mod: CurriculumModule) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (onSelectModule) {
      onSelectModule(mod);
    } else {
      setActiveTab('curriculum');
    }
  };

  const handleSelectRepoResult = (repo: RepositoryItem) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (onInspectRepo) {
      onInspectRepo(repo);
    } else {
      setActiveTab('repos');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-left font-mono text-sm tracking-tight hover:text-sky-400 transition"
          >
            <span className="font-bold text-white">Curriculum 70</span>
            <span className="text-slate-500 font-normal mx-1.5">//</span>
            <span className="text-slate-300 font-normal hidden sm:inline">7,200h Systems Lab</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 font-mono text-xs text-slate-400">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2 py-1.5 transition flex items-center space-x-1 ${
              activeTab === 'dashboard'
                ? 'text-white border-b-2 border-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-sky-400" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-2 py-1.5 transition ${
              activeTab === 'curriculum'
                ? 'text-white border-b-2 border-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Curriculum
          </button>
          <button
            onClick={() => setActiveTab('repos')}
            className={`px-2 py-1.5 transition ${
              activeTab === 'repos'
                ? 'text-white border-b-2 border-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Repo Stacks
          </button>
          <button
            onClick={() => setActiveTab('harness')}
            className={`px-2 py-1.5 transition ${
              activeTab === 'harness'
                ? 'text-white border-b-2 border-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Higher Harness
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-2 py-1.5 transition ${
              activeTab === 'media'
                ? 'text-white border-b-2 border-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Lectures &amp; Books
          </button>
          <button
            onClick={() => setActiveTab('gemini')}
            className={`px-2 py-1.5 transition ${
              activeTab === 'gemini'
                ? 'text-sky-300 border-b-2 border-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Gemini Lab
          </button>
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-2 py-1.5 transition ${
              activeTab === 'workspace'
                ? 'text-white border-b-2 border-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Workspace
          </button>
        </nav>

        {/* Zone 3: Global Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xs md:max-w-sm">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search modules & repos (e.g. Haystack, Robusta, NM28)..."
              className="w-full pl-8 pr-12 py-1.5 bg-slate-900 border border-slate-700/80 rounded-md text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2 text-slate-400 hover:text-slate-200 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-2 px-1 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-800 rounded border border-slate-700 pointer-events-none">
                /
              </span>
            )}
          </div>

          {/* Search Dropdown / Autocomplete Results */}
          {isSearchOpen && q && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/98 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
              {!hasMatches ? (
                <div className="p-4 text-center text-xs font-mono text-slate-400">
                  No matching modules or repositories found for &ldquo;<span className="text-sky-300">{searchQuery}</span>&rdquo;
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {/* Modules Section */}
                  {matchedModules.length > 0 && (
                    <div className="p-2">
                      <div className="px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Curriculum Modules ({matchedModules.length})</span>
                        <span className="text-[9px] text-slate-500">Jump to module</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {matchedModules.map((mod) => (
                          <button
                            key={mod.id}
                            onClick={() => handleSelectModuleResult(mod)}
                            className="w-full text-left px-2.5 py-2 rounded-md hover:bg-slate-800/80 transition flex items-start justify-between gap-2 group"
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 px-1.5 py-0.2 rounded border border-sky-800/50">
                                  {mod.id}
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">{mod.stage}</span>
                                <span className="text-xs font-medium text-slate-200 truncate group-hover:text-white">
                                  {mod.title}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1">{mod.goal}</p>
                              {mod.keyTools && (
                                <div className="flex flex-wrap gap-1 pt-0.5">
                                  {mod.keyTools.slice(0, 3).map((tool) => (
                                    <span key={tool} className="text-[9px] font-mono text-amber-300 bg-amber-950/50 px-1 rounded border border-amber-800/30">
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="shrink-0 flex items-center space-x-1 text-slate-500 group-hover:text-sky-400">
                              <span className="text-[10px] font-mono">{mod.hours}h</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Repositories Section */}
                  {matchedRepos.length > 0 && (
                    <div className="p-2">
                      <div className="px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Repositories &amp; Tools ({matchedRepos.length})</span>
                        <span className="text-[9px] text-slate-500">Inspect study guide</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {matchedRepos.map((repo) => (
                          <button
                            key={repo.id}
                            onClick={() => handleSelectRepoResult(repo)}
                            className="w-full text-left px-2.5 py-2 rounded-md hover:bg-slate-800/80 transition flex items-start justify-between gap-2 group"
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-mono font-bold text-emerald-400 truncate group-hover:text-emerald-300">
                                  {repo.name}
                                </span>
                                <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-800/40">
                                  {repo.module}
                                </span>
                                {repo.stars > 0 && (
                                  <span className="flex items-center space-x-0.5 text-[10px] font-mono text-amber-400">
                                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                                    <span>{repo.stars.toLocaleString()}</span>
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-1">{repo.description}</p>
                              <div className="text-[10px] font-mono text-slate-500">
                                {repo.harnessLayer}
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center text-slate-500 group-hover:text-emerald-400 pt-1">
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone 4: Primary Actions & Authentication */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Offline Indicator Badge */}
          {isOffline && (
            <span
              className="flex items-center space-x-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-1 rounded text-[11px] font-mono animate-pulse"
              title="Application is currently offline. Cached modules & repositories remain fully searchable via Service Worker."
            >
              <WifiOff className="w-3 h-3" />
              <span className="hidden md:inline">Offline (Cached)</span>
            </span>
          )}

          {/* Accounting Horizon Mode Indicator Button */}
          {onToggleNormalizedHours && (
            <button
              onClick={onToggleNormalizedHours}
              className={`hidden lg:flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-mono border transition ${
                hourMetricMode === 'audited'
                  ? 'bg-sky-950/60 text-sky-300 border-sky-500/40 font-bold'
                  : hourMetricMode === 'core'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-purple-950/60 text-purple-300 border-purple-500/40 font-bold'
              }`}
              title="Cycle between 12,600h Audited Lifecycle, 7,200h Core Milestone, and 69,168h Normalized Trajectory"
            >
              <Gauge className="w-3 h-3 text-sky-400" />
              <span>
                {hourMetricMode === 'audited'
                  ? '12.6k h (Audited)'
                  : hourMetricMode === 'core'
                  ? '7.2k h (Core)'
                  : '69k h (Norm)'}
              </span>
            </button>
          )}

          {/* Feature Flags & Modular Code Manager */}
          {onOpenFeatureFlags && (
            <button
              onClick={onOpenFeatureFlags}
              className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 px-2.5 py-1.5 rounded text-xs font-mono border border-cyan-500/30 hover:border-cyan-500/50 transition shadow-sm"
              title="Toggle features ON/OFF and copy implementation code to expand the app"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Features</span>
            </button>
          )}

          {/* Export PDF Progress Report Action */}
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="flex items-center space-x-1.5 bg-cyan-700/40 hover:bg-cyan-600/50 text-cyan-300 px-2.5 py-1.5 rounded text-xs font-mono border border-cyan-500/40 transition shadow-sm"
              title="Download executive progress report in PDF format using jsPDF"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold text-cyan-300">Export .pdf</span>
            </button>
          )}

          {/* Export .docx action */}
          {onExportDocx && (
            <button
              onClick={onExportDocx}
              className="flex items-center space-x-1.5 bg-emerald-700/40 hover:bg-emerald-600/50 text-emerald-300 px-2.5 py-1.5 rounded text-xs font-mono border border-emerald-500/40 transition shadow-sm"
              title="Download full curriculum syllabus in Word (.docx) format"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-emerald-300">Export .docx</span>
            </button>
          )}

          {/* Quick Drive Picker button */}
          <button
            onClick={onOpenPicker ? onOpenPicker : () => setActiveTab('workspace')}
            className="hidden sm:flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-sky-300 px-2.5 py-1.5 rounded text-xs font-mono border border-slate-800 hover:border-slate-700 transition"
            title="Open Google Drive with Google Picker"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Drive Picker</span>
          </button>

          <button
            onClick={onTriggerSynthesize}
            className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Synthesize Track</span>
            <span className="sm:hidden">AI Lab</span>
          </button>

          {user ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-6 h-6 rounded-full border border-slate-700"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 font-mono">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <span className="text-xs text-slate-300 font-mono hidden 2xl:inline max-w-[100px] truncate">
                {user.displayName || user.email}
              </span>
              <button
                onClick={onSignOut}
                title="Sign out of Google Workspace"
                className="text-slate-400 hover:text-slate-200 p-1"
                aria-label="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center space-x-1.5 bg-white text-slate-800 hover:bg-slate-100 px-2.5 py-1 rounded text-xs font-medium border border-slate-300 transition"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
