// ═══════════════════════════════════════════════════════
//  AI EXPERT DASHBOARD — App Logic
// ═══════════════════════════════════════════════════════

// ── State (persisted in localStorage) ──
const STORE_KEY = 'ai-expert-v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    streak: 6,
    journal: [],
    moduleStatus: {},   // moduleId -> 'done' | 'now' | 'lock'
    fcScores: {},       // deckIdx -> { ok, no }
    quizScores: {},     // deckIdx -> score
    openTracks: [],
    resFilter: 'todos',
    activityLog: [],    // ISO date strings
  };
}

function saveState() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(STATE)); }
  catch (e) { console.warn('Storage full'); }
}

let STATE = loadState();

// ── Tab routing ──
const TAB_TITLES = {
  dashboard: 'Dashboard',
  trilha: 'Trilha de Estudo',
  roadmap: 'Roadmap',
  flashcards: 'Flashcards',
  quiz: 'Quiz',
  recursos: 'Recursos',
  diario: 'Diário',
};

function goTab(id) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === id);
  });
  document.querySelectorAll('.tab').forEach(el => {
    el.classList.toggle('active', el.id === 'tab-' + id);
  });
  document.getElementById('topbar-title').textContent = TAB_TITLES[id] || id;
  // close sidebar on mobile
  if (window.innerWidth < 769) closeSidebar();
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => goTab(btn.dataset.tab));
});

// ── Sidebar toggle (mobile) ──
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
}

// ── Heatmap ──
function buildHeatmap() {
  const el = document.getElementById('heatmap');
  const today = new Date();
  let html = '';
  for (let row = 2; row >= 0; row--) {
    html += '<div class="heatmap-row">';
    for (let col = 6; col >= 0; col--) {
      const daysAgo = row * 7 + col;
      const d = new Date(today);
      d.setDate(today.getDate() - daysAgo);
      const isToday = daysAgo === 0;
      const dateStr = d.toISOString().split('T')[0];
      const logged = STATE.activityLog.includes(dateStr);
      const pastRandom = !isToday && daysAgo > 0 && daysAgo < 18 && Math.random() > 0.4;
      const active = logged || pastRandom;
      const cls = isToday ? 'today' : active ? 'done' : '';
      html += `<div class="heatmap-cell ${cls}" title="${dateStr}"></div>`;
    }
    html += '</div>';
  }
  el.innerHTML = html;
}

// ── Next Modules ──
function buildNextModules() {
  const el = document.getElementById('next-modules');
  const nextMods = [
    { name: 'Pré-treinamento e scaling laws', info: 'Trilha LLMs · Módulo 2 · 4h', status: 'now' },
    { name: 'Tokenização avançada', info: 'Trilha LLMs · Módulo 3 · 3h', status: 'lock' },
    { name: 'SFT — Supervised Fine-tuning', info: 'Trilha Fine-tuning · Módulo 1 · 4h', status: 'lock' },
  ];
  el.innerHTML = nextMods.map(m => `
    <button class="module-item" onclick="alert('Dica: use o Claude para gerar um plano detalhado sobre: ${m.name}')">
      <div class="mod-check ${m.status}">${m.status === 'done' ? '✓' : m.status === 'now' ? '▶' : ''}</div>
      <div class="mod-text">
        <div class="mod-name">${m.name}</div>
        <div class="mod-info">${m.info}</div>
      </div>
      <div class="mod-tag ${m.status}">${m.status === 'now' ? 'Em andamento' : 'Próximo'}</div>
    </button>
  `).join('');
}

// ── Tip ──
function buildTip() {
  const tips = DATA.tips;
  const el = document.getElementById('tip-text');
  el.textContent = tips[Math.floor(Math.random() * tips.length)];
}

// ── Tracks ──
function buildTracks() {
  const el = document.getElementById('tracks-container');
  el.innerHTML = DATA.tracks.map((t, ti) => {
    const isOpen = STATE.openTracks.includes(ti);
    return `
      <div class="track-card" id="track-${ti}">
        <div class="track-header" onclick="toggleTrack(${ti})">
          <div class="track-icon" style="background:${t.iconBg}">${t.icon}</div>
          <div class="track-meta">
            <div class="track-name">${t.name}</div>
            <div class="track-desc">${t.duration} · ${t.desc}</div>
          </div>
          <div style="text-align:right; flex-shrink:0; margin-right:8px">
            <div class="track-pct" style="color:${t.color}">${t.progress}%</div>
            <div class="track-bar">
              <div class="track-bar-fill" style="width:${t.progress}%; background:${t.color}"></div>
            </div>
          </div>
          <span class="track-chevron ${isOpen ? 'open' : ''}" id="chev-${ti}">▶</span>
        </div>
        <div class="track-body ${isOpen ? 'open' : ''}" id="track-body-${ti}">
          <div class="track-body-inner">
            <div class="module-list">
              ${t.modules.map((m, mi) => `
                <button class="module-item" onclick="openModuleDetail(${ti}, ${mi})">
                  <div class="mod-check ${m.status}">${m.status === 'done' ? '✓' : m.status === 'now' ? '▶' : ''}</div>
                  <div class="mod-text">
                    <div class="mod-name">${m.name}</div>
                    <div class="mod-info">${m.info} · ${m.hrs}</div>
                  </div>
                  <div class="mod-tag ${m.status}">${
                    m.status === 'done' ? '✓ Feito' :
                    m.status === 'now' ? 'Em andamento' :
                    m.status === 'proj' ? '🛠 Projeto' : '🔒'
                  }</div>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleTrack(ti) {
  const idx = STATE.openTracks.indexOf(ti);
  if (idx >= 0) STATE.openTracks.splice(idx, 1);
  else STATE.openTracks.push(ti);
  saveState();

  document.getElementById(`track-body-${ti}`).classList.toggle('open');
  document.getElementById(`chev-${ti}`).classList.toggle('open');
}

// ── Module detail data ──
const MODULE_DETAILS = {
  // key: "trackIndex-moduleIndex"
  "0-0": {
    resources: [
      { icon: "📄", name: "Attention Is All You Need", type: "Paper", url: "https://arxiv.org/abs/1706.03762" },
      { icon: "🎓", name: "Karpathy — Let's build GPT", type: "Vídeo", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY" },
      { icon: "📝", name: "The Illustrated Transformer (Alammar)", type: "Blog", url: "https://jalammar.github.io/illustrated-transformer/" },
    ],
    exercises: [
      "Implemente multi-head attention do zero em PyTorch sem usar nn.MultiheadAttention",
      "Visualize os attention maps de uma frase curta — quais tokens prestam atenção em quais?",
      "Compare a saída de atenção com e sem masking causal (autoregressive mask)",
    ],
  },
  "0-1": {
    resources: [
      { icon: "📄", name: "Training Compute-Optimal LLMs (Chinchilla)", type: "Paper", url: "https://arxiv.org/abs/2203.15556" },
      { icon: "📄", name: "Scaling Laws for Neural Language Models", type: "Paper", url: "https://arxiv.org/abs/2001.08361" },
      { icon: "📝", name: "Emergent Abilities of LLMs — survey", type: "Blog", url: "https://arxiv.org/abs/2206.07682" },
    ],
    exercises: [
      "Plote a curva de loss vs compute para dois modelos de tamanhos diferentes usando dados do paper Chinchilla",
      "Calcule o compute budget ótimo para treinar um modelo de 7B parâmetros segundo a lei de Chinchilla",
      "Pesquise 3 capabilities emergentes e escreva uma hipótese sobre por que elas surgem com escala",
    ],
  },
  "0-2": {
    resources: [
      { icon: "🔧", name: "tiktoken — tokenizador da OpenAI", type: "Lib", url: "https://github.com/openai/tiktoken" },
      { icon: "📝", name: "BPE tokenization explicada visualmente", type: "Blog", url: "https://huggingface.co/learn/nlp-course/chapter6/5" },
      { icon: "🎓", name: "SentencePiece — Google tokenizer", type: "Lib", url: "https://github.com/google/sentencepiece" },
    ],
    exercises: [
      "Implemente BPE tokenization do zero em ~50 linhas de Python",
      "Compare a tokenização de texto em português em BPE vs WordPiece vs Unigram",
      "Analise como o vocab size afeta o número de tokens por palavra em diferentes idiomas",
    ],
  },
  "0-3": {
    resources: [
      { icon: "📄", name: "FlashAttention-2 paper", type: "Paper", url: "https://arxiv.org/abs/2307.08691" },
      { icon: "📄", name: "GQA: Training Generalized Multi-Query Transformer Models", type: "Paper", url: "https://arxiv.org/abs/2305.13245" },
      { icon: "📝", name: "Sliding Window Attention no Mistral", type: "Blog", url: "https://mistral.ai/news/announcing-mistral-7b/" },
    ],
    exercises: [
      "Implemente e compare MHA, MQA e GQA medindo uso de memória e throughput",
      "Leia o código do FlashAttention-2 e descreva como o tiling elimina reads/writes em HBM",
      "Trace o KV cache de uma geração de 100 tokens e calcule o uso de memória em GB",
    ],
  },
  "0-4": {
    resources: [
      { icon: "📄", name: "Llama 3 Technical Report", type: "Paper", url: "https://arxiv.org/abs/2407.21783" },
      { icon: "📄", name: "Gemma 2 Technical Report", type: "Paper", url: "https://arxiv.org/abs/2408.00118" },
      { icon: "📄", name: "Phi-3 Technical Report", type: "Paper", url: "https://arxiv.org/abs/2404.14219" },
    ],
    exercises: [
      "Compare Llama 3, Mistral e Gemma 2 em: vocab size, context length, attention variant, treinamento",
      "Implemente RoPE e compare com sinusoidal positional encoding num mini transformer",
      "Rode benchmarks (MMLU, HumanEval) nos modelos via API e analise os resultados",
    ],
  },
  "1-0": {
    resources: [
      { icon: "📄", name: "LIMA: Less Is More for Alignment", type: "Paper", url: "https://arxiv.org/abs/2305.11206" },
      { icon: "🔧", name: "Alpaca — instruction tuning dataset", type: "Dataset", url: "https://github.com/tatsu-lab/stanford_alpaca" },
      { icon: "📝", name: "OpenAI — Instruct GPT paper", type: "Paper", url: "https://arxiv.org/abs/2203.02155" },
    ],
    exercises: [
      "Crie um dataset de 100 pares (instrução, resposta) em português para um domínio específico",
      "Fine-tune um modelo Llama 3.2-1B via SFT com seu dataset usando Unsloth",
      "Compare qualidade antes/depois do fine-tune com 10 prompts de avaliação manual",
    ],
  },
  "1-1": {
    resources: [
      { icon: "📄", name: "LoRA: Low-Rank Adaptation of LLMs", type: "Paper", url: "https://arxiv.org/abs/2106.09685" },
      { icon: "📄", name: "QLoRA: Efficient Finetuning of Quantized LLMs", type: "Paper", url: "https://arxiv.org/abs/2305.14314" },
      { icon: "🔧", name: "Unsloth — fine-tuning 2x mais rápido", type: "Lib", url: "https://github.com/unslothai/unsloth" },
    ],
    exercises: [
      "Implemente LoRA do zero: crie as matrizes A e B e injete-as em nn.Linear",
      "Fine-tune Llama 3.2 com r=4, 8, 16 e compare loss, qualidade e tempo de treino",
      "Use QLoRA para fine-tunar um modelo 7B num Colab gratuito (T4 16GB)",
    ],
  },
  "1-2": {
    resources: [
      { icon: "📄", name: "InstructGPT (RLHF original)", type: "Paper", url: "https://arxiv.org/abs/2203.02155" },
      { icon: "📄", name: "Constitutional AI — Anthropic", type: "Paper", url: "https://arxiv.org/abs/2212.08073" },
      { icon: "📝", name: "TRL library — RLHF/PPO no HuggingFace", type: "Lib", url: "https://github.com/huggingface/trl" },
    ],
    exercises: [
      "Treine um reward model simples em pares de preferência usando TRL",
      "Documente 5 exemplos concretos de reward hacking que você consegue provocar",
      "Compare as distribuições de reward antes e depois do RLHF num histograma",
    ],
  },
  "1-3": {
    resources: [
      { icon: "📄", name: "DPO: Direct Preference Optimization", type: "Paper", url: "https://arxiv.org/abs/2305.18290" },
      { icon: "📄", name: "SimPO: Simple Preference Optimization", type: "Paper", url: "https://arxiv.org/abs/2405.14734" },
      { icon: "🔧", name: "TRL DPOTrainer", type: "Docs", url: "https://huggingface.co/docs/trl/dpo_trainer" },
    ],
    exercises: [
      "Treine com DPO usando o dataset Anthropic HH-RLHF e compare com SFT baseline",
      "Derive o gradiente do DPO no papel e identifique o que está sendo maximizado/minimizado",
      "Teste SimPO vs DPO no mesmo dataset e compare usando MT-Bench",
    ],
  },
  "1-4": {
    resources: [
      { icon: "🔧", name: "lm-evaluation-harness (EleutherAI)", type: "Lib", url: "https://github.com/EleutherAI/lm-evaluation-harness" },
      { icon: "📝", name: "MT-Bench paper e dataset", type: "Paper", url: "https://arxiv.org/abs/2306.05685" },
      { icon: "🔧", name: "RAGAS — eval para RAG", type: "Lib", url: "https://github.com/explodinggradients/ragas" },
    ],
    exercises: [
      "Rode lm-eval no seu modelo fine-tunado nos benchmarks MMLU, TruthfulQA e HellaSwag",
      "Construa uma eval customizada de 20 questões para o domínio do seu fine-tune",
      "Implemente LLM-as-judge usando Claude ou GPT-4 para comparar dois modelos automaticamente",
    ],
  },
  "2-0": {
    resources: [
      { icon: "📄", name: "Matryoshka Representation Learning", type: "Paper", url: "https://arxiv.org/abs/2205.13147" },
      { icon: "📄", name: "ColBERT: Efficient and Effective Passage Retrieval", type: "Paper", url: "https://arxiv.org/abs/2004.12832" },
      { icon: "🔧", name: "MTEB Leaderboard — benchmark de embeddings", type: "Benchmark", url: "https://huggingface.co/spaces/mteb/leaderboard" },
    ],
    exercises: [
      "Compare qualidade de retrieval com embeddings de 1536d vs 256d truncados (MRL)",
      "Implemente pipeline bi-encoder + cross-encoder reranker e meça melhora de MRR@10",
      "Experimente 3 modelos de embedding diferentes no MTEB e analise tradeoff quality/speed",
    ],
  },
  "2-1": {
    resources: [
      { icon: "📝", name: "Chunking strategies for RAG — survey", type: "Blog", url: "https://www.llamaindex.ai/blog/evaluating-the-ideal-chunk-size-for-a-rag-system-using-llamaindex-6207e5d3fec5" },
      { icon: "📄", name: "Late Chunking paper (Jina AI)", type: "Paper", url: "https://arxiv.org/abs/2409.04701" },
      { icon: "🔧", name: "LlamaIndex — indexing e chunking", type: "Lib", url: "https://docs.llamaindex.ai/en/stable/" },
    ],
    exercises: [
      "Teste chunk sizes de 128, 512 e 2048 tokens no mesmo corpus e compare recall@5",
      "Implemente hierarchical chunking: chunks grandes para contexto + pequenos para retrieval",
      "Compare late chunking vs chunking antecipado em documentos técnicos longos",
    ],
  },
  "2-2": {
    resources: [
      { icon: "📄", name: "HyDE: Precise Zero-Shot Dense Retrieval", type: "Paper", url: "https://arxiv.org/abs/2212.10496" },
      { icon: "📄", name: "Self-RAG: Learning to Retrieve and Reflect", type: "Paper", url: "https://arxiv.org/abs/2310.11511" },
      { icon: "📄", name: "Corrective RAG (CRAG)", type: "Paper", url: "https://arxiv.org/abs/2401.15884" },
    ],
    exercises: [
      "Implemente HyDE e compare com retrieval direto em 20 queries — qual ganha?",
      "Construa um pipeline Self-RAG básico com critério de quando re-buscar",
      "Crie um experimento A/B comparando RAG simples vs Agentic RAG em 50 queries",
    ],
  },
  "2-3": {
    resources: [
      { icon: "📄", name: "From Local to Global: A Graph RAG Approach", type: "Paper", url: "https://arxiv.org/abs/2404.16130" },
      { icon: "🔧", name: "Microsoft GraphRAG library", type: "Lib", url: "https://github.com/microsoft/graphrag" },
      { icon: "📝", name: "Neo4j + LLM para Knowledge Graphs", type: "Tutorial", url: "https://neo4j.com/developer/genai-ecosystem/rag-knowledge-graph/" },
    ],
    exercises: [
      "Extraia entidades e relações de um corpus com LLM e construa um grafo com NetworkX",
      "Compare Graph RAG vs RAG vetorial em perguntas que requerem multi-hop reasoning",
      "Implemente um pipeline que escolhe automaticamente entre vector RAG e graph RAG",
    ],
  },
  "3-0": {
    resources: [
      { icon: "📄", name: "ReAct: Synergizing Reasoning and Acting", type: "Paper", url: "https://arxiv.org/abs/2210.03629" },
      { icon: "📄", name: "Reflexion: Language Agents with Verbal Reinforcement", type: "Paper", url: "https://arxiv.org/abs/2303.11366" },
      { icon: "📝", name: "Tree of Thoughts paper", type: "Paper", url: "https://arxiv.org/abs/2305.10601" },
    ],
    exercises: [
      "Implemente ReAct do zero em ~80 linhas com 3 ferramentas (search, calc, code)",
      "Adicione Reflexion ao seu agente e teste em tarefas que exigem múltiplas tentativas",
      "Compare CoT, ToT e ReAct no mesmo benchmark de raciocínio matemático",
    ],
  },
  "3-1": {
    resources: [
      { icon: "📝", name: "OpenAI Function Calling docs", type: "Docs", url: "https://platform.openai.com/docs/guides/function-calling" },
      { icon: "📝", name: "Anthropic Tool Use docs", type: "Docs", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      { icon: "📄", name: "Gorilla: LLM for API calls", type: "Paper", url: "https://arxiv.org/abs/2305.15334" },
    ],
    exercises: [
      "Crie 5 ferramentas com schemas JSON e teste o agente escolhendo a ferramenta certa",
      "Implemente parallel tool use e compare latência com chamadas sequenciais",
      "Construa um sistema de retry com fallback quando uma ferramenta falha",
    ],
  },
  "3-2": {
    resources: [
      { icon: "📄", name: "MemGPT: Towards LLMs as Operating Systems", type: "Paper", url: "https://arxiv.org/abs/2310.08560" },
      { icon: "🔧", name: "mem0 — memory layer para agentes", type: "Lib", url: "https://github.com/mem0ai/mem0" },
      { icon: "📝", name: "Cognitive Architectures for Language Agents", type: "Survey", url: "https://arxiv.org/abs/2309.02427" },
    ],
    exercises: [
      "Implemente os 4 tipos de memória (working, episodic, semantic, procedural) num agente",
      "Compare agente com e sem memória de longo prazo em conversas de 20+ turnos",
      "Construa um sistema de compressão de memória para manter o contexto dentro do limite",
    ],
  },
  "3-3": {
    resources: [
      { icon: "🔧", name: "LangGraph — multi-agent workflows", type: "Lib", url: "https://github.com/langchain-ai/langgraph" },
      { icon: "🔧", name: "CrewAI — role-based multi-agent", type: "Lib", url: "https://github.com/crewAIInc/crewAI" },
      { icon: "📄", name: "AutoGen: Enabling Next-Gen LLM Apps", type: "Paper", url: "https://arxiv.org/abs/2308.08155" },
    ],
    exercises: [
      "Construa um sistema de 3 agentes: pesquisador, escritor e revisor colaborando em paralelo",
      "Implemente verificação cruzada: agente A gera solução, agente B tenta falsificá-la",
      "Compare latência e custo de multi-agente vs agente único em 10 tarefas complexas",
    ],
  },
  "3-4": {
    resources: [
      { icon: "📝", name: "Model Context Protocol spec (Anthropic)", type: "Docs", url: "https://modelcontextprotocol.io/introduction" },
      { icon: "🔧", name: "MCP servers — repositório oficial", type: "GitHub", url: "https://github.com/modelcontextprotocol/servers" },
      { icon: "📝", name: "Building MCP servers — tutorial", type: "Docs", url: "https://modelcontextprotocol.io/quickstart/server" },
    ],
    exercises: [
      "Crie um MCP server que expõe 3 ferramentas de um domínio que você conhece bem",
      "Conecte seu MCP server ao Claude Desktop e teste via chat",
      "Implemente um MCP server com resources (leitura de arquivos/dados) além de tools",
    ],
  },
  "4-0": {
    resources: [
      { icon: "🔧", name: "vLLM — production LLM serving", type: "Lib", url: "https://github.com/vllm-project/vllm" },
      { icon: "📄", name: "PagedAttention paper", type: "Paper", url: "https://arxiv.org/abs/2309.06180" },
      { icon: "📝", name: "AWQ: Activation-aware Weight Quantization", type: "Paper", url: "https://arxiv.org/abs/2306.00978" },
    ],
    exercises: [
      "Compare throughput (tokens/s) do HuggingFace naive vs vLLM num modelo 7B",
      "Quantize um modelo com AWQ e GPTQ e compare qualidade vs tamanho vs velocidade",
      "Rode o mesmo modelo em GGUF no llama.cpp e compare com vLLM em GPU",
    ],
  },
  "4-1": {
    resources: [
      { icon: "🔧", name: "Langfuse — open-source LLM observability", type: "Lib", url: "https://langfuse.com" },
      { icon: "🔧", name: "LangSmith — tracing para LangChain", type: "Lib", url: "https://smith.langchain.com" },
      { icon: "📝", name: "OpenTelemetry para LLMs — guia", type: "Blog", url: "https://opentelemetry.io/docs/concepts/observability-primer/" },
    ],
    exercises: [
      "Instale Langfuse e instrumente seu pipeline RAG com traces completos",
      "Crie um dashboard de custo: tokens de entrada/saída por endpoint por dia",
      "Configure alertas automáticos para latência P99 > 3s e taxa de erro > 1%",
    ],
  },
  "4-2": {
    resources: [
      { icon: "🔧", name: "NeMo Guardrails (NVIDIA)", type: "Lib", url: "https://github.com/NVIDIA/NeMo-Guardrails" },
      { icon: "🔧", name: "Llama Guard — safety classifier", type: "Model", url: "https://huggingface.co/meta-llama/Llama-Guard-3-8B" },
      { icon: "📄", name: "Constitutional AI (Claude)", type: "Paper", url: "https://arxiv.org/abs/2212.08073" },
    ],
    exercises: [
      "Implemente guardrails de input e output usando NeMo Guardrails numa aplicação",
      "Rode Llama Guard em 50 prompts e analise false positives/negatives",
      "Crie um sistema de content filtering customizado para o seu caso de uso específico",
    ],
  },
  "4-3": {
    resources: [
      { icon: "📄", name: "RouteLLM: Learning to Route LLMs", type: "Paper", url: "https://arxiv.org/abs/2406.18665" },
      { icon: "📝", name: "Semantic cache para LLMs — GPTCache", type: "Lib", url: "https://github.com/zilliztech/GPTCache" },
      { icon: "📝", name: "LLM serving em produção — Anyscale blog", type: "Blog", url: "https://www.anyscale.com/blog/continuous-batching-llm-inference" },
    ],
    exercises: [
      "Implemente RouteLLM com GPT-4o-mini para queries simples e GPT-4o para complexas",
      "Adicione semantic caching com GPTCache e meça hit rate e economia de custo",
      "Construa um sistema de fallback: se modelo A falhar, roteie para modelo B automaticamente",
    ],
  },
};

function openModuleDetail(ti, mi) {
  const m = DATA.tracks[ti].modules[mi];
  const detail = MODULE_DETAILS[`${ti}-${mi}`] || { resources: [], exercises: [] };
  const track = DATA.tracks[ti];

  // Tag
  const tagEl = document.getElementById('modal-tag');
  tagEl.textContent = track.name;
  tagEl.style.background = track.iconBg;
  tagEl.style.color = track.color;
  tagEl.style.border = `1px solid ${track.color}44`;

  document.getElementById('modal-title').textContent = m.name;
  document.getElementById('modal-topics').textContent = '📌 ' + m.info;
  document.getElementById('modal-hours').textContent = `⏱ Estimativa: ${m.hrs}`;

  // Resources
  const resEl = document.getElementById('modal-resources');
  if (detail.resources.length) {
    resEl.innerHTML = detail.resources.map(r => `
      <a href="${r.url}" target="_blank" rel="noopener" class="modal-resource-item">
        <span class="modal-resource-icon">${r.icon}</span>
        <span class="modal-resource-name">${r.name}</span>
        <span class="modal-resource-type">${r.type}</span>
      </a>
    `).join('');
  } else {
    resEl.innerHTML = '<div style="font-size:.8rem;color:var(--text3);padding:8px 0">Em breve...</div>';
  }

  // Exercises
  const exEl = document.getElementById('modal-exercises');
  if (detail.exercises.length) {
    exEl.innerHTML = detail.exercises.map((e, i) => `
      <div class="modal-exercise-item">
        <span class="modal-exercise-num">${i + 1}</span>
        <span>${e}</span>
      </div>
    `).join('');
  } else {
    exEl.innerHTML = '<div style="font-size:.8rem;color:var(--text3);padding:8px 0">Em breve...</div>';
  }

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── Roadmap ──
function buildRoadmap() {
  const el = document.getElementById('roadmap-container');
  el.innerHTML = DATA.roadmap.map(r => `
    <div class="roadmap-phase">
      <div class="roadmap-dot" style="background:${r.color}; border-color:${r.color}"></div>
      <div class="roadmap-phase-tag">${r.phase} · ${r.weeks}</div>
      <div class="roadmap-phase-name" style="color:${r.color}">${r.name}</div>
      <div class="roadmap-phase-desc">${r.desc}</div>
      <span class="roadmap-deliverable">→ ${r.deliverable}</span>
    </div>
  `).join('');
}

// ══════════════════════════════════════════
//  FLASHCARDS MODULE
// ══════════════════════════════════════════
const FC = (() => {
  let deck = 0, idx = 0, flipped = false, ok = 0, no = 0;

  function loadDeck() {
    deck = parseInt(document.getElementById('fc-deck-select').value);
    idx = 0; ok = 0; no = 0; flipped = false;
    const scores = STATE.fcScores[deck] || { ok: 0, no: 0 };
    ok = scores.ok; no = scores.no;
    render();
  }

  function render() {
    const cards = DATA.flashcards[deck];
    if (idx >= cards.length) idx = 0;
    const c = cards[idx];
    document.getElementById('fc-q').textContent = c.q;
    document.getElementById('fc-a').textContent = c.a;
    document.getElementById('fc-counter').textContent = `${idx + 1}/${cards.length}`;
    document.getElementById('fc-card').classList.remove('flipped');
    document.getElementById('fc-rate-btns').style.display = 'none';
    document.getElementById('fc-reveal-btn').style.display = 'flex';
    document.getElementById('fc-hint').style.display = 'block';
    document.getElementById('fc-ok-count').textContent = `✓ ${ok}`;
    document.getElementById('fc-no-count').textContent = `✗ ${no}`;
    flipped = false;
  }

  function flip() {
    if (!flipped) {
      document.getElementById('fc-card').classList.add('flipped');
      document.getElementById('fc-rate-btns').style.display = 'flex';
      document.getElementById('fc-reveal-btn').style.display = 'none';
      document.getElementById('fc-hint').style.display = 'none';
      flipped = true;
    }
  }

  function rate(correct) {
    if (correct) ok++; else no++;
    STATE.fcScores[deck] = { ok, no };
    saveState();
    idx++;
    render();
  }

  function skip() { idx++; render(); }

  render();

  return { loadDeck, flip, rate, skip };
})();

// ══════════════════════════════════════════
//  QUIZ MODULE
// ══════════════════════════════════════════
const QZ = (() => {
  let deck = 0, idx = 0, score = 0, answered = false;

  function load() {
    deck = parseInt(document.getElementById('quiz-deck-select').value);
    idx = 0; score = 0; answered = false;
    render();
  }

  function render() {
    const qs = DATA.quizzes[deck];
    const deckNames = ['LLMs & Transformers', 'Fine-tuning & Alinhamento', 'Agentes & RAG', 'MLOps & Produção'];
    document.getElementById('quiz-score-chip').textContent = `${score} pts`;
    document.getElementById('quiz-next-btn').style.display = 'none';

    const pct = (idx / qs.length) * 100;
    document.getElementById('quiz-progress-fill').style.width = pct + '%';

    if (idx >= qs.length) {
      document.getElementById('quiz-progress-label').textContent = 'Concluído!';
      document.getElementById('quiz-q').textContent = `🎉 Quiz finalizado! ${score} de ${qs.length} pontos.`;
      document.getElementById('quiz-opts').innerHTML = `
        <button class="btn btn-primary" onclick="QZ.load()" style="margin-top:8px">Reiniciar quiz</button>
      `;
      document.getElementById('quiz-feedback').className = 'quiz-feedback';
      STATE.quizScores[deck] = score;
      saveState();
      return;
    }

    const q = qs[idx];
    document.getElementById('quiz-progress-label').textContent = `Questão ${idx + 1} de ${qs.length}`;
    document.getElementById('quiz-q').textContent = q.q;
    document.getElementById('quiz-feedback').className = 'quiz-feedback';
    answered = false;

    document.getElementById('quiz-opts').innerHTML = q.opts.map((o, i) => `
      <button class="quiz-opt" onclick="QZ.answer(${i})">${o}</button>
    `).join('');
  }

  function answer(optIdx) {
    if (answered) return;
    answered = true;
    const q = DATA.quizzes[deck][idx];
    const correct = optIdx === q.ans;
    if (correct) score++;

    document.querySelectorAll('.quiz-opt').forEach((b, i) => {
      b.disabled = true;
      if (i === q.ans) b.classList.add('correct');
      else if (i === optIdx && !correct) b.classList.add('wrong');
    });

    const fb = document.getElementById('quiz-feedback');
    fb.textContent = (correct ? '✓ Correto! ' : '✗ Incorreto. ') + q.exp;
    fb.className = 'quiz-feedback show ' + (correct ? 'ok' : 'wrong');
    document.getElementById('quiz-score-chip').textContent = `${score} pts`;
    document.getElementById('quiz-next-btn').style.display = 'block';
  }

  function next() { idx++; render(); }

  load();
  return { load, answer, next };
})();

// ══════════════════════════════════════════
//  RESOURCES MODULE
// ══════════════════════════════════════════
const RES = (() => {
  let filter = STATE.resFilter || 'todos';

  function render() {
    const el = document.getElementById('resources-list');
    const list = filter === 'todos' ? DATA.resources : DATA.resources.filter(r => r.type === filter);

    const typeColors = {
      paper: { bg: 'rgba(168,158,240,0.15)', color: '#a89ef0', label: 'Paper' },
      ferramenta: { bg: 'rgba(96,168,240,0.15)', color: '#60a8f0', label: 'Ferramenta' },
      curso: { bg: 'rgba(240,168,64,0.15)', color: '#f0a840', label: 'Curso' },
      livro: { bg: 'rgba(62,207,142,0.12)', color: '#3ecf8e', label: 'Livro' },
    };

    el.innerHTML = list.map(r => {
      const tc = typeColors[r.type] || typeColors.paper;
      return `
        <a href="${r.url}" target="_blank" rel="noopener" class="resource-card">
          <div class="resource-card-top">
            <div class="resource-icon" style="background:${r.iconBg}">${r.icon}</div>
            <span class="resource-type-badge" style="background:${tc.bg}; color:${tc.color}; border:1px solid ${tc.color}33">${tc.label}</span>
          </div>
          <div class="resource-name">${r.name}</div>
          <div class="resource-meta">${r.meta}</div>
        </a>
      `;
    }).join('');
  }

  function setFilter(btn, type) {
    filter = type;
    STATE.resFilter = type;
    saveState();
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  }

  render();
  return { filter: setFilter };
})();

// ══════════════════════════════════════════
//  JOURNAL MODULE
// ══════════════════════════════════════════
const JOURNAL = (() => {
  function render() {
    const el = document.getElementById('journal-entries');
    if (!STATE.journal.length) {
      el.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">◳</div>
          <div>Nenhuma entrada ainda.</div>
          <div class="empty-sub">Comece a registrar seu aprendizado acima.</div>
        </div>
      `;
      return;
    }
    el.innerHTML = STATE.journal.map(entry => `
      <div class="journal-entry">
        <div class="journal-entry-date">${entry.date}</div>
        <div class="journal-entry-text">${entry.text}</div>
        ${entry.tags.length ? `
          <div class="journal-entry-tags">
            ${entry.tags.map(t => `<span class="journal-entry-tag">${t}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  function save() {
    const text = document.getElementById('journal-input').value.trim();
    if (!text) return;
    const tags = Array.from(document.querySelectorAll('#journal-tag-row .tag-pill.on')).map(b => b.textContent);
    const now = new Date();
    const date = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    STATE.journal.unshift({ text, tags, date, ts: now.toISOString() });

    // log activity
    const today = now.toISOString().split('T')[0];
    if (!STATE.activityLog.includes(today)) {
      STATE.activityLog.push(today);
    }

    saveState();
    document.getElementById('journal-input').value = '';
    document.querySelectorAll('#journal-tag-row .tag-pill').forEach(b => b.classList.remove('on'));
    render();
    buildHeatmap(); // refresh heatmap
  }

  render();
  return { save };
})();

// ── Tag toggle ──
function toggleTag(btn) {
  btn.classList.toggle('on');
}

// ── Init dashboard ──
buildHeatmap();
buildNextModules();
buildTip();
buildTracks();
buildRoadmap();
