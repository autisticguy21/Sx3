import React, { useState } from 'react';
import {
  Sliders,
  Check,
  Copy,
  Download,
  Code2,
  Layers,
  Sparkles,
  X,
  FileCode,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
  Radar,
  Bell,
  Clock,
  Flame,
  FileDown,
} from 'lucide-react';

export interface AppFeatureConfig {
  id: string;
  name: string;
  category: 'Analytics & Visualization' | 'Offline & Infrastructure' | 'Study & Synthesis' | 'Reporting & Data';
  description: string;
  isEnabled: boolean;
  filePath: string;
  codeSnippet: string;
}

interface FeatureFlagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  features: Record<string, boolean>;
  onToggleFeature: (featureId: string) => void;
  onResetDefaults?: () => void;
}

export const DEFAULT_FEATURE_CONFIGS: AppFeatureConfig[] = [
  {
    id: 'sw_offline_cache',
    name: 'Service Worker Offline Cache & PWA',
    category: 'Offline & Infrastructure',
    description: 'Precaches curriculum modules and 442+ repositories so the entire search and study interface remains functional offline.',
    isEnabled: true,
    filePath: 'public/sw.js & src/registerServiceWorker.ts',
    codeSnippet: `// Register Service Worker
import { registerServiceWorker } from './registerServiceWorker.ts';
registerServiceWorker();

// In sw.js: Stale-While-Revalidate caching strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('frontier-curriculum-v1').then((cache) => {
      return cache.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((networkRes) => {
          if (networkRes.status === 200) cache.put(event.request, networkRes.clone());
          return networkRes;
        }).catch(() => cached || caches.match('/'));
        return cached || fetchPromise;
      });
    })
  );
});`,
  },
  {
    id: 'd3_radar_chart',
    name: 'D3 Core Engineering Domains Radar (D01-D18)',
    category: 'Analytics & Visualization',
    description: 'SVG multi-axis radar chart mapping candidate competency across 18 domains against living pioneer benchmark targets.',
    isEnabled: true,
    filePath: 'src/components/D3RadarChart.tsx',
    codeSnippet: `// D3 SVG Radar Generator across D01-D18 domains
const angleSlice = (Math.PI * 2) / domainProficiencies.length;
const coords = domainProficiencies.map((d, i) => {
  const r = (radius / 10) * d.currentScore;
  return [r * Math.sin(angleSlice * i), -r * Math.cos(angleSlice * i)];
});
g.append('polygon')
  .attr('points', coords.map(p => p.join(',')).join(' '))
  .attr('fill', 'url(#radarFillGradient)')
  .attr('stroke', '#06b6d4')
  .attr('stroke-width', 2.2);`,
  },
  {
    id: 'inactivity_notifier',
    name: '24h Inactivity Re-engagement Notifier',
    category: 'Study & Synthesis',
    description: 'Automated periodic monitor that suggests high-priority uncompleted modules when learner is idle >24h.',
    isEnabled: true,
    filePath: 'src/components/EngagementReengagementNotifier.tsx',
    codeSnippet: `// Check 24-hour engagement lapse
const lastActive = parseInt(localStorage.getItem('b69_last_engagement_timestamp') || '0', 10);
if (Date.now() - lastActive > 24 * 60 * 60 * 1000) {
  // Select uncompleted module with >=70% correlation
  const target = uncompletedModules.find(m => m.id === 'NM28') || uncompletedModules[0];
  showReengagementToast(target);
}`,
  },
  {
    id: 'pdf_progress_export',
    name: 'jsPDF Executive Progress Report Generator',
    category: 'Reporting & Data',
    description: 'Client-side PDF compiler formatting completed milestones, D01-D18 domain scores, and B65/B67 scan data.',
    isEnabled: true,
    filePath: 'src/lib/pdfExport.ts',
    codeSnippet: `import { jsPDF } from 'jspdf';
export async function downloadProgressReportPdf(modules, repositories) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  // Add executive header, stats boxes, table of modules, and domain scan
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 42, 'F');
  doc.save('Frontier_Curriculum_Progress_Report.pdf');
}`,
  },
  {
    id: 'd3_pathway_map',
    name: 'D3 Pathway & Thermal Heat Intensity Map',
    category: 'Analytics & Visualization',
    description: 'Force and hierarchical visual graph color-coding modules by estimated completion time and user difficulty ratings.',
    isEnabled: true,
    filePath: 'src/components/D3PathwayMap.tsx',
    codeSnippet: `// Compute Heat Intensity Score
const heatScore = Math.min(100, Math.round((mod.hours / 320) * 55 + (userRating / 5) * 45));
const heatColor = d3.interpolateYlOrRd(heatScore / 100);`,
  },
  {
    id: 'pomodoro_study_timer',
    name: 'Pomodoro Study & Focus Session Timer',
    category: 'Study & Synthesis',
    description: 'Interval-based study timer that logs session minutes into module proficiency calculations and Gemini prompts.',
    isEnabled: true,
    filePath: 'src/components/PomodoroStudyTimer.tsx',
    codeSnippet: `// Log focus session
const session = { moduleId, durationMinutes: 25, timestamp: Date.now() };
localStorage.setItem('b69_pomodoro_sessions', JSON.stringify([...existing, session]));`,
  },
  {
    id: 'big_tech_catalog',
    name: 'Big Tech 4k+ Canonical Stacks (Huawei, Qualcomm, Tencent, Apple, NVIDIA)',
    category: 'Reporting & Data',
    description: 'Indexes 4k+ verified repositories from top hardware & AI platforms with living persona alignment.',
    isEnabled: true,
    filePath: 'src/data/repoCatalog.ts & src/data/personaData.ts',
    codeSnippet: `// Big Tech Canonical Entries
{ name: 'ml-explore/mlx', stars: 21500, persona: 'Awni Hannun & Johny Srouji (Apple)' },
{ name: 'Tencent/ncnn', stars: 19850, persona: 'Nihui (Tencent)' },
{ name: 'mindspore-ai/mindspore', stars: 17400, persona: 'Zhifeng Chen (Huawei)' },
{ name: 'NVIDIA/cutlass', stars: 7850, persona: 'Bill Dally & Ian Buck (NVIDIA)' },
{ name: 'quic/aimet', stars: 4320, persona: 'Chirag Patel (Qualcomm)' }`,
  },
];

export const FeatureFlagsModal: React.FC<FeatureFlagsModalProps> = ({
  isOpen,
  onClose,
  features,
  onToggleFeature,
  onResetDefaults,
}) => {
  const [expandedCodeId, setExpandedCodeId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const categories = ['ALL', 'Analytics & Visualization', 'Offline & Infrastructure', 'Study & Synthesis', 'Reporting & Data'];

  const filteredFeatures = DEFAULT_FEATURE_CONFIGS.filter((f) => {
    if (activeCategory !== 'ALL' && f.category !== activeCategory) return false;
    return true;
  });

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportManifest = () => {
    const manifest = {
      appVersion: '3.0.0-frontier',
      exportDate: new Date().toISOString(),
      activeFeatureFlags: features,
      modularFeatures: DEFAULT_FEATURE_CONFIGS.map((f) => ({
        id: f.id,
        name: f.name,
        isEnabled: features[f.id] !== false,
        filePath: f.filePath,
        category: f.category,
      })),
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `frontier_app_features_manifest_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Modular Feature Flags & Extension Code Manager
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {Object.values(features).filter((v) => v !== false).length} / {DEFAULT_FEATURE_CONFIGS.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle platform capabilities ON/OFF and inspect or save their production code snippets to expand the app
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportManifest}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-all flex items-center space-x-1.5"
              title="Export feature configuration manifest"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Manifest</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center space-x-2 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feature List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 custom-scrollbar">
          {filteredFeatures.map((feat) => {
            const isEnabled = features[feat.id] !== false;
            const isExpanded = expandedCodeId === feat.id;

            return (
              <div
                key={feat.id}
                className={`rounded-xl border transition-all ${
                  isEnabled
                    ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/30 border-slate-800/40 opacity-75'
                }`}
              >
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => onToggleFeature(feat.id)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mt-0.5 ${
                        isEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                      role="switch"
                      aria-checked={isEnabled}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-white">{feat.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                          {feat.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-2xl">{feat.description}</p>
                      <div className="flex items-center space-x-2 mt-2 text-[11px] text-slate-500 font-mono">
                        <FileCode className="w-3.5 h-3.5 text-slate-400" />
                        <span>{feat.filePath}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      onClick={() => setExpandedCodeId(isExpanded ? null : feat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 border ${
                        isExpanded
                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                          : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide Code' : 'View Code'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Source Code Drawer */}
                {isExpanded && (
                  <div className="border-t border-slate-800 bg-slate-950 p-4 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-cyan-400 flex items-center space-x-1">
                        <span>Source Snippet ({feat.filePath})</span>
                      </span>
                      <button
                        onClick={() => handleCopyCode(feat.id, feat.codeSnippet)}
                        className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center space-x-1 font-mono"
                      >
                        {copiedId === feat.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                      {feat.codeSnippet}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <div>
            All feature flags persist automatically across browser reloads via <code className="text-cyan-300 font-mono">localStorage</code>.
          </div>
          <div className="flex items-center space-x-3">
            {onResetDefaults && (
              <button
                onClick={onResetDefaults}
                className="text-slate-400 hover:text-white underline text-xs"
              >
                Reset to Defaults
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-all shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
