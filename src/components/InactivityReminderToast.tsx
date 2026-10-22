import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Clock,
  Play,
  X,
  Volume2,
  VolumeX,
  Flame,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { CurriculumModule } from '../data/curriculumData.ts';

interface InactivityReminderToastProps {
  activeModule?: CurriculumModule | null;
  onResumeStudy?: (module?: CurriculumModule) => void;
  // Inactivity threshold in milliseconds (defaults to 20 minutes = 1,200,000 ms)
  timeoutMs?: number;
}

export const InactivityReminderToast: React.FC<InactivityReminderToastProps> = ({
  activeModule,
  onResumeStudy,
  timeoutMs = 20 * 60 * 1000, // 20 minutes default
}) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [inactiveSeconds, setInactiveSeconds] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const lastActivityRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<any>(null);

  // Synthesize gentle notification chime with Web Audio API (zero external assets)
  const playChime = () => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio autoplay policy or unavailable
    }
  };

  // Fire system notification if granted
  const triggerBrowserNotification = (modName: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Time to Resume Your Curriculum Session! 📚', {
          body: `You have been inactive for over 20 minutes. Keep up your momentum on ${modName}!`,
          icon: '/favicon.ico',
        });
      } catch {
        // Ignore notification errors
      }
    }
  };

  // Listen for user activity
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      if (!isTriggered) {
        setInactiveSeconds(0);
      }
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((ev) => window.addEventListener(ev, handleActivity, { passive: true }));

    // Check timer every 10 seconds
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      setInactiveSeconds(Math.floor(elapsed / 1000));

      if (elapsed >= timeoutMs && !isTriggered) {
        setIsTriggered(true);
        playChime();
        const targetTitle = activeModule ? `${activeModule.id}: ${activeModule.title}` : 'your curriculum track';
        triggerBrowserNotification(targetTitle);
      }
    }, 5000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleActivity));
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timeoutMs, isTriggered, activeModule, audioEnabled]);

  const handleRequestNotification = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationPermission(perm);
        if (perm === 'granted') {
          triggerBrowserNotification(activeModule?.title || 'B69 Curriculum');
        }
      } catch {
        // ignore
      }
    }
  };

  const handleResume = () => {
    setIsTriggered(false);
    lastActivityRef.current = Date.now();
    setInactiveSeconds(0);
    if (onResumeStudy) {
      onResumeStudy(activeModule || undefined);
    }
  };

  const handleSnooze = (minutes: number = 5) => {
    setIsTriggered(false);
    // Push last activity into future so it triggers again in X minutes
    lastActivityRef.current = Date.now() - (timeoutMs - minutes * 60 * 1000);
    setInactiveSeconds(0);
  };

  const handleDismiss = () => {
    setIsTriggered(false);
    lastActivityRef.current = Date.now();
    setInactiveSeconds(0);
  };

  // Manual test trigger for instantaneous demonstration
  const handleSimulate20mInactivity = () => {
    setIsTriggered(true);
    setInactiveSeconds(20 * 60 + 12);
    playChime();
    triggerBrowserNotification(activeModule ? `${activeModule.id}: ${activeModule.title}` : 'B69 Curriculum');
  };

  return (
    <>
      {/* Subtle Dev / Demo trigger badge in Curriculum Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSimulate20mInactivity}
          className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-amber-400/90 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 transition flex items-center gap-1"
          title="Test the 20-minute inactivity notification and reminder toast system immediately"
        >
          <Clock className="w-3 h-3 text-amber-400" />
          <span>Test 20m Inactivity Toast</span>
        </button>

        {notificationPermission === 'default' && (
          <button
            onClick={handleRequestNotification}
            className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/90 text-sky-400 hover:text-sky-300 border border-slate-800 hover:border-sky-500/40 transition flex items-center gap-1"
            title="Enable browser notifications for study resumption alerts"
          >
            <Bell className="w-3 h-3 text-sky-400" />
            <span>Enable Desktop Alerts</span>
          </button>
        )}
      </div>

      {/* Floating Inactivity Reminder Toast Banner */}
      {isTriggered && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md w-full p-4 bg-slate-950/95 border-2 border-amber-500/60 rounded-2xl shadow-2xl shadow-amber-950/40 backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 text-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 animate-bounce">
                <Clock className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Study Session Inactivity Detected
                  </h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    &gt;20m Away
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">
                  You have been away for {Math.floor(inactiveSeconds / 60)} minutes. Maintain cognitive momentum on{' '}
                  <span className="font-semibold text-amber-300">
                    {activeModule ? `${activeModule.id}: ${activeModule.title}` : 'your curriculum target'}
                  </span>
                  .
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-900 transition"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <button
                onClick={handleResume}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold font-mono transition shadow-md shadow-emerald-950/50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Focus Session</span>
              </button>

              <button
                onClick={() => handleSnooze(5)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono border border-slate-800 transition"
              >
                Snooze 5m
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-1.5 rounded text-slate-400 hover:text-slate-200 transition"
                title={audioEnabled ? 'Mute notification sound' : 'Unmute notification sound'}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {notificationPermission !== 'granted' && (
                <button
                  onClick={handleRequestNotification}
                  className="p-1.5 rounded text-slate-400 hover:text-sky-300 transition"
                  title="Enable native desktop notifications"
                >
                  <Bell className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
