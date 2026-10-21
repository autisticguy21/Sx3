import React, { useState } from 'react';
import { HIGHER_HARNESS_STACK, HarnessLayer } from '../data/harnessStack.ts';
import { REPOSITORY_DATABASE } from '../data/repoCatalog.ts';
import { Layers, ShieldCheck, Cpu, Code2, Database, Terminal, ArrowRight, Sparkles, Check, ExternalLink } from 'lucide-react';

interface HarnessStackViewProps {
  onSynthesizeStack: (stackSummary: string) => void;
}

export const HarnessStackView: React.FC<HarnessStackViewProps> = ({ onSynthesizeStack }) => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(1); // Default to Layer 2 MCP contracts
  const activeLayer = HIGHER_HARNESS_STACK[selectedLayerIndex];

  // Configured interactive stack state
  const [selectedHost, setSelectedHost] = useState('swe-bench/SWE-bench');
  const [selectedProtocol, setSelectedProtocol] = useState('modelcontextprotocol/typescript-sdk');
  const [selectedMemory, setSelectedMemory] = useState('mem0ai/mem0');
  const [selectedOrchestrator, setSelectedOrchestrator] = useState('HKUDS/OpenHarness');
  const [selectedGuardrail, setSelectedGuardrail] = useState('centerforaisafety/HarmBench');

  const getLayerIcon = (layerNum: number) => {
    switch (layerNum) {
      case 1:
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      case 2:
        return <Code2 className="w-4 h-4 text-sky-400" />;
      case 3:
        return <Database className="w-4 h-4 text-purple-400" />;
      case 4:
        return <Cpu className="w-4 h-4 text-amber-400" />;
      case 5:
        return <ShieldCheck className="w-4 h-4 text-rose-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleSynthesizeCurrentStack = () => {
    const summary = `Higher Harness Architecture Bundle:
- Host/Sandbox (L1): ${selectedHost}
- Protocol/MCP (L2): ${selectedProtocol}
- Memory/Context (L3): ${selectedMemory}
- Orchestrator (L4): ${selectedOrchestrator}
- Safety/Evaluation (L5): ${selectedGuardrail}`;
    onSynthesizeStack(summary);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
          <Layers className="w-4 h-4" />
          <span>PRODUCTION AGENT ARCHITECTURE</span>
        </div>
        <h2 className="text-lg font-bold text-white">
          The Higher Harness Stack Specification
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          High-performance autonomous AI systems require a decoupled, 5-layer harness architecture. Rather than building monolithic chatbots, modern engineering structures bounded sandboxes, strict Model Context Protocol (MCP) tool contracts, hierarchical memory indices, and continuous security evaluation guardrails.
        </p>
      </div>

      {/* Interactive 5-Layer Stack Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {HIGHER_HARNESS_STACK.map((layer, idx) => {
          const isSelected = selectedLayerIndex === idx;
          return (
            <button
              key={layer.layerNumber}
              onClick={() => setSelectedLayerIndex(idx)}
              className={`p-3.5 rounded-lg border text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800 border-sky-500 shadow-md ring-1 ring-sky-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    L{layer.layerNumber}
                  </span>
                  {getLayerIcon(layer.layerNumber)}
                </div>
                <div className="text-xs font-bold text-slate-100 line-clamp-1">
                  {layer.shortTitle}
                </div>
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-2 truncate">
                {layer.primaryRepos.length} Repositories
              </div>
            </button>
          );
        })}
      </div>

      {/* Layer Detail Inspector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
              <span>LAYER {activeLayer.layerNumber} SPECIFICATION</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Mapped to: {activeLayer.moduleMapping.join(', ')}</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">{activeLayer.name}</h3>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            Protocol: {activeLayer.protocolStandard}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">Architectural Mandate</span>
            <p className="text-slate-300 leading-relaxed font-sans">{activeLayer.role}</p>
          </div>
          <div className="bg-slate-950 p-3.5 rounded border border-slate-800 space-y-1">
            <span className="text-rose-400/90 uppercase text-[10px]">Critical Production Bottleneck</span>
            <p className="text-slate-300 leading-relaxed font-sans">{activeLayer.keyChallenge}</p>
          </div>
        </div>

        {/* Primary Repositories in this layer */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Canonical Repositories in Layer {activeLayer.layerNumber}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeLayer.primaryRepos.map((repoName) => {
              const repoData = REPOSITORY_DATABASE.find((r) => r.name.toLowerCase() === repoName.toLowerCase());
              const stars = repoData?.stars || 15000;
              const url = repoData?.url || `https://github.com/${repoName}`;
              const desc = repoData?.description || 'Core repository in the modern higher harness stack.';

              return (
                <div
                  key={repoName}
                  className="p-3 bg-slate-950 rounded border border-slate-800/80 hover:border-slate-700 transition space-y-1.5"
                >
                  <div className="flex items-start justify-between">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-100 hover:text-sky-400 flex items-center space-x-1"
                    >
                      <span className="truncate max-w-[190px]">{repoName}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                    </a>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {stars.toLocaleString()} stars · &gt;=70% match
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Harness Stack Builder & Evaluator */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Assemble Custom Higher Harness Stack</h3>
            <p className="text-xs text-slate-400">
              Select one repository per architectural layer to build an integrated engineering blueprint.
            </p>
          </div>
          <button
            onClick={handleSynthesizeCurrentStack}
            className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 rounded text-xs font-medium transition shadow-sm shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze Architecture with Gemini</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
          {/* L1 Host */}
          <div className="space-y-1">
            <label htmlFor="harness-l1-select" className="text-slate-400 text-[11px] block">L1 Sandbox / Host</label>
            <select
              id="harness-l1-select"
              value={selectedHost}
              onChange={(e) => setSelectedHost(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="swe-bench/SWE-bench">swe-bench/SWE-bench</option>
              <option value="browser-use/browser-harness">browser-use/browser-harness</option>
              <option value="openinterpreter/open-interpreter">openinterpreter</option>
              <option value="kubeflow/kubeflow">kubeflow/kubeflow</option>
            </select>
          </div>

          {/* L2 Protocol */}
          <div className="space-y-1">
            <label htmlFor="harness-l2-select" className="text-slate-400 text-[11px] block">L2 MCP Tool Schema</label>
            <select
              id="harness-l2-select"
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="modelcontextprotocol/typescript-sdk">MCP TypeScript SDK</option>
              <option value="modelcontextprotocol/python-sdk">MCP Python SDK</option>
              <option value="anthropics/skills">anthropics/skills</option>
              <option value="vercel-labs/agent-skills">vercel-labs/agent-skills</option>
              <option value="openai/skills">openai/skills</option>
            </select>
          </div>

          {/* L3 Memory */}
          <div className="space-y-1">
            <label htmlFor="harness-l3-select" className="text-slate-400 text-[11px] block">L3 Context &amp; Memory</label>
            <select
              id="harness-l3-select"
              value={selectedMemory}
              onChange={(e) => setSelectedMemory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="mem0ai/mem0">mem0ai/mem0</option>
              <option value="Gentleman-Programming/engram">Gentleman/engram</option>
              <option value="microsoft/graphrag">microsoft/graphrag</option>
              <option value="facebookresearch/faiss">facebook/faiss</option>
            </select>
          </div>

          {/* L4 Orchestrator */}
          <div className="space-y-1">
            <label htmlFor="harness-l4-select" className="text-slate-400 text-[11px] block">L4 Orchestrator</label>
            <select
              id="harness-l4-select"
              value={selectedOrchestrator}
              onChange={(e) => setSelectedOrchestrator(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="HKUDS/OpenHarness">HKUDS/OpenHarness</option>
              <option value="deepseek-ai/deepseek-harness">deepseek-harness</option>
              <option value="OpenHands/OpenHands">OpenHands/OpenHands</option>
              <option value="SWE-agent/SWE-agent">SWE-agent/SWE-agent</option>
              <option value="agno-agi/agno">agno-agi/agno</option>
              <option value="HKUDS/nanobot">HKUDS/nanobot</option>
            </select>
          </div>

          {/* L5 Safety */}
          <div className="space-y-1">
            <label htmlFor="harness-l5-select" className="text-slate-400 text-[11px] block">L5 Safety / Evals</label>
            <select
              id="harness-l5-select"
              value={selectedGuardrail}
              onChange={(e) => setSelectedGuardrail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="centerforaisafety/HarmBench">HarmBench</option>
              <option value="confident-ai/deepeval">confident-ai/deepeval</option>
              <option value="vibrantlabsai/ragas">vibrantlabsai/ragas</option>
              <option value="Arize-ai/phoenix">Arize-ai/phoenix</option>
              <option value="promptfoo/promptfoo">promptfoo/promptfoo</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
