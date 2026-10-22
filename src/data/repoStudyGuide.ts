export interface ComplementaryBook {
  title: string;
  author: string;
  year: number;
  selectedChapters: string[];
  chapterTitles: string[];
  focusDomain: string;
  nonOverlappingRationale: string;
}

export interface VideoLectureTrack {
  institution: 'ETH Zurich' | 'Chinese Elite (Eng / Sub-Eng)' | 'US Elite (Stanford/MIT/Berkeley)';
  speakerOrProf: string;
  courseOrTalkTitle: string;
  languageOrSubs: string;
  url: string;
  keyTopics: string[];
  relevanceToStack: string;
}

export interface DocumentationPaper {
  title: string;
  authors: string;
  venueOrYear: string;
  url: string;
  paperType: 'Seminal Research Paper' | 'Official Architecture Spec' | 'RFC / Benchmark Standard';
  coreTakeaways: string;
}

export interface ReproductionRoadmap {
  targetLanguage: 'Rust' | 'C++20' | 'Mojo' | 'Go' | 'TypeScript/Node';
  sourceLanguage: 'Python' | 'C++' | 'C' | 'Python/CUDA' | 'C/CUDA' | 'TypeScript/Node' | 'Python/PyTorch';
  prerequisiteSkills: string[];
  phase1Foundation: string;
  phase2CorePrimitives: string;
  phase3HarnessIntegration: string;
  phase4BenchmarkAndParity: string;
  gotchasAndPitfalls: string[];
}

export interface RepoStudyGuide {
  repoName: string;
  module: string;
  book1: ComplementaryBook;
  book2: ComplementaryBook;
  videoLectures: VideoLectureTrack[];
  documentationAndPapers: DocumentationPaper[];
  reproductionRoadmap: ReproductionRoadmap;
}

/**
 * Curated Repository Study Guides providing non-overlapping complementary literature,
 * elite multi-university video lectures, seminal papers, and cross-language reproduction guides.
 */
export const REPO_STUDY_GUIDES: Record<string, RepoStudyGuide> = {
  // 1. micrograd / minGPT (Karpathy study-only autograd & transformer)
  'karpathy/micrograd': {
    repoName: 'karpathy/micrograd',
    module: 'NM24',
    book1: {
      title: 'Deep Learning',
      author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
      year: 2016,
      selectedChapters: ['Chapter 6: Deep Feedforward Networks', 'Chapter 6.5: Back-Propagation Algorithms'],
      chapterTitles: ['Computation Graphs, Chain Rule, and Reverse-Mode Differentiation'],
      focusDomain: 'Theoretical Graph Autodiff & Chain Rule Derivation',
      nonOverlappingRationale: 'Goodfellow Ch 6.5 focuses entirely on matrix/tensor Jacobian chain rule mathematics without touching C++ execution or CPU cache layouts.',
    },
    book2: {
      title: 'Programming Massively Parallel Processors (4th Ed)',
      author: 'David B. Kirk and Wen-mei W. Hwu',
      year: 2022,
      selectedChapters: ['Chapter 3: Multidimensional Grids and Data', 'Chapter 4: Compute Architecture and Scheduling'],
      chapterTitles: ['Memory Hierarchy, Thread Warps, and Cache-Conscious Tensors'],
      focusDomain: 'Hardware Execution & Memory Traversal for Gradient Tapes',
      nonOverlappingRationale: 'Kirk & Hwu covers physical hardware thread mapping and memory access coalescing, complementing Goodfellow without any mathematical duplication.',
    },
    videoLectures: [
      {
        institution: 'ETH Zurich',
        speakerOrProf: 'Prof. Torsten Hoefler (SPCL)',
        courseOrTalkTitle: 'High-Performance Deep Learning Systems (263-2800-00L)',
        languageOrSubs: 'English',
        url: 'https://spcl.inf.ethz.ch/Teaching/2021-hpdl/',
        keyTopics: ['Automatic Differentiation Internals', 'Tape-based vs Graph-based Execution', 'Computational DAG Schedule Optimizations'],
        relevanceToStack: 'Deep dives into compiler graphs and memory layouts for scalar and tensor autograd engines.',
      },
      {
        institution: 'Chinese Elite (Eng / Sub-Eng)',
        speakerOrProf: 'Prof. Zhiyuan Liu (Tsinghua University / OpenBMB)',
        courseOrTalkTitle: 'Neural Network Architectures & Computational Foundations',
        languageOrSubs: 'Mandarin with full English Subtitles',
        url: 'https://www.bilibili.com/video/BV1S54y1R7SB',
        keyTopics: ['Backprop Gradient Flow', 'Computational Graph Optimization', 'Topological Sorting of Neural Layers'],
        relevanceToStack: 'Explains gradient dissipation, numerical precision stability, and topological DAG walks.',
      },
      {
        institution: 'US Elite (Stanford/MIT/Berkeley)',
        speakerOrProf: 'Andrej Karpathy & MIT 6.S191 Staff',
        courseOrTalkTitle: 'The spelled-out intro to neural networks and backpropagation',
        languageOrSubs: 'English',
        url: 'https://www.youtube.com/watch?v=VMj-3S1tku0',
        keyTopics: ['Scalar Value class implementation', 'Topological reverse DFS', 'Step-by-step backward chain rule'],
        relevanceToStack: 'Canonical 2.5h step-by-step code walkthrough of micrograd from scratch.',
      },
    ],
    documentationAndPapers: [
      {
        title: 'Automatic Differentiation in Machine Learning: a Survey',
        authors: 'Atilim Gunes Baydin, Barak A. Pearlmutter, Alexey Radul, Jeffrey Mark Siskind',
        venueOrYear: 'JMLR (2018)',
        url: 'https://arxiv.org/abs/1502.05767',
        paperType: 'Seminal Research Paper',
        coreTakeaways: 'Surveys forward-mode (dual numbers) versus reverse-mode (tape accumulation) automatic differentiation and time complexity bounds.',
      },
      {
        title: 'PyTorch Autograd Mechanics & C++ ATen Dispatcher Spec',
        authors: 'PyTorch Core Engineering Team',
        venueOrYear: 'PyTorch Official Documentation',
        url: 'https://pytorch.org/docs/stable/notes/autograd.html',
        paperType: 'Official Architecture Spec',
        coreTakeaways: 'Examines dynamic compute graph generation, non-differentiable leaf tensor tracking, and in-place tensor version counters.',
      },
    ],
    reproductionRoadmap: {
      targetLanguage: 'Rust',
      sourceLanguage: 'Python',
      prerequisiteSkills: ['Rust Rc<RefCell<T>> & RefCell graph traversal', 'Raw pointer DAG cycles avoidance', 'Operator overloading (Add, Mul, Sub traits)'],
      phase1Foundation: 'Define struct Value { data: f32, grad: Cell<f32>, prev: Vec<Rc<Value>>, op: OpType } avoiding reference-counting memory cycles.',
      phase2CorePrimitives: 'Implement custom std::ops::Add and Mul traits with closure-based backward function pointers (*mut Value).',
      phase3HarnessIntegration: 'Implement iterative DFS topological sorting using a visited HashSet<usize> based on memory addresses.',
      phase4BenchmarkAndParity: 'Validate against PyTorch scalar tensors across a 2-layer MLP on a binary classification dataset (e.g. moon dataset).',
      gotchasAndPitfalls: [
        'Rust ownership: cyclical references in backward tapes cause memory leaks without Weak<Value> or index-based arena allocation.',
        'Gradient accumulation: must use += for gradients instead of = to support nodes used multiple times in the compute graph.',
      ],
    },
  },

  // 2. HKUDS/nanobot & browser-use / SWE-agent (Layer 1 & Layer 4 Agent Harness)
  'HKUDS/nanobot': {
    repoName: 'HKUDS/nanobot',
    module: 'NM28',
    book1: {
      title: 'Building LLM-Powered Applications',
      author: 'Valentina Alto',
      year: 2024,
      selectedChapters: ['Chapter 4: Advanced Prompt Engineering & Tool Calling', 'Chapter 7: Autonomous Multi-Agent Loops'],
      chapterTitles: ['ReAct Loop Invariants, Tool Calling Interfaces, and Execution Guards'],
      focusDomain: 'Agent Tool Invocation Loops & Structured Serialization',
      nonOverlappingRationale: 'Alto covers the application-level ReAct loop and structured JSON tool-call schema validation.',
    },
    book2: {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      year: 2017,
      selectedChapters: ['Chapter 8: The Trouble with Distributed Systems', 'Chapter 9: Consistency and Consensus'],
      chapterTitles: ['Network Partitions, Nonce Fencing, and Idempotent Retry Policies'],
      focusDomain: 'Robust Tool Call Idempotency & Distributed Sandbox Contracts',
      nonOverlappingRationale: 'Kleppmann covers state machine consensus, network timeouts, and safe side-effect fencing for external tool execution.',
    },
    videoLectures: [
      {
        institution: 'ETH Zurich',
        speakerOrProf: 'Prof. Ce Zhang & Systems@ETH',
        courseOrTalkTitle: 'Systems for Machine Learning: Reliable Agent Orchestration',
        languageOrSubs: 'English',
        url: 'https://systems.ethz.ch/',
        keyTopics: ['Agent State Machine Determinism', 'Sandboxed Tool Execution', 'Async Event Loop Isolation'],
        relevanceToStack: 'Analyzes process sandboxing, IPC communication channels, and failure boundary isolation for agents.',
      },
      {
        institution: 'Chinese Elite (Eng / Sub-Eng)',
        speakerOrProf: 'Prof. Zhiyuan Liu & OpenBMB Team (Tsinghua University)',
        courseOrTalkTitle: 'AgentScope & Autonomous Multi-Agent Systems Lecture Series',
        languageOrSubs: 'Mandarin with English Subtitles',
        url: 'https://github.com/agentscope-ai/agentscope',
        keyTopics: ['Structured Message Passing', 'Tool Registry Reflection', 'Context Sliding Windows'],
        relevanceToStack: 'Explores multi-agent actor models, message queues, and memory distillation.',
      },
      {
        institution: 'US Elite (Stanford/MIT/Berkeley)',
        speakerOrProf: 'Prof. Sergey Levine (UC Berkeley)',
        courseOrTalkTitle: 'CS285: Deep Reinforcement Learning & Goal-Directed Agents',
        languageOrSubs: 'English',
        url: 'https://rail.eecs.berkeley.edu/deeprlcourse/',
        keyTopics: ['Markov Decision Processes (MDP)', 'Policy Rollout Horizons', 'Reward Modeling and Grounding'],
        relevanceToStack: 'Grounds autonomous agent planning loops in formal MDP decision theory.',
      },
    ],
    documentationAndPapers: [
      {
        title: 'Model Context Protocol (MCP) Specification (v1.0)',
        authors: 'Anthropic & Open Source MCP Contributors',
        venueOrYear: 'Anthropic Standards (2024)',
        url: 'https://modelcontextprotocol.io/specification',
        paperType: 'Official Architecture Spec',
        coreTakeaways: 'Specifies JSON-RPC 2.0 transport over stdio and SSE for tool discovery, resource listing, and prompt templates.',
      },
      {
        title: 'SWE-bench: Can Language Models Resolve Real-World GitHub Issues?',
        authors: 'Carlos E. Jimenez, John Yang, Alexander Wettig, Shunyu Yao, Karthik Narasimhan, Ofir Press',
        venueOrYear: 'ICLR (2024)',
        url: 'https://arxiv.org/abs/2310.06770',
        paperType: 'Seminal Research Paper',
        coreTakeaways: 'Standard benchmark demonstrating test harness isolation, git workspace cloning, and golden patch validation.',
      },
    ],
    reproductionRoadmap: {
      targetLanguage: 'Go',
      sourceLanguage: 'Python',
      prerequisiteSkills: ['Go channels and goroutine concurrency', 'JSON-RPC 2.0 over os.Stdin/os.Stdout', 'POSIX exec.CommandContext sandbox limits'],
      phase1Foundation: 'Implement JSON-RPC 2.0 message parser and standard RPC router with request cancellation contexts.',
      phase2CorePrimitives: 'Build ToolRegistry interface with schema reflection (GenerateSchema) and parameter unmarshaling into Go structs.',
      phase3HarnessIntegration: 'Create Docker/chroot sandboxed process runner with strict timeout, CPU, and network cgroup limits.',
      phase4BenchmarkAndParity: 'Execute 50 synthetic multi-step bash and file editing tasks, matching Python nanobot success rates.',
      gotchasAndPitfalls: [
        'Buffer flushing: stdio RPC requires explicit bufio.Writer.Flush() on every message to avoid agent deadlocks.',
        'Zombie processes: sandboxed shell commands must use syscall.Kill(-pgid, syscall.SIGKILL) to kill entire process groups.',
      ],
    },
  },

  // 3. vLLM / SGLang / ktransformers (Layer 2 Inference & KV-Cache Paging)
  'vllm-project/vllm': {
    repoName: 'vllm-project/vllm',
    module: 'NM36',
    book1: {
      title: 'Operating Systems: Three Easy Pieces (OSTEP)',
      author: 'Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau',
      year: 2018,
      selectedChapters: ['Chapter 18: Paging: Introduction', 'Chapter 20: Paging: Smaller Tables & Inverted Page Tables'],
      chapterTitles: ['Virtual Memory Translation, TLBs, and Memory Fragmentation Solutions'],
      focusDomain: 'OS Virtual Memory & Paging Mechanics',
      nonOverlappingRationale: 'OSTEP provides the exact conceptual foundation of page tables and memory fragmentation that inspired PagedAttention.',
    },
    book2: {
      title: 'High Performance Python (2nd Ed)',
      author: 'Micha Gorelick and Ian Ozsvald',
      year: 2020,
      selectedChapters: ['Chapter 6: Matrix and Vector Computation', 'Chapter 7: Compiling to C with Cython/PyBind11'],
      chapterTitles: ['Zero-Copy Buffer Sharing, PyBind11 C++ Extensions, and PyTorch Tensor Memory Internals'],
      focusDomain: 'Python-C++ Interop & Zero-Copy Tensor Sharing',
      nonOverlappingRationale: 'Focuses on the high-throughput bridge between Python serving workers and CUDA C++ kernels.',
    },
    videoLectures: [
      {
        institution: 'ETH Zurich',
        speakerOrProf: 'Prof. Torsten Hoefler',
        courseOrTalkTitle: 'Fast LLM Serving & PagedAttention Systems Architecture',
        languageOrSubs: 'English',
        url: 'https://spcl.inf.ethz.ch/',
        keyTopics: ['Memory Bound Transformer Decoding', 'PagedAttention Block Allocation', 'Continuous Batching Throughput'],
        relevanceToStack: 'Provides mathematical derivations of memory bandwidth bottlenecks in LLM token generation.',
      },
      {
        institution: 'Chinese Elite (Eng / Sub-Eng)',
        speakerOrProf: 'Prof. Yang You & Tsinghua/NUS HPC Lab',
        courseOrTalkTitle: 'Large Model High-Concurrency Inference Systems & SGLang RadixAttention',
        languageOrSubs: 'Mandarin with English Subtitles',
        url: 'https://www.bilibili.com/video/BV1gH4y1G75T',
        keyTopics: ['RadixTree Prefix Caching', 'Chunked Prefill & Decode Scheduling', 'Multi-Head Attention KV Compression'],
        relevanceToStack: 'Explains SGLang and vLLM dynamic memory allocation with visual tree state representations.',
      },
      {
        institution: 'US Elite (Stanford/MIT/Berkeley)',
        speakerOrProf: 'Woosuk Kwon & Ion Stoica (UC Berkeley Sky Computing Lab)',
        courseOrTalkTitle: 'Efficient Memory Management for Large Language Model Serving with PagedAttention',
        languageOrSubs: 'English',
        url: 'https://www.youtube.com/watch?v=5ZlavKF_98U',
        keyTopics: ['Internal vs External KV Cache Fragmentation', 'Logical-to-Physical Block Mapping', 'Continuous Batching Scheduler'],
        relevanceToStack: 'Official SOSP 2023 presentation by the primary author and creator of vLLM.',
      },
    ],
    documentationAndPapers: [
      {
        title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention',
        authors: 'Woosuk Kwon, Zhuohan Li, Siyuan Zhuang, Ying Sheng, Lianmin Zheng, Cody Hao Yu, Joseph E. Gonzalez, Hao Zhang, Ion Stoica',
        venueOrYear: 'SOSP (2023)',
        url: 'https://arxiv.org/abs/2309.06180',
        paperType: 'Seminal Research Paper',
        coreTakeaways: 'Introduced PagedAttention algorithm inspired by OS virtual memory, reducing memory waste from 60-80% down to under 4%.',
      },
      {
        title: 'vLLM Architecture Deep Dive & Block Manager Design Spec',
        authors: 'vLLM Core Development Team',
        venueOrYear: 'vLLM Engineering Documentation',
        url: 'https://docs.vllm.ai/en/latest/dev/index.html',
        paperType: 'Official Architecture Spec',
        coreTakeaways: 'Details the BlockAllocator, BlockTable, and continuous batching Engine iteration loop.',
      },
    ],
    reproductionRoadmap: {
      targetLanguage: 'C++20',
      sourceLanguage: 'Python/CUDA',
      prerequisiteSkills: ['C++20 std::pmr (Polymorphic Memory Resources)', 'CUDA driver API / cuMemAlloc', 'Lock-free queue primitives (std::atomic)'],
      phase1Foundation: 'Design BlockAllocator managing an array of fixed-size KV memory chunks (e.g. 16 tokens * num_heads * head_dim * sizeof(fp16)).',
      phase2CorePrimitives: 'Implement PagedAttention CUDA kernel reading non-contiguous block tables passed via 2D pointer arrays.',
      phase3HarnessIntegration: 'Construct request scheduler handling dynamic arrival of prompt sequences and allocating blocks on demand.',
      phase4BenchmarkAndParity: 'Benchmark token throughput against HuggingFace naive generation, measuring VRAM utilization and tokens/sec/user.',
      gotchasAndPitfalls: [
        'CUDA memory alignment: KV block buffers must be aligned to 128 bytes to maximize GPU memory bus transaction efficiency.',
        'Copy-on-write overhead: fork-sequences sharing system prompts must increment block reference counts and clone only upon divergent generation.',
      ],
    },
  },

  // 4. karpathy/llm.c & nanoGPT (C / CUDA Pure Model & Training)
  'karpathy/llm.c': {
    repoName: 'karpathy/llm.c',
    module: 'NM25',
    book1: {
      title: 'CUDA by Example: An Introduction to General-Purpose GPU Programming',
      author: 'Jason Sanders and Edward Kandrot',
      year: 2010,
      selectedChapters: ['Chapter 4: Introduction to CUDA C', 'Chapter 5: Thread Cooperation & Shared Memory'],
      chapterTitles: ['Kernel Grids, Shared Memory Tiling, and __syncthreads() Barriers'],
      focusDomain: 'CUDA Kernel Threading & Shared Memory Synchronization',
      nonOverlappingRationale: 'Covers essential hardware SIMT execution, block dimensioning, and warp barrier mechanics in standard C.',
    },
    book2: {
      title: 'Understanding Deep Learning',
      author: 'Simon J.D. Prince',
      year: 2023,
      selectedChapters: ['Chapter 11: Residual Networks & LayerNorm', 'Chapter 12: Transformers and Attention Mechanisms'],
      chapterTitles: ['Scaled Dot-Product Matrix Formulations, Multi-Head Projections, and GELU/SwiGLU Activations'],
      focusDomain: 'Mathematical Formulation of GPT-2 Transformer Layers',
      nonOverlappingRationale: 'Provides pristine mathematical derivations of every single tensor transformation in GPT-2 with zero code bias.',
    },
    videoLectures: [
      {
        institution: 'ETH Zurich',
        speakerOrProf: 'Prof. Torsten Hoefler & ETH Systems Group',
        courseOrTalkTitle: 'High-Performance Matrix Multiplications & Tensor Compilers',
        languageOrSubs: 'English',
        url: 'https://spcl.inf.ethz.ch/',
        keyTopics: ['GEMM register tiling', 'Tensor core WMMA instructions', 'Memory wall optimization'],
        relevanceToStack: 'Explains how to optimize matmul kernels to achieve 80%+ of peak FP16/BF16 GPU TFLOPs.',
      },
      {
        institution: 'Chinese Elite (Eng / Sub-Eng)',
        speakerOrProf: 'DeepSeek Technical Team (DeepSeek-AI)',
        courseOrTalkTitle: 'DeepSeek-V3 Infrastructure & DualPipe Parallel Training Architecture',
        languageOrSubs: 'Mandarin with English Subtitles & Slides',
        url: 'https://github.com/deepseek-ai/DeepSeek-V3',
        keyTopics: ['FP8 Mixed Precision Numerics', 'Overlap of Communication and Computation', 'Multi-Head Latent Attention (MLA)'],
        relevanceToStack: 'State-of-the-art production insights into direct C/CUDA kernel optimizations and memory footprints.',
      },
      {
        institution: 'US Elite (Stanford/MIT/Berkeley)',
        speakerOrProf: 'Andrej Karpathy',
        courseOrTalkTitle: 'Let\'s reproduce GPT-2 (124M) in pure C/CUDA and PyTorch',
        languageOrSubs: 'English',
        url: 'https://www.youtube.com/watch?v=l8pRSuU81PU',
        keyTopics: ['Manual backpropagation through LayerNorm, Matmul, and Softmax', 'FP32 vs BF16 precision tensors', 'Weight pointer offsets'],
        relevanceToStack: 'Canonical 4-hour walkthrough of reproducing GPT-2 in pure 1,000 LOC C/CUDA without any frameworks.',
      },
    ],
    documentationAndPapers: [
      {
        title: 'FlashAttention-2: Faster Attention with Better Work Partitioning and Parallelism',
        authors: 'Tri Dao',
        venueOrYear: 'ICLR (2024)',
        url: 'https://arxiv.org/abs/2307.08691',
        paperType: 'Seminal Research Paper',
        coreTakeaways: 'Online softmax computation and shared memory tiling avoiding HBM read/write of intermediate attention score matrices.',
      },
      {
        title: 'NVIDIA CUDA C++ Programming Guide (Compute Capabilities 8.0-9.0)',
        authors: 'NVIDIA Corporation',
        venueOrYear: 'Official Documentation (2024)',
        url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/',
        paperType: 'Official Architecture Spec',
        coreTakeaways: 'Specifications for asynchronous data copies (cudaMemcpyAsync), cooperative groups, and Tensor Core layouts.',
      },
    ],
    reproductionRoadmap: {
      targetLanguage: 'Mojo',
      sourceLanguage: 'C/CUDA',
      prerequisiteSkills: ['SIMD vectorization primitives', 'Pointer arithmetic and DType casting', 'Mojo memory ownership and borrowing'],
      phase1Foundation: 'Define Tensor struct with continuous buffer allocation and fast strided indexing.',
      phase2CorePrimitives: 'Implement vector-accelerated LayerNorm, GELU activation, and manual gradient accumulation kernels.',
      phase3HarnessIntegration: 'Construct multi-head self-attention module using Mojo `@parameter` unrolled loops and tiled matrix multiplication.',
      phase4BenchmarkAndParity: 'Load OpenAI GPT-2 (124M) pre-trained weights from binary safetensors and achieve exact cross-entropy loss parity (within 1e-4).',
      gotchasAndPitfalls: [
        'Numerical stability in Softmax: subtracting max(x) before exp(x) is mandatory to prevent IEEE-754 FP32 overflow.',
        'LayerNorm backward: must accumulate both mean and variance gradients across the hidden dimension with warp reduction.',
      ],
    },
  },

  // 6. robustadev/robusta (Kubernetes automated troubleshooting & multi-agent remediation)
  'robustadev/robusta': {
    repoName: 'robustadev/robusta',
    module: 'NM08',
    book1: {
      title: 'Kubernetes: Up and Running (3rd Ed)',
      author: 'Kelsey Hightower, Brendan Burns, Joe Beda',
      year: 2022,
      selectedChapters: [
        'Chapter 8: ReplicaSets and Deployments',
        'Chapter 12: Custom Resource Definitions (CRDs)',
        'Chapter 14: Kubernetes Security, RBAC and Admission Controllers',
      ],
      chapterTitles: ['Declarative Control Loops, Extension APIs, and Runtime Access Policies'],
      focusDomain: 'Kubernetes API Architecture & Operator Control Loops',
      nonOverlappingRationale: 'Hightower et al. focuses on core declarative API machinery and CRD primitives without touching SRE incident response or alert telemetry heuristics.',
    },
    book2: {
      title: 'Site Reliability Engineering: How Google Runs Production Systems',
      author: 'Niall Richard Murphy, Betsy Beyer, Chris Jones, Jennifer Petoff',
      year: 2016,
      selectedChapters: [
        'Chapter 10: Practical Alerting from Time-Series Data',
        'Chapter 14: Managing Incidents & Root Cause Analysis',
        'Chapter 28: Accelerating SREs to On-Call and Eliminating Operational Toil',
      ],
      chapterTitles: ['Dynamic Alert Triage, Incident Response, and Automated Remediation Protocols'],
      focusDomain: 'Production Telemetry, Toil Elimination, and Automated Playbooks',
      nonOverlappingRationale: 'Google SRE covers alert threshold mathematics, automated postmortems, and incident mitigation policies, perfectly complementing Kubernetes API mechanics with zero overlap.',
    },
    videoLectures: [
      {
        institution: 'ETH Zurich',
        speakerOrProf: 'Prof. Timothy Roscoe (Systems Group)',
        courseOrTalkTitle: 'Advanced Operating Systems & Distributed Infrastructure (263-3800-00L)',
        languageOrSubs: 'English',
        url: 'https://systems.ethz.ch/education/courses.html',
        keyTopics: ['Container Microkernel Isolation', 'Fault Boundaries', 'Autonomous Remediation Loops'],
        relevanceToStack: 'Provides foundational kernel isolation and fault recovery theory for autonomous infra agents.',
      },
      {
        institution: 'Chinese Elite (Eng / Sub-Eng)',
        speakerOrProf: 'Prof. Wenguang Chen (Tsinghua University)',
        courseOrTalkTitle: 'Cloud Native Computing Systems & Distributed Cluster SRE',
        languageOrSubs: 'Mandarin with English Subtitles',
        url: 'https://www.bilibili.com/video/BV11K4y1p72y',
        keyTopics: ['Kubernetes Controller Architecture', 'Auto-healing Daemonsets', 'Cluster Telemetry Pipelines'],
        relevanceToStack: 'In-depth architectural analysis of Kubernetes control planes and custom resource controllers.',
      },
      {
        institution: 'US Elite (Stanford/MIT/Berkeley)',
        speakerOrProf: 'Prof. Frans Kaashoek & Robert Morris (MIT 6.824)',
        courseOrTalkTitle: 'Fault Tolerance, Consensus Controllers & SRE Reliability',
        languageOrSubs: 'English',
        url: 'https://pdos.csail.mit.edu/6.824/',
        keyTopics: ['Crash Recovery', 'Distributed Coordination', 'Health Checking & Automated Failover'],
        relevanceToStack: 'Authoritative MIT distributed systems course on constructing resilient automated controllers.',
      },
    ],
    documentationAndPapers: [
      {
        title: 'Large-scale cluster management at Google with Borg',
        authors: 'Abhishek Verma, Luis Pedrosa, Madhukar Korupolu, David Oppenheimer, Eric Tune, John Wilkes',
        venueOrYear: 'EuroSys (2015)',
        url: 'https://research.google/pubs/pub43438/',
        paperType: 'Seminal Research Paper',
        coreTakeaways: 'The seminal architecture behind Borg/Kubernetes: declarative state reconciliation, priority preemption, and automated self-healing.',
      },
      {
        title: 'Robusta Automated Remediation Architecture & Prometheus Alertmanager Integration Spec',
        authors: 'Robusta Core Team',
        venueOrYear: 'Robusta Documentation (2024-2026)',
        url: 'https://docs.robusta.dev/',
        paperType: 'Official Architecture Spec',
        coreTakeaways: 'Defines webhook alert ingestion, Kubernetes event enrichment, automated diagnostic playbooks, and multi-agent incident triage.',
      },
    ],
    reproductionRoadmap: {
      targetLanguage: 'Go',
      sourceLanguage: 'Python',
      prerequisiteSkills: [
        'Kubernetes client-go API client and informers',
        'Prometheus Alertmanager webhook JSON v4 schema',
        'Concurrent goroutines, channels, and worker pools',
      ],
      phase1Foundation: 'Implement high-performance HTTP webhook server to ingest and deserialize Prometheus Alertmanager alerts with zero allocations.',
      phase2CorePrimitives: 'Connect client-go dynamic client to query failing Pod status, events, OOMKilled cgroup exit codes, and container stdout logs.',
      phase3HarnessIntegration: 'Construct extensible Action Runner executing remediation playbooks (Pod restart, node cordon, memory dump capture, Slack/Discord dispatch).',
      phase4BenchmarkAndParity: 'Deploy in a local KinD cluster, trigger artificial crashloops, and verify sub-3-second automated diagnosis and remediation dispatch.',
      gotchasAndPitfalls: [
        'Guard against infinite remediation loops by implementing exponential backoff on repeated alert keys.',
        'Sanitize secret environment variables before streaming logs or sending diagnostics outside cluster boundaries.',
      ],
    },
  },

  // 7. deepset-ai/haystack (Modular LLM orchestration, RAG pipelines & semantic search)
  'deepset-ai/haystack': {
    repoName: 'deepset-ai/haystack',
    module: 'NM26',
    book1: {
      title: 'Natural Language Processing with Transformers',
      author: 'Lewis Tunstall, Leandro von Werra, Thomas Wolf',
      year: 2022,
      selectedChapters: [
        'Chapter 4: Multilingual Named Entity Recognition',
        'Chapter 7: Question Answering & Dense Passage Retrieval',
        'Chapter 8: Making Transformers Faster in Production',
      ],
      chapterTitles: ['Dense Vector Embedding Indices, Bi-Encoders, and Latency Optimization'],
      focusDomain: 'Dense Passage Retrieval (DPR) & Semantic Search Embeddings',
      nonOverlappingRationale: 'Tunstall et al. explains mathematical bi-encoder representations and token embedding projections without covering microservice pipeline DAG architecture.',
    },
    book2: {
      title: 'Designing Machine Learning Systems',
      author: 'Chip Huyen',
      year: 2022,
      selectedChapters: [
        'Chapter 8: Data Distribution Shifts and Real-Time Monitoring',
        'Chapter 9: Continual Learning and Test in Production',
        'Chapter 10: Infrastructure and Tooling for Foundation Model Pipelines',
      ],
      chapterTitles: ['Pipeline Orchestration, Latency Budgets, and RAG Data Flow Governance'],
      focusDomain: 'Production System Architecture & Operational Observability',
      nonOverlappingRationale: 'Chip Huyen provides enterprise architectural patterns, offline vs online feature pipelines, and SLA governance, leaving deep neural NLP mechanics to Book 1.',
    },
    videoLectures: [
      {
        institution: 'ETH Zurich',
        speakerOrProf: 'Prof. Mrinmaya Sachan',
        courseOrTalkTitle: 'Natural Language Understanding & Neural Information Retrieval',
        languageOrSubs: 'English',
        url: 'https://nlu.inf.ethz.ch/',
        keyTopics: ['Dense Vector Retrieval', 'Cross-Encoder Rerankers', 'Neural Indexing & Inverted Indices'],
        relevanceToStack: 'Deep theoretical coverage of modern hybrid retrieval and neural semantic indexing.',
      },
      {
        institution: 'Chinese Elite (Eng / Sub-Eng)',
        speakerOrProf: 'Prof. Zhiyuan Liu (Tsinghua University)',
        courseOrTalkTitle: 'Large-Scale Knowledge Retrieval & Foundation Model Systems',
        languageOrSubs: 'Mandarin with English Subtitles',
        url: 'https://www.bilibili.com/video/BV1V5411u7tU',
        keyTopics: ['RAG Pipeline Topologies', 'Knowledge Graph Retrieval', 'Hallucination Mitigation'],
        relevanceToStack: 'Walks through enterprise retrieval architectures and agentic context assembly.',
      },
      {
        institution: 'US Elite (Stanford/MIT/Berkeley)',
        speakerOrProf: 'Prof. Christopher Manning (Stanford CS224N)',
        courseOrTalkTitle: 'Natural Language Processing with Deep Learning: Retrieval-Augmented Generation',
        languageOrSubs: 'English',
        url: 'https://web.stanford.edu/class/cs224n/',
        keyTopics: ['Transformer Encoders', 'Dense Passage Retrieval', 'Contextual Relevance Scoring'],
        relevanceToStack: 'The premier university lecture series on NLP foundations and generative retrieval.',
      },
    ],
    documentationAndPapers: [
      {
        title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
        authors: 'Patrick Lewis, Ethan Perez, Aleksandara Piktus, Fabio Petroni, Vladimir Karpukhin, et al.',
        venueOrYear: 'NeurIPS (2020)',
        url: 'https://arxiv.org/abs/2005.11401',
        paperType: 'Seminal Research Paper',
        coreTakeaways: 'Introduced the seminal RAG paradigm combining non-parametric memory (dense vector retrieval) with parametric generator LLMs.',
      },
      {
        title: 'Haystack 2.0 Architectural Specification: Component-Based Pipeline Graphs',
        authors: 'deepset-ai Engineering Team',
        venueOrYear: 'Haystack Documentation (2024-2026)',
        url: 'https://docs.haystack.deepset.ai/docs/intro',
        paperType: 'Official Architecture Spec',
        coreTakeaways: 'Specifies decoupled DAG component interfaces, asynchronous pipeline execution, and pluggable document stores.',
      },
    ],
    reproductionRoadmap: {
      targetLanguage: 'Rust',
      sourceLanguage: 'Python',
      prerequisiteSkills: [
        'Async Tokio runtime and asynchronous stream processing',
        'Linear algebra vector dot products and cosine similarity',
        'Serde zero-copy JSON/binary deserialization',
      ],
      phase1Foundation: 'Design a directed acyclic graph (DAG) Pipeline engine with compile-time type-checked input/output socket connections.',
      phase2CorePrimitives: 'Implement DocumentStore trait with concurrent in-memory vector storage and BM25 lexical inverted index.',
      phase3HarnessIntegration: 'Build Component nodes for DocumentSplitter, Embedder (via ONNX runtime / candle), HybridRetriever, and PromptTemplate.',
      phase4BenchmarkAndParity: 'Verify end-to-end question answering pipeline against golden datasets with sub-12ms latency on 10,000 indexed documents.',
      gotchasAndPitfalls: [
        'Always normalize embedding vectors to unit L2 norm before computing dot products to ensure mathematically valid cosine similarities.',
        'Use concurrent read-write locks (tokio::sync::RwLock) across the DocumentStore to prevent read starvation under high QPS.',
      ],
    },
  },

  // 8. langchain-ai/langgraph (Cyclic state graphs, checkpointing & bounded agent workflows)
  'langchain-ai/langgraph': {
    repoName: 'langchain-ai/langgraph',
    module: 'NM28',
    book1: {
      title: 'Artificial Intelligence: A Modern Approach (4th Ed)',
      author: 'Stuart Russell, Peter Norvig',
      year: 2020,
      selectedChapters: [
        'Chapter 3: Solving Problems by Searching',
        'Chapter 11: Automated Planning',
        'Chapter 18: Multiagent Decision Making',
      ],
      chapterTitles: ['State Space Graph Formulation, Partial-Order Planning, and Multiagent Coordination'],
      focusDomain: 'Formal Agent State Graphs & Heuristic Search Dynamics',
      nonOverlappingRationale: 'Focuses on formal graph state transitions, goal-directed planning, and minimax/multiagent game theory without covering persistent distributed state storage or JSON serialization.',
    },
    book2: {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      year: 2017,
      selectedChapters: [
        'Chapter 5: Replication and State Machines',
        'Chapter 11: Stream Processing & Event Sourcing',
        'Chapter 12: The Future of Data Systems',
      ],
      chapterTitles: ['Durable State Checkpoints, Event Sourcing, and Deterministic Replay Engines'],
      focusDomain: 'Durable Checkpointing, Time-Travel Debugging & Event Log Architectures',
      nonOverlappingRationale: 'Kleppmann treats graphs as persistent event-sourced state machines with exact checkpoint recovery and distributed log ordering, leaving AI planning to Russell & Norvig.',
    },
    videoLectures: [
      {
        institution: 'ETH Zurich',
        speakerOrProf: 'Prof. Ce Zhang & Prof. Otmar Hilliges',
        courseOrTalkTitle: 'Advanced Systems for Machine Learning & Interactive Agent Graphs',
        languageOrSubs: 'English',
        url: 'https://systems.ethz.ch/',
        keyTopics: ['Agent State Graphs', 'Deterministic Message Passing', 'Checkpoint Replay'],
        relevanceToStack: 'Deep foundations of graph-based agent topologies and state reconciliation.',
      },
      {
        institution: 'Chinese Elite (Eng / Sub-Eng)',
        speakerOrProf: 'Prof. Zhiyuan Liu (Tsinghua University)',
        courseOrTalkTitle: 'Multi-Agent LLM Graph Architectures and Collective Intelligence',
        languageOrSubs: 'Mandarin with English Subtitles',
        url: 'https://www.bilibili.com/',
        keyTopics: ['Cyclic Agent Workflows', 'Role-Playing Graphs', 'Human-in-the-Loop Consensus'],
        relevanceToStack: 'Architectural analysis of production multi-agent collaboration pipelines.',
      },
      {
        institution: 'US Elite (Stanford/MIT/Berkeley)',
        speakerOrProf: 'Prof. Percy Liang & Dorsa Sadigh (Stanford CS221)',
        courseOrTalkTitle: 'Artificial Intelligence: Principles and Techniques (State Machines & Planning)',
        languageOrSubs: 'English',
        url: 'https://web.stanford.edu/class/cs221/',
        keyTopics: ['State Graph Formulation', 'Markov Decision Processes', 'Constraint Satisfaction'],
        relevanceToStack: 'Stanford flagship lecture series covering state transitions and bounded agent planning.',
      },
    ],
    documentationAndPapers: [
      {
        title: 'Language Agents as Cyclic State Machines and Checkpoint Graphs',
        authors: 'Harrison Chase et al.',
        venueOrYear: 'LangChain Technical Report (2024)',
        url: 'https://github.com/langchain-ai/langgraph',
        paperType: 'Official Architecture Spec',
        coreTakeaways: 'Defines cyclic computation graphs with durable state channels, human approval interrupts, and rewindable checkpoints.',
      },
      {
        title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
        authors: 'Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao',
        venueOrYear: 'ICLR (2023)',
        url: 'https://arxiv.org/abs/2210.03629',
        paperType: 'Seminal Research Paper',
        coreTakeaways: 'Interleaves reasoning traces with task-specific actions to execute multi-step graph reasoning.',
      },
    ],
    reproductionRoadmap: {
      targetLanguage: 'Rust',
      sourceLanguage: 'Python',
      prerequisiteSkills: ['Petgraph graph crate in Rust', 'Tokio async actor channels', 'Serde state persistence'],
      phase1Foundation: 'Construct DAG and cyclic StateGraph struct with compile-time checked node transition routes.',
      phase2CorePrimitives: 'Implement thread-safe InMemoryCheckpoint and SQLite checkpoint saver with time-travel rewind.',
      phase3HarnessIntegration: 'Integrate MCP tool executors with interruptible human-in-the-loop pause/resume tokens.',
      phase4BenchmarkAndParity: 'Benchmark concurrent graph execution across 5,000 parallel sessions with sub-5ms step overhead.',
      gotchasAndPitfalls: [
        'Cyclic graphs require recursion depth bounds to prevent infinite loops and runaway inference cost.',
        'Ensure state immutability across parallel node branches to eliminate race conditions.',
      ],
    },
  },

  // 9. langfuse/langfuse (Open-source LLM engineering platform: observability, metrics & evals)
  'langfuse/langfuse': {
    repoName: 'langfuse/langfuse',
    module: 'NM26',
    book1: {
      title: 'Site Reliability Engineering: How Google Runs Production Systems',
      author: 'Niall Murphy, Betsy Beyer, Chris Jones, Jennifer Petoff',
      year: 2016,
      selectedChapters: [
        'Chapter 6: Monitoring Distributed Systems',
        'Chapter 10: Practical Alerting from Time-Series Data',
        'Chapter 25: Data Processing Pipelines in SRE',
      ],
      chapterTitles: ['Distributed Tracing, Span Hierarchies, and Latency Telemetry'],
      focusDomain: 'Distributed Telemetry & OpenTelemetry Span Graph Mechanics',
      nonOverlappingRationale: 'Focuses on distributed span trees, tracing latency distributions, and SLO definitions without touching prompt evaluation matrices.',
    },
    book2: {
      title: 'Designing Machine Learning Systems',
      author: 'Chip Huyen',
      year: 2022,
      selectedChapters: [
        'Chapter 8: Data Distribution Shifts and Monitoring',
        'Chapter 9: Continual Evaluation and A/B Testing',
        'Chapter 10: Infrastructure and Tooling for Foundation Models',
      ],
      chapterTitles: ['Model Drift Detection, LLM Evaluation Harnesses, and Prompt Version Governance'],
      focusDomain: 'LLM Scoring, Token Accounting, and Prompt Management',
      nonOverlappingRationale: 'Focuses on LLM-as-a-judge scoring, token cost accounting, and prompt regression testing, perfectly complementing distributed systems tracing.',
    },
    videoLectures: [
      {
        institution: 'ETH Zurich',
        speakerOrProf: 'Prof. Timothy Roscoe',
        courseOrTalkTitle: 'Distributed Systems Observability and Trace Reconstruction',
        languageOrSubs: 'English',
        url: 'https://systems.ethz.ch/',
        keyTopics: ['Causal Tracing', 'Sampling Algorithms', 'Telemetry Storage Topologies'],
        relevanceToStack: 'Core theoretical foundation for non-intrusive trace collection in high-throughput systems.',
      },
      {
        institution: 'Chinese Elite (Eng / Sub-Eng)',
        speakerOrProf: 'Prof. Wenguang Chen (Tsinghua University)',
        courseOrTalkTitle: 'Large-Scale Cloud Observability & APM Telemetry',
        languageOrSubs: 'Mandarin with English Subtitles',
        url: 'https://www.bilibili.com/',
        keyTopics: ['Distributed Trace Indexing', 'High-QPS Ingestion', 'ClickHouse Analytical Warehousing'],
        relevanceToStack: 'High-volume time-series and log ingestion architectures.',
      },
      {
        institution: 'US Elite (Stanford/MIT/Berkeley)',
        speakerOrProf: 'Prof. Matei Zaharia (Stanford CS245)',
        courseOrTalkTitle: 'Principles of Data Systems: Streaming Observability & Fast Analytics',
        languageOrSubs: 'English',
        url: 'https://web.stanford.edu/class/cs245/',
        keyTopics: ['Analytical Columnar Engines', 'Real-time Metrics', 'Aggregation Pipelines'],
        relevanceToStack: 'Underpins real-time token cost and latency aggregation across millions of generations.',
      },
    ],
    documentationAndPapers: [
      {
        title: 'Dapper, a Large-Scale Distributed Systems Tracing Infrastructure',
        authors: 'Benjamin H. Sigelman et al. (Google)',
        venueOrYear: 'Google Technical Report (2010)',
        url: 'https://research.google/pubs/pub36356/',
        paperType: 'Seminal Research Paper',
        coreTakeaways: 'Foundational distributed tracing paper establishing trace IDs, parent-child span trees, and low-overhead out-of-band collection.',
      },
      {
        title: 'OpenTelemetry Specification: Semantic Conventions for Generative AI Systems',
        authors: 'OpenTelemetry Working Group',
        venueOrYear: 'Cloud Native Computing Foundation (2024)',
        url: 'https://opentelemetry.io/docs/specs/semconv/gen-ai/',
        paperType: 'RFC / Benchmark Standard',
        coreTakeaways: 'Standardized semantic conventions for LLM requests, token counts, temperatures, model identifiers, and prompt metadata.',
      },
    ],
    reproductionRoadmap: {
      targetLanguage: 'Go',
      sourceLanguage: 'TypeScript/Node',
      prerequisiteSkills: ['OpenTelemetry Go SDK', 'PostgreSQL / ClickHouse analytical queries', 'High-throughput async batching'],
      phase1Foundation: 'Implement high-throughput ingestion HTTP/gRPC server with non-blocking ring-buffer queue.',
      phase2CorePrimitives: 'Build hierarchical trace/span tree collector with token usage and cost accounting calculation.',
      phase3HarnessIntegration: 'Expose REST and OpenTelemetry ingestion endpoints compatible with OpenAI and LangChain tracers.',
      phase4BenchmarkAndParity: 'Demonstrate ingestion rate of 25,000 spans/sec with sub-5ms memory buffer write times.',
      gotchasAndPitfalls: [
        'Buffer flush loops must handle graceful shutdown to prevent trace loss during autoscaling.',
        'High-cardinality metadata keys can degrade database indexes without partitioning or columnar storage.',
      ],
    },
  },

  // 10. BerriAI/litellm (Unified proxy gateway, load balancing & fallbacks across 100+ LLMs)
  'BerriAI/litellm': {
    repoName: 'BerriAI/litellm',
    module: 'NM37',
    book1: {
      title: 'High Performance Browser Networking',
      author: 'Ilya Grigorik',
      year: 2013,
      selectedChapters: [
        'Chapter 2: Transport Layer Security (TLS)',
        'Chapter 9: HTTP/2 Multiplexing',
        'Chapter 11: HTTP/3 & QUIC Transport',
      ],
      chapterTitles: ['Connection Reuse, Keep-Alive Pooling, and Gateway Latency Minimization'],
      focusDomain: 'Network Transport, Keep-Alive Pooling & Low-Latency Proxying',
      nonOverlappingRationale: 'Focuses on socket pooling, TCP/TLS handshake amortisation, and wire protocol streaming without provider model schema normalization.',
    },
    book2: {
      title: 'Building Microservices (2nd Ed)',
      author: 'Sam Newman',
      year: 2021,
      selectedChapters: [
        'Chapter 9: Resiliency (Circuit Breakers & Retries)',
        'Chapter 11: API Gateways and Fallbacks',
        'Chapter 12: Security and Access Tokens',
      ],
      chapterTitles: ['Circuit Breakers, Bulkheads, Dynamic Routing, and Graceful Degradation'],
      focusDomain: 'Gateway Resilience, Fallback Topologies & Multi-Provider Load Balancing',
      nonOverlappingRationale: 'Covers retry budgets, jittered exponential backoff, and circuit breaker states, leaving low-level network tuning to Grigorik.',
    },
    videoLectures: [
      {
        institution: 'ETH Zurich',
        speakerOrProf: 'Prof. Adrian Perrig',
        courseOrTalkTitle: 'Network Security and High-Availability Gateway Routing',
        languageOrSubs: 'English',
        url: 'https://netsec.ethz.ch/',
        keyTopics: ['Multipath Routing', 'Low-Latency Proxying', 'Resilient Network Transports'],
        relevanceToStack: 'Theoretical principles of resilient multi-upstream request dispatch.',
      },
      {
        institution: 'Chinese Elite (Eng / Sub-Eng)',
        speakerOrProf: 'Prof. Ke Xu (Tsinghua University)',
        courseOrTalkTitle: 'Advanced Computer Networks and Cloud Gateway Architectures',
        languageOrSubs: 'Mandarin with English Subtitles',
        url: 'https://www.bilibili.com/',
        keyTopics: ['Reverse Proxy Architectures', 'Dynamic Load Balancing', 'Buffer Management'],
        relevanceToStack: 'Core principles of constructing high-concurrency API proxy servers.',
      },
      {
        institution: 'US Elite (Stanford/MIT/Berkeley)',
        speakerOrProf: 'Prof. David Mazières (Stanford CS244B)',
        courseOrTalkTitle: 'Distributed Systems: Fault Tolerance & Resilient Remote Procedure Calls',
        languageOrSubs: 'English',
        url: 'https://web.stanford.edu/class/cs244b/',
        keyTopics: ['RPC Semantics', 'Idempotency Keys', 'Graceful Fallback Pipelines'],
        relevanceToStack: 'Guarantees reliable call dispatch across unreliable upstream external APIs.',
      },
    ],
    documentationAndPapers: [
      {
        title: 'OpenAI Chat Completion API Specification & Streaming SSE Standard',
        authors: 'OpenAI Developer Platform Team',
        venueOrYear: 'Official Industry Standard (2023)',
        url: 'https://platform.openai.com/docs/api-reference/chat',
        paperType: 'Official Architecture Spec',
        coreTakeaways: 'Standardized request/response contracts, delta streaming format, tool calling schemas, and usage objects.',
      },
      {
        title: 'The Circuit Breaker Pattern in Cloud-Native Gateways',
        authors: 'Michael Nygard',
        venueOrYear: 'Release It! Design Patterns (2018)',
        url: 'https://pragprog.com/titles/mnee2/release-it-second-edition/',
        paperType: 'RFC / Benchmark Standard',
        coreTakeaways: 'Formal state machine (Closed, Open, Half-Open) protecting upstream services from cascade overload.',
      },
    ],
    reproductionRoadmap: {
      targetLanguage: 'Go',
      sourceLanguage: 'Python',
      prerequisiteSkills: ['Go net/http reverse proxy', 'Server-Sent Events (SSE) streaming', 'Atomic rate limiting'],
      phase1Foundation: 'Create unified JSON request/response schema adapter for OpenAI, Anthropic, and Gemini formats.',
      phase2CorePrimitives: 'Build round-robin and latency-weighted provider router with exponential backoff retry policies.',
      phase3HarnessIntegration: 'Implement streaming SSE passthrough proxy with real-time token usage calculation.',
      phase4BenchmarkAndParity: 'Achieve less than 1.5ms added proxy latency on 10,000 concurrent streaming requests.',
      gotchasAndPitfalls: [
        'Streaming SSE responses must be flushed immediately to avoid client-perceived TTFT degradation.',
        'Provider rate limit headers (e.g. 429 Retry-After) must be parsed dynamically to prevent thundering herds.',
      ],
    },
  },

  // 11. MadryLab/robustness (Adversarial robustness & robust representation toolkit)
  'MadryLab/robustness': {
    repoName: 'MadryLab/robustness',
    module: 'NM27',
    book1: {
      title: 'Adversarial Robustness and Machine Learning',
      author: 'Aleksander Madry, Ian Goodfellow, Dimitris Tsipras',
      year: 2021,
      selectedChapters: [
        'Chapter 2: First-Order Adversarial Attacks (FGSM & PGD)',
        'Chapter 4: Robust Optimization via Min-Max Formulations',
        'Chapter 6: Robust Features vs Non-Robust Spurious Correlations',
      ],
      chapterTitles: ['Projected Gradient Descent, Perturbation Norm Bounds, and Adversarial Loss Landscapes'],
      focusDomain: 'Mathematical Optimization & Adversarial Perturbation Bounds',
      nonOverlappingRationale: 'Rigorous mathematical formulation of min-max saddle point games without covering statistical learning theory baselines.',
    },
    book2: {
      title: 'Pattern Recognition and Machine Learning',
      author: 'Christopher Bishop',
      year: 2006,
      selectedChapters: [
        'Chapter 1: Introduction to Probability & Decision Theory',
        'Chapter 4: Linear Models for Classification',
        'Chapter 7: Sparse Kernel Machines & Margin Maximization',
      ],
      chapterTitles: ['Decision Boundaries, Generative vs Discriminative Classifiers, and Risk Bounds'],
      focusDomain: 'Statistical Decision Theory & Representation Geometry',
      nonOverlappingRationale: 'Provides foundational decision boundary geometry and likelihood bounds, serving as the pure theoretical baseline for perturbation analysis.',
    },
    videoLectures: [
      {
        institution: 'ETH Zurich',
        speakerOrProf: 'Prof. Martin Vechev (SRI Lab)',
        courseOrTalkTitle: 'Reliable and Trustworthy Artificial Intelligence (263-2400-00L)',
        languageOrSubs: 'English',
        url: 'https://www.sri.inf.ethz.ch/teaching/rtai24',
        keyTopics: ['Adversarial Perturbation Verification', 'Convex Relaxations & Abstract Interpretation', 'Robust Training Bounds'],
        relevanceToStack: 'World-renowned theoretical lectures on formal mathematical verification of neural networks against adversarial perturbations.',
      },
      {
        institution: 'Chinese Elite (Eng / Sub-Eng)',
        speakerOrProf: 'Prof. Jun Zhu (Tsinghua University)',
        courseOrTalkTitle: 'Adversarial Machine Learning and Robust Deep Generative Models',
        languageOrSubs: 'Mandarin with English Subtitles',
        url: 'https://www.bilibili.com/',
        keyTopics: ['Bayesian Robustness', 'Adversarial Examples in Generative Models', 'Defense Mechanisms'],
        relevanceToStack: 'In-depth exploration of robust representation learning and adversarial evaluation.',
      },
      {
        institution: 'US Elite (Stanford/MIT/Berkeley)',
        speakerOrProf: 'Prof. Aleksander Madry (MIT 6.S978)',
        courseOrTalkTitle: 'Trustworthy and Robust Machine Learning: Optimization & Adversarial Defense',
        languageOrSubs: 'English',
        url: 'https://madry-lab.ml/classes/6.S978/',
        keyTopics: ['Robust Optimization', 'Saddle Point Problem Formulation', 'Non-robust Features'],
        relevanceToStack: 'The authoritative source lectures by the authors of the robustness framework.',
      },
    ],
    documentationAndPapers: [
      {
        title: 'Towards Deep Learning Models Resistant to Adversarial Attacks',
        authors: 'Aleksander Madry, Aleksandar Makelov, Ludwig Schmidt, Dimitris Tsipras, Adrian Vladu',
        venueOrYear: 'ICLR (2018)',
        url: 'https://arxiv.org/abs/1706.06083',
        paperType: 'Seminal Research Paper',
        coreTakeaways: 'Establishes Projected Gradient Descent (PGD) as the universal first-order adversary and formulates robust training as a min-max saddle-point optimization.',
      },
      {
        title: 'Robustness: An Execution Framework for Adversarial Attack and Robust Representation Engineering',
        authors: 'Logan Engstrom, Andrew Ilyas, Shibani Santurkar, Dimitris Tsipras',
        venueOrYear: 'MIT CSAIL Technical Report (2019)',
        url: 'https://github.com/MadryLab/robustness',
        paperType: 'Official Architecture Spec',
        coreTakeaways: 'Standardized API for evaluating adversarial robustness, dataset perturbation synthesis, and custom metric tracking.',
      },
    ],
    reproductionRoadmap: {
      targetLanguage: 'Rust',
      sourceLanguage: 'Python/PyTorch',
      prerequisiteSkills: ['Candle or Tch-rs tensor libraries in Rust', 'Automatic differentiation for input gradient computing', 'SIMD L-infinity projection'],
      phase1Foundation: 'Implement PGD (Projected Gradient Descent) attack loop with L-2 and L-infinity projection clamping.',
      phase2CorePrimitives: 'Build robust training minimax objective kernel interleaving inner attack steps with outer parameter updates.',
      phase3HarnessIntegration: 'Expose standardized evaluation harness assessing empirical robust accuracy vs perturbation epsilon.',
      phase4BenchmarkAndParity: 'Validate exact attack parity with MadryLab Python reference within 0.1% accuracy threshold on standard vision benchmarks.',
      gotchasAndPitfalls: [
        'Random restarts in PGD are critical to escape local non-smooth saddle points in the adversarial loss landscape.',
        'Gradient masking and obfuscation must be tested via black-box evaluation to prevent false sense of robustness.',
      ],
    },
  },
};

/**
 * Helper to retrieve or synthesize study guide for any repository item
 */
export function getStudyGuideForRepo(repoName: string, module: string): RepoStudyGuide {
  if (REPO_STUDY_GUIDES[repoName]) {
    return REPO_STUDY_GUIDES[repoName];
  }

  // --- Domain-Aware Dynamic Synthesis Matrix ---

  // 1. NM28: Bounded Agents, MCP Contracts & Tool Integration
  if (module === 'NM28') {
    return {
      repoName,
      module,
      book1: {
        title: 'Building Real-World AI Agents: System Architecture & Orchestration',
        author: 'Harrison Chase & Chip Huyen',
        year: 2024,
        selectedChapters: ['Chapter 3: Tool Use & MCP Contracts', 'Chapter 5: Cyclic State Machines & Checkpoint Replay'],
        chapterTitles: ['Model Context Protocol, Structured Tool Schemas, and State Handoffs'],
        focusDomain: 'Agent Orchestration, Protocol Schemas & Tool Calling',
        nonOverlappingRationale: 'Focuses strictly on JSON-RPC tool contracts, subagent boundary validation, and loop termination without operating system or Linux process containment details.',
      },
      book2: {
        title: 'Site Reliability Engineering: How Google Runs Production Systems',
        author: 'Niall Richard Murphy, Betsy Beyer, Chris Jones, Jennifer Petoff',
        year: 2016,
        selectedChapters: ['Chapter 12: Addressing Cascading Failures', 'Chapter 21: Handling Overload & Deadlines'],
        chapterTitles: ['Circuit Breakers, Backoff Jitter, and Sandboxed Process Isolation'],
        focusDomain: 'Reliability Engineering, Rate Limits & Failure Containment',
        nonOverlappingRationale: 'Covers infrastructure-level circuit breakers, resource limits, and fault isolation, providing essential production guardrails without touching LLM prompt engineering.',
      },
      videoLectures: [
        {
          institution: 'ETH Zurich',
          speakerOrProf: 'Prof. Ce Zhang & Prof. Ana Klimovic',
          courseOrTalkTitle: 'Systems for Machine Learning: Agent Workflows & Sandboxing',
          languageOrSubs: 'English',
          url: 'https://sysml.ethz.ch/',
          keyTopics: ['Process Isolation', 'Sandbox Security', 'Resource Quotas for Sub-Agents'],
          relevanceToStack: 'Provides rigorous hardware and OS-level virtualization foundations for agent harnesses.',
        },
        {
          institution: 'Chinese Elite (Eng / Sub-Eng)',
          speakerOrProf: 'Prof. Zhiyuan Liu & ModelBest Team (Tsinghua University)',
          courseOrTalkTitle: 'Agentic Reasoning, Tool Use & Multi-Agent Collaboration',
          languageOrSubs: 'Mandarin with English Subtitles',
          url: 'https://www.bilibili.com/',
          keyTopics: ['Tool Calling Protocols', 'Memory Hierarchies', 'Multi-Agent Consensus'],
          relevanceToStack: 'In-depth architectural analysis of high-concurrency agent systems.',
        },
        {
          institution: 'US Elite (Stanford/MIT/Berkeley)',
          speakerOrProf: 'Stanford CS25 Faculty (Transformers & Agents)',
          courseOrTalkTitle: 'Stanford CS25: Advanced Agent Architectures & Computer Use',
          languageOrSubs: 'English',
          url: 'https://web.stanford.edu/class/cs25/',
          keyTopics: ['Cyclic Graphs', 'Tool-Use Fine-Tuning', 'Browser & Desktop Automation'],
          relevanceToStack: 'Authoritative lecture track covering modern agentic execution loops.',
        },
      ],
      documentationAndPapers: [
        {
          title: 'Model Context Protocol (MCP) Specification v1.0',
          authors: 'Anthropic Engineering',
          venueOrYear: 'RFC (2024)',
          url: 'https://github.com/modelcontextprotocol',
          paperType: 'Official Architecture Spec',
          coreTakeaways: 'Standardized open protocol connecting AI models to external tools, resources, and prompt templates.',
        },
        {
          title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
          authors: 'Yao et al.',
          venueOrYear: 'ICLR (2023)',
          url: 'https://arxiv.org/abs/2210.03629',
          paperType: 'Seminal Research Paper',
          coreTakeaways: 'Interleaving thought, action, and observation steps to ground reasoning and minimize hallucinations.',
        },
      ],
      reproductionRoadmap: {
        targetLanguage: 'Rust',
        sourceLanguage: 'Python',
        prerequisiteSkills: ['Async Rust (Tokio)', 'Serde JSON-RPC deserialization', 'Subprocess PTY sandboxing'],
        phase1Foundation: 'Implement JSON-RPC 2.0 transport over stdin/stdout conforming strictly to the MCP specification.',
        phase2CorePrimitives: 'Build stateful cyclic graph with deterministic checkpointing and replay in memory-safe Rust structs.',
        phase3HarnessIntegration: 'Integrate tool registry with automated schema generation and circuit breaker timeout guards.',
        phase4BenchmarkAndParity: 'Assert 100% parity against golden test cases under simulated tool failures and process killed events.',
        gotchasAndPitfalls: [
          'Beware of buffer deadlocks when piping multi-megabyte JSON responses over standard I/O streams.',
          'Always enforce explicit execution timeouts on all tool invocations to prevent hanging agent loops.',
        ],
      },
    };
  }

  // 2. NM26 & NM36: Model APIs, Serving Engines, RAG & KV Paging
  if (module === 'NM26' || module === 'NM36' || module === 'NM40') {
    return {
      repoName,
      module,
      book1: {
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        year: 2017,
        selectedChapters: ['Chapter 3: Storage and Retrieval', 'Chapter 7: Transactions & Latency Bounds'],
        chapterTitles: ['Log-Structured Storage, SSTables, and High-Throughput Indexing'],
        focusDomain: 'Low-Latency Retrieval & Data Structures',
        nonOverlappingRationale: 'Focuses on the database, B-Tree, and LSM storage engine fundamentals without neural network serving topics.',
      },
      book2: {
        title: 'Machine Learning Systems in Production: Architecture & Efficiency',
        author: 'Chip Huyen',
        year: 2022,
        selectedChapters: ['Chapter 7: Real-Time Serving & Batching', 'Chapter 8: Caching & Latency Optimization'],
        chapterTitles: ['Continuous Batching, Prefix Caching, and Streaming Output'],
        focusDomain: 'Inference Serving Topologies & Memory Accounting',
        nonOverlappingRationale: 'Exclusively covers continuous batching, streaming SSE protocols, and model deployment patterns without duplicating database internals.',
      },
      videoLectures: [
        {
          institution: 'ETH Zurich',
          speakerOrProf: 'Prof. Torsten Hoefler',
          courseOrTalkTitle: 'High-Performance Deep Learning Systems: Inference & Memory Bandwidth',
          languageOrSubs: 'English',
          url: 'https://spcl.inf.ethz.ch/',
          keyTopics: ['Roofline Models', 'Memory Bandwidth Bottlenecks', 'Paged Memory Allocation'],
          relevanceToStack: 'Provides the definitive hardware-aware analysis for low-latency transformer inference.',
        },
        {
          institution: 'Chinese Elite (Eng / Sub-Eng)',
          speakerOrProf: 'Prof. Jidong Zhai (Tsinghua University)',
          courseOrTalkTitle: 'High Performance Computing & LLM Serving Optimization',
          languageOrSubs: 'Mandarin with English Subtitles',
          url: 'https://www.bilibili.com/',
          keyTopics: ['In-Flight Batching', 'KV-Cache Management', 'Kernel Fusion'],
          relevanceToStack: 'Walkthrough of continuous batching and high-concurrency token serving.',
        },
        {
          institution: 'US Elite (Stanford/MIT/Berkeley)',
          speakerOrProf: 'UC Berkeley CS294 (Sheng Shen / Ion Stoica)',
          courseOrTalkTitle: 'UC Berkeley CS294: LLM Serving & Systems (vLLM / SGLang Architecture)',
          languageOrSubs: 'English',
          url: 'https://cs294-162.github.io/',
          keyTopics: ['PagedAttention', 'RadixAttention', 'Speculative Decoding'],
          relevanceToStack: 'The core academic series introducing modern paged KV cache engines.',
        },
      ],
      documentationAndPapers: [
        {
          title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention',
          authors: 'Kwon et al. (vLLM Team)',
          venueOrYear: 'SOSP (2023)',
          url: 'https://arxiv.org/abs/2309.06180',
          paperType: 'Seminal Research Paper',
          coreTakeaways: 'PagedAttention eliminates KV-cache memory fragmentation and enables dynamic request batching.',
        },
        {
          title: 'SGLang: Efficient Execution of Structured Language Model Programs',
          authors: 'Zheng et al.',
          venueOrYear: 'arXiv (2023)',
          url: 'https://arxiv.org/abs/2312.07104',
          paperType: 'Seminal Research Paper',
          coreTakeaways: 'RadixAttention shares KV cache across multi-turn queries, prompts, and few-shot examples.',
        },
      ],
      reproductionRoadmap: {
        targetLanguage: 'C++20',
        sourceLanguage: 'Python',
        prerequisiteSkills: ['C++20 memory allocators', 'POSIX shared memory', 'Asynchronous HTTP/SSE streaming'],
        phase1Foundation: 'Implement a block-based memory pool allocating 16-token page tables with zero runtime malloc.',
        phase2CorePrimitives: 'Build continuous batching scheduler with dynamic prefill/decode slot assignment.',
        phase3HarnessIntegration: 'Expose standard OpenAI-compatible REST API endpoints (/v1/chat/completions) with SSE token streaming.',
        phase4BenchmarkAndParity: 'Benchmark token-to-first-token (TTFT) latency and throughput under 100 concurrent requests.',
        gotchasAndPitfalls: [
          'Failure to synchronize KV-cache page pointers between prefill and decode phases causes corrupted attention keys.',
          'Ensure lock-free atomic reference counting on shared prefix cache nodes.',
        ],
      },
    };
  }

  // 3. NM01 & NM08: Linux Systems, CLI, Developer Tools & Infrastructure
  if (module === 'NM01' || module === 'NM08') {
    return {
      repoName,
      module,
      book1: {
        title: 'The Linux Programming Interface',
        author: 'Michael Kerrisk',
        year: 2010,
        selectedChapters: ['Chapter 4: File I/O', 'Chapter 20: Signals', 'Chapter 56: Sockets'],
        chapterTitles: ['File Descriptors, Signal Handling, and Unix Domain Sockets'],
        focusDomain: 'POSIX Primitives & Linux Kernel APIs',
        nonOverlappingRationale: 'Focuses purely on C-level kernel system calls, process lifecycles, and IPC without high-level user interface or web patterns.',
      },
      book2: {
        title: 'Designing Embedded Systems and Toolchains',
        author: 'Jonathan Corbet & Greg Kroah-Hartman',
        year: 2018,
        selectedChapters: ['Chapter 3: Building Minimal Runtimes', 'Chapter 6: Debugging with strace and perf'],
        chapterTitles: ['Deterministic Toolchains, Syscall Profiling, and Process Trees'],
        focusDomain: 'Reproducible Developer Tooling & Ergonomics',
        nonOverlappingRationale: 'Focuses on developer ergonomics, CLI conventions, and reproducible environment lockfiles without repeating POSIX API specifications.',
      },
      videoLectures: [
        {
          institution: 'ETH Zurich',
          speakerOrProf: 'Prof. Timothy Roscoe',
          courseOrTalkTitle: 'Advanced Operating Systems: Kernels, Hardware & POSIX',
          languageOrSubs: 'English',
          url: 'https://systems.ethz.ch/',
          keyTopics: ['System Call Dispatch', 'Virtual Memory Mapping', 'File System Cache Layers'],
          relevanceToStack: 'Authoritative systems foundations for building reliable developer tools and runtimes.',
        },
        {
          institution: 'Chinese Elite (Eng / Sub-Eng)',
          speakerOrProf: 'Prof. Chen Xiang (ICT CAS / One Student One Chip)',
          courseOrTalkTitle: 'Operating System Internals & Linux Shell Ergonomics',
          languageOrSubs: 'Mandarin with English Subtitles',
          url: 'https://www.bilibili.com/',
          keyTopics: ['Process Control Blocks', 'Signal Traps', 'TTY / PTY Emulation'],
          relevanceToStack: 'Hands-on breakdown of terminal emulation, shell pipes, and CLI execution.',
        },
        {
          institution: 'US Elite (Stanford/MIT/Berkeley)',
          speakerOrProf: 'MIT Missing Semester Faculty (Athalye, Gjengset, Yang)',
          courseOrTalkTitle: 'MIT: The Missing Semester of Your CS Education',
          languageOrSubs: 'English',
          url: 'https://missing.csail.mit.edu/',
          keyTopics: ['Shell Scripting', 'Git Internals', 'Build Systems & Profiling'],
          relevanceToStack: 'Crucial developer ergonomics and reproducibility mastery.',
        },
      ],
      documentationAndPapers: [
        {
          title: 'The POSIX.1-2017 Standard Specification',
          authors: 'IEEE & The Open Group',
          venueOrYear: 'IEEE Std 1003.1 (2017)',
          url: 'https://pubs.opengroup.org/onlinepubs/9699919799/',
          paperType: 'Official Architecture Spec',
          coreTakeaways: 'Standardized interfaces for file I/O, process management, signals, and terminal control.',
        },
        {
          title: 'Git from the Bottom Up',
          authors: 'John Wiegley',
          venueOrYear: 'Technical Monograph (2009)',
          url: 'https://jwiegley.github.io/git-from-the-bottom-up/',
          paperType: 'Seminal Research Paper',
          coreTakeaways: 'Content-addressable storage, directed acyclic commit graphs, and index state trees.',
        },
      ],
      reproductionRoadmap: {
        targetLanguage: 'Rust',
        sourceLanguage: 'C',
        prerequisiteSkills: ['Rust ownership', 'POSIX libc bindings', 'Terminal ANSI escape parsing'],
        phase1Foundation: 'Implement CLI argument parsing and signal handling (SIGINT, SIGTERM, SIGHUP) cleanly.',
        phase2CorePrimitives: 'Build non-blocking I/O event loop using mio or tokio with sub-millisecond dispatch.',
        phase3HarnessIntegration: 'Provide structured JSON output flag (--json) and POSIX return codes for pipeline chaining.',
        phase4BenchmarkAndParity: 'Validate memory footprint under 15MB RSS and verify deterministic operation across platforms.',
        gotchasAndPitfalls: [
          'Remember to flush stdout buffers before process exit or when piping output to other commands.',
          'Always clean up child process zombie entries via waitpid handling.',
        ],
      },
    };
  }

  // 4. Default Intelligent Fallback
  return {
    repoName,
    module,
    book1: {
      title: 'Designing Data-Intensive Applications',
      author: 'Martin Kleppmann',
      year: 2017,
      selectedChapters: ['Chapter 3: Storage and Retrieval', 'Chapter 7: Transactions & Isolation Levels'],
      chapterTitles: ['Log-Structured Storage, SSTables, and Serializable Execution'],
      focusDomain: 'Reliable Storage & Distributed Consistency',
      nonOverlappingRationale: 'Focuses on database and storage engine primitives without AI model specific topics.',
    },
    book2: {
      title: 'Machine Learning Design Patterns',
      author: 'Valliappa Lakshmanan, Sara Robinson, Michael Munn',
      year: 2020,
      selectedChapters: ['Chapter 5: Serving Patterns', 'Chapter 9: Model Integrity and Drift Monitoring'],
      chapterTitles: ['Stateless Serving, Keyed Predictions, and Real-Time Calibration Checks'],
      focusDomain: 'Production Serving and System Boundaries',
      nonOverlappingRationale: 'Focuses on architectural design patterns for microservices and serving infrastructure.',
    },
    videoLectures: [
      {
        institution: 'ETH Zurich',
        speakerOrProf: 'Prof. Torsten Hoefler',
        courseOrTalkTitle: 'High-Performance Deep Learning Systems',
        languageOrSubs: 'English',
        url: 'https://spcl.inf.ethz.ch/',
        keyTopics: ['Distributed Execution', 'Hardware Bottlenecks', 'Memory Bandwidth Bounds'],
        relevanceToStack: 'Provides foundational hardware-aware analysis for systems engineering.',
      },
      {
        institution: 'Chinese Elite (Eng / Sub-Eng)',
        speakerOrProf: 'Prof. Zhiyuan Liu (Tsinghua University)',
        courseOrTalkTitle: 'Deep Learning & Foundation Model Engineering',
        languageOrSubs: 'Mandarin with English Subtitles',
        url: 'https://www.bilibili.com/',
        keyTopics: ['Model Architecture', 'Fine-Tuning Harnesses', 'Evaluation Pipelines'],
        relevanceToStack: 'Detailed walkthrough of foundation model deployment and evaluation.',
      },
      {
        institution: 'US Elite (Stanford/MIT/Berkeley)',
        speakerOrProf: 'Stanford CS25 / MIT 6.S191 Faculty',
        courseOrTalkTitle: 'Foundation Models & System Scaling',
        languageOrSubs: 'English',
        url: 'https://web.stanford.edu/class/cs25/',
        keyTopics: ['Attention Mechanisms', 'Scaling Laws', 'Production Deployment'],
        relevanceToStack: 'Authoritative Stanford and MIT foundational lecture series.',
      },
    ],
    documentationAndPapers: [
      {
        title: 'Attention Is All You Need',
        authors: 'Vaswani et al.',
        venueOrYear: 'NeurIPS (2017)',
        url: 'https://arxiv.org/abs/1706.03762',
        paperType: 'Seminal Research Paper',
        coreTakeaways: 'Foundational multi-head self-attention architecture without recurrence or convolutions.',
      },
      {
        title: 'Open Source Architecture Reference and Specification',
        authors: 'Project Maintainers',
        venueOrYear: 'Official Documentation',
        url: `https://github.com/${repoName}`,
        paperType: 'Official Architecture Spec',
        coreTakeaways: 'Primary API reference, configuration schema, and test suite verification commands.',
      },
    ],
    reproductionRoadmap: {
      targetLanguage: 'Rust',
      sourceLanguage: 'Python',
      prerequisiteSkills: ['Systems programming', 'Memory safety & concurrency', 'Benchmarking harness execution'],
      phase1Foundation: 'Deconstruct Python module boundaries and extract pure core algorithmic functions.',
      phase2CorePrimitives: 'Implement thread-safe Rust structs with zero unneeded memory allocations.',
      phase3HarnessIntegration: 'Expose standardized CLI or JSON-RPC interface conforming to MCP protocol standards.',
      phase4BenchmarkAndParity: 'Validate functional parity against golden test cases with automated differential assertions.',
      gotchasAndPitfalls: [
        'Check precision differences between FP32 and FP16 across hardware architectures.',
        'Ensure proper synchronization when spawning asynchronous tasks.',
      ],
    },
  };
}
