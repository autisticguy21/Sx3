import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CurriculumModule } from '../data/curriculumData.ts';
import { REPOSITORY_DATABASE } from '../data/repoCatalog.ts';
import {
  Bell,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface EngagementReengagementNotifierProps {
  modules: CurriculumModule[];
  onSelectModule: (moduleId: string) => void;
  // Threshold in ms (defaults to 24 hours = 86,400,000 ms)
  inactivityThresholdMs?: number;
}

const STORAGE_LAST_ACTIVE_KEY = 'b69_last_engagement_timestamp';
const STORAGE_SNOOZE_UNTIL_KEY = 'b69_reengagement_snooze_until';

export const EngagementReengagementNotifier: React.FC<EngagementReengagementNotifierProps> = ({
  modules,
  onSelectModule,
  inactivityThresholdMs = 24 * 60 * 60 * 1000, // 24 hours default
}) => {
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [elapsedHours, setElapsedHours] = useState<number>(0);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  // Identify highest-priority uncompleted high-correlation module
  const suggestedModule = useMemo(() => {
    // Priority order for high correlation: NM28 (Bounded Agents), NM26 (Serving APIs), NM37 (Quantization), NM25 (Transformers), NM24 (Autograd), NM34 (Triton)
    const priorityIds = ['NM28', 'NM26', 'NM37', 'NM25', 'NM24', 'NM34', 'NM07', 'NM04'];
    const uncompleted = modules.filter((m) => m.completionStatus !== 'completed');

    for (const pid of priorityIds) {
      const match = uncompleted.find((m) => m.id === pid);
      if (match) return match;
    }

    // Fallback: earliest in_progress or not_started
    return uncompleted.find((m) => m.completionStatus === 'in_progress') || uncompleted[0] || modules[0];
  }, [modules]);

  // Correlated repos for the suggested module
  const correlatedRepoCount = useMemo(() => {
    if (!suggestedModule) return 0;
    return REPOSITORY_DATABASE.filter((r) => r.module === suggestedModule.id).length;
  }, [suggestedModule]);

  const recordActivity = () => {
    try {
      if (!isSimulated) {
        localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, Date.now().toString());
      }
    } catch {
      // Ignore localStorage errors
    }
  };

  // Periodic check
  useEffect(() => {
    const checkInactivity = () => {
      try {
        const snoozeUntil = localStorage.getItem(STORAGE_SNOOZE_UNTIL_KEY);
        if (snoozeUntil && Date.now() < parseInt(snoozeUntil, 10)) {
          setShowNotification(false);
          return;
        }

        const lastActiveStr = localStorage.getItem(STORAGE_LAST_ACTIVE_KEY);
        const lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : Date.now();
        const diff = Date.now() - lastActive;

        if (diff >= inactivityThresholdMs) {
          setElapsedHours(Math.round(diff / (1000 * 60 * 60)));
          setShowNotification(true);

          // Trigger browser notification if permitted
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('Frontier AI Curriculum: 24h Study Re-engagement', {
                body: `You haven't engaged in over 24 hours. Resume ${suggestedModule?.id || 'curriculum'}: ${suggestedModule?.title || 'Next milestone'}.`,
                icon: '/favicon.ico',
              });
            } catch {
              // Ignore notification error
            }
          }
        }
      } catch {
        // Ignore errors
      }
    };

    // Initial check
    checkInactivity();

    // Check every 60 seconds
    const interval = setInterval(checkInactivity, 60000);

    // Track user engagement events
    const handleUserInteraction = () => {
      recordActivity();
    };

    window.addEventListener('click', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [inactivityThresholdMs, isSimulated, suggestedModule]);

  const handleSnooze = (hours: number = 2) => {
    try {
      localStorage.setItem(STORAGE_SNOOZE_UNTIL_KEY, (Date.now() + hours * 3600000).toString());
    } catch {
      // Ignore
    }
    setShowNotification(false);
  };

  const handleSimulate24Hours = () => {
    setIsSimulated(true);
    setElapsedHours(28);
    setShowNotification(true);
  };

  const handleResumeModule = () => {
    recordActivity();
    setShowNotification(false);
    setIsSimulated(false);
    if (suggestedModule) {
      onSelectModule(suggestedModule.id);
    }
  };

  if (!showNotification || !suggestedModule) {
    return (
      <div className="fixed bottom-3 right-3 z-30">
        <button
          onClick={handleSimulate24Hours}
          title="Test 24h Inactivity Re-engagement Notification"
          className="px-2.5 py-1 text-[10px] font-mono bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-700/80 rounded-md shadow-lg transition-all flex items-center space-x-1 backdrop-blur-sm"
        >
          <Bell className="w-3 h-3 text-cyan-400" />
          <span>Simulate &gt;24h Inactivity</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-50 max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-slate-900/95 border-2 border-cyan-500/60 rounded-xl p-4 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow corner decoration */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  24h Inactivity Re-engagement
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {elapsedHours > 0 ? `${elapsedHours}h Inactive` : '24h+ Idle'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Maintain curriculum momentum with a high-correlation uncompleted module:
              </p>
            </div>
          </div>
          <button
            onClick={() => handleSnooze(1)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
            title="Dismiss / Snooze"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Module Card */}
        <div className="mt-3 p-3 rounded-lg bg-slate-950/80 border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold">
              {suggestedModule.id} • {suggestedModule.stage}
            </span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{suggestedModule.hours}h</span>
            </span>
          </div>

          <h4 className="font-bold text-sm text-white mt-1.5 line-clamp-1">
            {suggestedModule.title}
          </h4>

          <p className="text-xs text-slate-300 mt-1 line-clamp-2">
            {suggestedModule.goal}
          </p>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>
              <strong className="text-cyan-300">{correlatedRepoCount}</strong> matched repositories (70%+ overlap)
            </span>
            <span className="font-mono text-slate-500">
              {suggestedModule.keyTools.slice(0, 2).join(', ')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 flex items-center justify-between gap-2">
          <button
            onClick={() => handleSnooze(2)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
          >
            Snooze 2h
          </button>

          <button
            onClick={handleResumeModule}
            className="flex-1 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5"
          >
            <span>Resume Module</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
