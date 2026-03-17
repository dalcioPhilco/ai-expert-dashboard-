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

function openModuleDetail(ti, mi) {
  const m = DATA.tracks[ti].modules[mi];
  alert(`Módulo: ${m.name}\n\nTópicos: ${m.info}\n\nDica: copie o nome do módulo e peça ao Claude para criar um plano de estudo detalhado com recursos e exercícios práticos.`);
}

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
