export type ModuleCompletionStatus = 'not_started' | 'in_progress' | 'completed';

export interface CurriculumModule {
  id: string;
  stage: string;
  stageName: string;
  title: string;
  hours: number;
  goal: string;
  coreKeywords: string[];
  harnessRole: string;
  prerequisites: string[];
  description: string;
  completionStatus: ModuleCompletionStatus;
  keyTools: string[];
  demandedMaterials: string[];
  learningObjectives: string[];
}

export const CURRICULUM_MODULES: CurriculumModule[] = [
  {
    id: 'NM01',
    stage: 'N0',
    stageName: 'Systems Foundations',
    title: 'Independent programming, Linux and reproducibility',
    hours: 120,
    completionStatus: 'completed',
    keyTools: ['bash', 'posix-cli', 'tmux', 'git', 'uv', 'strace'],
    demandedMaterials: [
      'Linux Kernel Programming & Systems Foundations',
      'The Linux Command Line (William Shotts)',
      'MIT The Missing Semester of Your CS Education',
    ],
    learningObjectives: [
      'Master POSIX shell scripting and signal handling',
      'Build deterministic virtual environments with uv and reproducible lockfiles',
      'Profile Linux system calls using strace, perf, and lsof under high load',
    ],
    goal: 'Master POSIX shell scripting, Linux kernel primitives, system calls, deterministic builds, and environment reproducibility.',
    coreKeywords: ['linux', 'programming', 'bash', 'posix', 'reproducibility', 'git', 'cli', 'environment', 'virtualenv', 'scripting'],
    harnessRole: 'Host Execution & Container Sandboxing Base',
    prerequisites: ['Basic command line'],
    description: 'Establishes rock-solid developer ergonomics, shell mastery, compiler toolchains, and immutable runtime environments necessary for scalable AI systems engineering.',
  },
  {
    id: 'NM02',
    stage: 'N0',
    stageName: 'Systems Foundations',
    title: 'Discrete reasoning, data structures and algorithms',
    hours: 200,
    completionStatus: 'completed',
    keyTools: ['valgrind', 'gprof', 'c++20', 'python-dis', 'pytest'],
    demandedMaterials: [
      'Introduction to Algorithms (CLRS 4th Ed)',
      'MIT 6.006 Introduction to Algorithms (Erik Demaine)',
      'Algorithms in C++ (Robert Sedgewick)',
    ],
    learningObjectives: [
      'Analyze amortized asymptotic computational complexity of dynamic structures',
      'Implement cache-friendly trees, heaps, and graph traversal routines',
      'Build fast priority queues and radix search graphs with minimal allocations',
    ],
    goal: 'Build fundamental algorithmic thinking: asymptotic analysis, trees, graphs, dynamic programming, and memory-conscious data structures.',
    coreKeywords: ['data structures', 'algorithms', 'discrete math', 'graphs', 'trees', 'dynamic programming', 'complexity', 'sorting', 'search'],
    harnessRole: 'Computational Complexity & Graph Traversal Core',
    prerequisites: ['NM01'],
    description: 'Rigorous algorithmic fundamentals implemented in clean C++/Python, with explicit computational complexity proofs and memory footprint tracking.',
  },
  {
    id: 'NM04',
    stage: 'N0',
    stageName: 'Systems Foundations',
    title: 'SQL, transactions and data correctness',
    hours: 160,
    completionStatus: 'completed',
    keyTools: ['postgresql', 'sqlite3', 'pg_stat_statements', 'wal-g', 'dbt'],
    demandedMaterials: [
      'Database Internals (Alex Petrov)',
      'CMU 15-445/645 Database Systems (Andy Pavlo)',
      'PostgreSQL 16 High Performance Manual',
    ],
    learningObjectives: [
      'Formulate ACID guarantees and verify serializable isolation anomalies',
      'Deep dive into query planner index scans, cost models, and MVCC mechanics',
      'Implement zero-data-loss WAL replay and transactional checkpointing',
    ],
    goal: 'Relational algebra, ACID guarantees, transaction isolation levels, query optimization, indexing strategies, and data integrity.',
    coreKeywords: ['sql', 'database', 'transactions', 'acid', 'relational', 'postgres', 'indexes', 'query optimization', 'concurrency'],
    harnessRole: 'State Persistence & Transactional Guardrails',
    prerequisites: ['NM01', 'NM02'],
    description: 'Relational storage engines, query planner deep dives, MVCC locking mechanics, and zero-data-loss consistency guarantees for AI platforms.',
  },
  {
    id: 'NM07',
    stage: 'N1',
    stageName: 'Data Infrastructure',
    title: 'Storage internals, indexes and recovery',
    hours: 200,
    completionStatus: 'in_progress',
    keyTools: ['faiss', 'hnswlib', 'rocksdb', 'falkordb', 'neo4j'],
    demandedMaterials: [
      'Designing Data-Intensive Applications (Martin Kleppmann)',
      'FAISS: A Library for Efficient Similarity Search (Johnson et al.)',
      'Stanford CS345 Data Mining & Vector Storage',
    ],
    learningObjectives: [
      'Implement write-ahead logging (WAL) and LSM-Tree memtable compaction',
      'Construct high-dimensional vector similarity indexes (HNSW, IVFFlat)',
      'Audit recall vs latency trade-offs under million-scale vector retrieval',
    ],
    goal: 'Design storage engines: B-trees, LSM trees, write-ahead logs (WAL), vector similarity indexes (HNSW, IVFFlat), and crash recovery.',
    coreKeywords: ['storage', 'b-tree', 'lsm-tree', 'wal', 'faiss', 'vector index', 'hnsw', 'embeddings', 'similarity search', 'recovery'],
    harnessRole: 'Vector Store & Embeddings Indexing Subsystem',
    prerequisites: ['NM04'],
    description: 'Low-level disk and RAM indexing structures, crash consistency, WAL replay, and high-performance vector retrieval architectures like FAISS and Annoy.',
  },
  {
    id: 'NM08',
    stage: 'N1',
    stageName: 'Data Infrastructure',
    title: 'Cloud, containers and reproducible infrastructure',
    hours: 180,
    completionStatus: 'completed',
    keyTools: ['robusta', 'docker', 'kubernetes', 'kubeflow', 'helm', 'k9s', 'containerd'],
    demandedMaterials: [
      'Kubernetes: Up and Running (Kelsey Hightower, Brendan Burns)',
      'Site Reliability Engineering (Beyer, Jones, Petoff, Murphy / Google)',
      'MIT OCW Distributed Computer Systems & Cloud Containers',
    ],
    learningObjectives: [
      'Construct hermetic OCI container images with multi-stage reproducible builds',
      'Deploy and monitor Kubernetes operator controllers and auto-remediation (Robusta)',
      'Isolate untrusted agent code via microVMs, cgroups v2, and seccomp profiles',
    ],
    goal: 'Container runtimes (Docker, OCI), orchestration with Kubernetes, declarative infrastructure, and isolated sandbox execution environments.',
    coreKeywords: ['cloud', 'docker', 'containers', 'kubernetes', 'k8s', 'sandbox', 'mlops', 'infrastructure', 'swe-bench', 'reproducibility', 'robusta'],
    harnessRole: 'Isolated Agent Execution Sandboxes & MicroVMs',
    prerequisites: ['NM01'],
    description: 'Containerized reproducible micro-environments, cgroups, namespaces, security confinement, automated cluster troubleshooting with Robusta, and scalable Kubernetes clusters for model execution.',
  },
  {
    id: 'NM17',
    stage: 'N3',
    stageName: 'Distributed Systems',
    title: 'Distributed execution and MapReduce',
    hours: 240,
    completionStatus: 'in_progress',
    keyTools: ['ray', 'kserve', 'xinference', 'grpc', 'etcd', 'dask'],
    demandedMaterials: [
      'Distributed Systems: Principles and Paradigms (Tanenbaum, Van Steen)',
      'MIT 6.824 Distributed Systems (Robert Morris)',
      'Google MapReduce & Ray: A Distributed Execution Framework',
    ],
    learningObjectives: [
      'Implement distributed task scheduling and fault-tolerant actor supervisors',
      'Coordinate cluster RPC serialization with gRPC, Protobuf, and zero-copy buffers',
      'Manage dynamic worker pools and auto-scaling model serving clusters',
    ],
    goal: 'Distributed computation models, fault-tolerant cluster scheduling, data partitioning, shuffle protocols, and consensus mechanisms.',
    coreKeywords: ['distributed', 'mapreduce', 'cluster', 'partitioning', 'shuffle', 'kserve', 'fault tolerance', 'rpc', 'consensus', 'ray'],
    harnessRole: 'Distributed Task Dispatch & Worker Scheduling',
    prerequisites: ['NM02', 'NM08'],
    description: 'Scale-out distributed compute engines, message brokers, job scheduling, and high-throughput inter-node data shuffles.',
  },
  {
    id: 'NM19',
    stage: 'N3',
    stageName: 'Distributed Systems',
    title: 'Streaming data, schemas, lineage and experiments',
    hours: 200,
    completionStatus: 'not_started',
    keyTools: ['feast', 'dvc', 'kafka', 'label-studio', 'avro', 'mlflow'],
    demandedMaterials: [
      'Streaming Systems: The What, Where, When, and How of Large-Scale Data (Akidau et al.)',
      'Designing Machine Learning Systems (Chip Huyen)',
      'UC Berkeley CS186 Streaming & Feature Storage',
    ],
    learningObjectives: [
      'Configure real-time event streaming pipelines with strict schema validation',
      'Manage versioned feature stores with point-in-time correctness (Feast)',
      'Enforce complete dataset provenance and model lineage tracking with DVC',
    ],
    goal: 'Event streaming, schema validation, data version control (DVC), feature stores (Feast), and experiment tracking lineage.',
    coreKeywords: ['streaming', 'kafka', 'schemas', 'lineage', 'dvc', 'feast', 'feature store', 'label-studio', 'annotation', 'versioning'],
    harnessRole: 'Context Lineage & Event Streaming Backplane',
    prerequisites: ['NM04', 'NM17'],
    description: 'Real-time event processing pipelines, data contracts, feature stores, reproducible dataset versioning, and human-in-the-loop annotation workflows.',
  },
  {
    id: 'NM21',
    stage: 'N4',
    stageName: 'Deep Learning Core',
    title: 'Linear algebra, calculus and numerical foundations',
    hours: 132,
    completionStatus: 'completed',
    keyTools: ['numpy', 'scipy', 'sympy', 'arrayfire', 'eigen3'],
    demandedMaterials: [
      'Linear Algebra and Learning from Data (Gilbert Strang)',
      'Mathematics for Machine Learning (Deisenroth, Faisal, Ong)',
      'MIT 18.06 Linear Algebra (Gilbert Strang OpenCourseWare)',
    ],
    learningObjectives: [
      'Derive Singular Value Decomposition (SVD), spectral theorems, and condition numbers',
      'Calculate multivariable tensor Jacobians, Hessians, and directional derivatives',
      'Identify floating-point underflow/overflow and conditioning stability bottlenecks',
    ],
    goal: 'Matrix decompositions (SVD, QR, Eigen), multivariate vector calculus, automatic differentiation math, and numerical stability.',
    coreKeywords: ['linear algebra', 'matrices', 'calculus', 'eigenvalues', 'svd', 'gradients', 'optimization', 'scipy', 'numerical stability'],
    harnessRole: 'Mathematical & Gradient Foundations',
    prerequisites: ['NM02'],
    description: 'Comprehensive mathematical underpinnings from Gilbert Strang linear algebra to gradient flows, conditioning, and floating-point roundoff dynamics.',
  },
  {
    id: 'NM22',
    stage: 'N4',
    stageName: 'Deep Learning Core',
    title: 'Probability, statistical testing and credible decisions',
    hours: 408,
    completionStatus: 'in_progress',
    keyTools: ['pymc', 'scipy-stats', 'statsmodels', 'bootstrap-ci'],
    demandedMaterials: [
      'Probabilistic Machine Learning: An Introduction (Kevin Murphy)',
      'Information Theory, Inference, and Learning Algorithms (David MacKay)',
      'Harvard Stat 110: Introduction to Probability (Joe Blitzstein)',
    ],
    learningObjectives: [
      'Conduct rigorous Bayesian inference, posterior predictive checks, and MCMC',
      'Formulate confidence intervals, bootstrap statistics, and multiple-testing correction',
      'Compute Shannon entropy, mutual information, and cross-entropy divergences',
    ],
    goal: 'Bayesian inference, hypothesis testing, confidence intervals, information theory (entropy, KL divergence), and decision theory.',
    coreKeywords: ['probability', 'statistics', 'hypothesis testing', 'bayes', 'entropy', 'kl divergence', 'causal', 'data science', 'evaluation'],
    harnessRole: 'Uncertainty Quantification & Benchmark Rigor',
    prerequisites: ['NM21'],
    description: 'Rigorous statistical methods, maximum likelihood estimation, confidence calibration, significance testing, and error decomposition.',
  },
  {
    id: 'NM23',
    stage: 'N4',
    stageName: 'Deep Learning Core',
    title: 'Statistical learning, calibration and robust baselines',
    hours: 320,
    completionStatus: 'in_progress',
    keyTools: ['scikit-learn', 'xgboost', 'lightgbm', 'evidently', 'optuna'],
    demandedMaterials: [
      'The Elements of Statistical Learning (Hastie, Tibshirani, Friedman)',
      'Hands-On Machine Learning (Aurélien Géron, 3rd Ed)',
      'Stanford CS229 Machine Learning (Andrew Ng)',
    ],
    learningObjectives: [
      'Implement regularized linear models, tree ensembles, and gradient boosting',
      'Calibrate probability estimates using Platt scaling and Isotonic regression',
      'Detect covariate shift, concept drift, and data leakage across splits',
    ],
    goal: 'Classical ML algorithms (linear/logistic regression, SVM, GBDT, random forests), cross-validation, hyperparameter tuning, and model calibration.',
    coreKeywords: ['machine learning', 'scikit-learn', 'gbdt', 'xgboost', 'lightgbm', 'calibration', 'classification', 'regression', 'baselines'],
    harnessRole: 'Diagnostic Baselines & Model Monitoring',
    prerequisites: ['NM21', 'NM22'],
    description: 'Solid foundational modeling without black boxes. Supervised and unsupervised statistical learners, proper validation splits, and metric trade-offs.',
  },
  {
    id: 'NM24',
    stage: 'N4',
    stageName: 'Deep Learning Core',
    title: 'Autograd and a transparent neural network',
    hours: 440,
    completionStatus: 'in_progress',
    keyTools: ['micrograd', 'mingpt', 'pytorch', 'burn', 'executorch'],
    demandedMaterials: [
      'Deep Learning (Goodfellow, Bengio, Courville)',
      'Neural Networks: Zero to Hero (Andrej Karpathy)',
      'MIT 6.S191 Introduction to Deep Learning',
    ],
    learningObjectives: [
      'Implement reverse-mode automatic differentiation DAG engine from scratch',
      'Code forward and backward passes for Linear, ReLU, LayerNorm, and CrossEntropy',
      'Verify numerical gradient equivalence with finite differences',
    ],
    goal: 'Build an autograd computation engine (like micrograd/minGPT) from scratch: reverse-mode autodiff, backpropagation, and transparent MLP training.',
    coreKeywords: ['autograd', 'backprop', 'micrograd', 'mingpt', 'neural network', 'pytorch', 'tensors', 'loss functions', 'optimizers', 'karpathy'],
    harnessRole: 'Transparent Gradient Computation & Kernel Primitives',
    prerequisites: ['NM21', 'NM23'],
    description: 'Building deep learning from the ground up: implement tensor operations, reverse-mode autodiff tape, SGD/Adam optimizers, and verify numerical gradients.',
  },
  {
    id: 'NM25',
    stage: 'N4',
    stageName: 'Deep Learning Core',
    title: 'Transformers, tokenization and reproducible small models',
    hours: 480,
    completionStatus: 'in_progress',
    keyTools: ['nanogpt', 'llm.c', 'tiktoken', 'sentencepiece', 'litgpt', 'qlora'],
    demandedMaterials: [
      'Attention Is All You Need (Vaswani et al. 2017)',
      'Build a Large Language Model (from Scratch) (Sebastian Raschka)',
      'Stanford CS25: Transformers United V6',
    ],
    learningObjectives: [
      'Implement byte-pair encoding (BPE) tokenizer training and byte token fallback',
      'Code Multi-Head Self-Attention, RoPE positional encodings, and KV projections',
      'Train a reproducible 124M parameter model on raw text corpora with FP16/BF16',
    ],
    goal: 'Full architecture of Transformer models: multi-head self-attention, RoPE positional encodings, byte-pair encoding (BPE) tokenizers, and pretraining loops.',
    coreKeywords: ['transformer', 'attention', 'tokenization', 'bpe', 'nanogpt', 'llm.c', 'nanochat', 'llm101n', 'tiktoken', 'pretraining'],
    harnessRole: 'Core Transformer Engine & Context Windows',
    prerequisites: ['NM24'],
    description: 'From attention math to full decoder-only LLM pretraining: implement Byte-Pair Encoding, multi-query attention, rotary embeddings, and train 124M param models.',
  },
  {
    id: 'NM26',
    stage: 'N5',
    stageName: 'Model Systems & Agents',
    title: 'Model APIs, serving engines and inference observability',
    hours: 360,
    completionStatus: 'in_progress',
    keyTools: ['haystack', 'vllm', 'sglang', 'langfuse', 'openllmetry', 'graphrag', 'lightrag', 'litellm'],
    demandedMaterials: [
      'Natural Language Processing with Transformers (Tunstall, von Werra, Wolf)',
      'Designing Machine Learning Systems (Chip Huyen)',
      'Triton / vLLM Architecture & PagedAttention Paper (Kwon et al.)',
    ],
    learningObjectives: [
      'Deploy production LLM serving with continuous dynamic batching and streaming',
      'Build modular retrieval-augmented generation (RAG) pipelines using Haystack 2.x',
      'Instrument OpenLLMetry and Langfuse distributed tracing for latency audits',
    ],
    goal: 'High-throughput LLM serving: continuous batching, streaming APIs, speculative decoding, OpenLLMetry tracing, Haystack RAG pipelines, and inference observability.',
    coreKeywords: ['inference', 'serving', 'vllm', 'sglang', 'rag', 'retrieval', 'haystack', 'openllmetry', 'langfuse', 'telemetry', 'continuous batching', 'graphrag'],
    harnessRole: 'Serving Backplane & Latency Profiling',
    prerequisites: ['NM25', 'NM08'],
    description: 'Deploying model servers with sub-millisecond overhead, continuous batching, chunked prefill, distributed tracing, and semantic retrieval systems.',
  },
  {
    id: 'NM27',
    stage: 'N5',
    stageName: 'Model Systems & Agents',
    title: 'AI product economics, batching and experiment governance',
    hours: 280,
    completionStatus: 'not_started',
    keyTools: ['deepeval', 'ragas', 'harmbench', 'phoenix', 'tensorzero', 'promptfoo'],
    demandedMaterials: [
      'Reliable Machine Learning: Applying SRE Principles to ML (O’Reilly)',
      'HarmBench: A Standardized Evaluation Framework for Automated Red Teaming',
      'Stanford CS324: Large Language Models Foundations & Economics',
    ],
    learningObjectives: [
      'Calculate unit economics: token-per-dollar, amortized GPU CAPEX, and latency frontiers',
      'Automate LLM regression testing with DeepEval, RAGAS, and synthetic adversarial probes',
      'Enforce real-time guardrails against indirect prompt injections and jailbreak attacks',
    ],
    goal: 'Inference unit economics, token cost accounting, evaluation benchmarks (SWE-bench, HarmBench, DeepEval), and safety red-teaming guardrails.',
    coreKeywords: ['economics', 'cost', 'token throughput', 'evaluation', 'deepeval', 'ragas', 'harmbench', 'safety', 'guardrails', 'phoenix', 'swe-bench'],
    harnessRole: 'Safety Guardrails & Economic Cost Auditing',
    prerequisites: ['NM26'],
    description: 'Rigorous economics and governance: calculate token per dollar, evaluate latency-quality frontiers, and enforce safety guardrails against prompt injection and jailbreaks.',
  },
  {
    id: 'NM28',
    stage: 'N5',
    stageName: 'Model Systems & Agents',
    title: 'Bounded agents, MCP contracts and security evaluation',
    hours: 500,
    completionStatus: 'in_progress',
    keyTools: ['modelcontextprotocol', 'swe-bench', 'robusta', 'openhands', 'autogen', 'nanobot', 'deepseek-harness', 'crewai'],
    demandedMaterials: [
      'Anthropic Model Context Protocol (MCP) Specification v1.0',
      'SWE-bench: Can Language Models Resolve Real-World GitHub Issues? (Jimenez et al.)',
      'Agentic Systems Architecture & Sandboxing Masterclass',
    ],
    learningObjectives: [
      'Implement strict JSON-RPC 2.0 Model Context Protocol (MCP) clients and servers',
      'Engineer hermetic sandboxed execution loops with timeout and rollback guarantees',
      'Build autonomous SWE agents capable of solving verified SWE-bench software issues',
    ],
    goal: 'Higher Agent Harness architecture: Model Context Protocol (MCP) server/client contracts, sandboxed tool execution, self-correction, automated remediation with Robusta, and autonomous SWE workflows.',
    coreKeywords: ['agents', 'mcp', 'model context protocol', 'harness', 'deepseek-harness', 'openharness', 'tools', 'sandbox', 'autogen', 'swe-agent', 'nanobot', 'robusta'],
    harnessRole: 'Higher Harness Protocol, Tool Contracts & Multi-Agent Loop',
    prerequisites: ['NM26', 'NM27'],
    description: 'The pinnacle of agent engineering: architect secure MCP tool protocols, state machine execution loops, isolated Docker sandboxes, and autonomous software development agents.',
  },
  {
    id: 'NM32',
    stage: 'N6',
    stageName: 'GPU Architecture & Kernels',
    title: 'CUDA execution, memory and synchronization',
    hours: 340,
    completionStatus: 'not_started',
    keyTools: ['cuda-c++', 'nsight-compute', 'nsight-systems', 'nvcc', 'fluidx3d'],
    demandedMaterials: [
      'Programming Massively Parallel Processors (Kirk & Hwu, 4th Ed)',
      'CUDA C++ Programming Guide (NVIDIA Documentation)',
      'UIUC ECE 408 Applied Parallel Programming (Wen-Mei Hwu)',
    ],
    learningObjectives: [
      'Analyze GPU memory hierarchy: registers, shared memory, L1/L2 caches, and HBM',
      'Write coalesced global memory access patterns and avoid warp divergence',
      'Profile occupancy, arithmetic intensity, and memory bottlenecks with Nsight Compute',
    ],
    goal: 'GPU hardware microarchitecture: streaming multiprocessors (SMs), warps, shared memory, coalesced global memory access, and warp barrier synchronizations.',
    coreKeywords: ['cuda', 'gpu', 'shared memory', 'warps', 'coalescing', 'synchronization', 'kernels', 'ptx', 'hardware', 'fluidx3d'],
    harnessRole: 'Bare-Metal Accelerator Execution Layer',
    prerequisites: ['NM21', 'NM24'],
    description: 'Low-level CUDA C++ programming: writing custom reduction, matrix multiplication, and convolution kernels with optimal arithmetic intensity and warp scheduling.',
  },
  {
    id: 'NM34',
    stage: 'N6',
    stageName: 'GPU Architecture & Kernels',
    title: 'Triton, IO-aware attention and independent numerical validation',
    hours: 320,
    completionStatus: 'not_started',
    keyTools: ['triton', 'flashattention', 'xformers', 'torch-compile', 'cutlass'],
    demandedMaterials: [
      'FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness (Dao et al.)',
      'OpenAI Triton: An Intermediate Language and Compiler for Tiled Neural Networks (Tillet et al.)',
      'Stanford CS330 Deep Multi-Task and Meta-Learning',
    ],
    learningObjectives: [
      'Write tiled matrix multiply and fused activation kernels in OpenAI Triton',
      'Implement FlashAttention SRAM tiling to eliminate O(N^2) memory footprint',
      'Verify numerical bitwise equivalence against PyTorch native baselines',
    ],
    goal: 'OpenAI Triton kernel programming, FlashAttention IO-aware memory hierarchies (SRAM vs HBM), block-level tiling, and numerical equivalence proofs.',
    coreKeywords: ['triton', 'flashattention', 'io-aware', 'sram', 'hbm', 'attention kernel', 'xformers', 'tiling', 'autotuning'],
    harnessRole: 'Custom Kernel Compilation & Attention Acceleration',
    prerequisites: ['NM32', 'NM25'],
    description: 'Modern GPU compilation via Triton: tile-level programming, fusing activation and projection layers, and implementing O(N) memory IO-aware FlashAttention.',
  },
  {
    id: 'NM36',
    stage: 'N7',
    stageName: 'Inference Engines',
    title: 'KV-cache accounting, paging and memory management',
    hours: 300,
    completionStatus: 'not_started',
    keyTools: ['pagedattention', 'vllm', 'gear', 'ktransformers', 'mooncake'],
    demandedMaterials: [
      'Efficient Memory Management for Large Language Model Serving with PagedAttention (Kwon et al.)',
      'Fast Distributed Inference in Large Language Models (Pope et al.)',
      'UC Berkeley Sky Computing Lab LLM Serving Lectures',
    ],
    learningObjectives: [
      'Design virtual memory page tables and physical block allocators for KV-caches',
      'Implement radixed prefix caching to share KV tensors across prompt prefixes',
      'Manage chunked prefill to eliminate decode phase bubble stalls',
    ],
    goal: 'PagedAttention virtual memory algorithms, KV-cache prefix caching, chunked prefill, and dynamic memory allocation in high-concurrency LLM inference.',
    coreKeywords: ['kv-cache', 'pagedattention', 'prefix caching', 'memory management', 'vllm', 'chunked prefill', 'gear', 'ktransformers'],
    harnessRole: 'Virtual KV-Cache Paging & Token Buffer Management',
    prerequisites: ['NM26', 'NM34'],
    description: 'Solving the memory wall in LLM serving: implement virtual memory paging for attention keys and values, hierarchical DRAM/SRAM swapping, and radixed prefix caches.',
  },
  {
    id: 'NM37',
    stage: 'N7',
    stageName: 'Inference Engines',
    title: 'Quantization, calibration and precision-dependent execution',
    hours: 340,
    completionStatus: 'not_started',
    keyTools: ['bitsandbytes', 'awq', 'gptq', 'litellm', 'llm-compressor', 'deepsparse'],
    demandedMaterials: [
      'AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration (Lin et al.)',
      'GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers (Frantar et al.)',
      'MIT Han Lab TinyML and Efficient Deep Learning Computing',
    ],
    learningObjectives: [
      'Protect salient outlier channels with activation-aware weight quantization (AWQ)',
      'Compute second-order Hessian approximations for layer-by-layer GPTQ INT4 reduction',
      'Deploy FP8 matrix multiplication kernels on modern Tensor Core hardware',
    ],
    goal: 'Weight and activation quantization algorithms: INT8, INT4 (AWQ, GPTQ), FP8, mixed precision scaling, outlier channel suppression, and hardware dequantization.',
    coreKeywords: ['quantization', 'awq', 'gptq', 'fp8', 'int4', 'bitsandbytes', 'litellm', 'calibration', 'compression', 'llm-compressor'],
    harnessRole: 'Precision Compression & High-Throughput Quantization',
    prerequisites: ['NM36'],
    description: 'Post-training quantization and activation calibration: implement AWQ salient weight protection, GPTQ Hessian second-order optimizations, and FP8 GEMM kernels.',
  },
  {
    id: 'NM40',
    stage: 'N7',
    stageName: 'Inference Engines',
    title: 'Disaggregated prefill/decode and useful-serving capstone',
    hours: 280,
    completionStatus: 'not_started',
    keyTools: ['mooncake', 'vllm', 'rdma', 'grpc', 'dynamo'],
    demandedMaterials: [
      'Disaggregated Inference Architectures for Frontier LLMs (DeepSeek / Mooncake Papers)',
      'Splitwise: Efficient generative LLM inference using phase splitting (Patel et al.)',
      'Tsinghua & Peking University Advanced Systems Lectures',
    ],
    learningObjectives: [
      'Split serving nodes into dedicated compute-bound prefill and bandwidth-bound decode pools',
      'Implement ultra-low latency RDMA transfer protocols for KV-cache state migration',
      'Meet strict multi-tenant P99 latency SLAs under bursty Poisson traffic distributions',
    ],
    goal: 'Disaggregated cluster architectures: separating compute-bound prefill phase from memory-bandwidth-bound decode phase across distinct GPU nodes.',
    coreKeywords: ['disaggregated serving', 'prefill', 'decode', 'kv-transfer', 'cluster inference', 'mooncake', 'network bandwidth', 'capstone'],
    harnessRole: 'Disaggregated Serving Cluster Architecture',
    prerequisites: ['NM36', 'NM37'],
    description: 'Pioneering frontier inference systems: split prefill and decode clusters, high-speed RDMA KV-cache transfers, and SLA-guaranteed multi-tenant serving topologies.',
  },
  {
    id: 'NM43',
    stage: 'N8',
    stageName: 'Distributed Scale',
    title: 'Multi-GPU collectives, topology and communication',
    hours: 320,
    completionStatus: 'not_started',
    keyTools: ['nccl', 'deepspeed', 'megatron-lm', 'torch-distributed', 'nvlink'],
    demandedMaterials: [
      'Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism (Shoeybi et al.)',
      'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models (Rajbhandari et al.)',
      'Carnegie Mellon University 15-745 Parallel Computer Architecture',
    ],
    learningObjectives: [
      'Implement Ring-AllReduce and Tree-AllGather collective communication primitives',
      'Configure ZeRO-1, ZeRO-2, and ZeRO-3 parameter, gradient, and optimizer state partitioning',
      'Design hybrid 3D parallelism: Tensor, Pipeline, and Data Parallel cluster topologies',
    ],
    goal: 'NCCL collective communication primitives (AllReduce, AllGather, ReduceScatter), NVLink network topologies, tensor parallelism, and pipeline parallelism.',
    coreKeywords: ['multi-gpu', 'nccl', 'allreduce', 'nvlink', 'tensor parallel', 'pipeline parallel', 'deepspeed', 'megatron-lm', 'distributed training'],
    harnessRole: 'Multi-GPU Cluster Interconnect & Collectives',
    prerequisites: ['NM32', 'NM17'],
    description: 'Scaling to multi-GPU and multi-node clusters: ZeRO memory optimization stages, Megatron-LM tensor slicing, Ring-AllReduce communication algorithms.',
  },
  {
    id: 'NM48',
    stage: 'N9',
    stageName: 'Compilers',
    title: 'MLIR, tensor semantics and memory planning',
    hours: 300,
    completionStatus: 'not_started',
    keyTools: ['mlir', 'llvm', 'tvm', 'torch-inductor', 'xla'],
    demandedMaterials: [
      'MLIR: Scaling Compiler Infrastructure for Domain Specific Computation (Lattner et al.)',
      'Compilers: Principles, Techniques, and Tools (Aho, Lam, Sethi, Ullman)',
      'Stanford CS243 Advanced Compilers for Modern Architectures',
    ],
    learningObjectives: [
      'Construct custom MLIR dialects with structured verification and polyhedral transformations',
      'Implement memory reuse planning and bufferization passes to eliminate heap overhead',
      'Target diverse hardware backends via LLVM and PTX codegen pipelines',
    ],
    goal: 'Compiler intermediate representations (MLIR, LLVM), dialect conversion pipelines, polyhedral loop transformations, and static memory allocation graphs.',
    coreKeywords: ['mlir', 'compilers', 'llvm', 'dialects', 'tvm', 'tensor semantics', 'memory planning', 'graph optimization', 'code generation'],
    harnessRole: 'Hardware-Agnostic Graph Compilation & Lowering',
    prerequisites: ['NM34', 'NM02'],
    description: 'Graph-to-binary compilation pipelines: lowering high-level tensor operations through MLIR dialects down to optimized PTX and CPU machine code.',
  },
  {
    id: 'NM54',
    stage: 'N10',
    stageName: 'Embodied AI',
    title: 'World models, state estimation and cyber-physical timing',
    hours: 260,
    completionStatus: 'not_started',
    keyTools: ['isaac-sim', 'mujoco', 'ros2', 'kalman-filter', 'diffusion-policy'],
    demandedMaterials: [
      'Probabilistic Robotics (Thrun, Burgard, Fox)',
      'World Models (Ha & Schmidhuber, 2018)',
      'UC Berkeley CS285 Deep Reinforcement Learning (Sergey Levine)',
    ],
    learningObjectives: [
      'Implement action-conditioned latent world models with temporal predictive dynamics',
      'Design Extended Kalman Filters (EKF) for multi-sensor state fusion under noise',
      'Enforce hard real-time latency budgets (&lt;10ms) in robotic closed-loop control',
    ],
    goal: 'Multimodal perception, temporal diffusion models, Kalman filters, real-time cyber-physical control loops, and robotic state estimation.',
    coreKeywords: ['world models', 'robotics', 'state estimation', 'control loops', 'diffusion', 'cyber-physical', 'perception', 'real-time', 'sensors'],
    harnessRole: 'Physical Tool Grounding & Embodied Environment Interface',
    prerequisites: ['NM25', 'NM28'],
    description: 'Bridging software agents to cyber-physical reality: action-conditioned world models, sensory perception latency budgets, and robotic control actuation.',
  },
  {
    id: 'NM56',
    stage: 'N11',
    stageName: 'Frontier Research',
    title: 'Research design, reproducibility and value of information',
    hours: 280,
    completionStatus: 'not_started',
    keyTools: ['alphafold', 'deep-research', 'artemis', 'spack', 'qlib'],
    demandedMaterials: [
      'The Craft of Research (Booth, Colomb, Williams)',
      'Highly accurate protein structure prediction with AlphaFold (Jumper et al. Nature)',
      'Oxford / Cambridge Principles of Scientific Computing & Empirical Methodology',
    ],
    learningObjectives: [
      'Design thorough ablation matrices that isolate true algorithmic contributions from luck',
      'Compute Value of Information (VoI) to prioritize costly GPU experiments',
      'Reproduce complex peer-reviewed papers independently from first principles',
    ],
    goal: 'Empirical research methodologies, scientific ablation studies, peer review verification, statistical value of information (VoI), and deep literature analysis.',
    coreKeywords: ['research', 'reproducibility', 'alphafold', 'deep-research', 'ablation', 'scientific', 'literature', 'open science', 'paper implementation'],
    harnessRole: 'Automated Deep Research & Empirical Synthesis',
    prerequisites: ['NM27', 'NM28'],
    description: 'How true breakthroughs are engineered: experimental design, isolating confounders, reproducing complex papers, and conducting automated scientific literature sweeps.',
  },
  {
    id: 'NM60',
    stage: 'N11',
    stageName: 'Frontier Research',
    title: 'Specialist operations, career review and standing frontier practice',
    hours: 240,
    completionStatus: 'not_started',
    keyTools: ['system-design-primer', 'chiphuyen-aie', 'coding-interview-u', 'ossu'],
    demandedMaterials: [
      'AI Engineering: Building Applications with Foundation Models (Chip Huyen)',
      'Designing Data-Intensive Applications (Martin Kleppmann)',
      'System Design Interview (Alex Xu & Sahn Lam)',
    ],
    learningObjectives: [
      'Defend comprehensive architectural portfolios before Senior Technical Committees',
      'Audit live production postmortems with Root Cause Analysis (RCA) and mitigation plans',
      'Establish continuous repository ingestion workflows to assimilate frontier releases',
    ],
    goal: 'Capstone portfolio defense, production system design review, postmortem engineering, and continuous assimilation of frontier repository advances.',
    coreKeywords: ['career', 'system design', 'interview', 'capstone', 'portfolio', 'production readiness', 'architecture', 'best practices', 'leadership'],
    harnessRole: 'Production Architect Mastery & Portfolio Capstone',
    prerequisites: ['NM28', 'NM40', 'NM56'],
    description: 'The final synthesis of the 7,200-hour journey: comprehensive system design defense, live architectural audits, and frontier engineering leadership.',
  },
];

export const TOTAL_CURRICULUM_HOURS = CURRICULUM_MODULES.reduce((acc, m) => acc + m.hours, 0); // Exactly 7,200h
export const CORE_MILESTONE_HOURS = 7200;

// Comprehensive 50k-Hour Build, Reproduction & Refinement Horizon:
// Estimated total hours once completely building from scratch, profiling, micro-optimizing,
// verifying, deploying, and refining all 566+ repository stacks across D01-D18 domains.
export const FULL_BUILD_REFINE_HOURS = 50400; // ~50k hours (7x multiplier over theoretical core)

// Standard Audited Engineering Lifecycle: accounts for initial learning (7,200h), build slices (2,160h),
// SRE runtime (1,440h), verification gates G01-G19 (1,080h), and threat auditing (720h)
export const AUDITED_LIFECYCLE_HOURS = 12600;

// B61 O3h (68,715h) & B62 O3x (69,620h) average higher value - uncapped normalized trajectory
export const NORMALIZED_LIFETIME_HOURS = 69168;

export interface LifecyclePhase {
  id: string;
  name: string;
  shortName: string;
  hours: number;
  percentage: number;
  description: string;
  color: string;
  deliverables: string[];
}

export const BUILD_REFINE_PHASES: LifecyclePhase[] = [
  {
    id: 'theory',
    name: 'Interactive Theory & Literature Mastery',
    shortName: 'Theory & Foundations',
    hours: 7200,
    percentage: 14.3,
    description: 'Stages N0–N11 core theoretical grounding, paper reading & multi-university lectures (ETH, MIT, Stanford, Tsinghua)',
    color: '#38bdf8', // sky-400
    deliverables: ['Mathematical proofs', 'Paper annotations', 'Syllabus mastery', 'Algorithmic complexity bounds'],
  },
  {
    id: 'reproduction',
    name: 'From-Scratch Multi-Stack Systems Reproduction',
    shortName: 'Build & Reproduction',
    hours: 14400,
    percentage: 28.6,
    description: 'Hands-on construction of 566+ repos in C++20, Rust, CUDA, Triton, Mojo & Go without high-level framework crutches',
    color: '#10b981', // emerald-500
    deliverables: ['Zero-copy autograd engine', 'Custom BPE tokenizers', 'MicroVM execution harness', 'Distributed Ray coordinator'],
  },
  {
    id: 'optimization',
    name: 'Refinement, Profiling & Kernel Micro-Optimization',
    shortName: 'Kernel Refinement',
    hours: 10800,
    percentage: 21.4,
    description: 'Roofline modeling, cache-line alignment, FlashAttention-3 Triton kernels, ARM NEON / AVX-512 vectorization, FP8 calibration',
    color: '#f59e0b', // amber-500
    deliverables: ['IO-aware attention kernels', 'Paged KV cache manager', 'Quantization calibration tables', 'Roofline efficiency plots'],
  },
  {
    id: 'verification',
    name: 'Autonomous Testing, Verification Gates & Formal Correctness',
    shortName: 'Correctness & Gates',
    hours: 9000,
    percentage: 17.9,
    description: 'Rigorous signoffs for Correctness Gates G01–G19: property-based fuzzing, deterministic AST verification, regression suites',
    color: '#a855f7', // purple-500
    deliverables: ['Correctness Gates G01–G19 proofs', 'Fuzzing & fault injection tests', 'Deterministic harness replay', 'AST code review diffs'],
  },
  {
    id: 'sre',
    name: 'Production SRE, Distributed Deployment & Observability',
    shortName: 'SRE & Runtime Ops',
    hours: 5400,
    percentage: 10.7,
    description: 'Kubernetes orchestration, Robusta auto-remediation runbooks, zero-downtime model serving, live Prometheus/OpenTelemetry traces',
    color: '#06b6d4', // cyan-500
    deliverables: ['Robusta auto-remediation rules', 'Distributed cluster scheduling', 'OpenTelemetry distributed spans', 'Chaos mesh resilience'],
  },
  {
    id: 'security',
    name: 'MicroVM Jails, Sandboxing & Threat Auditing',
    shortName: 'Security & Auditing',
    hours: 3600,
    percentage: 7.1,
    description: 'MicroVM sandbox isolation, seccomp/eBPF syscall auditing, MCP contract boundary enforcement, prompt injection defense harnesses',
    color: '#ef4444', // red-500
    deliverables: ['MicroVM sandbox isolation', 'MCP contract permission jail', 'Prompt injection defense harness', 'Supply chain SBOM validation'],
  },
];

export const AUDITED_LIFECYCLE_PHASES: LifecyclePhase[] = [
  {
    id: 'theory',
    name: 'Interactive Theory & Deep Learning Foundations',
    shortName: 'Theory & Literature',
    hours: 7200,
    percentage: 57.1,
    description: 'Stages N0–N11 core theoretical grounding, paper reading & lecture syntheses (MIT/Stanford/ETH)',
    color: '#38bdf8', // sky-400
    deliverables: ['Mathematical proofs', 'Paper annotations', 'Algorithmic complexity analysis', 'Syllabus mastery'],
  },
  {
    id: 'build',
    name: 'From-Scratch Build & Slice Implementations',
    shortName: 'Build & Implementation',
    hours: 2160,
    percentage: 17.1,
    description: 'Hands-on construction of autograd engines, transformers, Triton/CUDA kernels, KV allocators & harnesses',
    color: '#10b981', // emerald-500
    deliverables: ['Zero-dependency autograd', 'FlashAttention Triton kernels', 'Paged KV cache manager', 'MicroVM harness'],
  },
  {
    id: 'operating',
    name: 'Operating, Telemetry & SRE Runtime',
    shortName: 'Operating & SRE',
    hours: 1440,
    percentage: 11.4,
    description: 'Kubernetes orchestration, Robusta auto-remediation, distributed ray scheduling, CI/CD telemetry & observability',
    color: '#a855f7', // purple-500
    deliverables: ['Robusta Kubernetes runbooks', 'Distributed Ray cluster profiling', 'Prometheus & OpenTelemetry metrics'],
  },
  {
    id: 'verification',
    name: 'Code Review, Verification & Correctness (G01–G19)',
    shortName: 'Review & Correctness',
    hours: 1080,
    percentage: 8.6,
    description: 'Formal verification, correctness gates G01-G19, invariant validation, regression testing & peer reviews',
    color: '#f59e0b', // amber-500
    deliverables: ['Correctness gates G01-G19 signoffs', 'Fuzzing & deterministic stress tests', 'AST code reviews'],
  },
  {
    id: 'security',
    name: 'Extraction, Security & Threat Auditing',
    shortName: 'Security & Auditing',
    hours: 720,
    percentage: 5.7,
    description: 'MicroVM sandbox containment, MCP contract boundary auditing, prompt injection red-teaming & SBOM verification',
    color: '#ef4444', // red-500
    deliverables: ['MCP permission jail sandbox', 'Prompt injection defenses', 'Software supply chain & SBOM audits'],
  },
];

export type HourMetricMode = 'build_refine' | 'audited' | 'core' | 'normalized';

export interface CurriculumProgressStats {
  hourMetricMode: HourMetricMode;
  totalHours: number;
  completedHours: number;
  inProgressHours: number;
  remainingHours: number;
  completedPercent: number;
  inProgressPercent: number;
  completedModulesCount: number;
  inProgressModulesCount: number;
  notStartedModulesCount: number;
  totalModulesCount: number;
  coreTotalHours: number;
  coreCompletedHours: number;
  buildRefineTotalHours: number;
  buildRefineCompletedHours: number;
  buildRefineRemainingHours: number;
  auditedTotalHours: number;
  auditedCompletedHours: number;
  auditedRemainingHours: number;
  normalizedTotalHours: number;
  normalizedCompletedHours: number;
  normalizedRemainingHours: number;
  lifecyclePhases: LifecyclePhase[];
  stageBreakdown: {
    stage: string;
    stageName: string;
    totalHours: number;
    completedHours: number;
    inProgressHours: number;
    percent: number;
    moduleIds: string[];
  }[];
}

export type CurriculumStats = CurriculumProgressStats;

export function computeCurriculumStats(
  modules: CurriculumModule[],
  modeOrNormalized: HourMetricMode | boolean = 'build_refine'
): CurriculumProgressStats {
  let mode: HourMetricMode = 'build_refine';
  if (typeof modeOrNormalized === 'boolean') {
    mode = modeOrNormalized ? 'normalized' : 'build_refine';
  } else {
    mode = modeOrNormalized;
  }

  const coreTotal = modules.reduce((sum, m) => sum + m.hours, 0);
  const coreCompleted = modules
    .filter((m) => m.completionStatus === 'completed')
    .reduce((sum, m) => sum + m.hours, 0);
  const coreInProgress = modules
    .filter((m) => m.completionStatus === 'in_progress')
    .reduce((sum, m) => sum + m.hours, 0);

  const ratio = coreTotal > 0 ? coreCompleted / coreTotal : 0;
  const inProgressRatio = coreTotal > 0 ? coreInProgress / coreTotal : 0;

  // Comprehensive 50k-Hour Build & Refine calculations (50,400h)
  const buildRefineCompleted = Math.round(ratio * FULL_BUILD_REFINE_HOURS);
  const buildRefineInProgress = Math.round(inProgressRatio * FULL_BUILD_REFINE_HOURS);
  const buildRefineRemaining = Math.max(0, FULL_BUILD_REFINE_HOURS - buildRefineCompleted);

  // Audited calculations (12,600h)
  const auditedCompleted = Math.round(ratio * AUDITED_LIFECYCLE_HOURS);
  const auditedInProgress = Math.round(inProgressRatio * AUDITED_LIFECYCLE_HOURS);
  const auditedRemaining = Math.max(0, AUDITED_LIFECYCLE_HOURS - auditedCompleted);

  // Normalized calculations (69,168h)
  const normalizedCompleted = Math.round(ratio * NORMALIZED_LIFETIME_HOURS);
  const normalizedInProgress = Math.round(inProgressRatio * NORMALIZED_LIFETIME_HOURS);
  const normalizedRemaining = Math.max(0, NORMALIZED_LIFETIME_HOURS - normalizedCompleted);

  let totalHours = FULL_BUILD_REFINE_HOURS;
  let completedHours = buildRefineCompleted;
  let inProgressHours = buildRefineInProgress;
  let remainingHours = buildRefineRemaining;
  let lifecyclePhases = BUILD_REFINE_PHASES;

  if (mode === 'build_refine') {
    totalHours = FULL_BUILD_REFINE_HOURS;
    completedHours = buildRefineCompleted;
    inProgressHours = buildRefineInProgress;
    remainingHours = buildRefineRemaining;
    lifecyclePhases = BUILD_REFINE_PHASES;
  } else if (mode === 'audited') {
    totalHours = AUDITED_LIFECYCLE_HOURS;
    completedHours = auditedCompleted;
    inProgressHours = auditedInProgress;
    remainingHours = auditedRemaining;
    lifecyclePhases = AUDITED_LIFECYCLE_PHASES;
  } else if (mode === 'core') {
    totalHours = coreTotal;
    completedHours = coreCompleted;
    inProgressHours = coreInProgress;
    remainingHours = Math.max(0, coreTotal - coreCompleted);
    lifecyclePhases = AUDITED_LIFECYCLE_PHASES;
  } else if (mode === 'normalized') {
    totalHours = NORMALIZED_LIFETIME_HOURS;
    completedHours = normalizedCompleted;
    inProgressHours = normalizedInProgress;
    remainingHours = normalizedRemaining;
    lifecyclePhases = BUILD_REFINE_PHASES;
  }

  const completedModulesCount = modules.filter((m) => m.completionStatus === 'completed').length;
  const inProgressModulesCount = modules.filter((m) => m.completionStatus === 'in_progress').length;
  const notStartedModulesCount = modules.filter((m) => m.completionStatus === 'not_started').length;

  const stageMap = new Map<
    string,
    { stage: string; stageName: string; totalHours: number; completedHours: number; inProgressHours: number; moduleIds: string[] }
  >();

  modules.forEach((mod) => {
    const existing = stageMap.get(mod.stage) || {
      stage: mod.stage,
      stageName: mod.stageName,
      totalHours: 0,
      completedHours: 0,
      inProgressHours: 0,
      moduleIds: [],
    };
    existing.totalHours += mod.hours;
    if (mod.completionStatus === 'completed') {
      existing.completedHours += mod.hours;
    } else if (mod.completionStatus === 'in_progress') {
      existing.inProgressHours += mod.hours;
    }
    existing.moduleIds.push(mod.id);
    stageMap.set(mod.stage, existing);
  });

  const stageBreakdown = Array.from(stageMap.values()).map((s) => ({
    ...s,
    percent: s.totalHours > 0 ? Math.round((s.completedHours / s.totalHours) * 100) : 0,
  }));

  return {
    hourMetricMode: mode,
    totalHours,
    completedHours,
    inProgressHours,
    remainingHours,
    completedPercent: totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0,
    inProgressPercent: totalHours > 0 ? Math.round((inProgressHours / totalHours) * 100) : 0,
    completedModulesCount,
    inProgressModulesCount,
    notStartedModulesCount,
    totalModulesCount: modules.length,
    coreTotalHours: coreTotal,
    coreCompletedHours: coreCompleted,
    buildRefineTotalHours: FULL_BUILD_REFINE_HOURS,
    buildRefineCompletedHours: buildRefineCompleted,
    buildRefineRemainingHours: buildRefineRemaining,
    auditedTotalHours: AUDITED_LIFECYCLE_HOURS,
    auditedCompletedHours: auditedCompleted,
    auditedRemainingHours: auditedRemaining,
    normalizedTotalHours: NORMALIZED_LIFETIME_HOURS,
    normalizedCompletedHours: normalizedCompleted,
    normalizedRemainingHours: normalizedRemaining,
    lifecyclePhases,
    stageBreakdown,
  };
}
