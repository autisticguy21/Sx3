import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { CurriculumModule, computeCurriculumStats } from '../data/curriculumData.ts';

interface D3CompletionChartProps {
  modules: CurriculumModule[];
  onSelectStage?: (stageId: string) => void;
}

export const D3CompletionChart: React.FC<D3CompletionChartProps> = ({ modules, onSelectStage }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const barSvgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredData, setHoveredData] = useState<{
    label: string;
    sublabel?: string;
    hours: number;
    percent?: number;
    status?: string;
  } | null>(null);

  const [chartType, setChartType] = useState<'radial' | 'stacked'>('radial');

  const stats = computeCurriculumStats(modules);

  // 1. Render Radial Donut Chart
  useEffect(() => {
    if (!svgRef.current || chartType !== 'radial') return;

    const width = 420;
    const height = 420;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Color scales
    const stageColors = d3
      .scaleOrdinal<string>()
      .domain(stats.stageBreakdown.map((s) => s.stage))
      .range([
        '#38bdf8', // N0 sky
        '#0284c7', // N1
        '#6366f1', // N3 indigo
        '#8b5cf6', // N4 purple
        '#a855f7', // N5 fuchsia
        '#ec4899', // N6 pink
        '#f43f5e', // N7 rose
        '#f97316', // N8 orange
        '#eab308', // N9 yellow
        '#10b981', // N10 emerald
        '#14b8a6', // N11 teal
      ]);

    // Outer Arc: Stages breakdown
    const outerArc = d3
      .arc<d3.PieArcDatum<(typeof stats.stageBreakdown)[0]>>()
      .innerRadius(radius - 52)
      .outerRadius(radius - 12)
      .padAngle(0.02)
      .cornerRadius(4);

    const outerPie = d3
      .pie<(typeof stats.stageBreakdown)[0]>()
      .value((d) => d.totalHours)
      .sort(null);

    const outerArcs = g
      .selectAll('.outer-slice')
      .data(outerPie(stats.stageBreakdown))
      .enter()
      .append('g')
      .attr('class', 'outer-slice')
      .style('cursor', 'pointer')
      .on('mouseenter', (_event, d) => {
        setHoveredData({
          label: `${d.data.stage}: ${d.data.stageName}`,
          sublabel: `${d.data.moduleIds.length} modules`,
          hours: d.data.totalHours,
          percent: d.data.percent,
          status: `${d.data.completedHours}h done, ${d.data.inProgressHours}h in progress`,
        });
      })
      .on('mouseleave', () => setHoveredData(null))
      .on('click', (_event, d) => {
        if (onSelectStage) onSelectStage(d.data.stage);
      });

    outerArcs
      .append('path')
      .attr('d', outerArc as any)
      .attr('fill', (d) => stageColors(d.data.stage))
      .attr('opacity', (d) => (d.data.percent > 0 ? 0.95 : 0.45))
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 2)
      .transition()
      .duration(750)
      .attrTween('d', function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return outerArc(i(t) as any) || '';
        };
      });

    // Inner Arc: Overall Completion (Completed, In Progress, Backlog)
    const innerArc = d3
      .arc<d3.PieArcDatum<{ label: string; hours: number; color: string }>>()
      .innerRadius(radius - 92)
      .outerRadius(radius - 60)
      .padAngle(0.03)
      .cornerRadius(3);

    const innerData = [
      { label: 'Completed', hours: stats.completedHours, color: '#10b981' }, // emerald
      { label: 'In Progress', hours: stats.inProgressHours, color: '#38bdf8' }, // sky
      { label: 'Not Started', hours: stats.remainingHours - stats.inProgressHours, color: '#334155' }, // slate-700
    ].filter((d) => d.hours > 0);

    const innerPie = d3
      .pie<{ label: string; hours: number; color: string }>()
      .value((d) => d.hours)
      .sort(null);

    const innerArcs = g
      .selectAll('.inner-slice')
      .data(innerPie(innerData))
      .enter()
      .append('g')
      .attr('class', 'inner-slice')
      .style('cursor', 'pointer')
      .on('mouseenter', (_event, d) => {
        const pct = Math.round((d.data.hours / stats.totalHours) * 100);
        setHoveredData({
          label: d.data.label,
          hours: d.data.hours,
          percent: pct,
          status: `${d.data.hours.toLocaleString()} of 7,200 hours`,
        });
      })
      .on('mouseleave', () => setHoveredData(null));

    innerArcs
      .append('path')
      .attr('d', innerArc as any)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 2);
  }, [modules, chartType, stats]);

  // 2. Render Stacked Bar Chart
  useEffect(() => {
    if (!barSvgRef.current || chartType !== 'stacked') return;

    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = 680 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(barSvgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const stages = stats.stageBreakdown;

    const y = d3
      .scaleBand()
      .domain(stages.map((d) => d.stage))
      .range([0, height])
      .padding(0.25);

    const maxHours = d3.max(stages, (d) => d.totalHours) || 2040;
    const x = d3.scaleLinear().domain([0, maxHours]).range([0, width]);

    // Gridlines
    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(6)
          .tickSize(-height)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#1e293b')
      .attr('stroke-dasharray', '2,2');

    // Axes
    g.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '11px')
      .attr('font-family', 'monospace');

    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat((d) => `${d}h`))
      .selectAll('text')
      .attr('fill', '#64748b')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace');

    // Bars
    stages.forEach((st) => {
      const yPos = y(st.stage) || 0;
      const barHeight = y.bandwidth();
      const notStartedHours = Math.max(0, st.totalHours - st.completedHours - st.inProgressHours);

      // Background total bar
      g.append('rect')
        .attr('x', 0)
        .attr('y', yPos)
        .attr('width', x(st.totalHours))
        .attr('height', barHeight)
        .attr('fill', '#1e293b')
        .attr('rx', 3);

      // Completed bar
      if (st.completedHours > 0) {
        g.append('rect')
          .attr('x', 0)
          .attr('y', yPos)
          .attr('width', x(st.completedHours))
          .attr('height', barHeight)
          .attr('fill', '#10b981')
          .attr('rx', 3);
      }

      // In Progress bar
      if (st.inProgressHours > 0) {
        g.append('rect')
          .attr('x', x(st.completedHours))
          .attr('y', yPos)
          .attr('width', x(st.inProgressHours))
          .attr('height', barHeight)
          .attr('fill', '#38bdf8')
          .attr('rx', 3);
      }

      // Percentage label
      g.append('text')
        .attr('x', x(st.totalHours) + 8)
        .attr('y', yPos + barHeight / 2 + 4)
        .text(`${st.percent}% (${st.completedHours}/${st.totalHours}h)`)
        .attr('fill', st.percent > 0 ? '#38bdf8' : '#64748b')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace');
    });
  }, [modules, chartType, stats]);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
      {/* Header & Chart Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="text-xs font-mono text-sky-400">D3 ENGINE COMPLIANCE METRIC</div>
          <h3 className="text-base font-bold text-white mt-0.5">7,200-Hour Curriculum Completion Vector</h3>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setChartType('radial')}
            className={`px-3 py-1.5 rounded transition ${
              chartType === 'radial'
                ? 'bg-sky-600 text-white font-medium shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Radial Arc View
          </button>
          <button
            onClick={() => setChartType('stacked')}
            className={`px-3 py-1.5 rounded transition ${
              chartType === 'stacked'
                ? 'bg-sky-600 text-white font-medium shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Stage Horizon Bars
          </button>
        </div>
      </div>

      {/* Main Chart Rendering */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Chart SVG (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[360px]">
          {chartType === 'radial' ? (
            <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
              <svg ref={svgRef} className="w-full h-full drop-shadow-md" />
              {/* Central Donut Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                {hoveredData ? (
                  <div className="px-3 animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-xs font-mono text-sky-400 truncate max-w-[170px]">{hoveredData.label}</div>
                    <div className="text-2xl font-bold font-mono text-white mt-0.5">
                      {hoveredData.hours.toLocaleString()} <span className="text-xs text-slate-400">h</span>
                    </div>
                    {hoveredData.percent !== undefined && (
                      <div className="text-xs font-mono text-emerald-400 font-semibold">{hoveredData.percent}% complete</div>
                    )}
                    {hoveredData.status && (
                      <div className="text-[10px] text-slate-400 mt-1 max-w-[160px] truncate">{hoveredData.status}</div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-[11px] font-mono uppercase text-slate-500 tracking-wider">Completed</div>
                    <div className="text-2xl font-bold font-mono text-emerald-400">
                      {stats.completedHours.toLocaleString()}
                      <span className="text-xs text-slate-400 font-normal"> / 7,200h</span>
                    </div>
                    <div className="text-xs font-mono text-sky-400 mt-0.5 font-semibold">
                      {stats.completedPercent}% Progress
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      {stats.completedModulesCount} of {stats.totalModulesCount} modules
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <svg ref={barSvgRef} className="w-full min-w-[500px] h-[360px]" />
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono mt-3 text-slate-400">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Completed ({stats.completedHours}h)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-400" />
              <span>In Progress ({stats.inProgressHours}h)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-700" />
              <span>Remaining ({stats.remainingHours}h)</span>
            </div>
          </div>
        </div>

        {/* Right Stage Breakdown List (5 cols) */}
        <div className="lg:col-span-5 space-y-2 max-h-[380px] overflow-y-auto pr-1 text-xs font-mono">
          <div className="text-[11px] uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-800">
            Stage Completion Velocity
          </div>
          {stats.stageBreakdown.map((st) => (
            <div
              key={st.stage}
              onClick={() => onSelectStage && onSelectStage(st.stage)}
              className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sky-400">{st.stage}</span>
                  <span className="text-slate-300 font-sans font-medium line-clamp-1">{st.stageName}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {st.totalHours}h budget · {st.completedHours}h done · {st.inProgressHours}h in progress
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <div className={`font-bold ${st.percent > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {st.percent}%
                </div>
                <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${st.percent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
