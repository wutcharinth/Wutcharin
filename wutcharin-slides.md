---
marp: true
theme: default
size: 16:9
paginate: true
footer: "Wutcharin Thatan · 2026"
style: |
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');

  :root {
    --bg-dark: #020617;
    --bg-card: #0f172a;
    --accent-violet: #8b5cf6;
    --accent-blue: #3b82f6;
    --accent-cyan: #06b6d4;
    --accent-emerald: #10b981;
    --text-primary: #f1f5f9;
    --text-muted: #94a3b8;
  }

  section {
    background: var(--bg-dark);
    font-family: 'Inter', sans-serif;
    color: var(--text-primary);
    padding: 48px 60px;
  }

  /* Footer */
  footer {
    font-size: 0.65rem;
    color: #334155;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.05em;
  }

  /* Page number */
  section::after {
    font-size: 0.65rem;
    color: #334155;
    font-family: 'JetBrains Mono', monospace;
  }

  h1 {
    font-size: 2.4rem;
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1.1;
    color: #fff;
    margin: 0 0 0.3em;
  }

  h2 {
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #fff;
    border-bottom: none;
    margin: 0 0 0.5em;
  }

  h3 {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--accent-violet);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin: 0 0 0.3em;
  }

  p {
    color: var(--text-muted);
    font-size: 0.9rem;
    line-height: 1.7;
    margin: 0;
  }

  strong {
    color: #fff;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    background: #1e293b;
    color: var(--accent-violet);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.82em;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  ul li {
    color: var(--text-muted);
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 0.4em;
  }

  ul li::before {
    content: "▸ ";
    color: var(--accent-violet);
    font-weight: bold;
  }

  blockquote {
    border-left: 3px solid var(--accent-violet);
    padding-left: 16px;
    margin: 16px 0 0;
    color: var(--text-muted);
    font-style: italic;
    font-size: 0.95rem;
    line-height: 1.7;
  }

  /* Tags */
  .tag {
    display: inline-block;
    background: rgba(139,92,246,0.15);
    border: 1px solid rgba(139,92,246,0.3);
    color: #c4b5fd;
    padding: 2px 10px;
    border-radius: 99px;
    font-size: 0.7rem;
    font-weight: 600;
    margin: 2px;
  }

  /* Hero slide */
  section.hero {
    background: linear-gradient(135deg, #020617 0%, #0d0b1e 60%, #150b2e 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
  }

  section.hero footer,
  section.hero::after { display: none; }

  /* Divider slide */
  section.divider {
    background: linear-gradient(135deg, #0a0420 0%, #120a3a 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 60px;
  }

  section.divider footer,
  section.divider::after { display: none; }

  /* Closing slide */
  section.closing {
    background: linear-gradient(135deg, #020617 0%, #0d0b1e 60%, #150b2e 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 60px;
  }

  section.closing footer,
  section.closing::after { display: none; }

  /* Layout helpers */
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-top: 14px;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin-top: 14px;
  }

  .grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-top: 24px;
  }

  /* Cards */
  .card {
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 10px;
    padding: 14px 16px;
  }

  .card-title {
    font-size: 0.8rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }

  .card-sub {
    font-size: 0.68rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  /* Stats */
  .stat-big {
    font-size: 2.2rem;
    font-weight: 900;
    color: var(--accent-violet);
    line-height: 1;
  }

  /* Accent line */
  .accent-line {
    width: 40px;
    height: 4px;
    background: linear-gradient(90deg, var(--accent-violet), var(--accent-blue));
    border-radius: 99px;
    margin-bottom: 10px;
  }

  /* Experience row */
  .exp-row {
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 10px;
  }

  .exp-title {
    font-size: 0.82rem;
    font-weight: 700;
    color: #fff;
  }

  .exp-company {
    font-size: 0.72rem;
    font-weight: 700;
    margin-top: 1px;
    margin-bottom: 4px;
  }

  .exp-desc {
    font-size: 0.68rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  /* Highlight box */
  .highlight {
    background: rgba(139,92,246,0.08);
    border: 1px solid rgba(139,92,246,0.2);
    border-radius: 12px;
    padding: 14px 18px;
    margin-top: 14px;
  }
---

<!-- _class: hero -->

<div style="margin-bottom: 10px;">
  <span style="background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);color:#c4b5fd;padding:4px 14px;border-radius:99px;font-size:0.7rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">Portfolio · 2026</span>
</div>

# Wutcharin Thatan

<div style="font-size:1.1rem;font-weight:300;color:#94a3b8;margin-top:6px;margin-bottom:24px;">Executive Leader · AI Engineer · Data Storyteller</div>

<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:28px;">
  <span class="tag">🏙️ Bangkok, Thailand</span>
  <span class="tag">🎓 Chulalongkorn · Stamford MBA</span>
  <span class="tag">🌐 wutcharin.com</span>
</div>

<div style="display:flex;gap:28px;align-items:flex-start;">
  <div>
    <div class="stat-big">20<span style="font-size:1rem;color:#64748b;">yrs</span></div>
    <div style="font-size:0.65rem;color:#64748b;margin-top:2px;letter-spacing:0.08em;">EXPERIENCE</div>
  </div>
  <div style="width:1px;background:#1e293b;align-self:stretch;"></div>
  <div>
    <div class="stat-big">10+<span style="font-size:1rem;color:#64748b;">yrs</span></div>
    <div style="font-size:0.65rem;color:#64748b;margin-top:2px;letter-spacing:0.08em;">LEADERSHIP</div>
  </div>
  <div style="width:1px;background:#1e293b;align-self:stretch;"></div>
  <div>
    <div class="stat-big">200M<span style="font-size:1rem;color:#64748b;">฿</span></div>
    <div style="font-size:0.65rem;color:#64748b;margin-top:2px;letter-spacing:0.08em;">CAPITAL SECURED</div>
  </div>
  <div style="width:1px;background:#1e293b;align-self:stretch;"></div>
  <div>
    <div class="stat-big">12K<span style="font-size:1rem;color:#64748b;">hr</span></div>
    <div style="font-size:0.65rem;color:#64748b;margin-top:2px;letter-spacing:0.08em;">ANNUAL SAVINGS</div>
  </div>
</div>

---

<!-- _class: divider -->

<div class="accent-line"></div>

### Chapter 01

# Executive Profile

<blockquote>
"Transforming businesses through AI-powered automation, advanced analytics, and intelligent data solutions."
</blockquote>

---

## Who I Am

<div class="grid-2" style="margin-top:20px;">
  <div>
    <p style="font-size:0.92rem;line-height:1.8;color:#cbd5e1;">
      Executive leader with <strong>nearly 20 years of experience</strong> (10+ in people management), combining <strong>Business Strategy</strong> and <strong>Technical Execution</strong> in one role.
    </p>
    <p style="font-size:0.92rem;line-height:1.8;color:#cbd5e1;margin-top:10px;">
      I bridge the gap between <strong>Finance, Engineering, and Commercial strategy</strong> — equally at home in hyper-growth tech and aviation startups.
    </p>
  </div>
  <div style="display:flex;flex-direction:column;gap:10px;">
    <div class="card">
      <div class="card-title">🧠 Hands-On Builder</div>
      <div class="card-sub">Ships full-stack AI prototypes within days, not weeks</div>
    </div>
    <div class="card">
      <div class="card-title">📊 C-Suite Advisor</div>
      <div class="card-sub">Translates complex data into boardroom-ready strategies</div>
    </div>
    <div class="card">
      <div class="card-title">🚀 Scale Expert</div>
      <div class="card-sub">Scaled AI, Automation & Analytics functions at Agoda & beyond</div>
    </div>
  </div>
</div>

---

<!-- _class: divider -->

<div class="accent-line"></div>

### Chapter 02

# Career Journey

---

## Recent Roles

<div style="margin-top:16px;display:flex;flex-direction:column;gap:10px;">

  <div class="exp-row" style="border-left:4px solid #8b5cf6;">
    <div style="display:flex;justify-content:space-between;">
      <div class="exp-title">Associate Director · FinTech Data & Automation</div>
      <span class="tag">Current</span>
    </div>
    <div class="exp-company" style="color:#8b5cf6;">AGODA &nbsp;·&nbsp; Apr 2024 – Present</div>
    <div class="exp-desc">Leading 8-person FDA team · 12,000 hrs/yr productivity gain · Treasury, Tax, Credit Risk automation</div>
  </div>

  <div class="exp-row" style="border-left:4px solid #3b82f6;">
    <div class="exp-title">Head of Commercial</div>
    <div class="exp-company" style="color:#3b82f6;">REALLY COOL AIRLINES &nbsp;·&nbsp; Apr 2023 – Feb 2024</div>
    <div class="exp-desc">Built 11-person team from scratch · 6 departments · Secured <strong>200M THB</strong> seed funding</div>
  </div>

  <div class="exp-row" style="border-left:4px solid #06b6d4;">
    <div class="exp-title">Head of Strategic Foresight & Planning</div>
    <div class="exp-company" style="color:#06b6d4;">THAIRATH GROUP &nbsp;·&nbsp; Apr 2022 – Mar 2023</div>
    <div class="exp-desc">Led PMO team · KPI frameworks · Data-driven culture across business units</div>
  </div>

  <div class="exp-row" style="border-left:4px solid #10b981;">
    <div class="exp-title">Associate Director · Supply Analytics</div>
    <div class="exp-company" style="color:#10b981;">AGODA &nbsp;·&nbsp; Nov 2017 – Apr 2022</div>
    <div class="exp-desc">7-person team · 100+ Tableau dashboards for 600+ users · Credit risk models</div>
  </div>

</div>

---

## Early Career & Education

<div class="grid-2" style="margin-top:16px;">
  <div class="card" style="border-left:4px solid #f59e0b;">
    <div class="card-title">✈️ Planning Director — Nok Air</div>
    <div style="color:#f59e0b;font-size:0.7rem;font-weight:700;margin-bottom:6px;">2016 – 2017</div>
    <div class="card-sub">Co-architected a <strong>corporate turnaround</strong>. Increased aircraft utilization by <strong>15%</strong>. Presented strategy to Board, lessors, and banks.</div>
  </div>
  <div class="card" style="border-left:4px solid #ec4899;">
    <div class="card-title">✈️ Strategy & Planning Manager — Thai Smile</div>
    <div style="color:#ec4899;font-size:0.7rem;font-weight:700;margin-bottom:6px;">2015 – 2016</div>
    <div class="card-sub">Managed team of <strong>8</strong> on network optimization. Secured operating permits and route slots with aviation authorities.</div>
  </div>
</div>

<div class="highlight" style="margin-top:14px;">
  <span style="color:#c4b5fd;font-size:0.82rem;font-weight:600;">🎓 Education &nbsp;</span>
  <span style="color:#94a3b8;font-size:0.82rem;">MBA · Stamford International University (2013–2015) &nbsp;|&nbsp; B.Eng · Chulalongkorn University (2004–2008)</span>
</div>

---

<!-- _class: divider -->

<div class="accent-line"></div>

### Chapter 03

# Technical Skills

---

## Competencies

<div class="grid-3" style="margin-top:18px;">

  <div class="card">
    <div style="font-size:1.4rem;margin-bottom:6px;">🤖</div>
    <div class="card-title">AI & Development</div>
    <div class="card-sub" style="margin-top:4px;">Generative AI (Gemini, Claude) · RAG · AI Agents · LangGraph · React · Node.js · Python · Firebase · n8n</div>
  </div>

  <div class="card">
    <div style="font-size:1.4rem;margin-bottom:6px;">📊</div>
    <div class="card-title">Analytics & Data</div>
    <div class="card-sub" style="margin-top:4px;">SQL · Tableau · Metabase · Predictive Modeling · Time Series · Regression · ETL Pipelines · Financial Analysis</div>
  </div>

  <div class="card">
    <div style="font-size:1.4rem;margin-bottom:6px;">🏛️</div>
    <div class="card-title">Leadership</div>
    <div class="card-sub" style="margin-top:4px;">Corporate Data Strategy · AI Roadmaps · C-Suite Advisory · Fundraising · Crisis Management · Team Building</div>
  </div>

</div>

<div style="margin-top:14px;display:flex;gap:6px;flex-wrap:wrap;">
  <span class="tag">LangGraph</span><span class="tag">React</span><span class="tag">Python</span><span class="tag">Gemini AI</span><span class="tag">RAG</span><span class="tag">Text-to-SQL</span><span class="tag">Tableau</span><span class="tag">Firebase</span><span class="tag">n8n</span><span class="tag">ETL</span><span class="tag">OCR</span><span class="tag">NLP</span>
</div>

---

<!-- _class: divider -->

<div class="accent-line"></div>

### Chapter 04

# Featured Projects

---

## Lecture Insights

<div class="grid-3" style="margin-top:16px;">

  <div class="card">
    <div style="color:#6366f1;font-size:1.1rem;margin-bottom:4px;">🧠</div>
    <div class="card-title">Karpathy LLM Guide</div>
    <div style="font-size:0.62rem;color:#6366f1;font-weight:700;margin-bottom:4px;font-family:'JetBrains Mono',monospace;">INTERACTIVE ARTICLE</div>
    <div class="card-sub">Technical synthesis of Karpathy's LLM masterclass. Token visualizers & Model ELO charts.</div>
    <div style="margin-top:6px;"><span class="tag" style="font-size:0.62rem;">LLM</span><span class="tag" style="font-size:0.62rem;">Education</span></div>
  </div>

  <div class="card">
    <div style="color:#06b6d4;font-size:1.1rem;margin-bottom:4px;">💡</div>
    <div class="card-title">The Human Edge</div>
    <div style="font-size:0.62rem;color:#06b6d4;font-weight:700;margin-bottom:4px;font-family:'JetBrains Mono',monospace;">INTERACTIVE ARTICLE</div>
    <div class="card-sub">Based on Po-Shen Loh's philosophy. Mental Fitness simulation & AI-era survival skills.</div>
    <div style="margin-top:6px;"><span class="tag" style="font-size:0.62rem;">Philosophy</span><span class="tag" style="font-size:0.62rem;">React</span></div>
  </div>

  <div class="card">
    <div style="color:#8b5cf6;font-size:1.1rem;margin-bottom:4px;">🤖</div>
    <div class="card-title">Agentic AI Deep Dive</div>
    <div style="font-size:0.62rem;color:#8b5cf6;font-weight:700;margin-bottom:4px;font-family:'JetBrains Mono',monospace;">INTERACTIVE ARTICLE</div>
    <div class="card-sub">Stanford CS230 on Agentic AI. Jagged Frontier, HyDE, and ReAct visualizations.</div>
    <div style="margin-top:6px;"><span class="tag" style="font-size:0.62rem;">Stanford</span><span class="tag" style="font-size:0.62rem;">Agentic</span></div>
  </div>

</div>

<div class="grid-2" style="margin-top:12px;">

  <div class="card">
    <div style="color:#f97316;font-size:1.1rem;margin-bottom:4px;">🗳️</div>
    <div class="card-title">Thai Election 2566</div>
    <div class="card-sub">Interactive data storytelling with RAG-based AI chatbot. Visualizes 2023 election with political insights.</div>
    <div style="margin-top:6px;"><span class="tag" style="font-size:0.62rem;">RAG</span><span class="tag" style="font-size:0.62rem;">Gemini AI</span><span class="tag" style="font-size:0.62rem;">Data Viz</span></div>
  </div>

  <div class="card">
    <div style="color:#ef4444;font-size:1.1rem;margin-bottom:4px;">🔍</div>
    <div class="card-title">2026 Election Investigation</div>
    <div class="card-sub">Statistical investigation of the Feb 8, 2026 election. QR ballot analysis across 382 districts.</div>
    <div style="margin-top:6px;"><span class="tag" style="font-size:0.62rem;">ECT Data</span><span class="tag" style="font-size:0.62rem;">Bilingual</span><span class="tag" style="font-size:0.62rem;">ECharts</span></div>
  </div>

</div>

---

## AI Agent Projects

<div class="grid-3" style="margin-top:16px;">

  <div class="card">
    <div style="color:#f43f5e;font-size:1.1rem;margin-bottom:4px;">🛡️</div>
    <div class="card-title">RiskGuard AI</div>
    <div class="card-sub" style="margin-top:4px;">Real-time transaction audits, Policy Checks, Entity Resolution (COI), Market Benchmarking.</div>
    <div style="margin-top:6px;"><span class="tag" style="font-size:0.62rem;">LangGraph</span><span class="tag" style="font-size:0.62rem;">Risk</span></div>
  </div>

  <div class="card">
    <div style="color:#3b82f6;font-size:1.1rem;margin-bottom:4px;">📋</div>
    <div class="card-title">ProjectFlow AI</div>
    <div class="card-sub" style="margin-top:4px;">Autonomous Scrum Master for Jira. Scope Creep detection, Auto-Grooming, DoD checks.</div>
    <div style="margin-top:6px;"><span class="tag" style="font-size:0.62rem;">Jira API</span><span class="tag" style="font-size:0.62rem;">DevOps</span></div>
  </div>

  <div class="card">
    <div style="color:#f59e0b;font-size:1.1rem;margin-bottom:4px;">⭐</div>
    <div class="card-title">ReviewFlow AI</div>
    <div class="card-sub" style="margin-top:4px;">Reputation Engine. Sentiment Analysis, Intelligent Routing, Automated Triggers.</div>
    <div style="margin-top:6px;"><span class="tag" style="font-size:0.62rem;">NLP</span><span class="tag" style="font-size:0.62rem;">Automation</span></div>
  </div>

  <div class="card">
    <div style="color:#8b5cf6;font-size:1.1rem;margin-bottom:4px;">🗄️</div>
    <div class="card-title">QueryFlow AI</div>
    <div class="card-sub" style="margin-top:4px;">Natural language → SQL. Metadata Scouting, Federated Execution & Lineage Tracking.</div>
    <div style="margin-top:6px;"><span class="tag" style="font-size:0.62rem;">Text-to-SQL</span><span class="tag" style="font-size:0.62rem;">Trino</span></div>
  </div>

  <div class="card">
    <div style="color:#10b981;font-size:1.1rem;margin-bottom:4px;">💸</div>
    <div class="card-title">Collections AI</div>
    <div class="card-sub" style="margin-top:4px;">Autonomous dispute agent for VCC overcharges. Strategy engine & auto-rebuttal loops.</div>
    <div style="margin-top:6px;"><span class="tag" style="font-size:0.62rem;">LangGraph</span><span class="tag" style="font-size:0.62rem;">FinTech</span></div>
  </div>

  <div class="card">
    <div style="color:#a855f7;font-size:1.1rem;margin-bottom:4px;">🧾</div>
    <div class="card-title">SlipVerify AI</div>
    <div class="card-sub" style="margin-top:4px;">Multi-agent orchestration for fraud detection & OCR-based expense verification.</div>
    <div style="margin-top:6px;"><span class="tag" style="font-size:0.62rem;">LangGraph</span><span class="tag" style="font-size:0.62rem;">OCR</span></div>
  </div>

</div>

---

## Production Apps

<div class="grid-2" style="margin-top:18px;">

  <div class="card" style="border-color:#ec4899;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <div style="font-size:1.6rem;">🧾</div>
      <div>
        <div class="card-title">SplitBill AI</div>
        <div style="font-size:0.65rem;color:#ec4899;font-weight:700;font-family:'JetBrains Mono',monospace;">splitbill-ai.com</div>
      </div>
    </div>
    <div class="card-sub">Built <strong>end-to-end in 7 days</strong>. Instant receipt scanning via Gemini AI, automatic item parsing, smart bill splitting.</div>
    <div style="margin-top:8px;"><span class="tag">Gemini AI</span><span class="tag">React</span><span class="tag">Firebase</span></div>
  </div>

  <div class="card" style="border-color:#06b6d4;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <div style="font-size:1.6rem;">🗺️</div>
      <div>
        <div class="card-title">Local Guide</div>
        <div style="font-size:0.65rem;color:#06b6d4;font-weight:700;font-family:'JetBrains Mono',monospace;">Full Stack · Travel Platform</div>
      </div>
    </div>
    <div class="card-sub">MVP for a travel tech startup. Full-stack: auth, dynamic profiles, real-time booking workflows.</div>
    <div style="margin-top:8px;"><span class="tag">React</span><span class="tag">Express.js</span><span class="tag">PostgreSQL</span></div>
  </div>

</div>

<div class="highlight">
  <span style="color:#c4b5fd;font-size:0.8rem;">Also built: </span>
  <span style="color:#94a3b8;font-size:0.8rem;"><strong style="color:#fff;">AI Resume Builder</strong> · <strong style="color:#fff;">Gemini OCR</strong> · <strong style="color:#fff;">AI Evolution Stats</strong></span>
</div>

---

<!-- _class: divider -->

<div class="accent-line"></div>

### Chapter 05

# Impact & Philosophy

---

## By the Numbers

<div class="grid-4">

  <div class="card" style="text-align:center;padding:20px 12px;">
    <div class="stat-big">12K</div>
    <div style="font-size:0.6rem;color:#64748b;margin-top:4px;text-transform:uppercase;letter-spacing:0.08em;">Hours / Year</div>
    <div style="font-size:0.65rem;color:#94a3b8;margin-top:6px;">Saved via AI automation at Agoda</div>
  </div>

  <div class="card" style="text-align:center;padding:20px 12px;">
    <div class="stat-big">200M</div>
    <div style="font-size:0.6rem;color:#64748b;margin-top:4px;text-transform:uppercase;letter-spacing:0.08em;">THB Raised</div>
    <div style="font-size:0.65rem;color:#94a3b8;margin-top:6px;">Seed funding via data-driven pitch</div>
  </div>

  <div class="card" style="text-align:center;padding:20px 12px;">
    <div class="stat-big">100+</div>
    <div style="font-size:0.6rem;color:#64748b;margin-top:4px;text-transform:uppercase;letter-spacing:0.08em;">Dashboards</div>
    <div style="font-size:0.65rem;color:#94a3b8;margin-top:6px;">Tableau ecosystem for 600+ users</div>
  </div>

  <div class="card" style="text-align:center;padding:20px 12px;">
    <div class="stat-big">15%</div>
    <div style="font-size:0.6rem;color:#64748b;margin-top:4px;text-transform:uppercase;letter-spacing:0.08em;">Utilization ↑</div>
    <div style="font-size:0.65rem;color:#94a3b8;margin-top:6px;">Aircraft via analytical models at Nok Air</div>
  </div>

</div>

<div class="highlight" style="margin-top:18px;">
  <p style="font-size:0.9rem;color:#cbd5e1;line-height:1.8;font-style:italic;">
    "I build <strong>rapid AI prototypes</strong> — often within days, not weeks — and translate them into <strong>scalable intelligent solutions</strong> that drive real business outcomes."
  </p>
</div>

---

## Philosophy

<div class="grid-2" style="margin-top:18px;">
  <div style="display:flex;flex-direction:column;gap:10px;">
    <div class="card">
      <div class="card-title">⚡ Speed as a Strategy</div>
      <div class="card-sub" style="margin-top:3px;">Ship working prototypes in days. AI is a force-multiplier, not a replacement for judgment.</div>
    </div>
    <div class="card">
      <div class="card-title">🔗 Bridge Builder</div>
      <div class="card-sub" style="margin-top:3px;">Connects Finance, Engineering, and Commercial — speaking every team's language fluently.</div>
    </div>
    <div class="card">
      <div class="card-title">📖 Data Storyteller</div>
      <div class="card-sub" style="margin-top:3px;">Transforms complex data into narratives that compel boards to act decisively.</div>
    </div>
  </div>
  <div style="display:flex;flex-direction:column;gap:10px;">
    <div class="card">
      <div class="card-title">🧪 Vibe Coder</div>
      <div class="card-sub" style="margin-top:3px;">Architects the intent. AI agents handle implementation. Review, verify, deploy.</div>
    </div>
    <div class="card">
      <div class="card-title">🎓 Perpetual Learner</div>
      <div class="card-sub" style="margin-top:3px;">Synthesizes Karpathy, Po-Shen Loh, Stanford CS230 into interactive educational articles.</div>
    </div>
    <div class="card">
      <div class="card-title">🕵️ Data Investigator</div>
      <div class="card-sub" style="margin-top:3px;">Uses statistical rigor and official data to surface insights others miss.</div>
    </div>
  </div>
</div>

---

<!-- _class: closing -->

<div class="accent-line" style="margin:0 auto 18px;"></div>

<h1 style="font-size:2.4rem;margin-bottom:8px;">Let's Build Something<br><span style="background:linear-gradient(90deg,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Extraordinary</span></h1>

<p style="font-size:0.9rem;color:#64748b;max-width:420px;margin:10px auto 0;">Where executive strategy meets hands-on AI engineering.</p>

<div style="display:flex;gap:16px;margin-top:32px;flex-wrap:wrap;justify-content:center;">
  <div style="background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:12px 22px;text-align:center;">
    <div style="font-size:0.6rem;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Website</div>
    <div style="font-weight:700;color:#8b5cf6;font-size:0.9rem;">wutcharin.com</div>
  </div>
  <div style="background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:12px 22px;text-align:center;">
    <div style="font-size:0.6rem;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Email</div>
    <div style="font-weight:700;color:#3b82f6;font-size:0.9rem;">wutcharin.th@gmail.com</div>
  </div>
  <div style="background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:12px 22px;text-align:center;">
    <div style="font-size:0.6rem;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">LinkedIn</div>
    <div style="font-weight:700;color:#06b6d4;font-size:0.9rem;">in/Wutcharin</div>
  </div>
</div>

<div style="margin-top:40px;font-size:0.6rem;color:#1e293b;font-family:'JetBrains Mono',monospace;letter-spacing:0.1em;">WUTCHARIN THATAN · 2026</div>
