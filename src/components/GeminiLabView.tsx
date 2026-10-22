import React, { useState, useRef, useEffect } from 'react';
import { CurriculumModule, CURRICULUM_MODULES } from '../data/curriculumData.ts';
import { REPOSITORY_DATABASE, RepositoryItem } from '../data/repoCatalog.ts';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Globe,
  Loader2,
  RefreshCw,
  Cpu,
  Layers,
  Search,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp: string;
}

interface GeminiLabViewProps {
  initialModule?: CurriculumModule | null;
  initialVerifyRepo?: RepositoryItem | null;
  initialPrompt?: string | null;
  onClearInitialVerify?: () => void;
}

export const GeminiLabView: React.FC<GeminiLabViewProps> = ({
  initialModule,
  initialVerifyRepo,
  initialPrompt,
  onClearInitialVerify,
}) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'synthesis' | 'verify'>('chat');

  // --- 1. Multi-turn Chat State ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your B69 Curriculum & Higher Harness Intelligence advisor. I can help you plan your 7,200-hour study path, dissect Model Context Protocol (MCP) tool contracts, evaluate inference serving latency trade-offs, and recommend companion lectures from MIT and Stanford. How can I assist you today?`,
      model: 'gemini-3.8-flash',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [chatInput, setChatInput] = useState(initialPrompt || '');
  const [selectedModel, setSelectedModel] = useState<'gemini-4-argon' | 'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [selectedPersona, setSelectedPersona] = useState<string>('architect');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // --- 2. High Thinking Synthesis State ---
  const [synthesisModuleId, setSynthesisModuleId] = useState<string>(initialModule ? initialModule.id : 'NM28');
  const [synthesisResult, setSynthesisResult] = useState<string>('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisModelUsed, setSynthesisModelUsed] = useState('');

  // --- 3. Live Google Search Verification State ---
  const [verifyRepoName, setVerifyRepoName] = useState<string>(initialVerifyRepo ? initialVerifyRepo.name : 'deepseek-ai/deepseek-harness');
  const [verifyRepoUrl, setVerifyRepoUrl] = useState<string>(initialVerifyRepo ? initialVerifyRepo.url : 'https://github.com/deepseek-ai/deepseek-harness');
  const [verifyResult, setVerifyResult] = useState<string>('');
  const [groundingMetadata, setGroundingMetadata] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (initialPrompt) {
      setChatInput(initialPrompt);
      setActiveMode('chat');
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (initialVerifyRepo) {
      setVerifyRepoName(initialVerifyRepo.name);
      setVerifyRepoUrl(initialVerifyRepo.url);
      setActiveMode('verify');
    }
  }, [initialVerifyRepo]);

  useEffect(() => {
    if (initialModule) {
      setSynthesisModuleId(initialModule.id);
      setActiveMode('synthesis');
    }
  }, [initialModule]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const personaInstructions: Record<string, string> = {
    architect:
      'You are a Principal AI Systems Architect. You provide deep technical explanations of distributed LLM serving, CUDA kernel memory hierarchy, and high-performance engineering without buzzwords.',
    harness:
      'You are a Higher Agent Harness Specialist. You focus on Model Context Protocol (MCP) tool schemas, sandbox isolation, ReAct execution loops, and safety evaluations.',
    curriculum:
      'You are an Academic Director advising students on completing the 7,200-hour B69 engineering curriculum across Stages N0 to N11. You provide specific module sequencing and hour pacing.',
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          model: selectedModel,
          systemInstruction: personaInstructions[selectedPersona],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Chat request failed');
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: data.text,
          model: data.model || selectedModel,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: `Error: ${err.message || 'Unable to contact Gemini server. Please check your connection or API key.'}`,
          model: selectedModel,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleRunSynthesis = async () => {
    const targetMod = CURRICULUM_MODULES.find((m) => m.id === synthesisModuleId) || CURRICULUM_MODULES[0];
    const correlated = REPOSITORY_DATABASE.filter((r) => r.module === targetMod.id);

    setIsSynthesizing(true);
    setSynthesisResult('');
    try {
      const res = await fetch('/api/gemini/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: targetMod.id,
          moduleTitle: targetMod.title,
          stage: targetMod.stage,
          hours: targetMod.hours,
          correlatedRepos: correlated.map((r) => ({
            name: r.name,
            stars: r.stars,
            status: r.status,
            correlation: `${r.correlationScore}%`,
            harnessLayer: r.harnessLayer,
            url: r.url,
            description: r.description,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Synthesis failed');
      setSynthesisResult(data.synthesis);
      setSynthesisModelUsed(data.modelUsed || 'gemini-4-argon');
    } catch (err: any) {
      setSynthesisResult(`Error synthesizing curriculum: ${err.message}`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleRunVerification = async () => {
    if (!verifyRepoName.trim()) return;
    setIsVerifying(true);
    setVerifyResult('');
    setGroundingMetadata(null);

    try {
      const res = await fetch('/api/gemini/verify-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName: verifyRepoName.trim(),
          repoUrl: verifyRepoUrl.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setVerifyResult(data.verification);
      setGroundingMetadata(data.groundingMetadata);
    } catch (err: any) {
      setVerifyResult(`Error running live verification: ${err.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Navigation Bar */}
      <div className="flex items-center justify-between p-2 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-mono">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveMode('chat')}
            className={`px-3.5 py-1.5 rounded transition flex items-center space-x-1.5 ${
              activeMode === 'chat'
                ? 'bg-sky-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Multi-Turn Chatbot</span>
          </button>
          <button
            onClick={() => setActiveMode('synthesis')}
            className={`px-3.5 py-1.5 rounded transition flex items-center space-x-1.5 ${
              activeMode === 'synthesis'
                ? 'bg-sky-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>High Thinking Synthesis (Gemini 4 Argon)</span>
          </button>
          <button
            onClick={() => setActiveMode('verify')}
            className={`px-3.5 py-1.5 rounded transition flex items-center space-x-1.5 ${
              activeMode === 'verify'
                ? 'bg-sky-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Live Search Grounding (Gemini 3.8 Flash)</span>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-2 text-slate-500 text-[11px]">
          <span>Server-Side Gemini API Proxy</span>
        </div>
      </div>

      {/* --- MODE 1: Multi-Turn Chatbot --- */}
      {activeMode === 'chat' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg flex flex-col h-[640px]">
          {/* Chat Control Toolbar */}
          <div className="p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono bg-slate-950/50">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as any)}
                aria-label="Select Gemini model for chat"
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="gemini-4-argon">gemini-4-argon (High Reasoning STEM)</option>
                <option value="gemini-3.8-flash">gemini-3.8-flash (General &amp; Fast)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Rapid Lookup)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-500">Persona:</span>
              <select
                value={selectedPersona}
                onChange={(e) => setSelectedPersona(e.target.value)}
                aria-label="Select advisor persona role"
                className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="architect">Systems Architect</option>
                <option value="harness">Higher Harness Specialist</option>
                <option value="curriculum">7,200h Curriculum Advisor</option>
              </select>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded bg-sky-950 border border-sky-800/80 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-2xl rounded-lg p-3.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-950 border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-60 mb-1">
                    <span>{msg.role === 'user' ? 'You' : `Advisor (${msg.model || selectedModel})`}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                <span>Gemini is generating reasoning chain...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about curriculum modules, higher harness layers, MCP schemas, or Karpathy codebases..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-mono"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white px-4 py-2 rounded text-xs font-medium transition flex items-center space-x-1.5 shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODE 2: High Thinking Synthesis (Gemini 4 Argon) --- */}
      {activeMode === 'synthesis' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
                <Cpu className="w-4 h-4" />
                <span>REASONING-DRIVEN CURRICULUM SYNTHESIS</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Deep Module Synthesis with Gemini 4 Argon
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Uses ThinkingLevel.HIGH to synthesize rigorous theory, code labs, and higher harness stack implementations.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0 font-mono text-xs">
              <select
                value={synthesisModuleId}
                onChange={(e) => setSynthesisModuleId(e.target.value)}
                aria-label="Select module to synthesize"
                className="bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {CURRICULUM_MODULES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id}: {m.title.slice(0, 30)}... ({m.hours}h)
                  </option>
                ))}
              </select>

              <button
                onClick={handleRunSynthesis}
                disabled={isSynthesizing}
                className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white px-4 py-2 rounded text-xs font-medium transition shadow-sm"
              >
                {isSynthesizing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Breakdown</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Display */}
          {synthesisResult ? (
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
                <span>Model Engine: {synthesisModelUsed || 'gemini-4-argon (ThinkingLevel.HIGH)'}</span>
                <span className="text-emerald-400 font-semibold">Synthesis Complete</span>
              </div>
              <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-[500px] overflow-y-auto pr-2">
                {synthesisResult}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-950/40 rounded-lg border border-slate-800/80">
              <Cpu className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <h4 className="text-xs font-mono text-slate-300">Ready for High-Thinking Synthesis</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Select a curriculum module and click &quot;Generate Breakdown&quot; to invoke Gemini 4 Argon with high reasoning tokens.
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- MODE 3: Live Google Search Verification (Gemini 3.8 Flash) --- */}
      {activeMode === 'verify' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
                <Globe className="w-4 h-4" />
                <span>SEARCH-GROUNDED AUDIT</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                Live GitHub Repository Verification
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Uses Gemini 3.8 Flash with Google Search grounding to verify live star counts and recent commit/release dates.
              </p>
            </div>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs font-mono">
            <div className="sm:col-span-6 space-y-1">
              <label htmlFor="repo-owner-name-input" className="text-slate-400 text-[11px] block">Repository Owner / Name:</label>
              <input
                id="repo-owner-name-input"
                type="text"
                value={verifyRepoName}
                onChange={(e) => setVerifyRepoName(e.target.value)}
                placeholder="e.g. deepseek-ai/deepseek-harness"
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="sm:col-span-4 space-y-1">
              <label htmlFor="github-url-input" className="text-slate-400 text-[11px] block">GitHub URL (Optional):</label>
              <input
                id="github-url-input"
                type="text"
                value={verifyRepoUrl}
                onChange={(e) => setVerifyRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="sm:col-span-2 flex items-end">
              <button
                onClick={handleRunVerification}
                disabled={isVerifying || !verifyRepoName.trim()}
                className="w-full flex items-center justify-center space-x-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white p-2 rounded text-xs font-medium transition shadow-sm"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Auditing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Audit Repo</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Verification Results */}
          {verifyResult ? (
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-semibold">Search Grounding Verification Result</span>
                <span>Powered by gemini-3.8-flash + Google Search</span>
              </div>
              <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                {verifyResult}
              </div>

              {/* Grounding web search chunks */}
              {groundingMetadata?.groundingChunks && (
                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                  <div className="text-slate-500 uppercase text-[10px]">Authoritative Web Citations</div>
                  <div className="flex flex-wrap gap-2">
                    {groundingMetadata.groundingChunks.map((chunk: any, i: number) => (
                      <a
                        key={i}
                        href={chunk.web?.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:underline flex items-center space-x-1"
                      >
                        <span>{chunk.web?.title || 'Citation'}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 text-center bg-slate-950/40 rounded-lg border border-slate-800/80">
              <Globe className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <h4 className="text-xs font-mono text-slate-300">Ready for Live Web Grounding</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Audits real-time star counts and release activity to confirm whether a repository meets the &gt;=4,000 star rule and 21-day release window.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
