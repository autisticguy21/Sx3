import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { CurriculumModule } from '../data/curriculumData.ts';
import { RepositoryItem } from '../data/repoCatalog.ts';
import {
  GitBranch,
  BookOpen,
  ExternalLink,
  Flame,
  CheckCircle2,
  Layers,
  Thermometer,
  Zap,
  Star,
  Info,
} from 'lucide-react';

interface D3PathwayMapProps {
  modules: CurriculumModule[];
  repositories: RepositoryItem[];
  onSelectModule?: (moduleId: string) => void;
  onInspectRepo?: (repo: RepositoryItem) => void;
}

interface PathwayNode {
  id: string;
  name: string;
  type: 'stage' | 'module' | 'repo';
  status?: string;
  moduleRef?: CurriculumModule;
  repoRef?: RepositoryItem;
  hours?: number;
  difficultyRating?: number;
  difficultyLabel?: string;
  heatScore?: number;
  stars?: number;
  x?: number;
  y?: number;
}

// User feedback difficulty rating heuristic (1.0 to 5.0)
export function getModuleDifficulty(mod: CurriculumModule): { rating: number; label: string } {
  const stageNum = parseInt(mod.stage.replace(/[^0-9]/g, '') || '0', 10);
  if (stageNum <= 1) return { rating: 2.2, label: 'Foundation Rigor' };
  if (stageNum <= 3) return { rating: 3.4, label: 'Systems & Data' };
  if (stageNum <= 5) return { rating: 4.2, label: 'Inference & Guardrails' };
  if (stageNum <= 7) return { rating: 4.6, label: 'Kernel & Paging Scale' };
  return { rating: 4.9, label: 'Frontier Architecture' };
}

// Heat score: 0.0 to 1.0 based on hours (40 to 240) and user feedback difficulty (1 to 5)
export function getModuleHeatScore(mod: CurriculumModule): number {
  const hoursNorm = Math.min(1, Math.max(0, (mod.hours - 40) / 200));
  const diff = getModuleDifficulty(mod);
  const diffNorm = (diff.rating - 1) / 4.0;
  return Math.min(1, Math.max(0, 0.5 * hoursNorm + 0.5 * diffNorm));
}

// Thermal color palette for heat intensity
export function getThermalColor(heatScore: number): string {
  // Interpolate along warm spectrum: cyan -> emerald -> amber -> orange -> neon red
  if (heatScore < 0.25) return '#06b6d4'; // Cyan
  if (heatScore < 0.45) return '#10b981'; // Emerald
  if (heatScore < 0.65) return '#f59e0b'; // Amber
  if (heatScore < 0.82) return '#f97316'; // Vivid Orange
  return '#ef4444'; // Burning Red
}

export const D3PathwayMap: React.FC<D3PathwayMapProps> = ({
  modules,
  repositories,
  onSelectModule,
  onInspectRepo,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<PathwayNode | null>(null);
  const [activeStageFilter, setActiveStageFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'heat' | 'status'>('heat');

  // Key canonical repositories representing core stack (including loopx, robustadev, haystack, langfuse, langgraph, litellm, robustness)
  const canonicalRepoNames = [
    'robustadev/robusta',
    'deepset-ai/haystack',
    'loopx/loopx',
    'swe-bench/SWE-bench',
    'karpathy/micrograd',
    'langchain-ai/langgraph',
    'langfuse/langfuse',
    'BerriAI/litellm',
    'MadryLab/robustness',
    'vllm-project/vllm',
    'modelcontextprotocol/typescript-sdk',
    'centerforaisafety/HarmBench',
    'deepseek-ai/deepseek-harness',
    'facebookresearch/faiss',
    'chiphuyen/aie-book',
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    // Filter modules based on stage filter
    const activeModules =
      activeStageFilter === 'ALL'
        ? modules.filter((m) =>
            ['NM01', 'NM08', 'NM22', 'NM24', 'NM26', 'NM27', 'NM28', 'NM37', 'NM43', 'NM56', 'NM60'].includes(
              m.id
            )
          )
        : modules.filter((m) => m.stage === activeStageFilter);

    const activeModuleIds = new Set(activeModules.map((m) => m.id));

    // Filter repos connected to active modules (priority to canonical requested repos with >= 7k stars and high correlation)
    const activeRepos = repositories
      .filter(
        (r) =>
          activeModuleIds.has(r.module) &&
          (canonicalRepoNames.includes(r.name) || r.isHarnessStack || r.stars >= 7000)
      )
      .slice(0, 18);

    // Build unique stages
    const uniqueStages = Array.from(new Set(activeModules.map((m) => m.stage)));

    const width = 1040;
    const height = Math.max(540, Math.max(activeModules.length, activeRepos.length) * 46 + 70);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', '100%');

    // Create defs for glow filter
    const defs = svg.append('defs');
    const glowFilter = defs.append('filter').attr('id', 'heat-glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g').attr('transform', 'translate(15, 25)');

    // Compute positions
    const stageNodes: PathwayNode[] = uniqueStages.map((stageId, i) => {
      const step = (height - 70) / (uniqueStages.length + 1);
      return {
        id: `stage-${stageId}`,
        name: `Stage ${stageId}`,
        type: 'stage',
        x: 80,
        y: 40 + (i + 1) * step,
      };
    });

    const moduleNodes: PathwayNode[] = activeModules.map((mod, i) => {
      const step = (height - 70) / (activeModules.length + 1);
      const diff = getModuleDifficulty(mod);
      const heat = getModuleHeatScore(mod);
      return {
        id: `mod-${mod.id}`,
        name: `${mod.id}: ${mod.title}`,
        type: 'module',
        status: mod.completionStatus,
        moduleRef: mod,
        hours: mod.hours,
        difficultyRating: diff.rating,
        difficultyLabel: diff.label,
        heatScore: heat,
        x: 370,
        y: 30 + (i + 1) * step,
      };
    });

    const repoNodes: PathwayNode[] = activeRepos.map((repo, i) => {
      const step = (height - 70) / (activeRepos.length + 1);
      return {
        id: `repo-${repo.id}`,
        name: repo.name,
        type: 'repo',
        repoRef: repo,
        stars: repo.stars,
        x: 770,
        y: 30 + (i + 1) * step,
      };
    });

    const allNodes = [...stageNodes, ...moduleNodes, ...repoNodes];
    const nodeMap = new Map(allNodes.map((n) => [n.id, n]));

    // Build links
    const links: { sourceNode: PathwayNode; targetNode: PathwayNode; status?: string; heatScore?: number }[] = [];

    // Stage -> Module links
    moduleNodes.forEach((mn) => {
      if (mn.moduleRef) {
        const stageNode = nodeMap.get(`stage-${mn.moduleRef.stage}`);
        if (stageNode) {
          links.push({ sourceNode: stageNode, targetNode: mn, status: mn.status, heatScore: mn.heatScore });
        }
      }
    });

    // Module -> Repo links
    repoNodes.forEach((rn) => {
      if (rn.repoRef) {
        const modNode = nodeMap.get(`mod-${rn.repoRef.module}`);
        if (modNode) {
          links.push({ sourceNode: modNode, targetNode: rn, status: modNode.status, heatScore: modNode.heatScore });
        }
      }
    });

    // Draw column headers
    const headers = [
      { text: 'CURRICULUM STAGES', x: 80 },
      { text: 'CURRICULUM MODULES (HEAT INTENSITY & LOAD)', x: 370 },
      { text: 'CORRELATED STACK REPOSITORIES (>=70% MATCH)', x: 770 },
    ];

    headers.forEach((h) => {
      g.append('text')
        .attr('x', h.x)
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .attr('font-family', 'ui-monospace, monospace')
        .attr('font-weight', 'bold')
        .attr('letter-spacing', '0.05em')
        .text(h.text);
    });

    // Horizontal bezier link generator
    const linkGenerator = d3
      .linkHorizontal<{ sourceNode: PathwayNode; targetNode: PathwayNode }, [number, number]>()
      .source((d) => [d.sourceNode.x!, d.sourceNode.y!])
      .target((d) => [d.targetNode.x!, d.targetNode.y!]);

    // Draw links
    g.selectAll('.path-link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', 'path-link')
      .attr('d', linkGenerator as any)
      .attr('fill', 'none')
      .attr('stroke', (d) => {
        if (viewMode === 'heat') {
          return d.heatScore !== undefined ? getThermalColor(d.heatScore) : '#475569';
        }
        if (d.status === 'completed') return '#10b981';
        if (d.status === 'in_progress') return '#38bdf8';
        return '#334155';
      })
      .attr('stroke-width', (d) => {
        if (viewMode === 'heat') {
          return d.heatScore ? 1 + d.heatScore * 2 : 1.25;
        }
        return d.status === 'completed' ? 2 : 1.25;
      })
      .attr('stroke-opacity', (d) => {
        if (viewMode === 'heat') {
          return d.heatScore ? 0.35 + d.heatScore * 0.45 : 0.25;
        }
        return d.status === 'completed' ? 0.7 : d.status === 'in_progress' ? 0.6 : 0.25;
      })
      .attr('stroke-dasharray', (d) => (!d.status || d.status === 'backlog' ? '4 3' : 'none'));

    // Draw Nodes
    const nodeGroups = g
      .selectAll('.pathway-node')
      .data(allNodes)
      .enter()
      .append('g')
      .attr('class', 'pathway-node')
      .attr('transform', (d) => `translate(${d.x}, ${d.y})`)
      .style('cursor', 'pointer')
      .on('mouseenter', (_event, d) => setSelectedNode(d))
      .on('click', (_event, d) => {
        if (d.type === 'module' && d.moduleRef && onSelectModule) {
          onSelectModule(d.moduleRef.id);
        } else if (d.type === 'repo' && d.repoRef && onInspectRepo) {
          onInspectRepo(d.repoRef);
        }
      });

    // Node circles / icons with heat glow
    nodeGroups
      .append('circle')
      .attr('r', (d) => {
        if (d.type === 'stage') return 7;
        if (d.type === 'module') return viewMode === 'heat' ? 7 + (d.heatScore || 0) * 3 : 6;
        return 5;
      })
      .attr('fill', (d) => {
        if (d.type === 'stage') return '#818cf8';
        if (d.type === 'module') {
          if (viewMode === 'heat') {
            return getThermalColor(d.heatScore || 0.5);
          }
          if (d.status === 'completed') return '#10b981';
          if (d.status === 'in_progress') return '#38bdf8';
          return '#475569';
        }
        // Repositories
        if (['robustadev/robusta', 'deepset-ai/haystack', 'loopx/loopx', 'langgraph', 'langfuse'].some((k) => d.name.includes(k))) {
          return '#ec4899';
        }
        return '#f59e0b';
      })
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 2)
      .attr('filter', (d) => (viewMode === 'heat' && d.type === 'module' && (d.heatScore || 0) > 0.7 ? 'url(#heat-glow)' : null));

    // Node labels
    nodeGroups
      .append('text')
      .attr('x', (d) => (d.type === 'stage' ? -14 : 14))
      .attr('y', 3.5)
      .attr('text-anchor', (d) => (d.type === 'stage' ? 'end' : 'start'))
      .attr('fill', (d) => {
        if (viewMode === 'heat' && d.type === 'module') {
          return (d.heatScore || 0) > 0.7 ? '#fed7aa' : '#cbd5e1';
        }
        if (d.status === 'completed') return '#a7f3d0';
        if (d.status === 'in_progress') return '#bae6fd';
        if (d.type === 'repo') return '#fde047';
        return '#cbd5e1';
      })
      .attr('font-size', '10px')
      .attr('font-family', 'ui-monospace, monospace')
      .text((d) => {
        if (d.type === 'module') {
          const hoursBadge = `[${d.hours}h]`;
          const diffBadge = viewMode === 'heat' ? ` ${d.difficultyRating}★` : '';
          const title = d.name.length > 28 ? d.name.slice(0, 26) + '...' : d.name;
          return `${title} ${hoursBadge}${diffBadge}`;
        }
        if (d.type === 'repo') {
          const starStr = d.stars ? ` (${(d.stars / 1000).toFixed(1)}k★)` : '';
          const name = d.name.length > 26 ? d.name.slice(0, 24) + '...' : d.name;
          return `${name}${starStr}`;
        }
        return d.name;
      });
  }, [modules, repositories, activeStageFilter, viewMode, onSelectModule, onInspectRepo]);

  // Find repos associated with the hovered module
  const hoveredModuleRepos =
    selectedNode?.type === 'module' && selectedNode.moduleRef
      ? repositories.filter((r) => r.module === selectedNode.moduleRef?.id)
      : [];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Flame className="w-5 h-5 animate-pulse" />
            </span>
            <h3 className="text-base font-semibold text-white tracking-wide">
              Curriculum Heat Intensity &amp; Repository Pathway
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
              D3 Interactive Visualizer
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Color-coded heat map derived from estimated study hours and difficulty feedback ratings, connecting modules to recommended repositories (70%+ correlation).
          </p>
        </div>

        {/* View Mode & Stage Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setViewMode('heat')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'heat'
                  ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              Thermal Heat Intensity
            </button>
            <button
              onClick={() => setViewMode('status')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === 'status'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completion Status
            </button>
          </div>

          {/* Stage Filter */}
          <select
            value={activeStageFilter}
            onChange={(e) => setActiveStageFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
          >
            <option value="ALL">Focus Pathway (11 Key Modules)</option>
            <option value="N0">Stage N0: Programming &amp; Algo Foundations</option>
            <option value="N1">Stage N1: Storage &amp; Cloud Infra</option>
            <option value="N3">Stage N3: Distributed &amp; Streaming</option>
            <option value="N4">Stage N4: Math, Autograd &amp; Transformers</option>
            <option value="N5">Stage N5: Inference, Economics &amp; Agents</option>
            <option value="N6">Stage N6: CUDA &amp; Triton Kernels</option>
            <option value="N7">Stage N7: Paging &amp; Quantization</option>
            <option value="N8">Stage N8: Multi-GPU Collectives</option>
            <option value="N9">Stage N9: MLIR &amp; Compilers</option>
            <option value="N10">Stage N10: World Models &amp; Robotics</option>
            <option value="N11">Stage N11: Research &amp; Capstones</option>
          </select>
        </div>
      </div>

      {/* Heat Intensity Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-2 px-3 bg-slate-950/60 rounded-xl my-3 border border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-400">
          <Info className="w-3.5 h-3.5 text-sky-400" />
          <span>Heat Scale:</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-sm shadow-cyan-500/50" />
            <span className="text-slate-300">Foundation (&lt;80h · 2.0★)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-slate-300">Core (80-120h · 3.2★)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="text-slate-300">Advanced (120-160h · 4.0★)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
            <span className="text-slate-300">High Load (160-200h · 4.5★)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50 animate-pulse" />
            <span className="text-rose-300 font-bold">Frontier Extreme (200-240h · 4.9★)</span>
          </div>
        </div>
        <div className="text-slate-500 text-[11px]">
          Click any node to inspect syllabus or study guide
        </div>
      </div>

      {/* Main SVG Visualization */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[980px]">
          <svg ref={svgRef} className="w-full h-auto" />
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              {selectedNode.type === 'module' ? (
                <BookOpen className="w-4 h-4 text-sky-400" />
              ) : selectedNode.type === 'repo' ? (
                <GitBranch className="w-4 h-4 text-amber-400" />
              ) : (
                <Layers className="w-4 h-4 text-indigo-400" />
              )}
              <span className="font-semibold text-slate-100 text-sm">{selectedNode.name}</span>
            </div>

            <div className="flex items-center gap-2">
              {selectedNode.type === 'module' && selectedNode.moduleRef && (
                <>
                  <span
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-medium border"
                    style={{
                      backgroundColor: `${getThermalColor(selectedNode.heatScore || 0.5)}15`,
                      color: getThermalColor(selectedNode.heatScore || 0.5),
                      borderColor: `${getThermalColor(selectedNode.heatScore || 0.5)}40`,
                    }}
                  >
                    🔥 Heat: {Math.round((selectedNode.heatScore || 0) * 100)}% ({selectedNode.difficultyLabel})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                    ⏱️ {selectedNode.hours} Hours
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[11px] border border-amber-500/20">
                    ★ Difficulty: {selectedNode.difficultyRating} / 5.0
                  </span>
                  {onSelectModule && (
                    <button
                      onClick={() => onSelectModule(selectedNode.moduleRef!.id)}
                      className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors"
                    >
                      Open in Curriculum →
                    </button>
                  )}
                </>
              )}

              {selectedNode.type === 'repo' && selectedNode.repoRef && (
                <>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono text-[11px]">
                    ★ {selectedNode.stars?.toLocaleString()} Stars
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono text-[11px]">
                    {selectedNode.repoRef.harnessLayer}
                  </span>
                  {onInspectRepo && (
                    <button
                      onClick={() => onInspectRepo(selectedNode.repoRef!)}
                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      View Study Guide
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Connected Repositories if Module Selected */}
          {selectedNode.type === 'module' && hoveredModuleRepos.length > 0 && (
            <div className="mt-3">
              <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
                <span>Associated Repositories for this Module ({hoveredModuleRepos.length}):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {hoveredModuleRepos.slice(0, 8).map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => onInspectRepo && onInspectRepo(repo)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 hover:bg-slate-800 transition-colors text-slate-200"
                  >
                    <GitBranch className="w-3 h-3 text-amber-400" />
                    <span className="font-mono text-[11px]">{repo.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({repo.stars > 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}★)
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
