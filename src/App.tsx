import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, getAccessToken } from './lib/firebase.ts';
import { TopBar, ActiveTab } from './components/TopBar.tsx';
import { CurriculumView } from './components/CurriculumView.tsx';
import { RepoMatrixView } from './components/RepoMatrixView.tsx';
import { HarnessStackView } from './components/HarnessStackView.tsx';
import { MediaLibraryView } from './components/MediaLibraryView.tsx';
import { GeminiLabView } from './components/GeminiLabView.tsx';
import { WorkspaceExportView } from './components/WorkspaceExportView.tsx';
import { CurriculumModule } from './data/curriculumData.ts';
import { RepositoryItem } from './data/repoCatalog.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('curriculum');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Cross-component communication state
  const [geminiModuleTarget, setGeminiModuleTarget] = useState<CurriculumModule | null>(null);
  const [geminiVerifyRepoTarget, setGeminiVerifyRepoTarget] = useState<RepositoryItem | null>(null);
  const [matrixInitialModule, setMatrixInitialModule] = useState<string>('ALL');

  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      },
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (err) {
      console.error('Sign-in failed:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  // Cross-tab handlers
  const handleSelectModuleForSynthesis = (mod: CurriculumModule) => {
    setGeminiModuleTarget(mod);
    setActiveTab('gemini');
  };

  const handleExploreModuleRepos = (moduleId: string) => {
    setMatrixInitialModule(moduleId);
    setActiveTab('repos');
  };

  const handleVerifyRepo = (repo: RepositoryItem) => {
    setGeminiVerifyRepoTarget(repo);
    setActiveTab('gemini');
  };

  const handleSynthesizeStack = (stackSummary: string) => {
    setActiveTab('gemini');
  };

  const handleTopBarSynthesize = () => {
    setActiveTab('gemini');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Bar matching contract */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onTriggerSynthesize={handleTopBarSynthesize}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'curriculum' && (
          <CurriculumView
            onSelectModuleForSynthesis={handleSelectModuleForSynthesis}
            onExploreModuleRepos={handleExploreModuleRepos}
          />
        )}

        {activeTab === 'repos' && (
          <RepoMatrixView
            initialModuleId={matrixInitialModule}
            onVerifyRepo={handleVerifyRepo}
          />
        )}

        {activeTab === 'harness' && (
          <HarnessStackView
            onSynthesizeStack={handleSynthesizeStack}
          />
        )}

        {activeTab === 'media' && (
          <MediaLibraryView />
        )}

        {activeTab === 'gemini' && (
          <GeminiLabView
            initialModule={geminiModuleTarget}
            initialVerifyRepo={geminiVerifyRepoTarget}
            onClearInitialVerify={() => setGeminiVerifyRepoTarget(null)}
          />
        )}

        {activeTab === 'workspace' && (
          <WorkspaceExportView
            user={user}
            accessToken={accessToken}
            onSignIn={handleSignIn}
          />
        )}
      </main>

      {/* Editorial System Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>B69 Curriculum &amp; Higher Harness Platform</span>
            <span className="mx-2 text-slate-700">·</span>
            <span>7,200h Engineering Scope</span>
            <span className="mx-2 text-slate-700">·</span>
            <span>544+ Ingested Repositories</span>
          </div>
          <div className="text-slate-600">
            Powered by Gemini 4 Argon, Gemini 3.8 Flash &amp; Google Workspace
          </div>
        </div>
      </footer>
    </div>
  );
}
