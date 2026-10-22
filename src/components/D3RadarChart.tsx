import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { CurriculumModule } from '../data/curriculumData.ts';
import {
  Radar,
  Award,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export interface EngineeringDomainProficiency {
  id: string; // e.g. D01
  label: string;
  category: string;
  currentScore: number; // 0 - 10
  targetScore: number; // 0 - 10
  leadPersona: string;
  associatedModules: string[];
  description: string;
}

interface D3RadarChartProps {
  modules: CurriculumModule[];
  onSelectModule?: (moduleId: string) => void;
  height?: number;
}

export const D3RadarChart: React.FC<D3RadarChartProps> = ({
  modules,
  onSelectModule,
  height = 420,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredDomain, setHoveredDomain] = useState<EngineeringDomainProficiency | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<EngineeringDomainProficiency | null>(null);
  const [showTarget, setShowTarget] = useState<boolean>(true);

  // Compute dynamic domain proficiencies based on module completions
  const domainProficiencies: EngineeringDomainProficiency[] = useMemo(() => {
    const isCompleted = (id: string) => modules.some((m) => m.id === id && m.completionStatus === 'completed');
    const isInProgress = (id: string) => modules.some((m) => m.id === id && m.completionStatus === 'in_progress');

    const scoreForModules = (ids: string[], baseMin = 2.5): number => {
      let score = baseMin;
      ids.forEach((id) => {
        if (isCompleted(id)) score += 3.2;
        else if (isInProgress(id)) score += 1.4;
      });
      return Math.min(10, Math.round(score * 10) / 10);
    };

    return [
      {
        id: 'D01',
        label: 'DL Foundations',
        category: 'Core Machine Learning',
        currentScore: scoreForModules(['NM21', 'NM22', 'NM24'], 3.2),
        targetScore: 9.2,
        leadPersona: 'Yoshua Bengio & Yann LeCun',
        associatedModules: ['NM21', 'NM22', 'NM24'],
        description: 'Representation learning, autograd graph differentiation, and loss manifolds.',
      },
      {
        id: 'D02',
        label: 'Vision & Spatial AI',
        category: 'Perception & Geometry',
        currentScore: scoreForModules(['NM24', 'NM54'], 3.0),
        targetScore: 8.8,
        leadPersona: 'Fei-Fei Li',
        associatedModules: ['NM24', 'NM54'],
        description: 'Computer vision, persistent geometric representations, and 3D world models.',
      },
      {
        id: 'D03',
        label: 'LLM Scaling & MoE',
        category: 'Generative Systems',
        currentScore: scoreForModules(['NM25', 'NM26'], 3.5),
        targetScore: 9.4,
        leadPersona: 'Quoc V. Le & Damai Dai',
        associatedModules: ['NM25', 'NM26'],
        description: 'Transformers, tokenization, Mixture-of-Experts routing, and scaling laws.',
      },
      {
        id: 'D04',
        label: 'Kernels & Quantization',
        category: 'Performance Acceleration',
        currentScore: scoreForModules(['NM34', 'NM37'], 2.8),
        targetScore: 9.6,
        leadPersona: 'Tri Dao, Tim Dettmers & Song Han',
        associatedModules: ['NM34', 'NM37'],
        description: 'FlashAttention Triton kernels, FP4/FP8 microscaling, and AWQ/GPTQ.',
      },
      {
        id: 'D05',
        label: 'Algorithms & Rigour',
        category: 'Computer Science Core',
        currentScore: scoreForModules(['NM02'], 4.5),
        targetScore: 9.8,
        leadPersona: 'Donald Knuth & Edsger Dijkstra',
        associatedModules: ['NM02'],
        description: 'Discrete reasoning, amortized analysis, and graph theory proofs.',
      },
      {
        id: 'D06',
        label: 'OS, Linux & Systems',
        category: 'Infrastructure',
        currentScore: scoreForModules(['NM01', 'NM08'], 5.0),
        targetScore: 9.9,
        leadPersona: 'Linus Torvalds',
        associatedModules: ['NM01', 'NM08'],
        description: 'POSIX system calls, memory-mapped I/O, cgroups, and container sandboxing.',
      },
      {
        id: 'D07',
        label: 'Database Systems',
        category: 'Storage Engineering',
        currentScore: scoreForModules(['NM04', 'NM07'], 4.0),
        targetScore: 9.0,
        leadPersona: 'Michael Stonebraker',
        associatedModules: ['NM04', 'NM07'],
        description: 'WAL, transactions, columnar storage, B+trees, and vector indexing.',
      },
      {
        id: 'D08',
        label: 'Distributed Systems',
        category: 'Scale Architecture',
        currentScore: scoreForModules(['NM17', 'NM19'], 3.2),
        targetScore: 9.5,
        leadPersona: 'Jeff Dean',
        associatedModules: ['NM17', 'NM19'],
        description: 'MapReduce, consensus protocols, streaming pipelines, and fault recovery.',
      },
      {
        id: 'D10',
        label: 'Computer Architecture',
        category: 'Hardware Systems',
        currentScore: scoreForModules(['NM32', 'NM48'], 2.4),
        targetScore: 9.2,
        leadPersona: 'John Hennessy & David Patterson',
        associatedModules: ['NM32', 'NM48'],
        description: 'Out-of-order execution, memory hierarchies, and NPU co-design.',
      },
      {
        id: 'D12',
        label: 'GPU Fabric & RDMA',
        category: 'Interconnect & Collectives',
        currentScore: scoreForModules(['NM43'], 2.0),
        targetScore: 9.4,
        leadPersona: 'Bill Dally & Michael Kagan',
        associatedModules: ['NM43'],
        description: 'NVLink, InfiniBand, NCCL ring all-reduce, and RoCE v2 collective communication.',
      },
      {
        id: 'D13',
        label: 'Compilers & MLIR',
        category: 'Toolchain Optimization',
        currentScore: scoreForModules(['NM48'], 2.2),
        targetScore: 9.1,
        leadPersona: 'Chris Lattner & Tianqi Chen',
        associatedModules: ['NM48'],
        description: 'LLVM intermediate representations, MLIR dialect lowering, and TVM/Ansor tuning.',
      },
      {
        id: 'D18',
        label: 'Classical ML & Ensembles',
        category: 'Statistical Learning',
        currentScore: scoreForModules(['NM22', 'NM23'], 4.2),
        targetScore: 9.5,
        leadPersona: 'Zhi-Hua Zhou',
        associatedModules: ['NM22', 'NM23'],
        description: 'Gradient boosting, causal inference, conformal prediction, and calibration.',
      },
    ];
  }, [modules]);

  // Render D3 SVG Radar
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const size = Math.min(width, height);
    const radius = size / 2 - 45;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('class', 'overflow-visible select-none');

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const numAxes = domainProficiencies.length;
    const angleSlice = (Math.PI * 2) / numAxes;

    // Define gradients & filters
    const defs = svg.append('defs');

    // Radar fill gradient
    const fillGradient = defs
      .append('radialGradient')
      .attr('id', 'radarFillGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');

    fillGradient.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4').attr('stop-opacity', 0.55);
    fillGradient.append('stop').attr('offset', '70%').attr('stop-color', '#10b981').attr('stop-opacity', 0.35);
    fillGradient.append('stop').attr('offset', '100%').attr('stop-color', '#0284c7').attr('stop-opacity', 0.15);

    // Glow filter
    const filter = defs.append('filter').attr('id', 'radarGlow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    filter.append('feMerge').selectAll('feMergeNode').data(['blur', 'SourceGraphic']).enter().append('feMergeNode').attr('in', (d) => d);

    // Circular concentric grid levels (20%, 40%, 60%, 80%, 100%)
    const levels = [2, 4, 6, 8, 10];
    levels.forEach((lvl) => {
      const lvlRadius = (radius / 10) * lvl;

      // Draw polygon outline for each level
      const points = domainProficiencies.map((_, i) => {
        const x = lvlRadius * Math.sin(angleSlice * i);
        const y = -lvlRadius * Math.cos(angleSlice * i);
        return [x, y];
      });

      g.append('polygon')
        .attr('points', points.map((p) => p.join(',')).join(' '))
        .attr('fill', 'none')
        .attr('stroke', lvl === 10 ? '#475569' : '#334155')
        .attr('stroke-dasharray', lvl === 10 ? 'none' : '2,3')
        .attr('stroke-width', lvl === 10 ? 1.2 : 0.8)
        .attr('stroke-opacity', 0.6);

      // Level percentage label
      g.append('text')
        .attr('x', 4)
        .attr('y', -lvlRadius + 3)
        .attr('fill', '#64748b')
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
        .text(`${lvl * 10}%`);
    });

    // Draw Axis Spokes and Axis Labels
    domainProficiencies.forEach((d, i) => {
      const angle = angleSlice * i;
      const x = radius * Math.sin(angle);
      const y = -radius * Math.cos(angle);

      // Spoke line
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', '#334155')
        .attr('stroke-width', 0.9)
        .attr('stroke-opacity', 0.7);

      // Label coordinate with extra outward padding
      const labelRadius = radius + 22;
      const lx = labelRadius * Math.sin(angle);
      const ly = -labelRadius * Math.cos(angle);

      const textAnchor = Math.abs(x) < 5 ? 'middle' : x > 0 ? 'start' : 'end';

      const labelGroup = g
        .append('g')
        .attr('class', 'cursor-pointer')
        .on('mouseenter', () => setHoveredDomain(d))
        .on('click', () => setSelectedDomain(d));

      labelGroup
        .append('text')
        .attr('x', lx)
        .attr('y', ly - 2)
        .attr('text-anchor', textAnchor)
        .attr('fill', '#e2e8f0')
        .attr('font-size', '9.5px')
        .attr('font-weight', '600')
        .attr('font-family', 'system-ui, sans-serif')
        .text(d.label);

      labelGroup
        .append('text')
        .attr('x', lx)
        .attr('y', ly + 8)
        .attr('text-anchor', textAnchor)
        .attr('fill', '#38bdf8')
        .attr('font-size', '8.5px')
        .attr('font-family', 'monospace')
        .text(`${d.currentScore.toFixed(1)}/10`);
    });

    // Target polygon (optional reference)
    if (showTarget) {
      const targetCoords = domainProficiencies.map((d, i) => {
        const r = (radius / 10) * d.targetScore;
        const x = r * Math.sin(angleSlice * i);
        const y = -r * Math.cos(angleSlice * i);
        return [x, y];
      });

      g.append('polygon')
        .attr('points', targetCoords.map((c) => c.join(',')).join(' '))
        .attr('fill', '#a855f7')
        .attr('fill-opacity', 0.08)
        .attr('stroke', '#c084fc')
        .attr('stroke-width', 1.2)
        .attr('stroke-dasharray', '3,3')
        .attr('stroke-opacity', 0.7);
    }

    // Actual Student Proficiency Polygon
    const actualCoords = domainProficiencies.map((d, i) => {
      const r = (radius / 10) * d.currentScore;
      const x = r * Math.sin(angleSlice * i);
      const y = -r * Math.cos(angleSlice * i);
      return [x, y];
    });

    // Filled Polygon
    g.append('polygon')
      .attr('points', actualCoords.map((c) => c.join(',')).join(' '))
      .attr('fill', 'url(#radarFillGradient)')
      .attr('stroke', '#06b6d4')
      .attr('stroke-width', 2.2)
      .attr('filter', 'url(#radarGlow)')
      .attr('class', 'transition-all duration-300');

    // Interactive Node Dots on Actual Polygon
    domainProficiencies.forEach((d, i) => {
      const r = (radius / 10) * d.currentScore;
      const x = r * Math.sin(angleSlice * i);
      const y = -r * Math.cos(angleSlice * i);

      const dot = g
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 4.5)
        .attr('fill', '#10b981')
        .attr('stroke', '#0f172a')
        .attr('stroke-width', 1.8)
        .attr('class', 'cursor-pointer transition-transform duration-200 hover:scale-150')
        .on('mouseenter', () => setHoveredDomain(d))
        .on('click', () => setSelectedDomain(d));
    });

    // Center pulse dot
    g.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 2.5).attr('fill', '#38bdf8');
  }, [domainProficiencies, height, showTarget]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-sm relative overflow-hidden">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Radar className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                Core Engineering Domains Radar
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                D01 - D18 Framework
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live proficiency scan synthesized across modules, kernel optimizations & 133 persona benchmarks
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowTarget(!showTarget)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center space-x-1.5 ${
              showTarget
                ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Target Benchmark</span>
          </button>
        </div>
      </div>

      {/* Radar SVG Container */}
      <div ref={containerRef} className="w-full flex items-center justify-center relative min-h-[360px]">
        <svg ref={svgRef} className="w-full h-auto max-w-[540px]" />

        {/* Floating Tooltip when Hovering */}
        {hoveredDomain && (
          <div className="absolute bottom-2 left-2 right-2 sm:right-auto sm:max-w-xs bg-slate-950/95 border border-cyan-500/40 rounded-lg p-3 text-xs shadow-2xl backdrop-blur-md pointer-events-none z-20 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
              <span className="font-mono font-bold text-cyan-400">{hoveredDomain.id} • {hoveredDomain.label}</span>
              <span className="font-bold text-emerald-400">{hoveredDomain.currentScore.toFixed(1)} / 10</span>
            </div>
            <div className="text-[11px] text-slate-300 mb-1">{hoveredDomain.description}</div>
            <div className="text-[10px] text-slate-400">
              <span className="text-slate-500">Lead Persona:</span> <span className="text-slate-300 font-medium">{hoveredDomain.leadPersona}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              <span className="text-slate-500">Host Modules:</span> <span className="font-mono text-cyan-300">{hoveredDomain.associatedModules.join(', ')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Domain Drilldown Drawer */}
      {selectedDomain && (
        <div className="mt-4 p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                {selectedDomain.id}
              </span>
              <span className="font-bold text-white text-sm">{selectedDomain.label}</span>
              <span className="text-slate-400 font-mono">({selectedDomain.category})</span>
            </div>
            <button
              onClick={() => setSelectedDomain(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800"
            >
              Close
            </button>
          </div>
          <p className="text-slate-300 mt-2">{selectedDomain.description}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="text-slate-400">Associated Curriculum Modules:</span>
            {selectedDomain.associatedModules.map((modId) => (
              <button
                key={modId}
                onClick={() => onSelectModule && onSelectModule(modId)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/40 text-cyan-300 font-mono transition-all flex items-center space-x-1"
              >
                <span>{modId}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Legend & Normalization Hint */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-1 rounded bg-cyan-400 inline-block" />
            <span>Current Student Level</span>
          </div>
          {showTarget && (
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-1 rounded bg-purple-400 border-dashed inline-block" />
              <span>Target Benchmark (85%+)</span>
            </div>
          )}
        </div>
        <div className="text-slate-500 text-[10px]">
          Normalized to B62 O3x 133 persona scale (0-10)
        </div>
      </div>
    </div>
  );
};
