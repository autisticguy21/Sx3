export interface HarnessLayer {
  layerNumber: number;
  name: string;
  shortTitle: string;
  role: string;
  protocolStandard: string;
  keyChallenge: string;
  primaryRepos: string[];
  moduleMapping: string[];
  specification: string;
}

export const HIGHER_HARNESS_STACK: HarnessLayer[] = [
  {
    layerNumber: 1,
    name: 'Layer 1: Host Sandbox & Execution Runtime',
    shortTitle: 'Host & Sandbox',
    role: 'Provides ephemeral, isolated micro-virtual machines or Docker containers where the agent safely executes shell commands, edits files, and runs test suites.',
    protocolStandard: 'OCI / Docker / E2B Sandbox Protocol',
    keyChallenge: 'Zero leakage between sessions, strict timeouts, memory limits, and sub-second container spin-up times.',
    primaryRepos: ['swe-bench/SWE-bench', 'browser-use/browser-harness', 'openinterpreter/open-interpreter', 'codecrafters-io/build-your-own-x', 'kubeflow/kubeflow'],
    moduleMapping: ['NM01', 'NM08', 'NM28'],
    specification: 'Deterministic filesystem isolation with copy-on-write scratchpads and network boundary policies.',
  },
  {
    layerNumber: 2,
    name: 'Layer 2: MCP Tool Contracts & Protocol Schemas',
    shortTitle: 'MCP Tool Contracts',
    role: 'Standardizes tool definitions, parameters, and return types using the Model Context Protocol (MCP) so agents can dynamically discover and safely invoke capabilities.',
    protocolStandard: 'JSON-RPC 2.0 / MCP Specification (v1.0)',
    keyChallenge: 'Schema drift prevention, dynamic parameter validation, and robust error codes returned to the LLM.',
    primaryRepos: [
      'modelcontextprotocol/typescript-sdk',
      'modelcontextprotocol/python-sdk',
      'modelcontextprotocol/registry',
      'anthropics/skills',
      'vercel-labs/agent-skills',
      'openai/skills',
    ],
    moduleMapping: ['NM28'],
    specification: 'Stdio and Server-Sent Events (SSE) transports with bidirectional capability negotiation.',
  },
  {
    layerNumber: 3,
    name: 'Layer 3: Memory & Context Windows Architecture',
    shortTitle: 'Memory & Context',
    role: 'Maintains working memory across multi-turn reasoning loops, stores episodic history in vector/graph stores, and manages prompt context budget.',
    protocolStandard: 'Vector Embeddings / Knowledge Graph Triples (Cypher)',
    keyChallenge: 'Attention distraction over 128k+ tokens, lost-in-the-middle phenomena, and stale state invalidation.',
    primaryRepos: ['mem0ai/mem0', 'Gentleman-Programming/engram', 'microsoft/graphrag', 'facebookresearch/faiss', 'HKUDS/RAG-Anything', 'vectorize-io/hindsight'],
    moduleMapping: ['NM07', 'NM26', 'NM28', 'NM36'],
    specification: 'Hierarchical memory hierarchy: L1 Working Memory (Prompt), L2 Episodic Scratchpad, L3 Persistent Knowledge Graph.',
  },
  {
    layerNumber: 4,
    name: 'Layer 4: Agent Orchestrator & Planner Engine',
    shortTitle: 'Orchestrator & Planner',
    role: 'Executes the core cognitive loops (Plan-Act-Observe-Reflect), routes sub-tasks to specialized sub-agents, and drives self-correction upon test failures.',
    protocolStandard: 'ReAct / Plan-and-Solve / 12-Factor Agent Principles',
    keyChallenge: 'Infinite loop prevention, hallucinated tool calls, and high-latency coordination deadlocks.',
    primaryRepos: [
      'deepseek-ai/deepseek-harness',
      'HKUDS/OpenHarness',
      'OpenHands/OpenHands',
      'SWE-agent/SWE-agent',
      'agno-agi/agno',
      'Significant-Gravitas/AutoGPT',
      'HKUDS/nanobot',
    ],
    moduleMapping: ['NM28', 'NM60'],
    specification: 'State machine execution graphs with human-in-the-loop pause gates and deterministic rollback.',
  },
  {
    layerNumber: 5,
    name: 'Layer 5: Safety, Guardrails & Evaluation Harness',
    shortTitle: 'Safety & Evaluation',
    role: 'Performs continuous verification, detects prompt injections and unauthorized tool executions, and benchmarks agent success rates against ground truth.',
    protocolStandard: 'OpenLLMetry / SWE-bench Test Suites / HarmBench Taxonomy',
    keyChallenge: 'Adversarial jailbreaks, silent tool regression, and accurately measuring pass@1 vs cost trade-offs.',
    primaryRepos: [
      'centerforaisafety/HarmBench',
      'confident-ai/deepeval',
      'vibrantlabsai/ragas',
      'Arize-ai/phoenix',
      'promptfoo/promptfoo',
      'openai/evals',
      'traceloop/openllmetry',
    ],
    moduleMapping: ['NM27', 'NM28', 'NM56'],
    specification: 'Pre-execution tool firewall, post-execution output validation, and statistical confidence scoring.',
  },
];
