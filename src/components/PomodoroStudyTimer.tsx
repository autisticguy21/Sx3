import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  Timer,
  Zap,
} from 'lucide-react';
import { CurriculumModule, ModuleCompletionStatus } from '../data/curriculumData.ts';

interface PomodoroStudyTimerProps {
  activeModule: CurriculumModule;
  modules: CurriculumModule[];
  onSelectModule: (mod: CurriculumModule) => void;
  onTriggerGeminiSynthesis: (mod: CurriculumModule, synthesisPrompt: string) => void;
  onUpdateModuleStatus: (moduleId: string, status: ModuleCompletionStatus) => void;
}

const STORAGE_POMODORO_KEY = 'b69_pomodoro_study_telemetry';

export const PomodoroStudyTimer: React.FC<PomodoroStudyTimerProps> = ({
  activeModule,
  modules,
  onSelectModule,
  onTriggerGeminiSynthesis,
  onUpdateModuleStatus,
}) => {
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState<boolean>(false);
  const [totalStudySecondsForModule, setTotalStudySecondsForModule] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load accumulated study time for active module
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_POMODORO_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, number>;
        setTotalStudySecondsForModule(parsed[activeModule.id] || 0);
      } else {
        setTotalStudySecondsForModule(0);
      }
    } catch (e) {
      console.warn(e);
    }
  }, [activeModule.id]);

  // Handle countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsRunning(false);
            setSessionCompleted(true);
            saveCompletedMinutes(selectedDurationMinutes);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, selectedDurationMinutes]);

  const saveCompletedMinutes = (minutes: number) => {
    try {
      const stored = localStorage.getItem(STORAGE_POMODORO_KEY);
      const parsed: Record<string, number> = stored ? JSON.parse(stored) : {};
      const currentSeconds = parsed[activeModule.id] || 0;
      const updatedSeconds = currentSeconds + minutes * 60;
      parsed[activeModule.id] = updatedSeconds;
      localStorage.setItem(STORAGE_POMODORO_KEY, JSON.stringify(parsed));
      setTotalStudySecondsForModule(updatedSeconds);
    } catch (e) {
      console.warn('Failed to save study time', e);
    }
  };

  const handleStartPause = () => {
    if (!isRunning && activeModule.completionStatus === 'not_started') {
      onUpdateModuleStatus(activeModule.id, 'in_progress');
    }
    setIsRunning(!isRunning);
  };

  const handleReset = (newMinutes = selectedDurationMinutes) => {
    setIsRunning(false);
    setSelectedDurationMinutes(newMinutes);
    setSecondsRemaining(newMinutes * 60);
    setSessionCompleted(false);
  };

  const handleFinishEarly = () => {
    setIsRunning(false);
    setSessionCompleted(true);
    const elapsedMinutes = Math.max(1, Math.round((selectedDurationMinutes * 60 - secondsRemaining) / 60));
    saveCompletedMinutes(elapsedMinutes);
  };

  // Format time MM:SS
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const totalDurationSeconds = selectedDurationMinutes * 60;
  const progressPercent = Math.min(100, Math.round(((totalDurationSeconds - secondsRemaining) / totalDurationSeconds) * 100));

  // Generate tailored Gemini synthesis prompt
  const generatedSynthesisPrompt = `[CURRICULUM SYNTHESIS & MASTERY AUDIT]
Module: ${activeModule.id} - ${activeModule.title} (Stage ${activeModule.stage}: ${activeModule.stageName})
Target Curriculum Hours: ${activeModule.hours}h
Focused Study Session Duration: ${selectedDurationMinutes} minutes completed.

Key Frameworks & Tools In Scope:
${(activeModule.keyTools || ['Standard systems primitives']).join(', ')}

Demanded Learning Objectives:
${(activeModule.learningObjectives || [activeModule.goal]).map((o, idx) => `${idx + 1}. ${o}`).join('\n')}

Core Keywords & Primitives:
${activeModule.coreKeywords.join(' · ')}

Required Synthesis Deliverables:
1. Architectural Blueprint & Mathematical Invariants: Detail key data structures, state machines, and concurrency barriers.
2. Production Pitfalls & Hard Edge Cases: Highlight numerical instabilities, deadlock conditions, and memory leak vectors.
3. Cross-Language Reproduction Strategy: Map Python primitives directly into memory-safe Rust or low-overhead C++20.
4. Three Rigorous Self-Assessment Mastery Questions: Test deep systems mechanics and protocol contracts.`;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedSynthesisPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const totalLoggedMinutes = Math.round(totalStudySecondsForModule / 60);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
      {/* Header with active module picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-sky-400">POMODORO STUDY TIMER</span>
              <span className="text-[10px] font-mono text-slate-500">·</span>
              <span className="text-[10px] font-mono text-emerald-400">
                {totalLoggedMinutes > 0 ? `${totalLoggedMinutes}m total logged` : 'Session ready'}
              </span>
            </div>
            <div className="text-xs text-slate-300">
              Track focused execution on specific modules with Gemini synthesis output.
            </div>
          </div>
        </div>

        {/* Module Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsModuleDropdownOpen(!isModuleDropdownOpen)}
            className="flex items-center space-x-2 bg-slate-950 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-200 transition"
          >
            <span className="text-sky-400 font-bold">{activeModule.id}</span>
            <span className="max-w-[140px] truncate text-slate-300">{activeModule.title}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {isModuleDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-800">
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    onSelectModule(m);
                    setIsModuleDropdownOpen(false);
                    handleReset();
                  }}
                  className={`w-full text-left p-2.5 hover:bg-slate-800 text-xs font-mono transition flex items-center justify-between ${
                    m.id === activeModule.id ? 'bg-slate-800/60 text-white' : 'text-slate-300'
                  }`}
                >
                  <div className="truncate">
                    <span className="text-sky-400 font-bold mr-1.5">{m.id}</span>
                    <span>{m.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{m.hours}h</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Timer Display & Presets */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Big Time readout & controls */}
        <div className="md:col-span-6 flex flex-col items-center justify-center bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
          <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-white mb-2">
            {timeFormatted}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                sessionCompleted ? 'bg-emerald-400' : isRunning ? 'bg-sky-400' : 'bg-slate-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleStartPause}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-mono font-semibold transition ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{progressPercent > 0 ? 'Resume' : 'Start Focus'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleReset(selectedDurationMinutes)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition border border-slate-700"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleFinishEarly}
              disabled={progressPercent === 0}
              className="flex items-center space-x-1 bg-emerald-600/30 hover:bg-emerald-600/50 disabled:opacity-40 text-emerald-300 border border-emerald-500/40 px-3 py-2 rounded-lg text-xs font-mono transition"
              title="Finish session and synthesize summary prompt"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Complete &amp; Synthesize</span>
            </button>
          </div>
        </div>

        {/* Presets & Module Scope details */}
        <div className="md:col-span-6 space-y-3">
          {/* Preset buttons */}
          <div className="flex items-center space-x-2">
            {[
              { label: '25m Pomodoro', mins: 25 },
              { label: '50m Deep Work', mins: 50 },
              { label: '5m Short Break', mins: 5 },
            ].map((p) => (
              <button
                key={p.mins}
                onClick={() => handleReset(p.mins)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono transition text-center ${
                  selectedDurationMinutes === p.mins
                    ? 'bg-slate-800 text-sky-400 font-semibold border border-sky-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Module scope info */}
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800/80 text-xs font-mono space-y-1">
            <div className="text-slate-400 flex items-center justify-between">
              <span>Target Module:</span>
              <span className="text-sky-400 font-bold">{activeModule.id} ({activeModule.hours}h)</span>
            </div>
            <div className="text-slate-200 font-medium truncate">{activeModule.title}</div>
            {activeModule.keyTools && activeModule.keyTools.length > 0 && (
              <div className="flex items-center space-x-1 pt-1">
                <span className="text-slate-500 text-[10px]">Tools:</span>
                <div className="flex flex-wrap gap-1">
                  {activeModule.keyTools.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] text-amber-300 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/40">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Synthesis Prompt Output Modal / Drawer when completed */}
      {sessionCompleted && (
        <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span className="font-bold">STUDY SESSION COMPLETED — GEMINI SYNTHESIS PROMPT GENERATED</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyPrompt}
                className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs font-mono border border-slate-700 transition"
              >
                {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPrompt ? 'Copied!' : 'Copy Prompt'}</span>
              </button>
              <button
                onClick={() => onTriggerGeminiSynthesis(activeModule, generatedSynthesisPrompt)}
                className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1 rounded text-xs font-medium font-mono transition shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Gemini Synthesis</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
            {generatedSynthesisPrompt}
          </div>

          {/* Module status advancement quick actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-mono text-slate-400">
            <span>Update module status:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateModuleStatus(activeModule.id, 'in_progress')}
                className="px-2.5 py-1 rounded bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-800/50 transition"
              >
                Keep In-Progress
              </button>
              <button
                onClick={() => onUpdateModuleStatus(activeModule.id, 'completed')}
                className="px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/50 transition flex items-center space-x-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Module Completed</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
