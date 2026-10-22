import React, { useMemo } from 'react';
import { CurriculumModule } from '../data/curriculumData.ts';
import { Award, Zap, Clock, ShieldCheck } from 'lucide-react';

interface ModuleProficiencyGaugeProps {
  module: CurriculumModule;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  extraMinutes?: number;
}

export function computeModuleProficiency(
  module: CurriculumModule,
  extraMinutes: number = 0
): {
  percent: number;
  tier: 'Mastery Tier' | 'Proficient' | 'Competent' | 'Apprentice' | 'Foundational';
  color: string;
  minutesSpent: number;
  targetHours: number;
} {
  // Read logged pomodoro sessions from localStorage
  let storedMinutes = 0;
  try {
    const raw = localStorage.getItem('b69_pomodoro_sessions');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const matching = parsed.filter((s: any) => s.moduleId === module.id);
        storedMinutes = matching.reduce((sum: number, s: any) => sum + (s.durationMinutes || 0), 0);
      }
    }
  } catch (e) {
    // Ignore storage parse errors
  }

  const totalMinutes = storedMinutes + extraMinutes;

  // Base competency from status
  let baseScore = 6;
  if (module.completionStatus === 'completed') {
    baseScore = 78;
  } else if (module.completionStatus === 'in_progress') {
    baseScore = 36;
  }

  // Bonus from active study minutes
  // 100 minutes of focused pomodoro study = ~7% competency boost
  const timeBonus = Math.min(22, Math.round((totalMinutes / 60) * 4.5));

  const rawPercent = Math.min(100, Math.max(5, baseScore + timeBonus));

  let tier: 'Mastery Tier' | 'Proficient' | 'Competent' | 'Apprentice' | 'Foundational' = 'Foundational';
  let color = '#94a3b8'; // Slate

  if (rawPercent >= 88) {
    tier = 'Mastery Tier';
    color = '#10b981'; // Emerald
  } else if (rawPercent >= 70) {
    tier = 'Proficient';
    color = '#38bdf8'; // Sky
  } else if (rawPercent >= 40) {
    tier = 'Competent';
    color = '#f59e0b'; // Amber
  } else if (rawPercent >= 20) {
    tier = 'Apprentice';
    color = '#fb923c'; // Orange
  }

  return {
    percent: rawPercent,
    tier,
    color,
    minutesSpent: totalMinutes,
    targetHours: module.hours,
  };
}

export const ModuleProficiencyGauge: React.FC<ModuleProficiencyGaugeProps> = ({
  module,
  size = 'md',
  showLabel = true,
  extraMinutes = 0,
}) => {
  const { percent, tier, color, minutesSpent, targetHours } = useMemo(
    () => computeModuleProficiency(module, extraMinutes),
    [module, extraMinutes]
  );

  // Dimensions based on size
  const dimensions = {
    sm: { box: 38, strokeWidth: 3.5, r: 15, fontSize: 'text-[9px]' },
    md: { box: 64, strokeWidth: 5, r: 25, fontSize: 'text-xs' },
    lg: { box: 96, strokeWidth: 7, r: 38, fontSize: 'text-base' },
  }[size];

  const circumference = 2 * Math.PI * dimensions.r;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: dimensions.box, height: dimensions.box }}
      >
        <svg
          className="w-full h-full -rotate-90 transform"
          viewBox={`0 0 ${dimensions.box} ${dimensions.box}`}
        >
          {/* Background Track */}
          <circle
            cx={dimensions.box / 2}
            cy={dimensions.box / 2}
            r={dimensions.r}
            className="stroke-slate-800"
            strokeWidth={dimensions.strokeWidth}
            fill="transparent"
          />
          {/* Animated Radial Progress Arc */}
          <circle
            cx={dimensions.box / 2}
            cy={dimensions.box / 2}
            r={dimensions.r}
            stroke={color}
            strokeWidth={dimensions.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
            style={{
              filter: percent >= 70 ? `drop-shadow(0 0 4px ${color}88)` : 'none',
            }}
          />
        </svg>

        {/* Center Percentage */}
        <span
          className={`absolute font-mono font-bold text-slate-100 ${dimensions.fontSize}`}
        >
          {percent}%
        </span>
      </div>

      {showLabel && size !== 'sm' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className="text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded"
              style={{
                backgroundColor: `${color}15`,
                color: color,
                border: `1px solid ${color}40`,
              }}
            >
              {tier}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
            {minutesSpent > 0 ? `${Math.round(minutesSpent)}m logged` : 'Baseline'} · {targetHours}h goal
          </span>
        </div>
      )}
    </div>
  );
};
