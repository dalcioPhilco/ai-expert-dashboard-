# AI Expert Dashboard 🧠

Painel de estudos personalizado para se tornar especialista em **LLMs & IA Generativa** e **Agentes de IA**.

## ✨ Funcionalidades

- **Dashboard** — métricas de progresso, heatmap de atividade, próximos módulos
- **Trilha** — plano de 6 meses com 5 trilhas progressivas (~130h de conteúdo)
- **Roadmap** — visão macro por mês com entregas concretas
- **Flashcards** — 5 decks temáticos, flip interativo com spaced repetition manual
- **Quiz** — questões técnicas de nível sênior com feedback explicativo
- **Recursos** — papers, ferramentas, cursos e livros curados com links
- **Diário** — registro de aprendizados com tags e persistência local

## 🚀 Deploy rápido com GitHub Pages

1. Fork ou clone este repositório
2. Vá em **Settings → Pages**
3. Source: `Deploy from a branch` → branch `main` → folder `/ (root)`
4. Acesse em `https://seu-usuario.github.io/ai-expert-dashboard`

## 📁 Estrutura

```
ai-expert-dashboard/
├── index.html          # Estrutura principal
├── css/
│   └── style.css       # Design system dark mode
├── js/
│   └── app.js          # Lógica da aplicação
├── data/
│   └── content.js      # Conteúdo editável (trilhas, flashcards, quiz, recursos)
└── README.md
```

## ✏️ Personalização

Todo o conteúdo educacional está em **`data/content.js`**. Edite à vontade:

- `DATA.tips` — dicas rotativas do dashboard
- `DATA.roadmap` — fases do plano de 6 meses
- `DATA.tracks` — trilhas e módulos (altere `status: 'done'` conforme concluir)
- `DATA.flashcards` — adicione novos cards por deck
- `DATA.quizzes` — adicione novas questões por deck
- `DATA.resources` — adicione papers, ferramentas, cursos

### Marcar módulo como concluído

Em `data/content.js`, na trilha correspondente, mude o `status` do módulo:

```js
{ name: "Transformer internals profundos", status: "done", ... }  // ✓ Concluído
{ name: "Pré-treinamento e scaling laws",  status: "now",  ... }  // ▶ Em andamento
{ name: "Tokenização avançada",            status: "lock", ... }  // 🔒 Bloqueado
```

## 💾 Persistência

O diário e pontuações são salvos automaticamente no **localStorage** do navegador. Os dados ficam no dispositivo — nenhuma informação é enviada para servidores externos.

## 🛠 Tecnologias

- HTML5 + CSS3 + JavaScript vanilla (sem dependências)
- Fontes: IBM Plex Mono, Syne, Inter (Google Fonts)
- LocalStorage para persistência de dados

---

Feito para quem já tem base sólida em ML e quer se especializar em LLMs, fine-tuning, RAG e Agentes de IA.
