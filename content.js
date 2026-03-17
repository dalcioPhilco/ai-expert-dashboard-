// ═══════════════════════════════════════════════════════
//  AI EXPERT DASHBOARD — Content Data
//  Edite este arquivo para personalizar seu plano de estudos
// ═══════════════════════════════════════════════════════

const DATA = {

  // ── Dicas rotativas ──
  tips: [
    "Esta semana: implemente KV cache manual num mini-GPT para entender como o vLLM otimiza com PagedAttention. O contraste é revelador.",
    "Leia o paper DPO e reproduza o training loop. Entender o gradiente por dentro faz toda a diferença na hora de debugar alinhamento.",
    "Antes de usar um framework de agentes, implemente um ReAct loop do zero em ~100 linhas. Você vai entender o que o LangGraph resolve.",
    "Monte uma eval automatizada com LLM-as-judge para seu projeto atual. Sem evals rigorosas você está voando às cegas.",
    "Documente experimentos no diário: o que tentou, por que falhou, o que funcionou. Em 6 meses será seu recurso mais valioso.",
    "Experimente o mesmo prompt em 3 temperaturas e analise a distribuição dos outputs. Intuição sobre temperatura vale mais que heurística.",
    "Estude um paper por semana: comece pelo abstract, depois conclusão, depois metodologia. Eficiência > completude.",
  ],

  // ── Roadmap de 6 meses ──
  roadmap: [
    {
      phase: "Mês 1–2",
      weeks: "~40h totais",
      name: "LLMs & Fine-tuning",
      color: "#a89ef0",
      desc: "Domine os internals de transformers modernos (KV cache, RoPE, FlashAttention, scaling laws) e execute seus primeiros fine-tunes com LoRA e QLoRA.",
      deliverable: "Entrega: modelo fine-tunado em domínio específico, publicado no HuggingFace Hub",
    },
    {
      phase: "Mês 2–3",
      weeks: "~25h totais",
      name: "RAG & Knowledge Systems",
      color: "#f0a840",
      desc: "Construa um pipeline RAG de produção com embeddings avançados (Matryoshka, late chunking), Graph RAG e avaliação automatizada com RAGAS.",
      deliverable: "Entrega: sistema RAG com eval automatizada e dashboard de métricas",
    },
    {
      phase: "Mês 3–4",
      weeks: "~30h totais",
      name: "Agentes de IA",
      color: "#60a8f0",
      desc: "Implemente agentes ReAct e Reflexion, sistemas multi-agente com CrewAI/LangGraph e integre ferramentas via Model Context Protocol (MCP).",
      deliverable: "Entrega: agente especializado com ferramentas reais e eval automatizada",
    },
    {
      phase: "Mês 5",
      weeks: "~20h totais",
      name: "MLOps & Produção",
      color: "#f0a840",
      desc: "Otimize inference com vLLM e quantização, implante observabilidade completa com Langfuse, implemente guardrails e reduza custo de serving.",
      deliverable: "Entrega: sistema em produção com SLA definido e monitoramento ativo",
    },
    {
      phase: "Mês 6",
      weeks: "~25h totais",
      name: "Projeto Integrador",
      color: "#3ecf8e",
      desc: "Sistema completo: LLM fine-tunado + RAG contextual + agente orquestrando tudo + MLOps. Documentar e publicar como blog post técnico ou paper.",
      deliverable: "Entrega: repositório público com README técnico e blog post ou paper",
    },
  ],

  // ── Trilhas de estudo ──
  tracks: [
    {
      name: "LLMs — Arquitetura & Fundamentos",
      icon: "🔬",
      color: "#a89ef0",
      iconBg: "rgba(168,158,240,0.15)",
      duration: "5 semanas · ~25h",
      desc: "Internals de transformers, pré-treinamento, tokenização avançada",
      progress: 15,
      modules: [
        { name: "Transformer internals profundos", info: "Attention patterns, KV cache, positional encodings (RoPE, ALiBi)", status: "done", hrs: "4h" },
        { name: "Pré-treinamento e scaling laws", info: "Chinchilla, emergência, compute-optimal training", status: "now", hrs: "4h" },
        { name: "Tokenização avançada", info: "BPE, SentencePiece, tiktoken, vocabulário multilíngue", status: "lock", hrs: "3h" },
        { name: "Mecanismos de atenção modernos", info: "FlashAttention, GQA, MLA, Sliding Window Attention", status: "lock", hrs: "4h" },
        { name: "Arquiteturas recentes", info: "Mistral, Llama 3, Gemma, Phi — diferenças e tradeoffs", status: "lock", hrs: "5h" },
      ],
    },
    {
      name: "Fine-tuning & Alinhamento",
      icon: "🎯",
      color: "#3ecf8e",
      iconBg: "rgba(62,207,142,0.12)",
      duration: "6 semanas · ~30h",
      desc: "RLHF, DPO, LoRA, QLoRA — do conceito ao experimento",
      progress: 0,
      modules: [
        { name: "SFT — Supervised Fine-tuning", info: "Instruction tuning, chat templates, formatação de dados", status: "lock", hrs: "4h" },
        { name: "LoRA e variantes (QLoRA, DoRA)", info: "Math por trás, rank selection, target modules", status: "lock", hrs: "5h" },
        { name: "RLHF e reward modeling", info: "PPO, reward hacking, helpfulness vs safety", status: "lock", hrs: "6h" },
        { name: "DPO e métodos offline", info: "Direct Preference Optimization, SimPO, KTO", status: "lock", hrs: "5h" },
        { name: "Avaliação rigorosa de LLMs", info: "MT-Bench, HELM, LM-Eval, evals customizadas", status: "lock", hrs: "5h" },
        { name: "Projeto: fine-tune de domínio", info: "Dataset curation → training → eval → deployment", status: "proj", hrs: "10h" },
      ],
    },
    {
      name: "RAG & Knowledge Systems",
      icon: "📚",
      color: "#f0a840",
      iconBg: "rgba(240,168,64,0.12)",
      duration: "5 semanas · ~25h",
      desc: "RAG avançado, embeddings, grafos de conhecimento",
      progress: 0,
      modules: [
        { name: "Embeddings avançados", info: "Matryoshka, late chunking, colBERT, bi-encoder vs cross-encoder", status: "lock", hrs: "5h" },
        { name: "Estratégias de chunking & indexação", info: "Hierarchical, semantic, late chunking, multi-vector", status: "lock", hrs: "4h" },
        { name: "RAG avançado e Agentic RAG", info: "HyDE, FLARE, self-RAG, corrective RAG", status: "lock", hrs: "6h" },
        { name: "Graph RAG & Knowledge Graphs", info: "Microsoft GraphRAG, entidades, relações, reasoning", status: "lock", hrs: "5h" },
        { name: "Projeto: sistema RAG em produção", info: "Pipeline completo com eval e monitoramento", status: "proj", hrs: "8h" },
      ],
    },
    {
      name: "Agentes de IA",
      icon: "🤖",
      color: "#60a8f0",
      iconBg: "rgba(96,168,240,0.12)",
      duration: "6 semanas · ~30h",
      desc: "Arquiteturas multi-agente, tool use, planning, MCP",
      progress: 0,
      modules: [
        { name: "Fundamentos de agentes LLM", info: "ReAct, Reflexion, CoT vs ToT vs BoT", status: "lock", hrs: "4h" },
        { name: "Tool use & function calling", info: "Parallel tool use, tool selection, error handling", status: "lock", hrs: "5h" },
        { name: "Memory e state management", info: "Working memory, episodic, semantic, procedural", status: "lock", hrs: "4h" },
        { name: "Multi-agent systems", info: "CrewAI, AutoGen, Swarm, orchestration patterns", status: "lock", hrs: "6h" },
        { name: "Model Context Protocol (MCP)", info: "Spec, tool servers, integração com Claude/GPT", status: "lock", hrs: "4h" },
        { name: "Projeto: agente especializado", info: "Agente com ferramentas reais + eval automatizada", status: "proj", hrs: "12h" },
      ],
    },
    {
      name: "MLOps & Deploy em Produção",
      icon: "⚙️",
      color: "#f07040",
      iconBg: "rgba(240,112,64,0.12)",
      duration: "4 semanas · ~20h",
      desc: "Serving, observabilidade, custo, guardrails",
      progress: 0,
      modules: [
        { name: "Inference otimizada", info: "vLLM, TensorRT-LLM, quantização (GPTQ, AWQ, GGUF)", status: "lock", hrs: "5h" },
        { name: "LLMOps — monitoramento", info: "Langfuse, LangSmith, traces, latência, custo", status: "lock", hrs: "4h" },
        { name: "Guardrails e safety", info: "NeMo Guardrails, Llama Guard, output filtering", status: "lock", hrs: "4h" },
        { name: "Arquiteturas de produção", info: "Caching, routing (RouteLLM), fallbacks, batching", status: "lock", hrs: "5h" },
      ],
    },
  ],

  // ── Flashcard decks ──
  flashcards: [
    // 0 — Arquitetura LLMs
    [
      { q: "O que é KV Cache e por que é essencial em inference?", a: "Armazena os vetores Key e Value de tokens anteriores para evitar recalcular atenção. Reduz complexidade de O(n²) por token para O(n), crítico para geração autoregressiva." },
      { q: "Explique RoPE (Rotary Positional Encoding)", a: "Codifica posição multiplicando embeddings por matrizes de rotação. Vantagem: extrapola para sequências mais longas que as vistas no treino e preserva a distância relativa entre tokens." },
      { q: "O que são Scaling Laws (Chinchilla)?", a: "Chinchilla mostrou que LLMs costumavam ser over-trained. A lei ótima: tokens ≈ 20× parâmetros. Um modelo 7B precisa de ~140B tokens para ser compute-optimal." },
      { q: "O que é Grouped-Query Attention (GQA)?", a: "Compartilha as matrizes Key/Value entre grupos de heads de query, reduzindo o KV cache sem perda significativa de qualidade. Usado no Llama 2/3 e Mistral." },
      { q: "Diferença entre Flash Attention e atenção padrão?", a: "FlashAttention recalcula blocos de atenção no chip (SRAM) sem materializar a matriz N×N completa em HBM, reduzindo uso de memória de O(N²) para O(N) e acelerando 2–4×." },
    ],
    // 1 — Fine-tuning & PEFT
    [
      { q: "O que é LoRA e como funciona matematicamente?", a: "Decompõe a atualização de peso ΔW em dois matrices de baixo rank: ΔW = A·B onde A∈Rᵈˣʳ e B∈RʳˣD, com r<<d. Treina só A e B, reduzindo parâmetros treináveis em ~1000×." },
      { q: "Diferença entre SFT e RLHF?", a: "SFT treina o modelo para imitar demonstrations (máximo de likelihood). RLHF vai além: aprende um reward model com preferências humanas e usa RL (PPO) para maximizar a recompensa esperada." },
      { q: "O que é DPO e como difere do RLHF?", a: "Direct Preference Optimization elimina o reward model explícito, otimizando diretamente em pares de respostas (preferida vs rejeitada). Mais estável que PPO e produz resultados comparáveis." },
      { q: "O que é QLoRA?", a: "LoRA + quantização do modelo base em 4-bit (NF4). Permite fine-tunar modelos 70B+ em uma única GPU de consumidor. O modelo base fica congelado em 4-bit; apenas os adaptadores LoRA treinam em bf16." },
      { q: "O que é instruction tuning?", a: "Supervised fine-tuning em datasets de pares (instrução, resposta de alta qualidade). Ensina o modelo a seguir instruções. Base para todos os modelos de chat modernos (GPT-4, Claude, Llama-Instruct)." },
    ],
    // 2 — RAG avançado
    [
      { q: "O que é Matryoshka Representation Learning (MRL)?", a: "Treina embeddings que funcionam bem em qualquer dimensão truncada. Um embedding de 1536d pode ser truncado para 256d com boa qualidade, permitindo armazenamento e busca mais eficientes." },
      { q: "O que é HyDE (Hypothetical Document Embeddings)?", a: "Ao invés de embeddar a pergunta diretamente, usa o LLM para gerar um documento hipotético que responderia à pergunta, depois embeds esse documento. Melhora recuperação semântica." },
      { q: "Diferença entre bi-encoder e cross-encoder em retrieval?", a: "Bi-encoder embeds query e doc separadamente (rápido, escalável). Cross-encoder processa o par junto (lento, muito mais preciso). Combinação: retrieval com bi-encoder + reranking com cross-encoder." },
      { q: "O que é late chunking?", a: "Chunks o documento só após obter os embeddings contextualizados do documento completo. Preserva contexto cross-chunk que chunking antecipado perde. Aumenta qualidade de retrieval para textos longos." },
      { q: "O que é RAGAS e como avaliar um pipeline RAG?", a: "Framework de avaliação que mede: faithfulness, answer relevancy, context precision e context recall. Cada métrica calculada com LLM-as-judge sem labels humanos." },
    ],
    // 3 — Agentes & ReAct
    [
      { q: "O que é o padrão ReAct?", a: "Reasoning + Acting interleaved: o agente alterna entre Thought (raciocínio), Action (chamada de ferramenta) e Observation (resultado). Resolve problemas complexos iterativamente com grounding." },
      { q: "O que é Reflexion em agentes?", a: "O agente gera uma reflexão verbal sobre seus erros após cada episódio, armazenando essa crítica em memória. Nas tentativas seguintes, usa as reflexões para evitar os mesmos erros — self-improvement sem fine-tuning." },
      { q: "Diferença entre orquestrador e sub-agente?", a: "Orquestrador: recebe o objetivo, decide qual sub-agente chamar e quando. Sub-agente: especializado em uma tarefa, executa e retorna resultado. Separação de concerns para sistemas complexos." },
      { q: "O que é Model Context Protocol (MCP)?", a: "Protocolo aberto da Anthropic que padroniza como LLMs se conectam a ferramentas externas. Define primitivas: tools, resources e prompts. Permite trocar o LLM sem reescrever as integrações." },
      { q: "O que é Tree of Thoughts (ToT)?", a: "Generaliza CoT: o LLM explora múltiplos ramos de raciocínio em paralelo (busca em árvore), avalia cada ramo e faz backtracking. Resolve problemas que exigem planejamento global." },
    ],
    // 4 — MLOps & Deploy
    [
      { q: "O que é vLLM e por que é o padrão de serving?", a: "Engine de serving que usa PagedAttention — gerencia KV cache em páginas como memória virtual de SO. Elimina fragmentação e alcança throughput 10–24× maior que Transformers naive." },
      { q: "Diferença entre GPTQ, AWQ e GGUF?", a: "GPTQ: quantização por calibração (GPU). AWQ: preserva pesos importantes antes de quantizar (melhor qualidade, GPU). GGUF: formato llama.cpp para CPU inference com mixed precision por layer." },
      { q: "O que é RouteLLM?", a: "Framework de roteamento que direciona cada query para o modelo mais barato capaz de respondê-la. Usa classificador treinado em preferências humanas. Pode reduzir custos 85%+ mantendo 95% da qualidade." },
      { q: "O que medir em observabilidade de LLMs?", a: "Latência (TTFT e TPS), tokens de entrada/saída (custo), taxa de erro, qualidade (LLM-as-judge), drift de distribuição de queries e taxa de guardrail triggers. Ferramentas: Langfuse, LangSmith, Arize." },
      { q: "O que é continuous batching em LLM serving?", a: "Insere novas requests nos slots liberados enquanto outras ainda geram, sem esperar todas terminarem. Mantém alta utilização de GPU e reduz latência média. Implementado em vLLM e TGI." },
    ],
  ],

  // ── Quiz decks ──
  quizzes: [
    // 0 — LLMs & Transformers
    [
      {
        q: "Qual é a complexidade computacional da atenção padrão em relação ao comprimento da sequência N?",
        opts: ["O(N)", "O(N log N)", "O(N²)", "O(N³)"],
        ans: 2,
        exp: "A atenção calcula scores entre todos os pares de tokens, resultando em uma matriz N×N. FlashAttention mantém a mesma complexidade, mas é IO-aware: evita materializar a matriz completa em HBM.",
      },
      {
        q: "O que a pesquisa Chinchilla (2022) revelou sobre modelos como GPT-3?",
        opts: ["Muito poucas camadas de atenção", "Muitos parâmetros e tokens de treino insuficientes", "Taxa de aprendizado muito alta", "Vocab size pequeno demais"],
        ans: 1,
        exp: "Chinchilla mostrou que GPT-3 (175B params, 300B tokens) era compute-suboptimal. A lei: tokens ≈ 20× parâmetros. GPT-3 deveria ter ~3× menos parâmetros e ~3× mais tokens para o mesmo compute budget.",
      },
      {
        q: "GQA (Grouped Query Attention) foi introduzida principalmente para resolver qual problema?",
        opts: ["Reduzir overfitting", "Diminuir o tamanho do KV cache em inference", "Acelerar o pré-treinamento", "Melhorar qualidade em raciocínio"],
        ans: 1,
        exp: "O KV cache cresce com batch_size × seq_len × num_heads. GQA compartilha K/V entre grupos de Q heads, reduzindo o KV cache em num_heads/num_kv_heads× com degradação mínima de qualidade.",
      },
      {
        q: "RoPE encoda posição de qual forma nos embeddings?",
        opts: ["Adição de vetor sinusoidal fixo", "Multiplicação por matrizes de rotação dependentes da posição", "Concatenação de embedding de posição", "Soma aprendida durante fine-tuning"],
        ans: 1,
        exp: "RoPE aplica rotações no espaço complexo: cada par de dimensões é rotacionado por um ângulo proporcional à posição. O dot product fica função apenas da distância relativa — o que facilita extrapolação de contexto.",
      },
    ],
    // 1 — Fine-tuning & Alinhamento
    [
      {
        q: "No LoRA, o que o hiperparâmetro 'r' (rank) controla?",
        opts: ["Taxa de aprendizado dos adaptadores", "Número de parâmetros treináveis — rank mais alto = mais parâmetros", "Quais camadas recebem adaptadores", "Proporção de dropout nos adaptadores"],
        ans: 1,
        exp: "r define o rank da decomposição ΔW=AB. r=4: ~0.1% params. r=64: ~1.5%. Ranks maiores aumentam capacidade mas risco de overfitting em datasets pequenos. r=8 a 16 costuma ser suficiente para domínios específicos.",
      },
      {
        q: "DPO é treinado em qual tipo de dados?",
        opts: ["Pares (instrução, resposta)", "Trios (prompt, resposta_ganha, resposta_perde)", "Apenas respostas de alta qualidade", "Feedback numérico de 1 a 5"],
        ans: 1,
        exp: "DPO usa datasets de preferência: para cada prompt, há uma resposta 'chosen' e uma 'rejected'. O objetivo é maximizar a probabilidade relativa da escolhida vs rejeitada — sem reward model explícito.",
      },
      {
        q: "Qual é a principal vantagem prática do QLoRA sobre LoRA padrão?",
        opts: ["Convergência mais rápida", "Permite fine-tunar modelos 70B+ em GPUs de consumidor com 24GB", "Produz modelos menores após o treino", "Não precisa de dados de preferência"],
        ans: 1,
        exp: "QLoRA quantiza o modelo base em NF4 (4-bit), reduzindo ~4× o uso de VRAM. Um Llama-3 70B ocupa ~35GB em 4-bit vs ~140GB em bf16. Apenas os adaptadores LoRA ficam em bf16.",
      },
      {
        q: "O que é 'reward hacking' em RLHF?",
        opts: ["O modelo nega responder perguntas difíceis", "O modelo aprende a maximizar o reward model de formas não desejadas", "O modelo copia respostas do dataset", "O reward model overfita no validation set"],
        ans: 1,
        exp: "O reward model é uma aproximação imperfeita das preferências humanas. O LLM pode hackear o reward model gerando textos que pontuam alto mas são incoerentes, muito longos ou sycophantic — sem real melhora de qualidade.",
      },
    ],
    // 2 — Agentes & RAG
    [
      {
        q: "Em ReAct, qual é a sequência correta em cada step?",
        opts: ["Action → Thought → Observation", "Thought → Action → Observation", "Observation → Thought → Action", "Action → Observation → Thought"],
        ans: 1,
        exp: "Thought: o agente raciocina. Action: executa uma ferramenta. Observation: recebe o resultado. Esse ciclo se repete até o agente ter informação suficiente para responder.",
      },
      {
        q: "O que diferencia Agentic RAG do RAG tradicional?",
        opts: ["Agentic RAG usa modelos menores", "O LLM decide quando e como buscar, podendo fazer múltiplas buscas iterativas e reflexivas", "Agentic RAG não usa vector stores", "Agentic RAG só funciona com GPT-4"],
        ans: 1,
        exp: "RAG tradicional: query → retrieve → generate (1 passo fixo). Agentic RAG: o agente avalia se o contexto é suficiente, faz buscas adicionais, reformula queries e usa diferentes estratégias dependendo da pergunta.",
      },
      {
        q: "Por que sistemas multi-agente podem superar um único agente poderoso?",
        opts: ["São mais baratos", "Paralelismo, especialização por domínio e verificação cruzada", "Agentes menores têm menos hallucinations", "Facilitam o deploy"],
        ans: 1,
        exp: "Paralelismo (subproblemas em paralelo), especialização (cada agente tem system prompt e ferramentas otimizadas) e verificação cruzada (um agente critica o output de outro). Tradeoff: mais complexidade de orquestração.",
      },
      {
        q: "O que é o hiperparâmetro 'top-k' no retrieval?",
        opts: ["Número de tokens gerados", "Número de chunks recuperados do vector store", "Dimensão dos embeddings", "Número de layers do encoder"],
        ans: 1,
        exp: "top-k define quantos chunks são recuperados e passados no contexto do LLM. Típico: k=4–8 para RAG simples, k=20+ com reranking posterior que filtra para os 3–5 mais relevantes.",
      },
    ],
    // 3 — MLOps & Produção
    [
      {
        q: "O que é TTFT em inference de LLMs?",
        opts: ["Total Token Frequency Threshold", "Time To First Token — latência até o primeiro token aparecer", "Training Time Fine-Tuning", "Token Throughput Factor Test"],
        ans: 1,
        exp: "TTFT mede a latência de prefill (processar o prompt). É o que o usuário percebe como 'demora para começar'. Separar de TPS (tokens/segundo de geração) é crucial — batching aumenta TPS mas pode aumentar TTFT.",
      },
      {
        q: "AWQ difere do GPTQ porque:",
        opts: ["AWQ usa 8-bit em vez de 4-bit", "AWQ identifica e preserva os 1% de pesos mais importantes antes de quantizar", "AWQ só funciona em CPUs", "AWQ é mais lento mas mais preciso"],
        ans: 1,
        exp: "GPTQ minimiza erro ao quantizar todos os pesos igualmente. AWQ observa que ~1% dos pesos são 'salientes'. AWQ protege esses pesos e quantiza o resto agressivamente. Resultado: melhor quality/compression tradeoff.",
      },
      {
        q: "O que é 'continuous batching' em LLM serving?",
        opts: ["Treinar em micro-batches contínuos", "Inserir novas requests no batch enquanto outras ainda geram", "Aumentar o batch size progressivamente", "Fazer caching de KV entre requests do mesmo usuário"],
        ans: 1,
        exp: "Serving estático espera todas as sequences terminarem antes de processar o próximo batch. Continuous batching insere novas requests nos slots liberados imediatamente, mantendo alta utilização de GPU.",
      },
      {
        q: "Para que serve o RouteLLM?",
        opts: ["Distribuir carga entre múltiplos GPUs", "Rotear cada query para o modelo mais barato capaz de respondê-la bem", "Fazer load balance entre data centers", "Cachear respostas de queries frequentes"],
        ans: 1,
        exp: "RouteLLM usa um classificador treinado em preferências humanas para decidir se uma query precisa de um modelo forte (GPT-4, Claude Opus) ou se um modelo menor responde bem. Pode reduzir custos 85%+ mantendo qualidade.",
      },
    ],
  ],

  // ── Recursos curados ──
  resources: [
    { name: "Llama 3 Technical Report", meta: "Meta, 2024 — detalhes completos da arquitetura e treinamento", type: "paper", icon: "📄", iconBg: "rgba(168,158,240,0.15)", url: "https://arxiv.org/abs/2407.21783" },
    { name: "Direct Preference Optimization (DPO)", meta: "Rafailov et al. 2023 — alternativa estável ao RLHF", type: "paper", icon: "📄", iconBg: "rgba(168,158,240,0.15)", url: "https://arxiv.org/abs/2305.18290" },
    { name: "FlashAttention-2", meta: "Dao, 2023 — faster attention with better parallelism", type: "paper", icon: "📄", iconBg: "rgba(168,158,240,0.15)", url: "https://arxiv.org/abs/2307.08691" },
    { name: "Attention Is All You Need", meta: "Vaswani et al. 2017 — o paper original do Transformer", type: "paper", icon: "📄", iconBg: "rgba(168,158,240,0.15)", url: "https://arxiv.org/abs/1706.03762" },
    { name: "Unsloth — Fine-tuning 2× mais rápido", meta: "LoRA/QLoRA otimizado, notebooks prontos para Colab", type: "ferramenta", icon: "⚡", iconBg: "rgba(96,168,240,0.15)", url: "https://github.com/unslothai/unsloth" },
    { name: "LangGraph — Agentes com estado", meta: "Framework para agentes e multi-agent workflows stateful", type: "ferramenta", icon: "🔧", iconBg: "rgba(96,168,240,0.15)", url: "https://github.com/langchain-ai/langgraph" },
    { name: "Langfuse — Observabilidade para LLMs", meta: "Traces, evals, prompts, métricas de custo open-source", type: "ferramenta", icon: "📊", iconBg: "rgba(96,168,240,0.15)", url: "https://langfuse.com" },
    { name: "vLLM — High-throughput LLM serving", meta: "PagedAttention, continuous batching, OpenAI-compatible", type: "ferramenta", icon: "🚀", iconBg: "rgba(96,168,240,0.15)", url: "https://github.com/vllm-project/vllm" },
    { name: "Karpathy — Neural Nets: Zero to Hero", meta: "GPT-2 do zero em ~1h de vídeo, altamente recomendado", type: "curso", icon: "🎓", iconBg: "rgba(240,168,64,0.15)", url: "https://karpathy.ai/zero-to-hero.html" },
    { name: "Fast.ai — Practical Deep Learning pt.2", meta: "ULMFiT, transformers, diffusion implementados do zero", type: "curso", icon: "🎓", iconBg: "rgba(240,168,64,0.15)", url: "https://course.fast.ai/Lessons/part2.html" },
    { name: "HuggingFace NLP Course", meta: "Transformers, fine-tuning e deployment gratuito", type: "curso", icon: "🎓", iconBg: "rgba(240,168,64,0.15)", url: "https://huggingface.co/learn/nlp-course" },
    { name: "Building LLMs from Scratch (Raschka)", meta: "Livro 2024 — implementação completa em PyTorch", type: "livro", icon: "📚", iconBg: "rgba(62,207,142,0.12)", url: "https://www.manning.com/books/build-a-large-language-model-from-scratch" },
    { name: "Designing ML Systems (Chip Huyen)", meta: "Sistemas de ML em produção — referência da área", type: "livro", icon: "📚", iconBg: "rgba(62,207,142,0.12)", url: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/" },
  ],

};
