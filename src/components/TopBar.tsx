import React from 'react';
import { User } from 'firebase/auth';
import { Sparkles, LogOut, Check } from 'lucide-react';

export type ActiveTab = 'curriculum' | 'repos' | 'harness' | 'media' | 'gemini' | 'workspace';

interface TopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onTriggerSynthesize: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onSignIn,
  onSignOut,
  onTriggerSynthesize,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setActiveTab('curriculum')}
            className="text-left font-mono text-sm tracking-tight hover:text-sky-400 transition"
          >
            <span className="font-bold text-white">Curriculum 70</span>
            <span className="text-slate-500 font-normal mx-1.5">//</span>
            <span className="text-slate-300 font-normal">Repo &amp; Media Intelligence</span>
          </button>
        </div>

        {/* Zone 2: Single-line nav links */}
        <nav className="hidden md:flex items-center space-x-1 font-mono text-xs text-slate-400">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-3 py-1.5 transition ${
              activeTab === 'curriculum'
                ? 'text-white border-b-2 border-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Curriculum
          </button>
          <button
            onClick={() => setActiveTab('repos')}
            className={`px-3 py-1.5 transition ${
              activeTab === 'repos'
                ? 'text-white border-b-2 border-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Repo Stacks
          </button>
          <button
            onClick={() => setActiveTab('harness')}
            className={`px-3 py-1.5 transition ${
              activeTab === 'harness'
                ? 'text-white border-b-2 border-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Higher Harness
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-3 py-1.5 transition ${
              activeTab === 'media'
                ? 'text-white border-b-2 border-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Lectures &amp; Books
          </button>
          <button
            onClick={() => setActiveTab('gemini')}
            className={`px-3 py-1.5 transition ${
              activeTab === 'gemini'
                ? 'text-sky-300 border-b-2 border-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Gemini Lab
          </button>
          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1.5 transition ${
              activeTab === 'workspace'
                ? 'text-white border-b-2 border-sky-400 font-medium'
                : 'hover:text-slate-200'
            }`}
          >
            Workspace Export
          </button>
        </nav>

        {/* Zone 3: Primary Action & Authentication */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={onTriggerSynthesize}
            className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 rounded text-xs font-medium transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Synthesize Study Track</span>
            <span className="sm:hidden">Synthesize</span>
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
              <span className="text-xs text-slate-300 font-mono hidden lg:inline max-w-[120px] truncate">
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
              className="flex items-center space-x-2 bg-white text-slate-800 hover:bg-slate-100 px-3 py-1 rounded text-xs font-medium border border-slate-300 transition"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span className="hidden sm:inline">Sign in with Google</span>
              <span className="sm:hidden">Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
