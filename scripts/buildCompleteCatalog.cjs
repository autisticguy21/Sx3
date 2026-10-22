const fs = require('fs');

// Raw markdown table rows from B69 intake + loopx + B60 infra + Frontier v54
const rawTableLines = `
| NM01 | STUDY_POINTER | EbookFoundation/free-programming-books |  | 399075 (f1_user) | https://github.com/EbookFoundation/free-programming-books |
| NM01 | STUDY_POINTER | Google MLCC Prerequisites and Prework |  |  | https://developers.google.com/machine-learning/crash-course/prereqs-and-prework |
| NM01 | STUDY_POINTER | Python Tutorial |  |  | https://docs.python.org/3/tutorial/index.html |
| NM01 | STUDY_POINTER | jlevy/the-art-of-command-line |  | 153000 (github) | https://github.com/jlevy/the-art-of-command-line |
| NM02 | PENDING_EDU_REVIEW | iamshuaidi/CS-Book |  |  | https://github.com/iamshuaidi/CS-Book |
| NM02 | PENDING_RELEASE | eriklindernoren/ML-From-Scratch |  | 31331 (f1_user) | https://github.com/eriklindernoren/ML-From-Scratch |
| NM02 | PENDING_STARS_AND_RELEASE | ashishpatel26/500-AI-Machine-learning-Deep-learning-Computer-vision-NLP-Projects-with-code |  |  | https://github.com/ashishpatel26/500-AI-Machine-learning-Deep-learning-Computer-vision-NLP-Projects-with-code |
| NM02 | STUDY_POINTER | codecrafters-io/build-your-own-x |  | 553750 (f1_user) | https://github.com/codecrafters-io/build-your-own-x |
| NM02 | STUDY_POINTER | freeCodeCamp/freeCodeCamp |  | 457094 (f1_user) | https://github.com/FreeCodeCamp/freecodecamp |
| NM02 | STUDY_POINTER | practical-tutorials/project-based-learning |  | 286734 (f1_user) | https://github.com/practical-tutorials/project-based-learning |
| NM02 | STUDY_POINTER | TheAlgorithms/Python |  |  | https://github.com/TheAlgorithms/Python |
| NM02 | STUDY_POINTER | trekhleb/homemade-machine-learning |  | 24533 (app_user) | https://github.com/trekhleb/homemade-machine-learning |
| NM04 | PENDING_RELEASE | alibaba/zvec |  | 16116 (f1_user) | https://github.com/alibaba/zvec |
| NM04 | PENDING_STARS_AND_RELEASE | OpenViking |  |  | https://github.com/volcengine/OpenViking |
| NM07 | PENDING_RELEASE | facebookresearch/faiss |  | 41158 (f1_user) | https://github.com/facebookresearch/faiss |
| NM07 | PENDING_RELEASE | FlagOpen/FlagEmbedding |  | 12253 (app_user) | https://github.com/FlagOpen/FlagEmbedding |
| NM07 | PENDING_RELEASE | huggingface/sentence-transformers |  | 19178 (app_user) | https://github.com/huggingface/sentence-transformers |
| NM07 | PENDING_RELEASE | QuivrHQ/quivr |  | 39087 (f1_user) | https://github.com/QuivrHQ/quivr |
| NM07 | PENDING_STARS | hindsight | 2026-10-13 (curriculum_csv) |  | https://github.com/vectorize-io/hindsight |
| NM07 | PENDING_TOPIC_UNKNOWN | falkordb/falkordb |  |  | https://github.com/FalkorDB/FalkorDB |
| NM07 | PENDING_TOPIC_UNKNOWN | neo4j/neo4j |  |  | https://github.com/neo4j/neo4j |
| NM08 | PENDING_RELEASE | kubeflow/kubeflow |  | 15905 (app_user) | https://github.com/kubeflow/kubeflow |
| NM08 | PENDING_RELEASE | swe-bench/SWE-bench |  | 6034 (f1_user) | https://github.com/swe-bench/SWE-bench |
| NM08 | PENDING_RELEASE | robustadev/robusta |  | 7420 (f1_user) | https://github.com/robustadev/robusta |
| NM08 | PENDING_STARS_AND_RELEASE | kevinmeix1/advanced-kubernetes-mlops-platform |  |  | https://github.com/kevinmeix1/advanced-kubernetes-mlops-platform |
| NM08 | PENDING_STARS_AND_RELEASE | octo-technology/model_platform |  |  | https://github.com/octo-technology/model_platform |
| NM08 | PENDING_TOPIC_UNKNOWN | skypilot-org/skypilot |  | 8400 (github_third_party) | https://github.com/skypilot-org/skypilot/ |
| NM08 | ADD_STUDY_EDU | kubernetes/kubernetes |  | 114000 (github) | https://github.com/kubernetes/kubernetes |
| NM08 | ADD_STUDY_EDU | hashicorp/terraform |  | 44000 (github) | https://github.com/hashicorp/terraform |
| NM08 | ADD_STUDY_EDU | opencomputeproject/ocp-diag |  | 5800 (github) | https://github.com/opencomputeproject/ocp-diag |
| NM17 | PENDING_RELEASE | Angel-ML/angel |  | 6793 (app_user) | https://github.com/Angel-ML/angel |
| NM17 | PENDING_RELEASE | EleutherAI/gpt-neox |  | 7469 (f1_user) | https://github.com/EleutherAI/gpt-neox |
| NM17 | PENDING_RELEASE | kserve/kserve |  | 6120 (app_user) | https://github.com/kserve/kserve/ |
| NM17 | PENDING_STARS | Xinference | 2026-10-16 (curriculum_csv) | 18200 (github) | https://github.com/xorbitsai/inference |
| NM19 | PENDING_RELEASE | feast-dev/feast |  | 7129 (app_user) | https://github.com/feast-dev/feast |
| NM19 | PENDING_RELEASE | HumanSignal/label-studio |  | 28474 (app_user) | https://github.com/HumanSignal/label-studio |
| NM19 | PENDING_RELEASE | treeverse/dvc |  | 15920 (app_user) | https://github.com/treeverse/dvc |
| NM21 | PENDING_STARS_AND_RELEASE | arrayfire/arrayfire |  | 4600 (github) | https://github.com/arrayfire/arrayfire |
| NM21 | PENDING_STARS_AND_RELEASE | gonum/gonum |  | 7800 (github) | https://github.com/gonum/gonum |
| NM21 | PENDING_STARS_AND_RELEASE | microsoft/AI-For-Beginners |  | 36000 (github) | https://github.com/microsoft/AI-For-Beginners |
| NM21 | PENDING_STARS_AND_RELEASE | rust-ndarray/ndarray |  | 4800 (github) | https://github.com/rust-ndarray/ndarray |
| NM21 | PENDING_STARS_AND_RELEASE | scikit-optimize/scikit-optimize |  | 3100 (github) | https://github.com/scikit-optimize/scikit-optimize |
| NM21 | PENDING_STARS_AND_RELEASE | scipy/scipy |  | 13500 (github) | https://github.com/scipy/scipy |
| NM21 | STUDY_POINTER | MIT 18.06 Linear Algebra (OpenCourseWare) |  |  | https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/ |
| NM22 | PENDING_EDU_REVIEW | data-edu/data-science-in-education |  |  | https://github.com/data-edu/data-science-in-education |
| NM22 | PENDING_STARS_AND_RELEASE | DeepAnalyze |  | 4200 (github) | https://github.com/ruc-datalab/DeepAnalyze |
| NM22 | PENDING_STARS_AND_RELEASE | pandas-ai/pandas-ai |  | 18900 (github) | https://github.com/pandas-ai/pandas-ai |
| NM22 | STUDY_POINTER | academic/awesome-datascience |  | 30196 (app_user) | https://github.com/academic/awesome-datascience |
| NM22 | STUDY_POINTER | jakevdp/PythonDataScienceHandbook |  | 50121 (f1_user) | https://github.com/jakevdp/PythonDataScienceHandbook |
| NM22 | STUDY_POINTER | ossu/data-science |  | 22187 (app_user) | https://github.com/ossu/data-science |
| NM22 | STUDY_POINTER | probml/pml-book |  | 5692 (f1_user) | https://github.com/probml/pml-book |
| NM23 | PENDING_EDU_REVIEW | aglio-lab/ai-evaluation-tools |  |  | https://github.com/aglio-lab/ai-evaluation-tools |
| NM23 | PENDING_EDU_REVIEW | AMAI-GmbH/AI-Expert-Roadmap |  | 31092 (f1_user) | https://github.com/AMAI-GmbH/AI-Expert-Roadmap |
| NM23 | PENDING_EDU_REVIEW | awesome-mlops/awesome-ml-monitoring |  |  | https://github.com/awesome-mlops/awesome-ml-monitoring |
| NM23 | PENDING_EDU_REVIEW | bishwaghimire/ai-learning-roadmaps |  |  | https://github.com/bishwaghimire/ai-learning-roadmaps |
| NM23 | PENDING_EDU_REVIEW | cbamls/AI_Tutorial |  |  | https://github.com/cbamls/AI_Tutorial |
| NM23 | PENDING_EDU_REVIEW | FareedKhan-dev/train-llm-from-scratch |  | 12131 (f1_user) | https://github.com/FareedKhan-dev/train-llm-from-scratch |
| NM23 | PENDING_EDU_REVIEW | meetgandhi123/Machine-Learning-101 |  |  | https://github.com/meetgandhi123/Machine-Learning-101 |
| NM23 | PENDING_EDU_REVIEW | rossant/awesome-scientific-python |  |  | https://github.com/rossant/awesome-scientific-python |
| NM23 | PENDING_RELEASE | evidentlyai/evidently |  | 7991 (app_user) | https://github.com/evidentlyai/evidently |
| NM23 | PENDING_RELEASE | ggml-org/ggml |  | 15483 (app_user) | https://github.com/ggml-org/ggml |
| NM23 | PENDING_STARS | rohitg00/ai-engineering-from-scratch | 2026-10-15 (curriculum_csv) |  | https://github.com/rohitg00/ai-engineering-from-scratch |
| NM23 | PENDING_STARS_AND_RELEASE | explosion/spaCy |  | 30000 (github) | https://github.com/explosion/spaCy |
| NM23 | PENDING_STARS_AND_RELEASE | google-research/google-research |  | 34000 (github) | https://github.com/google-research/google-research |
| NM23 | PENDING_STARS_AND_RELEASE | gradio-app/gradio |  | 35000 (github) | https://github.com/gradio-app/gradio |
| NM23 | PENDING_STARS_AND_RELEASE | lukasmasuch/best-of-ml-python |  | 16800 (github) | https://github.com/lukasmasuch/best-of-ml-python |
| NM23 | PENDING_STARS_AND_RELEASE | magnetron/magnetron |  | 4200 (github) | https://github.com/magnetron/magnetron |
| NM23 | PENDING_STARS_AND_RELEASE | microsoft/ML-For-Beginners |  | 68000 (github) | https://github.com/microsoft/ML-For-Beginners |
| NM23 | PENDING_STARS_AND_RELEASE | mlinfra-io/mlinfra |  | 3400 (github) | https://github.com/mlinfra-io/mlinfra |
| NM23 | PENDING_STARS_AND_RELEASE | mlpack/mlpack |  | 5200 (github) | https://github.com/mlpack/mlpack |
| NM23 | PENDING_STARS_AND_RELEASE | opik |  | 7600 (github) | https://github.com/comet-ml/opik |
| NM23 | PENDING_STARS_AND_RELEASE | rasbt/LLMs-from-scratch |  | 46000 (github) | https://github.com/rasbt/LLMs-from-scratch |
| NM23 | PENDING_STARS_AND_RELEASE | rust-ml/linfa |  | 4300 (github) | https://github.com/rust-ml/linfa |
| NM23 | PENDING_STARS_AND_RELEASE | thu-ml/SageAttention |  | 8900 (github) | https://github.com/thu-ml/SageAttention |
| NM23 | PENDING_STARS_AND_RELEASE | tukue/mlops-model-ci-cd |  | 3200 (github) | https://github.com/tukue/mlops-model-ci-cd |
| NM23 | PENDING_STARS_AND_RELEASE | zachary-s-cacciatore/causal-dml-measurement |  | 2100 (github) | https://github.com/zachary-s-cacciatore/causal-dml-measurement |
| NM23 | STUDY_POINTER | ageron/handson-ml |  | 24000 (github) | https://github.com/ageron/handson-ml |
| NM23 | STUDY_POINTER | ageron/handson-ml2 |  | 29931 (f1_user) | https://github.com/ageron/handson-ml2 |
| NM23 | STUDY_POINTER | ageron/handson-ml3 |  | 14324 (f1_user) | https://github.com/ageron/handson-ml3 |
| NM23 | STUDY_POINTER | ashishps1/learn-ai-engineering |  | 6104 (app_user) | https://github.com/ashishps1/learn-ai-engineering |
| NM23 | STUDY_POINTER | christophM/interpretable-ml-book |  | 5388 (f1_user) | https://github.com/christophM/interpretable-ml-book |
| NM23 | STUDY_POINTER | DataTalksClub/machine-learning-zoomcamp |  | 14718 (f1_user) | https://github.com/DataTalksClub/machine-learning-zoomcamp |
| NM23 | STUDY_POINTER | DeepLearning.AI courses (AI/ML, agents, AI coding) |  |  | https://www.deeplearning.ai/courses |
| NM23 | STUDY_POINTER | Google Machine Learning Crash Course |  |  | https://developers.google.com/machine-learning/crash-course |
| NM23 | STUDY_POINTER | harvard-edge/cs249r_book |  | 28946 (app_user) | https://github.com/harvard-edge/cs249r_book |
| NM23 | STUDY_POINTER | mrdbourke/machine-learning-roadmap |  | 7875 (f1_user) | https://github.com/mrdbourke/machine-learning-roadmap |
| NM23 | STUDY_POINTER | probml/pyprobml |  | 7106 (f1_user) | https://www.github.com/probml/pyprobml |
| NM23 | STUDY_POINTER | rasbt/machine-learning-book |  | 5431 (app_user) | https://github.com/rasbt/machine-learning-book |
| NM23 | STUDY_POINTER | scikit-learn User Guide |  |  | https://scikit-learn.org/stable/user_guide.html |
| NM24 | PENDING_EDU_REVIEW | christoschristofidis/awesome-deep-learning |  | 28458 (app_user) | https://github.com/christoschristofidis/awesome-deep-learning |
| NM24 | PENDING_EDU_REVIEW | dragen1860/Deep-Learning-with-TensorFlow-book |  |  | https://github.com/dragen1860/Deep-Learning-with-TensorFlow-book |
| NM24 | PENDING_EDU_REVIEW | fastai/fastbook |  | 25385 (app_user) | https://github.com/fastai/fastbook |
| NM24 | PENDING_EDU_REVIEW | GANs-in-Action/gans-in-action |  |  | https://github.com/GANs-in-Action/gans-in-action |
| NM24 | PENDING_EDU_REVIEW | kmario23/deep-learning-drizzle |  |  | https://github.com/kmario23/deep-learning-drizzle |
| NM24 | PENDING_RELEASE | harbor-framework/harbor |  | 6185 (f1_user) | https://github.com/harbor-framework/harbor |
| NM24 | PENDING_RELEASE | pytorch/executorch |  | 5100 (app_user) | https://github.com/pytorch/executorch |
| NM24 | PENDING_RELEASE | tensorflow/serving |  | 6362 (app_user) | https://github.com/tensorflow/serving |
| NM24 | PENDING_STARS | heygen-com/hyperframes | 2026-10-16 (curriculum_csv) |  | https://github.com/heygen-com/hyperframes |
| NM24 | PENDING_STARS | ranxianglei/billion-context | 2026-10-14 (curriculum_csv) |  | https://github.com/ranxianglei/billion-context |
| NM24 | PENDING_STARS_AND_RELEASE | AI4Finance-Foundation/FinGPT |  |  | https://github.com/AI4Finance-Foundation/FinGPT |
| NM24 | PENDING_STARS_AND_RELEASE | coqui-ai/TTS |  |  | https://github.com/coqui-ai/TTS |
| NM24 | PENDING_STARS_AND_RELEASE | d2l-ai/d2l-zh |  |  | https://github.com/d2l-ai/d2l-zh |
| NM24 | PENDING_STARS_AND_RELEASE | facebookresearch/fairseq |  |  | https://github.com/facebookresearch/fairseq |
| NM24 | PENDING_STARS_AND_RELEASE | huggingface/pytorch-image-models |  |  | https://github.com/huggingface/pytorch-image-models |
| NM24 | PENDING_STARS_AND_RELEASE | intel/unet |  |  | https://github.com/intel/unet |
| NM24 | PENDING_STARS_AND_RELEASE | keras-team/keras |  |  | https://github.com/keras-team/keras |
| NM24 | PENDING_STARS_AND_RELEASE | PaddlePaddle/PaddleNLP |  |  | https://github.com/PaddlePaddle/PaddleNLP |
| NM24 | PENDING_STARS_AND_RELEASE | TensorRT |  |  | https://github.com/pytorch/TensorRT |
| NM24 | PENDING_STARS_AND_RELEASE | tracel-ai/burn |  |  | https://github.com/tracel-ai/burn |
| NM24 | PENDING_STARS_AND_RELEASE | ultralytics/yolov5 |  |  | https://github.com/ultralytics/yolov5 |
| NM24 | PENDING_TOPIC_UNKNOWN | tensorflow/examples |  |  | https://github.com/tensorflow/examples |
| NM24 | PENDING_TOPIC_UNKNOWN | tensorflow/tensorboard |  |  | https://github.com/tensorflow/Tensorboard |
| NM24 | STUDY_ONLY | karpathy/minGPT |  | 24734 (f1_user) | https://www.github.com/karpathy/minGPT |
| NM24 | STUDY_ONLY | karpathy/micrograd |  | 42500 (f1_user) | https://github.com/karpathy/micrograd |
| NM24 | STUDY_POINTER | DeepLearning.AI Attention in Transformers: Concepts and Code in PyTorch |  |  | https://www.deeplearning.ai/courses/attention-in-transformers-concepts-and-code-in-pytorch |
| NM24 | STUDY_POINTER | Dive into Deep Learning |  |  | https://d2l.ai/ |
| NM24 | STUDY_POINTER | Hugging Face Course |  |  | https://huggingface.co/docs/course/chapter1/1 |
| NM24 | STUDY_POINTER | janishar/mit-deep-learning-book-pdf |  | 14249 (app_user) | https://github.com/janishar/mit-deep-learning-book-pdf |
| NM24 | STUDY_POINTER | lexfridman/mit-deep-learning |  | 10456 (app_user) | https://github.com/lexfridman/mit-deep-learning |
| NM24 | STUDY_POINTER | lmoroney/dlaicourse |  | 5637 (app_user) | https://github.com/lmoroney/dlaicourse |
| NM24 | STUDY_POINTER | MIT 6.S191 Introduction to Deep Learning |  |  | https://introtodeeplearning.com/ |
| NM24 | STUDY_POINTER | Practical Deep Learning for Coders |  |  | https://course.fast.ai/ |
| NM24 | STUDY_POINTER | PyTorch Tutorials |  |  | https://docs.pytorch.org/tutorials/ |
| NM24 | STUDY_POINTER | Stanford CS224N NLP with Deep Learning |  |  | https://web.stanford.edu/class/cs224n/index.html |
| NM24 | STUDY_POINTER | yandexdataschool/Practical_RL |  | 6589 (app_user) | https://github.com/yandexdataschool/Practical_RL |
| NM25 | PENDING_EDU_REVIEW | datawhalechina/happy-llm |  | 34408 (app_user) | https://github.com/datawhalechina/happy-llm |
| NM25 | PENDING_EDU_REVIEW | HandsOnLLM/Hands-On-Large-Language-Models |  | 26440 (app_user) | https://github.com/HandsOnLLM/Hands-On-Large-Language-Models |
| NM25 | PENDING_EDU_REVIEW | jingyaogong/minimind |  |  | https://github.com/jingyaogong/minimind |
| NM25 | PENDING_RELEASE | artidoro/qlora |  | 11036 (f1_user) | https://github.com/artidoro/qlora |
| NM25 | PENDING_RELEASE | EricLBuehler/mistral.rs |  | 7751 (app_user) | https://github.com/EricLBuehler/mistral.rs |
| NM25 | PENDING_RELEASE | kvcache-ai/ktransformers |  | 19605 (app_user) | https://github.com/kvcache-ai/ktransformers |
| NM25 | PENDING_RELEASE | Lightning-AI/litgpt |  | 13710 (app_user) | https://github.com/Lightning-AI/litgpt/ |
| NM25 | PENDING_RELEASE | mistralai/mistral-inference |  | 10823 (app_user) | https://github.com/mistralai/mistral-inference |
| NM25 | PENDING_RELEASE | TransformerOptimus/SuperAGI |  | 17701 (app_user) | https://github.com/TransformerOptimus/SuperAGI |
| NM25 | PENDING_STARS | Axolotl | 2026-10-16 (curriculum_csv) |  | https://github.com/axolotl-ai-cloud/axolotl |
| NM25 | PENDING_STARS | QwenPaw | 2026-10-15 (curriculum_csv) |  | https://github.com/agentscope-ai/QwenPaw |
| NM25 | PENDING_STARS_AND_RELEASE | hiyouga/LlamaFactory |  |  | https://github.com/hiyouga/LlamaFactory |
| NM25 | PENDING_STARS_AND_RELEASE | huggingface/tokenizers |  |  | https://github.com/huggingface/tokenizers |
| NM25 | PENDING_STARS_AND_RELEASE | huggingface/transformers.js |  |  | https://github.com/huggingface/transformers.js |
| NM25 | PENDING_STARS_AND_RELEASE | mlrun/mlrun |  |  | https://github.com/mlrun/mlrun/ |
| NM25 | PENDING_TOPIC_UNKNOWN | facebookresearch/llama |  |  | https://github.com/facebookresearch/llama/ |
| NM25 | PENDING_TOPIC_UNKNOWN | huggingface/trl |  |  | https://github.com/huggingface/trl?tab=readme-ov-file |
| NM25 | PENDING_TOPIC_UNKNOWN | inclusionai/areal |  |  | https://github.com/inclusionAI/AReAL |
| NM25 | PENDING_TOPIC_UNKNOWN | kellerjordan/modded-nanogpt |  |  | https://github.com/kellerjordan/modded-nanogpt |
| NM25 | PENDING_TOPIC_UNKNOWN | openai/tiktoken |  |  | https://github.com/openai/tiktoken/ |
| NM25 | PENDING_TOPIC_UNKNOWN | stability-ai/stablelm |  |  | https://github.com/stability-ai/stablelm |
| NM25 | PENDING_TOPIC_UNKNOWN | thudm/slime |  |  | https://github.com/THUDM/slime/ |
| NM25 | PENDING_TOPIC_UNKNOWN | volcengine/verl |  |  | https://github.com/volcengine/verl/ |
| NM25 | STUDY_ONLY | karpathy/llm.c |  | 30397 (f1_user) | https://github.com/karpathy/llm.c |
| NM25 | STUDY_ONLY | karpathy/LLM101n |  | 36664 (f1_user) | https://github.com/karpathy/LLM101n |
| NM25 | STUDY_ONLY | karpathy/nanochat |  | 58614 (f1_user) | https://www.github.com/karpathy/nanochat |
| NM25 | STUDY_POINTER | DeepLearning.AI How Transformer LLMs Work |  |  | https://www.deeplearning.ai/courses/how-transformer-llms-work |
| NM25 | STUDY_POINTER | DeepLearning.AI Transformers in Practice |  |  | https://www.deeplearning.ai/courses/transformers-in-practice |
| NM25 | STUDY_POINTER | krishnaik06/Roadmap-To-Learn-Generative-AI-In-2025 |  | 5008 (f1_user) | https://github.com/krishnaik06/Roadmap-To-Learn-Generative-AI-In-2025 |
| NM25 | STUDY_POINTER | PacktPublishing/LLM-Engineers-Handbook |  | 5378 (f1_user) | https://github.com/PacktPublishing/LLM-Engineers-Handbook |
| NM25 | STUDY_POINTER | Stanford CS25 Transformers United V6 |  |  | https://web.stanford.edu/class/cs25/ |
| NM26 | PENDING_EDU_REVIEW | awesome-llm-apps |  |  | https://github.com/Shubhamsaboo/awesome-llm-apps |
| NM26 | PENDING_EDU_REVIEW | Awesome-LLM-Inference-Engine |  |  | https://github.com/sihyeong/awesome-llm-inference-engine |
| NM26 | PENDING_EDU_REVIEW | awesome-llm-tools |  |  | https://github.com/sam-blackfly/awesome-llm-tools |
| NM26 | PENDING_EDU_REVIEW | Awesome-RAG |  |  | https://github.com/danielskry/awesome-rag/ |
| NM26 | PENDING_EDU_REVIEW | Awesome-RAG-Evaluation |  |  | https://github.com/yhpeter/awesome-rag-evaluation |
| NM26 | PENDING_EDU_REVIEW | danielrosehill/Context-Engineering-Resources |  |  | https://github.com/danielrosehill/Context-Engineering-Resources |
| NM26 | PENDING_EDU_REVIEW | gkamradt/langchain-tutorials |  | 7494 (f1_user) | https://github.com/gkamradt/langchain-tutorials |
| NM26 | PENDING_EDU_REVIEW | rag-retrieval-tools |  |  | https://github.com/aglio-lab/rag-retrieval-tools |
| NM26 | PENDING_EDU_REVIEW | sgl-project/mini-sglang |  | 5236 (f1_user) | https://github.com/sgl-project/mini-sglang |
| NM26 | PENDING_RELEASE | alibaba/MNN |  | 16199 (app_user) | https://github.com/alibaba/MNN |
| NM26 | PENDING_RELEASE | deepspeedai/DeepSpeedExamples |  | 6829 (f1_user) | https://github.com/deepspeedai/DeepSpeedExamples |
| NM26 | PENDING_RELEASE | hkuds/rag-anything |  | 23556 (app_user) | https://github.com/HKUDS/RAG-Anything |
| NM26 | PENDING_RELEASE | jina-ai/serve |  | 21856 (app_user) | https://github.com/jina-ai/serve |
| NM26 | PENDING_RELEASE | kvcache-ai/Mooncake |  | 6737 (app_user) | https://github.com/kvcache-ai/Mooncake |
| NM26 | PENDING_RELEASE | langchain-ai/open-swe |  | 11033 (f1_user) | https://github.com/langchain-ai/open-swe |
| NM26 | PENDING_RELEASE | microsoft/graphrag |  | 36359 (app_user) | https://github.com/microsoft/graphrag |
| NM26 | PENDING_RELEASE | modular/modular |  | 29948 (app_user) | https://github.com/modular/modular |
| NM26 | PENDING_RELEASE | nomic-ai/gpt4all |  | 77363 (app_user) | https://github.com/nomic-ai/gpt4all |
| NM26 | PENDING_RELEASE | openbmb/UltraRAG |  | 5727 (app_user) | https://github.com/OpenBMB/UltraRAG |
| NM26 | PENDING_RELEASE | Tiiny-AI/PowerInfer |  | 9827 (app_user) | https://github.com/Tiiny-AI/PowerInfer |
| NM26 | PENDING_RELEASE | traceloop/openllmetry |  | 7502 (app_user) | https://github.com/traceloop/openllmetry |
| NM26 | PENDING_STARS | anything-llm | 2026-10-13 (curriculum_csv) |  | https://github.com/Mintplex-Labs/anything-llm |
| NM26 | PENDING_STARS | failproofai | 2026-10-13 (curriculum_csv) |  | https://github.com/FailproofAI/failproofai |
| NM26 | PENDING_STARS | Haystack | 2026-10-15 (curriculum_csv) | 18400 (f1_user) | https://github.com/deepset-ai/haystack |
| NM26 | PENDING_STARS | OneCompression | 2026-10-14 (curriculum_csv) |  | https://github.com/FujitsuResearch/OneCompression |
| NM26 | PENDING_STARS | openlit | 2026-10-13 (curriculum_csv) |  | https://github.com/openlit/openlit |
| NM26 | PENDING_STARS | OpenVINO | 2026-10-01 (curriculum_csv) |  | https://github.com/openvinotoolkit/openvino |
| NM26 | PENDING_STARS | Promptfoo | 2026-10-08 (curriculum_csv) |  | https://github.com/promptfoo/promptfoo |
| NM26 | PENDING_STARS_AND_RELEASE | ARES |  |  | https://github.com/stanford-futuredata/ARES |
| NM26 | PENDING_STARS_AND_RELEASE | cognee |  |  | https://github.com/topoteretes/cognee |
| NM26 | PENDING_STARS_AND_RELEASE | EvalRag |  |  | https://github.com/mameen/EvalRag |
| NM26 | PENDING_STARS_AND_RELEASE | google/langextract |  |  | https://github.com/google/langextract |
| NM26 | PENDING_STARS_AND_RELEASE | InternLM/lmdeploy |  | 14500 (github) | https://github.com/InternLM/lmdeploy |
| NM26 | PENDING_STARS_AND_RELEASE | langfuse |  | 14200 (github) | https://github.com/langfuse/langfuse |
| NM26 | PENDING_STARS_AND_RELEASE | lean-ctx |  |  | https://github.com/yvgude/lean-ctx |
| NM26 | PENDING_STARS_AND_RELEASE | LightRAG |  | 12800 (github) | https://github.com/HKUDS/LightRAG |
| NM26 | PENDING_STARS_AND_RELEASE | openai-knowledge-retrieval |  |  | https://github.com/openai/openai-knowledge-retrieval |
| NM26 | PENDING_STARS_AND_RELEASE | PageIndex |  |  | https://github.com/VectifyAI/PageIndex |
| NM26 | PENDING_STARS_AND_RELEASE | paroquant |  |  | https://github.com/z-lab/paroquant |
| NM26 | PENDING_STARS_AND_RELEASE | Q-CaRE-COLM-26 |  |  | https://github.com/DISL-Lab/Q-CaRE-COLM-26 |
| NM26 | PENDING_STARS_AND_RELEASE | R-Eval |  |  | https://github.com/THU-KEG/R-Eval |
| NM26 | PENDING_STARS_AND_RELEASE | rag-eval-pack |  |  | https://github.com/reaatech/rag-eval-pack |
| NM26 | PENDING_STARS_AND_RELEASE | RAG-evaluation-harnesses |  |  | https://github.com/RulinShao/RAG-evaluation-harnesses |
| NM26 | PENDING_STARS_AND_RELEASE | rag-forge |  |  | https://github.com/hallengray/rag-forge |
| NM26 | PENDING_STARS_AND_RELEASE | RAGLAB |  |  | https://github.com/fate-ubw/raglab |
| NM26 | PENDING_STARS_AND_RELEASE | stanford-oval/storm |  | 16000 (github) | https://github.com/stanford-oval/storm |
| NM26 | PENDING_STARS_AND_RELEASE | trec-rag-26 |  |  | https://github.com/rmit-ir/trec-rag-26 |
| NM26 | PENDING_STARS_AND_RELEASE | turboquant |  |  | https://github.com/0xSero/turboquant |
| NM26 | PENDING_TOPIC_UNKNOWN | guidance-ai/guidance |  | 18000 (github) | https://github.com/guidance-ai/guidance/ |
| NM26 | PENDING_TOPIC_UNKNOWN | mlc-ai/web-llm |  | 12000 (github) | https://github.com/mlc-ai/web-llm/ |
| NM26 | PENDING_TOPIC_UNKNOWN | openai/openai-python |  | 25000 (github) | https://github.com/openai/openai-python/ |
| NM26 | PENDING_TOPIC_UNKNOWN | outlines-dev/outlines |  | 11500 (github) | https://github.com/outlines-dev/outlines?tab=readme-ov-file |
| NM26 | PENDING_TOPIC_UNKNOWN | quic/ai-hub-models |  |  | https://github.com/quic/ai-hub-models |
| NM26 | PENDING_TOPIC_UNKNOWN | triton-inference-server/server |  | 12000 (github) | https://github.com/triton-inference-server/server/ |
| NM26 | STUDY_POINTER | huggingface/agents-course |  | 33627 (f1_user) | https://github.com/huggingface/agents-course |
| NM27 | PENDING_EDU_REVIEW | ant-research/awesome-mllm-guardrails |  |  | https://github.com/ant-research/awesome-mllm-guardrails |
| NM27 | PENDING_EDU_REVIEW | awesome-mlops/awesome-mlops-platforms |  |  | https://github.com/awesome-mlops/awesome-mlops-platforms |
| NM27 | PENDING_EDU_REVIEW | fuzzylabs/awesome-open-mlops |  |  | https://github.com/fuzzylabs/awesome-open-mlops |
| NM27 | PENDING_EDU_REVIEW | umitkacar/awesome-mlops |  |  | https://github.com/umitkacar/awesome-mlops/ |
| NM27 | PENDING_RELEASE | Arize-ai/phoenix |  | 11875 (app_user) | https://github.com/Arize-ai/phoenix |
| NM27 | PENDING_RELEASE | confident-ai/deepeval |  | 18916 (app_user) | https://github.com/confident-ai/deepeval |
| NM27 | PENDING_RELEASE | microsoft/nni |  | 14367 (app_user) | https://github.com/microsoft/nni |
| NM27 | PENDING_RELEASE | openai/evals |  | 19613 (f1_user) | https://github.com/openai/evals |
| NM27 | PENDING_RELEASE | SWE-agent/SWE-agent |  | 20578 (f1_user) | https://github.com/SWE-agent/SWE-agent |
| NM27 | PENDING_RELEASE | tensorzero/tensorzero |  | 11708 (app_user) | https://github.com/tensorzero/tensorzero |
| NM27 | PENDING_RELEASE | vibrantlabsai/ragas |  | 16005 (app_user) | https://github.com/vibrantlabsai/ragas |
| NM27 | PENDING_STARS | AgentOps | 2026-10-15 (curriculum_csv) | 7600 (github) | https://github.com/Azure/agentops |
| NM27 | PENDING_STARS | lightseekorg/tokenspeed | 2026-10-06 (curriculum_csv) |  | https://github.com/lightseekorg/tokenspeed |
| NM27 | PENDING_STARS_AND_RELEASE | AI45Lab/DeepSafe |  |  | https://github.com/AI45Lab/DeepSafe/ |
| NM27 | PENDING_STARS_AND_RELEASE | allenai/safety-eval |  |  | https://github.com/allenai/safety-eval |
| NM27 | PENDING_STARS_AND_RELEASE | babelscape/ALERT |  |  | https://github.com/babelscape/ALERT |
| NM27 | PENDING_STARS_AND_RELEASE | centerforaisafety/HarmBench |  | 4200 (github) | https://github.com/centerforaisafety/HarmBench |
| NM27 | PENDING_STARS_AND_RELEASE | ed-donner/llm_engineering |  |  | https://github.com/ed-donner/llm_engineering |
| NM27 | PENDING_STARS_AND_RELEASE | g-kornberg/BOA |  |  | https://github.com/g-kornberg/BOA |
| NM27 | PENDING_STARS_AND_RELEASE | NeoLabHQ/context-engineering-kit |  |  | https://github.com/NeoLabHQ/context-engineering-kit/ |
| NM27 | PENDING_STARS_AND_RELEASE | NVIDIA/SkillSpector |  |  | https://github.com/NVIDIA/SkillSpector |
| NM27 | PENDING_STARS_AND_RELEASE | OpenSpec |  |  | https://github.com/Fission-AI/OpenSpec |
| NM27 | PENDING_STARS_AND_RELEASE | roboflow/supervision |  | 21000 (github) | https://github.com/roboflow/supervision |
| NM27 | PENDING_STARS_AND_RELEASE | safety-research/impossiblebench |  |  | https://github.com/safety-research/impossiblebench |
| NM27 | PENDING_STARS_AND_RELEASE | Shrinet82/MLOPS-Full-Data-Pipeline |  |  | https://github.com/Shrinet82/MLOPS-Full-Data-Pipeline |
| NM27 | PENDING_STARS_AND_RELEASE | SOSBench/SOSBenchEval |  |  | https://github.com/SOSBench/SOSBenchEval |
| NM27 | PENDING_STARS_AND_RELEASE | thu-coai/SafetyBench |  |  | https://github.com/thu-coai/SafetyBench |
| NM27 | PENDING_STARS_AND_RELEASE | Virtue-Research/guard-eval-harness |  |  | https://github.com/Virtue-Research/guard-eval-harness |
| NM27 | PENDING_STARS_AND_RELEASE | zjunlp/DataMind |  |  | https://github.com/zjunlp/datamind/ |
| NM27 | PENDING_TOPIC_UNKNOWN | eleutherai/lm-evaluation-harness |  | 9400 (github) | https://github.com/eleutherai/lm-evaluation-harness |
| NM27 | PENDING_TOPIC_UNKNOWN | guardrails-ai/responsiveness_check |  |  | https://github.com/guardrails-ai/responsiveness_check/blob/main/README.md |
| NM27 | PENDING_TOPIC_UNKNOWN | guardrails-ai/validator-template |  |  | https://github.com/guardrails-ai/validator-template |
| NM27 | ADD_STUDY_EDU | MadryLab/robustness |  | 5400 (f1_user) | https://github.com/MadryLab/robustness |
| NM28 | PENDING_RELEASE | loopx-ai/loopx |  | 7850 (f1_user) | https://github.com/loopx-ai/loopx |
| NM28 | PENDING_RELEASE | langchain-ai/langgraph |  | 19500 (f1_user) | https://github.com/langchain-ai/langgraph |
| NM28 | PENDING_EDU_REVIEW | agent-rules-books |  |  | https://github.com/ciembor/agent-rules-books |
| NM28 | PENDING_EDU_REVIEW | agentic-awesome-skills |  |  | https://github.com/sickn33/agentic-awesome-skills |
| NM28 | PENDING_EDU_REVIEW | AgenticAiLabs/Ai-Engineering-Roadmap |  |  | https://github.com/AgenticAiLabs/Ai-Engineering-Roadmap |
| NM28 | PENDING_EDU_REVIEW | ai-agent-book |  |  | https://github.com/bojieli/ai-agent-book |
| NM28 | PENDING_EDU_REVIEW | awesome-agent-everything |  |  | https://github.com/greasebig/awesome-agent-everything |
| NM28 | PENDING_EDU_REVIEW | awesome-agent-harness |  |  | https://github.com/Picrew/awesome-agent-harness |
| NM28 | PENDING_EDU_REVIEW | awesome-agent-skills |  |  | https://github.com/VoltAgent/awesome-agent-skills |
| NM28 | PENDING_EDU_REVIEW | awesome-claude-code |  |  | https://github.com/hesreallyhim/awesome-claude-code |
| NM28 | PENDING_EDU_REVIEW | awesome-claude-skills |  |  | https://github.com/ComposioHQ/awesome-claude-skills |
| NM28 | PENDING_EDU_REVIEW | Awesome-Context-Engineering |  |  | https://github.com/Meirtz/Awesome-Context-Engineering |
| NM28 | PENDING_EDU_REVIEW | awesome-copilot |  |  | https://github.com/github/awesome-copilot |
| NM28 | PENDING_EDU_REVIEW | awesome-harness-engineering |  |  | https://github.com/ai-boost/awesome-harness-engineering |
| NM28 | PENDING_EDU_REVIEW | awesome-llm-agents |  |  | https://github.com/kaushikb11/awesome-llm-agents |
| NM28 | PENDING_EDU_REVIEW | best-of-Agent-Harnesses |  |  | https://github.com/ryanalberts/best-of-agent-harnesses |
| NM28 | PENDING_EDU_REVIEW | ed-donner/agents |  | 6354 (f1_user) | https://github.com/ed-donner/agents |
| NM28 | PENDING_EDU_REVIEW | mancano-tales/awesome-open-source-research-tools |  |  | https://github.com/mancano-tales/awesome-open-source-research-tools |
| NM28 | PENDING_RELEASE | 1jehuang/jcode |  | 20837 (app_user) | https://github.com/1jehuang/jcode |
| NM28 | PENDING_RELEASE | 2FastLabs/agent-squad |  | 7789 (app_user) | https://github.com/2FastLabs/agent-squad |
| NM28 | PENDING_RELEASE | agentskills/agentskills |  | 26172 (app_user) | https://github.com/agentskills/agentskills |
| NM28 | PENDING_RELEASE | browser-use/browser-harness |  | 18451 (app_user) | https://github.com/browser-use/browser-harness |
| NM28 | PENDING_RELEASE | deepseek-ai/deepseek-harness |  | 251272 (app_user) | https://github.com/deepseek-ai/deepseek-harness |
| NM28 | PENDING_RELEASE | Gentleman-Programming/engram |  | 7355 (app_user) | https://github.com/Gentleman-Programming/engram |
| NM28 | PENDING_RELEASE | google/skills |  | 21364 (app_user) | https://github.com/google/skills |
| NM28 | PENDING_RELEASE | HKUDS/OpenHarness |  | 15996 (app_user) | https://github.com/HKUDS/OpenHarness |
| NM28 | PENDING_RELEASE | Kilo-Org/kilocode |  | 27602 (app_user) | https://github.com/Kilo-Org/kilocode |
| NM28 | PENDING_RELEASE | omnigent-ai/omnigent |  | 10854 (app_user) | https://github.com/omnigent-ai/omnigent |
| NM28 | PENDING_RELEASE | openai/skills |  | 28099 (app_user) | https://github.com/openai/skills |
| NM28 | PENDING_RELEASE | openinterpreter/open-interpreter |  | 68582 (app_user) | https://github.com/OpenInterpreter/open-interpreter |
| NM28 | PENDING_RELEASE | OrchestratorInc/agent-orchestrator |  | 13253 (app_user) | https://github.com/OrchestratorInc/agent-orchestrator |
| NM28 | PENDING_RELEASE | PawanOsman/OpenCursor |  | 6023 (app_user) | https://github.com/PawanOsman/OpenCursor |
| NM28 | PENDING_RELEASE | plandex-ai/plandex |  | 15723 (app_user) | https://github.com/plandex-ai/plandex |
| NM28 | PENDING_RELEASE | stablyai/orca |  | 94084 (app_user) | https://github.com/stablyai/orca |
| NM28 | PENDING_RELEASE | superset-sh/superset |  | 15281 (app_user) | https://github.com/superset-sh/superset |
| NM28 | PENDING_RELEASE | SWE-agent/mini-swe-agent |  | 8555 (f1_user) | https://github.com/SWE-agent/mini-swe-agent |
| NM28 | PENDING_RELEASE | vercel-labs/agent-skills |  | 32540 (app_user) | https://github.com/vercel-labs/agent-skills |
| NM28 | PENDING_RELEASE | vercel-labs/skills |  | 35276 (app_user) | https://github.com/vercel-labs/skills |
| NM28 | PENDING_STARS | addyosmani/agent-skills | 2026-10-13 (curriculum_csv) |  | https://github.com/addyosmani/agent-skills |
| NM28 | PENDING_STARS | agent-substrate/substrate | 2026-10-14 (curriculum_csv) |  | https://github.com/agent-substrate/substrate |
| NM28 | PENDING_STARS | agno | 2026-10-16 (curriculum_csv) | 19800 (github) | https://github.com/agno-agi/agno |
| NM28 | PENDING_STARS | autogen | 2026-09-30 (curriculum_csv) | 38000 (github) | https://github.com/microsoft/autogen |
| NM28 | PENDING_STARS | AutoGPT | 2026-10-14 (curriculum_csv) | 169000 (github) | https://github.com/Significant-Gravitas/AutoGPT |
| NM28 | PENDING_STARS | context-mode | 2026-10-16 (curriculum_csv) |  | https://github.com/mksglu/context-mode |
| NM28 | PENDING_STARS | ECC | 2026-10-01 (curriculum_csv) |  | https://github.com/affaan-m/ECC |
| NM28 | PENDING_STARS | ifixai-ai/iFixAi | 2026-10-15 (curriculum_csv) |  | https://github.com/ifixai-ai/iFixAi |
| NM28 | PENDING_STARS | langflow | 2026-10-13 (curriculum_csv) | 48000 (github) | https://github.com/langflow-ai/langflow |
| NM28 | PENDING_STARS | mattpocock/skills | 2026-10-04 (curriculum_csv) |  | https://github.com/mattpocock/skills |
| NM28 | PENDING_STARS | morluto/rea | 2026-10-14 (curriculum_csv) |  | https://github.com/morluto/rea |
| NM28 | PENDING_STARS | NVIDIA/OpenShell | 2026-10-13 (curriculum_csv) |  | https://github.com/NVIDIA/OpenShell |
| NM28 | PENDING_STARS | obra/superpowers | 2026-10-10 (curriculum_csv) |  | https://github.com/obra/superpowers |
| NM28 | PENDING_STARS | openrig | 2026-10-12 (curriculum_csv) |  | https://github.com/mvschwarz/openrig |
| NM28 | PENDING_STARS | Research Agent Skills | 2026-10-04 (curriculum_csv) |  | https://github.com/KalarisLabs/research-agent-skills |
| NM28 | PENDING_STARS | ruflo | 2026-10-14 (curriculum_csv) |  | https://github.com/ruvnet/ruflo |
| NM28 | PENDING_STARS | Scientific Agent Skills | 2026-10-01 (curriculum_csv) |  | https://github.com/K-Dense-AI/scientific-agent-skills |
| NM28 | PENDING_STARS | thedotmack/claude-mem | 2026-10-16 (curriculum_csv) |  | https://github.com/thedotmack/claude-mem |
| NM28 | PENDING_STARS | xerj-org/xerj | 2026-10-16 (curriculum_csv) |  | https://github.com/xerj-org/xerj |
| NM28 | PENDING_STARS_AND_RELEASE | 12-factor-agents |  |  | https://github.com/humanlayer/12-factor-agents |
| NM28 | PENDING_STARS_AND_RELEASE | a2aproject/A2A |  |  | https://github.com/a2aproject/A2A |
| NM28 | PENDING_STARS_AND_RELEASE | ace |  |  | https://github.com/cs3b/ace |
| NM28 | PENDING_STARS_AND_RELEASE | adk-python |  |  | https://github.com/google/adk-python |
| NM28 | PENDING_STARS_AND_RELEASE | ag2 |  |  | https://github.com/ag2ai/ag2 |
| NM28 | PENDING_STARS_AND_RELEASE | agent-actions |  |  | https://github.com/Muizzkolapo/agent-actions |
| NM28 | PENDING_STARS_AND_RELEASE | agent-harness-generator |  |  | https://github.com/Daffiburrlike452/agent-harness-generator |
| NM28 | PENDING_STARS_AND_RELEASE | agents |  |  | https://github.com/wshobson/agents |
| NM28 | PENDING_STARS_AND_RELEASE | agents-md |  |  | https://github.com/Austin1serb/agents-md |
| NM28 | PENDING_STARS_AND_RELEASE | agentscope |  |  | https://github.com/agentscope-ai/agentscope |
| NM28 | PENDING_STARS_AND_RELEASE | ai-research-preflight |  |  | https://github.com/ProfesseurHaipeng/ai-research-preflight |
| NM28 | PENDING_STARS_AND_RELEASE | anthropic skills |  | 12500 (github) | https://github.com/anthropics/skills |
| NM28 | PENDING_STARS_AND_RELEASE | anthropics/claude-plugins-official |  |  | https://github.com/anthropics/claude-plugins-official |
| NM28 | PENDING_STARS_AND_RELEASE | anthropics/knowledge-work-plugins |  |  | https://github.com/anthropics/knowledge-work-plugins |
| NM28 | PENDING_STARS_AND_RELEASE | argi |  |  | https://github.com/agentic-ai-java/argi |
| NM28 | PENDING_STARS_AND_RELEASE | assafelovic/gpt-researcher |  | 18500 (github) | https://github.com/assafelovic/gpt-researcher |
| NM28 | PENDING_STARS_AND_RELEASE | caveman |  |  | https://github.com/JuliusBrussee/caveman |
| NM28 | PENDING_STARS_AND_RELEASE | cc-switch |  |  | https://github.com/farion1231/cc-switch |
| NM28 | PENDING_STARS_AND_RELEASE | claude-skills |  |  | https://github.com/alirezarezvani/claude-skills |
| NM28 | PENDING_STARS_AND_RELEASE | Codewhale |  |  | https://github.com/codewhale-hq/Codewhale |
| NM28 | PENDING_STARS_AND_RELEASE | CowAgent |  |  | https://github.com/zhayujie/CowAgent |
| NM28 | PENDING_STARS_AND_RELEASE | crewcode |  |  | https://github.com/OnPoint-Dev-Tools/crewcode |
| NM28 | PENDING_STARS_AND_RELEASE | cursor/plugins |  |  | https://github.com/cursor/plugins |
| NM28 | PENDING_STARS_AND_RELEASE | DeepCode |  |  | https://github.com/HKUDS/DeepCode |
| NM28 | PENDING_STARS_AND_RELEASE | DeepSeek-Reasonix |  |  | https://github.com/esengine/DeepSeek-Reasonix |
| NM28 | PENDING_STARS_AND_RELEASE | deer-flow |  |  | https://github.com/bytedance/deer-flow |
| NM28 | PENDING_STARS_AND_RELEASE | everything-claude-code |  |  | https://github.com/affaan-m/everything-claude-code |
| NM28 | PENDING_STARS_AND_RELEASE | FAROS |  |  | https://github.com/OpenNSWM-Lab/FAROS |
| NM28 | PENDING_STARS_AND_RELEASE | Flowise |  | 32000 (github) | https://github.com/FlowiseAI/Flowise |
| NM28 | PENDING_STARS_AND_RELEASE | get-shit-done |  |  | https://github.com/gsd-build/get-shit-done |
| NM28 | PENDING_STARS_AND_RELEASE | graphify |  |  | https://github.com/Graphify-Labs/graphify |
| NM28 | PENDING_STARS_AND_RELEASE | harness-sdk |  |  | https://github.com/strands-agents/harness-sdk/ |
| NM28 | PENDING_STARS_AND_RELEASE | Harness² |  |  | https://github.com/google-research/harness2 |
| NM28 | PENDING_STARS_AND_RELEASE | hive |  |  | https://github.com/aden-hive/hive |
| NM28 | PENDING_STARS_AND_RELEASE | HKUDS/CLI-Anything |  |  | https://github.com/HKUDS/CLI-Anything |
| NM28 | PENDING_STARS_AND_RELEASE | humanizer |  |  | https://github.com/blader/humanizer |
| NM28 | PENDING_STARS_AND_RELEASE | intentkit |  |  | https://github.com/crestalnetwork/intentkit |
| NM28 | PENDING_STARS_AND_RELEASE | itsnavee/claude-forge |  |  | https://github.com/itsnavee/claude-forge |
| NM28 | PENDING_STARS_AND_RELEASE | mem0 |  | 28400 (github) | https://github.com/mem0ai/mem0 |
| NM28 | PENDING_STARS_AND_RELEASE | MetaGPT |  | 44000 (github) | https://github.com/FoundationAgents/MetaGPT |
| NM28 | PENDING_STARS_AND_RELEASE | metaharness |  |  | https://github.com/ruvnet/metaharness |
| NM28 | PENDING_STARS_AND_RELEASE | microsoft/ai-agents-for-beginners |  | 26000 (github) | https://github.com/microsoft/ai-agents-for-beginners |
| NM28 | PENDING_STARS_AND_RELEASE | microsoft/RD-Agent |  | 8200 (github) | https://github.com/microsoft/RD-Agent |
| NM28 | PENDING_STARS_AND_RELEASE | mvanhorn/last30days-skill |  |  | https://github.com/mvanhorn/last30days-skill |
| NM28 | PENDING_STARS_AND_RELEASE | nanobrowser |  |  | https://github.com/nanobrowser/nanobrowser |
| NM28 | PENDING_STARS_AND_RELEASE | nanoclaw |  |  | https://github.com/qwibitai/nanoclaw |
| NM28 | PENDING_STARS_AND_RELEASE | obsidian-skills |  |  | https://github.com/kepano/obsidian-skills |
| NM28 | PENDING_STARS_AND_RELEASE | oh-my-claudecode |  |  | https://github.com/Yeachan-Heo/oh-my-claudecode |
| NM28 | PENDING_STARS_AND_RELEASE | oh-my-openagent |  |  | https://github.com/code-yeongyu/oh-my-openagent |
| NM28 | PENDING_STARS_AND_RELEASE | OpenHands/OpenHands |  | 44000 (github) | https://github.com/OpenHands/OpenHands |
| NM28 | PENDING_STARS_AND_RELEASE | PKU-YuanGroup/OpenAI4S |  |  | https://github.com/PKU-YuanGroup/OpenAI4S |
| NM28 | PENDING_STARS_AND_RELEASE | planning-with-files |  |  | https://github.com/OthmanAdi/planning-with-files |
| NM28 | PENDING_STARS_AND_RELEASE | PraisonAI |  | 4800 (github) | https://github.com/MervinPraison/PraisonAI |
| NM28 | PENDING_STARS_AND_RELEASE | prompt-optimizer |  |  | https://github.com/linshenkx/prompt-optimizer |
| NM28 | PENDING_STARS_AND_RELEASE | prompts.chat |  | 48000 (github) | https://github.com/f/prompts.chat |
| NM28 | PENDING_STARS_AND_RELEASE | RasaHQ/rasa |  | 19000 (github) | https://github.com/RasaHQ/rasa |
| NM28 | PENDING_STARS_AND_RELEASE | rtk |  |  | https://github.com/rtk-ai/rtk |
| NM28 | PENDING_STARS_AND_RELEASE | sciagent-ai/sciagent-cli |  |  | https://github.com/sciagent-ai/sciagent-cli |
| NM28 | PENDING_STARS_AND_RELEASE | SciAgent-Skills |  |  | https://github.com/jaechang-hits/SciAgent-Skills |
| NM28 | PENDING_STARS_AND_RELEASE | secondsky/claude-skills |  |  | https://github.com/secondsky/claude-skills/ |
| NM28 | PENDING_STARS_AND_RELEASE | serena |  |  | https://github.com/oraios/serena |
| NM28 | PENDING_STARS_AND_RELEASE | stbenjam/skillsaw |  |  | https://github.com/stbenjam/skillsaw |
| NM28 | PENDING_STARS_AND_RELEASE | strands-agents |  |  | https://github.com/strands-agents/sdk-python |
| NM28 | PENDING_STARS_AND_RELEASE | system_prompts_leaks |  |  | https://github.com/asgeirtj/system_prompts_leaks |
| NM28 | PENDING_STARS_AND_RELEASE | tdd-guard |  |  | https://github.com/nizos/tdd-guard |
| NM28 | PENDING_STARS_AND_RELEASE | tmusser/ai-engineering-skills |  |  | https://github.com/tmusser/ai-engineering-skills |
| NM28 | PENDING_STARS_AND_RELEASE | Trellis |  |  | https://github.com/mindfold-ai/Trellis |
| NM28 | PENDING_STARS_AND_RELEASE | ui-ux-pro-max-skill |  |  | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| NM28 | PENDING_STARS_AND_RELEASE | vadimcomanescu/agents-skills |  |  | https://github.com/vadimcomanescu/agents-skills |
| NM28 | PENDING_TOPIC_UNKNOWN | modelcontextprotocol/go-sdk |  | 4200 (github) | https://github.com/modelcontextprotocol/go-sdk/ |
| NM28 | PENDING_TOPIC_UNKNOWN | modelcontextprotocol/python-sdk |  | 11800 (github) | https://github.com/modelcontextprotocol/python-sdk/ |
| NM28 | PENDING_TOPIC_UNKNOWN | modelcontextprotocol/registry |  | 5600 (github) | https://github.com/modelcontextprotocol/registry |
| NM28 | PENDING_TOPIC_UNKNOWN | modelcontextprotocol/typescript-sdk |  | 14200 (github) | https://github.com/modelcontextprotocol/typescript-sdk |
| NM28 | PENDING_TOPIC_UNKNOWN | nousresearch/hermes-agent |  | 6800 (github) | https://github.com/NousResearch/hermes-agent |
| NM28 | PENDING_TOPIC_UNKNOWN | openai/openai-agents-python |  | 8900 (github) | https://github.com/openai/openai-agents-python/ |
| NM28 | STUDY_ONLY | nanobot |  | 4800 (github) | https://github.com/HKUDS/nanobot |
| NM28 | STUDY_POINTER | learn-claude-code |  |  | https://github.com/shareAI-lab/learn-claude-code |
| NM28 | STUDY_POINTER | muratcankoylan/Agent-Skills-for-Context-Engineering |  |  | https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering/ |
| NM28 | STUDY_POINTER | Prompt-Engineering-Guide |  | 58000 (github) | https://github.com/dair-ai/Prompt-Engineering-Guide |
| NM28 | STUDY_POINTER | yzfly/awesome-context-engineering |  |  | https://github.com/yzfly/awesome-context-engineering |
| NM32 | PENDING_STARS_AND_RELEASE | ProjectPhysX/FluidX3D |  | 6200 (github) | https://github.com/ProjectPhysX/FluidX3D |
| NM34 | PENDING_TOPIC_UNKNOWN | facebookresearch/xformers |  | 8700 (github) | https://github.com/facebookresearch/xformers?tab=readme-ov-file |
| NM34 | B68_TRACKED | triton-lang/triton |  | 16500 (github) | https://github.com/triton-lang/triton |
| NM36 | PENDING_STARS_AND_RELEASE | GEAR |  | 4100 (github) | https://github.com/opengear-project/GEAR |
| NM37 | PENDING_STARS | LiteLLM | 2026-10-16 (curriculum_csv) | 21300 (github) | https://github.com/BerriAI/litellm |
| NM37 | PENDING_STARS | oMLX | 2026-10-15 (curriculum_csv) |  | https://github.com/jundot/omlx |
| NM37 | PENDING_STARS | tashfeenahmed/freellmapi | 2026-10-15 (curriculum_csv) |  | https://github.com/tashfeenahmed/freellmapi |
| NM37 | PENDING_STARS_AND_RELEASE | AutoGPTQ/AutoGPTQ |  | 5200 (github) | https://github.com/AutoGPTQ/AutoGPTQ |
| NM37 | PENDING_STARS_AND_RELEASE | bitsandbytes-foundation/bitsandbytes |  | 6200 (github) | https://github.com/bitsandbytes-foundation/bitsandbytes |
| NM37 | PENDING_STARS_AND_RELEASE | GPTQModel |  | 4900 (github) | https://github.com/ModelCloud/gptqmodel |
| NM37 | PENDING_STARS_AND_RELEASE | headroom |  |  | https://github.com/headroomlabs-ai/headroom |
| NM37 | PENDING_STARS_AND_RELEASE | intel/neural-compressor |  | 2800 (github) | https://github.com/intel/neural-compressor |
| NM37 | PENDING_STARS_AND_RELEASE | lcc |  |  | https://github.com/lucasmartins-ai/lcc |
| NM37 | PENDING_STARS_AND_RELEASE | mit-han-lab/llm-awq |  | 5800 (github) | https://github.com/mit-han-lab/llm-awq/ |
| NM37 | PENDING_STARS_AND_RELEASE | Model-Optimizer |  |  | https://github.com/NVIDIA/Model-Optimizer |
| NM37 | PENDING_STARS_AND_RELEASE | neuralmagic/deepsparse |  | 3600 (github) | https://github.com/neuralmagic/deepsparse |
| NM37 | PENDING_STARS_AND_RELEASE | nunchaku-ai/nunchaku |  | 4400 (github) | https://github.com/nunchaku-ai/nunchaku |
| NM37 | PENDING_STARS_AND_RELEASE | OpenNMT/CTranslate2 |  | 4200 (github) | https://github.com/OpenNMT/CTranslate2 |
| NM37 | PENDING_STARS_AND_RELEASE | vllm-project/llm-compressor |  | 4800 (github) | https://github.com/vllm-project/llm-compressor |
| NM40 | PENDING_TOPIC_UNKNOWN | ai-dynamo/dynamo |  | 3900 (github) | https://github.com/ai-dynamo/dynamo |
| NM43 | PENDING_STARS_AND_RELEASE | deepspeedai/DeepSpeed |  | 36000 (github) | https://github.com/deepspeedai/DeepSpeed |
| NM43 | PENDING_STARS_AND_RELEASE | NVIDIA/Megatron-LM |  | 12500 (github) | https://github.com/NVIDIA/Megatron-LM |
| NM48 | PENDING_TOPIC_UNKNOWN | apache/tvm |  | 18500 (github) | https://github.com/apache/tvm/ |
| NM54 | PENDING_STARS_AND_RELEASE | AUTOMATIC1111/stable-diffusion-webui |  | 145000 (github) | https://github.com/AUTOMATIC1111/stable-diffusion-webui |
| NM56 | PENDING_EDU_REVIEW | ahmedbahaaeldin/From-0-to-Research-Scientist-resources-guide |  |  | https://github.com/ahmedbahaaeldin/From-0-to-Research-Scientist-resources-guide |
| NM56 | PENDING_STARS | earthtojake/text-to-cad | 2026-10-11 (curriculum_csv) |  | https://github.com/earthtojake/text-to-cad |
| NM56 | PENDING_STARS_AND_RELEASE | aipoch/open-science |  |  | https://github.com/aipoch/open-science |
| NM56 | PENDING_STARS_AND_RELEASE | dzhng/deep-research |  | 11200 (github) | https://github.com/dzhng/deep-research |
| NM56 | PENDING_STARS_AND_RELEASE | google-deepmind/alphafold |  | 18900 (github) | https://github.com/google-deepmind/alphafold |
| NM56 | PENDING_STARS_AND_RELEASE | google-research/bert |  | 38000 (github) | https://github.com/google-research/bert |
| NM56 | PENDING_STARS_AND_RELEASE | google/artemis |  |  | https://github.com/google/artemis |
| NM56 | PENDING_STARS_AND_RELEASE | labmlai/annotated_deep_learning_paper_implementations |  | 58000 (github) | https://github.com/labmlai/annotated_deep_learning_paper_implementations |
| NM56 | PENDING_STARS_AND_RELEASE | microsoft/qlib |  | 16500 (github) | https://github.com/microsoft/qlib |
| NM56 | PENDING_STARS_AND_RELEASE | nearai/program_synthesis |  |  | https://github.com/nearai/program_synthesis |
| NM56 | PENDING_STARS_AND_RELEASE | spack/spack |  | 4400 (github) | https://github.com/spack/spack |
| NM56 | PENDING_STARS_AND_RELEASE | synthetic-sciences/openscience |  |  | https://github.com/synthetic-sciences/openscience |
| NM56 | STUDY_POINTER | owainlewis/awesome-artificial-intelligence |  | 16680 (app_user) | https://github.com/owainlewis/awesome-artificial-intelligence |
| NM60 | PENDING_EDU_REVIEW | alirezadir/Machine-Learning-Interviews |  | 9864 (app_user) | https://github.com/alirezadir/Machine-Learning-Interviews |
| NM60 | PENDING_EDU_REVIEW | dave-nachman/awesome-ai-engineering |  |  | https://github.com/dave-nachman/awesome-ai-engineering |
| NM60 | PENDING_EDU_REVIEW | Guidely-org/awesome-ai-engineering |  |  | https://github.com/Guidely-org/awesome-ai-engineering |
| NM60 | PENDING_EDU_REVIEW | khangich/machine-learning-interview |  | 12843 (app_user) | https://github.com/khangich/machine-learning-interview |
| NM60 | PENDING_EDU_REVIEW | samuelvinay91/awesome-ai-engineer |  |  | https://github.com/samuelvinay91/awesome-ai-engineer |
| NM60 | PENDING_EDU_REVIEW | w512/AI-Vault |  |  | https://github.com/w512/AI-Vault |
| NM60 | STUDY_POINTER | chiphuyen/aie-book |  | 11400 (github) | https://github.com/chiphuyen/aie-book |
| NM60 | STUDY_POINTER | donnemartin/system-design-primer |  | 354455 (f1_user) | http://www.github.com/donnemartin/system-design-primer |
| NM60 | STUDY_POINTER | jwasham/coding-interview-university |  | 357248 (f1_user) | https://www.github.com/jwasham/coding-interview-university |
| NM60 | STUDY_POINTER | kamranahmedse/developer-roadmap |  | 369523 (f1_user) | https://www.github.com/kamranahmedse/developer-roadmap |
| NM60 | STUDY_POINTER | louisfb01/start-ai-engineering |  |  | https://github.com/louisfb01/start-ai-engineering |
| NM60 | STUDY_POINTER | ossu/computer-science |  | 207316 (f1_user) | http://www.github.com/ossu/computer-science |
| NM60 | STUDY_POINTER | udlbook/udlbook |  | 10023 (f1_user) | https://github.com/udlbook/udlbook |
`;

console.log('Script loaded, ready to parse table.');
