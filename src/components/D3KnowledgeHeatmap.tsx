import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Calendar,
  Flame,
  Zap,
  Info,
  Clock,
  RotateCcw,
  PlusCircle,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { CurriculumModule } from '../data/curriculumData.ts';

interface D3KnowledgeHeatmapProps {
  modules: CurriculumModule[];
  onSelectTrack?: (stageId: string) => void;
}

interface ActivityCell {
  dateStr: string;
  dayIndex: number;
  stageId: string;
  stageName: string;
  hours: number;
  sessionsCount: number;
  concepts: string[];
}

const STAGES = [
  { id: 'N0', name: 'Systems Foundations', modules: ['NM01', 'NM02', 'NM04'] },
  { id: 'N1', name: 'Data Infrastructure', modules: ['NM07', 'NM08'] },
  { id: 'N3', name: 'Distributed Systems', modules: ['NM17', 'NM19'] },
  { id: 'N4', name: 'Core ML & Transformers', modules: ['NM21', 'NM22', 'NM23', 'NM24', 'NM25'] },
  { id: 'N5', name: 'Serving & Bounded Agents', modules: ['NM26', 'NM27', 'NM28'] },
  { id: 'N6', name: 'CUDA & Triton Kernels', modules: ['NM32', 'NM34'] },
  { id: 'N7', name: 'KV Paging & Quantization', modules: ['NM36', 'NM37', 'NM40'] },
  { id: 'N8', name: 'Multi-GPU Parallelism', modules: ['NM43'] },
  { id: 'N9', name: 'Compilers & MLIR', modules: ['NM48'] },
  { id: 'N10', name: 'World Models & Cyber-Physical', modules: ['NM54'] },
  { id: 'N11', name: 'Research & Capstone Review', modules: ['NM56', 'NM60'] },
];

export const D3KnowledgeHeatmap: React.FC<D3KnowledgeHeatmapProps> = ({
  modules,
  onSelectTrack,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedCell, setSelectedCell] = useState<ActivityCell | null>(null);
  const [extraSessions, setExtraSessions] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('b69_simulated_activity_bump');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Generate 30 days from 29 days ago until today
  const daysList = useMemo(() => {
    const list: { dateStr: string; label: string; fullDate: Date; dayOfWeek: string }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const label = `${monthNames[d.getMonth()]} ${d.getDate()}`;
      list.push({
        dateStr,
        label,
        fullDate: d,
        dayOfWeek: dayNames[d.getDay()],
      });
    }
    return list;
  }, []);

  // Compute activity grid data combining completed curriculum baseline and stored pomodoro sessions
  const gridData = useMemo(() => {
    // Read logged pomodoro sessions from localStorage
    let storedSessions: any[] = [];
    try {
      const raw = localStorage.getItem('b69_pomodoro_sessions');
      if (raw) storedSessions = JSON.parse(raw);
    } catch {
      // ignore
    }

    const cells: ActivityCell[] = [];

    // Deterministic pseudo-random based on string hash for smooth baseline activity distribution
    const hashStr = (s: string) => {
      let h = 0;
      for (let i = 0; i < s.length; i++) {
        h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
      }
      return Math.abs(h);
    };

    STAGES.forEach((stage) => {
      const stageModules = modules.filter((m) => m.stage === stage.id);
      const hasCompleted = stageModules.some((m) => m.completionStatus === 'completed');
      const hasInProgress = stageModules.some((m) => m.completionStatus === 'in_progress');

      daysList.forEach((day, dayIndex) => {
        // Base seed density
        const hash = hashStr(`${stage.id}-${day.dateStr}`);
        const isWeekend = day.dayOfWeek === 'Sat' || day.dayOfWeek === 'Sun';

        let hours = 0;
        let sessions = 0;

        // Stages with completed modules (N0, N1, N4) have sustained baseline activity
        if (hasCompleted) {
          if (hash % 10 > (isWeekend ? 4 : 2)) {
            hours = 1.5 + ((hash % 35) / 10);
            sessions = 1 + (hash % 3);
          }
        } else if (hasInProgress) {
          // In progress stages (N3, N5) have active recent spikes
          if (dayIndex > 14 && hash % 10 > 4) {
            hours = 1.0 + ((hash % 25) / 10);
            sessions = 1 + (hash % 2);
          }
        } else {
          // Other stages have occasional exploratory sessions
          if (hash % 20 === 0) {
            hours = 0.8;
            sessions = 1;
          }
        }

        // Add stored sessions if any match date and stage
        storedSessions.forEach((s) => {
          if (s.date && s.date.startsWith(day.dateStr)) {
            const mod = modules.find((m) => m.id === s.moduleId);
            if (mod && mod.stage === stage.id) {
              hours += (s.durationMinutes || 25) / 60;
              sessions += 1;
            }
          }
        });

        // Add bump if on today
        if (dayIndex === 29 && extraSessions > 0) {
          if (stage.id === 'N5' || stage.id === 'N4') {
            hours += extraSessions * 0.8;
            sessions += extraSessions;
          }
        }

        hours = Math.round(hours * 10) / 10;

        cells.push({
          dateStr: day.dateStr,
          dayIndex,
          stageId: stage.id,
          stageName: stage.name,
          hours,
          sessionsCount: sessions,
          concepts: stageModules.flatMap((m) => m.coreKeywords.slice(0, 3)),
        });
      });
    });

    return cells;
  }, [daysList, modules, extraSessions]);

  // Total summary metrics
  const totalHours30Days = useMemo(() => {
    return Math.round(gridData.reduce((acc, c) => acc + c.hours, 0) * 10) / 10;
  }, [gridData]);

  const activeDaysCount = useMemo(() => {
    const activeDates = new Set(gridData.filter((c) => c.hours > 0).map((c) => c.dateStr));
    return activeDates.size;
  }, [gridData]);

  // Color mapping based on hours
  const getCellColor = (hours: number): string => {
    if (hours <= 0) return '#090d16'; // empty dark
    if (hours < 1.5) return '#0e7490'; // light cyan
    if (hours < 3.0) return '#0284c7'; // sky blue
    if (hours < 4.5) return '#10b981'; // emerald green
    if (hours < 6.0) return '#f59e0b'; // amber
    return '#ec4899'; // vibrant pink / deep focus
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 30, right: 20, bottom: 25, left: 190 };
    const cellWidth = 24;
    const cellHeight = 22;
    const cellGap = 3;

    const width = margin.left + daysList.length * (cellWidth + cellGap) + margin.right;
    const height = margin.top + STAGES.length * (cellHeight + cellGap) + margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', '100%');

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Day labels (top headers every 5 days + Today)
    daysList.forEach((day, i) => {
      if (i % 5 === 0 || i === daysList.length - 1) {
        g.append('text')
          .attr('x', i * (cellWidth + cellGap) + cellWidth / 2)
          .attr('y', -10)
          .attr('text-anchor', 'middle')
          .attr('fill', i === daysList.length - 1 ? '#38bdf8' : '#64748b')
          .attr('font-size', '10px')
          .attr('font-family', 'ui-monospace, monospace')
          .attr('font-weight', i === daysList.length - 1 ? 'bold' : 'normal')
          .text(i === daysList.length - 1 ? 'Today' : day.label);
      }
    });

    // Stage Row Labels (left axis)
    STAGES.forEach((stage, i) => {
      const textGroup = svg
        .append('g')
        .attr('transform', `translate(15, ${margin.top + i * (cellHeight + cellGap) + cellHeight / 2 + 3.5})`)
        .style('cursor', 'pointer')
        .on('click', () => onSelectTrack && onSelectTrack(stage.id));

      textGroup
        .append('text')
        .attr('fill', '#94a3b8')
        .attr('font-size', '11px')
        .attr('font-family', 'ui-monospace, monospace')
        .attr('font-weight', '500')
        .text(`${stage.id}: ${stage.name}`);
    });

    // Draw Heatmap Cells
    gridData.forEach((cell) => {
      const stageIndex = STAGES.findIndex((s) => s.id === cell.stageId);
      if (stageIndex === -1) return;

      const x = cell.dayIndex * (cellWidth + cellGap);
      const y = stageIndex * (cellHeight + cellGap);
      const color = getCellColor(cell.hours);

      const cellRect = g
        .append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('fill', color)
        .attr('stroke', cell.hours > 0 ? `${color}40` : '#1e293b')
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .style('transition', 'all 0.15s ease-in-out');

      // Interactivity hover
      cellRect
        .on('mouseenter', function () {
          d3.select(this)
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.6))');
          setSelectedCell(cell);
        })
        .on('mouseleave', function () {
          d3.select(this)
            .attr('stroke', cell.hours > 0 ? `${color}40` : '#1e293b')
            .attr('stroke-width', 1)
            .style('filter', 'none');
        })
        .on('click', function () {
          setSelectedCell(cell);
          if (onSelectTrack) onSelectTrack(cell.stageId);
        });
    });
  }, [daysList, gridData, onSelectTrack]);

  const handleSimulateSession = () => {
    const next = extraSessions + 1;
    setExtraSessions(next);
    try {
      localStorage.setItem('b69_simulated_activity_bump', String(next));
    } catch {
      // ignore
    }
  };

  const handleResetActivity = () => {
    setExtraSessions(0);
    try {
      localStorage.removeItem('b69_simulated_activity_bump');
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Calendar className="w-5 h-5" />
            </span>
            <h3 className="text-base font-semibold text-white tracking-wide">
              30-Day Curriculum Knowledge Heatmap
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
              D3 Activity Density
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual density matrix tracking focused study hours, session frequencies, and skill absorption across curriculum tracks over the last 30 days.
          </p>
        </div>

        {/* Telemetry quick stats */}
        <div className="flex items-center gap-4 shrink-0 text-xs font-mono">
          <div className="px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400">30D Focus:</span>{' '}
            <span className="font-bold text-sky-400">{totalHours30Days}h</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-slate-400">Active Days:</span>{' '}
            <span className="font-bold text-emerald-400">{activeDaysCount} / 30</span>
          </div>
        </div>
      </div>

      {/* D3 SVG Canvas */}
      <div className="w-full overflow-x-auto pb-1">
        <div className="min-w-[1000px]">
          <svg ref={svgRef} className="w-full h-auto" />
        </div>
      </div>

      {/* Footer Legend and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
        {/* Color Scale Legend */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-400">Activity Density:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#090d16] border border-slate-800" />
            <span className="text-slate-400">0h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#0e7490]" />
            <span className="text-slate-300">&lt;1.5h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#0284c7]" />
            <span className="text-slate-300">1.5 - 3h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#10b981]" />
            <span className="text-slate-300">3 - 4.5h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#f59e0b]" />
            <span className="text-slate-300">4.5 - 6h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#ec4899]" />
            <span className="text-pink-300 font-semibold">&gt;6h Deep Focus</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSimulateSession}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-950 text-sky-300 hover:bg-sky-900 border border-sky-800/60 transition"
            title="Log an active study session today to test live density updates"
          >
            <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Simulate Today Session</span>
          </button>
          {extraSessions > 0 && (
            <button
              onClick={handleResetActivity}
              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              title="Reset simulated session additions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Selected Cell Details Drawer */}
      {selectedCell && (
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getCellColor(selectedCell.hours) }}
            />
            <span className="font-bold text-slate-200">
              {selectedCell.dateStr} · {selectedCell.stageId} ({selectedCell.stageName})
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-300">
              ⏱️ {selectedCell.hours} Hours Studied
            </span>
            <span className="text-slate-400">
              🎯 {selectedCell.sessionsCount} Focus Sessions
            </span>
            {onSelectTrack && (
              <button
                onClick={() => onSelectTrack(selectedCell.stageId)}
                className="text-sky-400 hover:text-sky-300 font-medium underline flex items-center gap-0.5"
              >
                Inspect Track Modules <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
