import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout } from './lib/firebase.ts';
import { TopBar, ActiveTab } from './components/TopBar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { CurriculumView } from './components/CurriculumView.tsx';
import { RepoMatrixView } from './components/RepoMatrixView.tsx';
import { HarnessStackView } from './components/HarnessStackView.tsx';
import { MediaLibraryView } from './components/MediaLibraryView.tsx';
import { GeminiLabView } from './components/GeminiLabView.tsx';
import { WorkspaceExportView } from './components/WorkspaceExportView.tsx';
import { RepoStudyGuideModal } from './components/RepoStudyGuideModal.tsx';
import { EngagementReengagementNotifier } from './components/EngagementReengagementNotifier.tsx';
import { FeatureFlagsModal } from './components/FeatureFlagsModal.tsx';
import {
  CURRICULUM_MODULES,
  CurriculumModule,
  ModuleCompletionStatus,
  HourMetricMode,
  AUDITED_LIFECYCLE_HOURS,
  CORE_MILESTONE_HOURS,
  NORMALIZED_LIFETIME_HOURS,
} from './data/curriculumData.ts';
import { REPOSITORY_DATABASE, RepositoryItem } from './data/repoCatalog.ts';
import { PickedFile } from './lib/googlePicker.ts';
import { downloadCurriculumDocx } from './lib/docxExport.ts';
import { downloadProgressReportPdf } from './lib/pdfExport.ts';

const STORAGE_KEY = 'b69_curriculum_modules_progress_v3';
const FEATURE_FLAGS_KEY = 'b69_feature_flags';
const HOUR_MODE_KEY = 'b69_hour_metric_mode';
const NORMALIZED_HOURS_KEY = 'b69_normalized_hours';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Offline detection state
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });

  // Hour accounting mode: 'audited' (12,600h) | 'core' (7,200h) | 'normalized' (69,168h)
  const [hourMetricMode, setHourMetricMode] = useState<HourMetricMode>(() => {
    try {
      const saved = localStorage.getItem(HOUR_MODE_KEY);
      if (saved === 'audited' || saved === 'core' || saved === 'normalized') {
        return saved as HourMetricMode;
      }
      const legacyNorm = localStorage.getItem(NORMALIZED_HOURS_KEY);
      if (legacyNorm === 'true') return 'normalized';
    } catch {
      // ignore
    }
    return 'audited';
  });

  const useNormalizedHours = hourMetricMode === 'normalized';

  // Feature flags state
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(FEATURE_FLAGS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isFeatureFlagsOpen, setIsFeatureFlagsOpen] = useState<boolean>(false);

  // Persistent modules with completion status
  const [modules, setModules] = useState<CurriculumModule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { id: string; completionStatus: ModuleCompletionStatus }[];
        return CURRICULUM_MODULES.map((base) => {
          const match = parsed.find((p) => p.id === base.id);
          return match ? { ...base, completionStatus: match.completionStatus } : base;
        });
      }
    } catch (e) {
      console.warn('Failed to load curriculum progress from storage', e);
    }
    return CURRICULUM_MODULES;
  });

  // Cross-component communication state
  const [geminiModuleTarget, setGeminiModuleTarget] = useState<CurriculumModule | null>(null);
  const [geminiVerifyRepoTarget, setGeminiVerifyRepoTarget] = useState<RepositoryItem | null>(null);
  const [geminiPromptTarget, setGeminiPromptTarget] = useState<string | null>(null);
  const [matrixInitialModule, setMatrixInitialModule] = useState<string>('ALL');

  // Global Study Guide modal state
  const [inspectedRepo, setInspectedRepo] = useState<RepositoryItem | null>(null);

  // Listen to online / offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  const handleUpdateModuleStatus = (moduleId: string, status: ModuleCompletionStatus) => {
    setModules((prev) => {
      const updated = prev.map((m) => (m.id === moduleId ? { ...m, completionStatus: status } : m));
      try {
        const toSave = updated.map((m) => ({ id: m.id, completionStatus: m.completionStatus }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      } catch (e) {
        console.warn('Failed to save progress to localStorage', e);
      }
      return updated;
    });
  };

  const handleResetToBaseline = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear progress', e);
    }
    setModules(CURRICULUM_MODULES);
  };

  const handleSetHourMetricMode = (mode: HourMetricMode) => {
    setHourMetricMode(mode);
    try {
      localStorage.setItem(HOUR_MODE_KEY, mode);
      localStorage.setItem(NORMALIZED_HOURS_KEY, (mode === 'normalized').toString());
    } catch {
      // Ignore
    }
  };

  const handleToggleNormalizedHours = () => {
    setHourMetricMode((prev) => {
      const next: HourMetricMode = prev === 'audited' ? 'core' : prev === 'core' ? 'normalized' : 'audited';
      try {
        localStorage.setItem(HOUR_MODE_KEY, next);
        localStorage.setItem(NORMALIZED_HOURS_KEY, (next === 'normalized').toString());
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const handleToggleFeature = (featureId: string) => {
    setFeatureFlags((prev) => {
      const updated = {
        ...prev,
        [featureId]: prev[featureId] === false ? true : false,
      };
      try {
        localStorage.setItem(FEATURE_FLAGS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const handleResetFeatureFlags = () => {
    try {
      localStorage.removeItem(FEATURE_FLAGS_KEY);
    } catch {
      // Ignore
    }
    setFeatureFlags({});
  };

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
  const handleSelectModuleForSynthesis = (mod: CurriculumModule, promptText?: string) => {
    setGeminiModuleTarget(mod);
    if (promptText) {
      setGeminiPromptTarget(promptText);
    }
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

  const handleSynthesizeStack = () => {
    setActiveTab('gemini');
  };

  const handleTopBarSynthesize = () => {
    setActiveTab('gemini');
  };

  const handleExportDocx = () => {
    downloadCurriculumDocx(modules, REPOSITORY_DATABASE);
  };

  const handleExportPdf = () => {
    downloadProgressReportPdf(modules, REPOSITORY_DATABASE, {
      useNormalizedHours: hourMetricMode === 'normalized',
      hourMetricMode,
      targetHours: hourMetricMode === 'normalized' ? 69168 : hourMetricMode === 'audited' ? 12600 : 7200,
    });
  };

  const handleAnalyzePickedFile = (_file: PickedFile) => {
    setActiveTab('gemini');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Offline Alert Strip */}
      {isOffline && (
        <div className="bg-amber-600/90 text-slate-950 px-4 py-1.5 text-center text-xs font-mono font-bold flex items-center justify-center space-x-2 shadow-sm z-50">
          <span>Offline Mode Active • Service Worker Cache enabled • Curriculum (25 modules) &amp; Catalog (442+ repos) fully searchable</span>
        </div>
      )}

      {/* Global Repo Study Guide Modal */}
      <RepoStudyGuideModal
        repo={inspectedRepo}
        isOpen={Boolean(inspectedRepo)}
        onClose={() => setInspectedRepo(null)}
        onTriggerGeminiAnalysis={handleVerifyRepo}
      />

      {/* Feature Flags & Modular Code Manager Modal */}
      <FeatureFlagsModal
        isOpen={isFeatureFlagsOpen}
        onClose={() => setIsFeatureFlagsOpen(false)}
        features={featureFlags}
        onToggleFeature={handleToggleFeature}
        onResetDefaults={handleResetFeatureFlags}
      />

      {/* 24h Inactivity Re-engagement Notifier */}
      {featureFlags.inactivity_notifier !== false && (
        <EngagementReengagementNotifier
          modules={modules}
          onSelectModule={(modId) => {
            setMatrixInitialModule(modId);
            setActiveTab('curriculum');
          }}
        />
      )}

      {/* Top Bar with Global Search and Navigation */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onTriggerSynthesize={handleTopBarSynthesize}
        onOpenPicker={() => setActiveTab('workspace')}
        onExportDocx={handleExportDocx}
        onExportPdf={handleExportPdf}
        onOpenFeatureFlags={() => setIsFeatureFlagsOpen(true)}
        isOffline={isOffline}
        useNormalizedHours={useNormalizedHours}
        hourMetricMode={hourMetricMode}
        onToggleNormalizedHours={handleToggleNormalizedHours}
        modules={modules}
        repositories={REPOSITORY_DATABASE}
        onSelectModule={(mod) => {
          setMatrixInitialModule(mod.id);
          setActiveTab('curriculum');
        }}
        onInspectRepo={(repo) => setInspectedRepo(repo)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            modules={modules}
            onUpdateModuleStatus={handleUpdateModuleStatus}
            onNavigateToModule={(modId) => {
              setMatrixInitialModule(modId);
              setActiveTab('curriculum');
            }}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onInspectRepo={(repo) => setInspectedRepo(repo)}
            onResetBaseline={handleResetToBaseline}
            onOpenFeatureFlags={() => setIsFeatureFlagsOpen(true)}
            useNormalizedHours={useNormalizedHours}
            onToggleNormalizedHours={handleToggleNormalizedHours}
            hourMetricMode={hourMetricMode}
            onSetHourMetricMode={handleSetHourMetricMode}
            featureFlags={featureFlags}
          />
        )}

        {activeTab === 'curriculum' && (
          <CurriculumView
            modules={modules}
            onUpdateModuleStatus={handleUpdateModuleStatus}
            onSelectModuleForSynthesis={handleSelectModuleForSynthesis}
            onExploreModuleRepos={handleExploreModuleRepos}
            onInspectRepo={(repo) => setInspectedRepo(repo)}
            onResetBaseline={handleResetToBaseline}
            hourMetricMode={hourMetricMode}
          />
        )}

        {activeTab === 'repos' && (
          <RepoMatrixView
            initialModuleId={matrixInitialModule}
            onVerifyRepo={handleVerifyRepo}
            onTriggerGeminiAnalysis={handleVerifyRepo}
          />
        )}

        {activeTab === 'harness' && (
          <HarnessStackView
            onSynthesizeStack={handleSynthesizeStack}
            onInspectRepo={(repo) => setInspectedRepo(repo)}
          />
        )}

        {activeTab === 'media' && <MediaLibraryView />}

        {activeTab === 'gemini' && (
          <GeminiLabView
            initialModule={geminiModuleTarget}
            initialVerifyRepo={geminiVerifyRepoTarget}
            initialPrompt={geminiPromptTarget}
            onClearInitialVerify={() => setGeminiVerifyRepoTarget(null)}
          />
        )}

        {activeTab === 'workspace' && (
          <WorkspaceExportView
            user={user}
            accessToken={accessToken}
            onSignIn={handleSignIn}
            onAnalyzeFileInGemini={handleAnalyzePickedFile}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            B69 Curriculum Intelligence //{' '}
            {hourMetricMode === 'audited'
              ? '12,600h Full Audited Production Lifecycle'
              : hourMetricMode === 'normalized'
              ? '69,168h Normalized Trajectory (Uncapped)'
              : '7,200h Systems Milestone'}{' '}
            · &gt;=70% Correlation
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
            <span>D3 Radar &amp; Pathway Map</span>
            <span>·</span>
            <span>D3 Knowledge Heatmap</span>
            <span>·</span>
            <span>PDF &amp; DOCX Exporter</span>
            <span>·</span>
            <span>Big Tech 4k+ Canonical Stacks</span>
            <span>·</span>
            <span>Offline PWA Service Worker</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
