# Product

## Register

brand

## Users

Hiring managers, executive recruiters, and senior peers in fintech / data / AI evaluating Wutcharin Thirakisem for leadership roles. Context: skim-reading the site between meetings, often on a laptop, sometimes on mobile. Job to be done: in under 60 seconds, decide whether Wutcharin is operating at the seniority level claimed (Associate Director, FinTech Data & Automation, Agoda — team of 12, ~20 years experience, AI/Analytics/Automation portfolio). The site has to *demonstrate* taste, technical range, and executive presence — not just describe them.

## Product Purpose

A portfolio / executive resume site that doubles as proof-of-craft. Replaces the LinkedIn-shaped resume with a kinetic, motion-rich, technically ambitious site that itself functions as a work sample. Success looks like: visitors leave convinced of seniority, request an introduction, or spend long enough on Projects to grasp the AI/agent portfolio. Failure looks like: visitors confuse it for a generic developer portfolio template or bounce because the motion feels random rather than choreographed.

## Brand Personality

**Kinetic. Executive. Technical.**

- **Kinetic** — motion is the medium, not garnish. Type breaks, scroll-driven choreography, and pre-rendered video belong here only when they earn their place. Stillness is a deliberate choice against this baseline, not the default.
- **Executive** — the work shown is at the level of running orgs, not shipping side projects. Tone is confident without bragging; metrics are concrete (12k hours saved, 20 AI agents shipped, 50 people led) and never inflated.
- **Technical** — the implementation itself is part of the pitch. React 19, Three.js, GSAP, Remotion-rendered video, custom motion tokens — all visible to a technical visitor inspecting the source.

## Anti-references

This site must not look like:

- **Generic SaaS / startup landing.** No "big number + small label + gradient accent" hero-metric template. No identical 3-up feature card grids. No "Loved by teams at" logo strip clichés.
- **Default LinkedIn-style resume.** No corporate `#0A66C2` blue. No two-column layout with a profile photo at top-left. No stock `Skills / Experience / Education` section headers carried verbatim from a CV.
- **AI-slop dev portfolio.** No glassmorphism applied as a default surface treatment. No rainbow gradient text via `background-clip: text`. No neon-on-black cyberpunk palette. No terminal-cursor blinking in the hero. No three-up "Projects" cards with identical icon + heading + description.
- **Crypto / web3 maximalism.** No mint/teal grid backgrounds. No animated coin/token particle systems. No faux "Launch App" CTA in the nav.

## Design Principles

1. **Practice what you preach.** The site is itself an AI/data/motion portfolio entry. If the resume claims taste, the resume must *be* tasteful. Every motion choice should survive the question "would I put this on a slide for the CEO?"
2. **Show, don't tell.** Replace adjectives with artifacts. "Cinematic" is earned by a real cinematic reel, not by typing the word. "Performance-aware" is earned by Lighthouse scores, not a section header.
3. **One layer of motion at a time.** The site already has Three.js + GSAP + Framer Motion + neural canvas. Adding more without subtracting yields slop. When introducing a new motion layer (e.g. Remotion video), retire one.
4. **Executive confidence, not bragging.** Numbers must be specific and verifiable from context. Tone never says "world-class" or "rockstar" — the work has to imply it.
5. **Variation over symmetry.** Vary spacing, card sizes, section rhythm. Identical card grids are the cliché signal. Sections should feel composed, not templated.

## Accessibility & Inclusion

- **WCAG 2.1 AA** is the floor: 4.5:1 contrast for body text, 3:1 for large text and UI components.
- **`prefers-reduced-motion`** is fully respected: no autoplay video, instant reveals replace scroll-triggered animations, marquee stops, custom cursor disabled.
- **Keyboard navigation** works for every interactive element; focus states are visible and on-brand (not browser default outlines, but no less visible than them).
- **Color blindness**: violet/cyan accents are paired with weight/size hierarchy, never carrying meaning by color alone.
- **Screen readers**: section landmarks, descriptive `alt`/`aria-label` on decorative motion elements, video assets have `aria-hidden="true"` when purely ambient.
