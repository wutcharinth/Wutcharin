---
name: Wutcharin Portfolio
description: Kinetic executive portfolio for an AI/data leader — sparkled graphite surface, silver glints, motion as medium.
colors:
  graphite: "#0e0e10"
  graphite-deep: "#0a0a0b"
  void: "#08080a"
  veil: "#0e0e10cc"
  veil-soft: "#0e0e108c"
  silver-signal: "#e6e6ea"
  silver-deep: "#a3a3ab"
  silver-glow: "#3a3a41"
  cyan-pulse: "#22d3ee"
  fuchsia-flare: "#e879f9"
  pewter-body: "#cfcfd4"
  pewter-mute: "#8e8e96"
  chalk: "#fafafa"
  border-faint: "#ffffff0d"
typography:
  display:
    fontFamily: "'Clash Display', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(3.5rem, 9vw, 9rem)"
    fontWeight: 600
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Clash Display', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
  serif-accent:
    fontFamily: "'Instrument Serif', Georgia, serif"
    fontSize: "inherit"
    fontWeight: 400
    fontStyle: "italic"
    letterSpacing: "0"
  title:
    fontFamily: "'Clash Display', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.28em"
rounded:
  none: "0"
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "96px"
  section: "8rem"
components:
  button-primary:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.graphite}"
    rounded: "{rounded.sm}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "{colors.silver-signal}"
    textColor: "{colors.graphite}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.silver-signal}"
    rounded: "{rounded.sm}"
    padding: "12px 28px"
  button-ghost-hover:
    backgroundColor: "{colors.silver-glow}"
    textColor: "{colors.chalk}"
  chip-meta:
    backgroundColor: "{colors.silver-glow}"
    textColor: "{colors.silver-signal}"
    rounded: "{rounded.pill}"
    padding: "6px 16px"
  instrument:
    backgroundColor: "{colors.veil}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.sm}"
    padding: "20px"
  card-section:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.pewter-body}"
    rounded: "{rounded.lg}"
    padding: "32px"
---

# Design System: Wutcharin Portfolio

## 1. Overview

**Creative North Star: "Sparkled Graphite"**

A sheet of graphite under a single lamp. The surface is dark and mineral: a fine grain of glitter runs through it, faint in the shadows and bright where a long, soft sweep of light falls, and it glints as the cursor moves over it. The live particles are the same material: silver points that gather into a portrait, a number, a flight path. Color is the exception, not the language. The site speaks in graphite, pewter and chalk, and lets a project's own hue appear only on that project. The interface is technical without being cyberpunk, kinetic without being maximalist, confident without bragging — it shows the work of an Associate Director who has spent twenty years inside data-and-automation org charts.

The system explicitly rejects four neighbors: the LinkedIn-blue corporate-resume default; the SaaS landing-page hero-metric template; the AI-slop dev-portfolio palette of glassmorphism and rainbow-gradient text; and the crypto/web3 neon-on-black maximalism. Each of those is what a generic AI tool would produce given the same brief. Sparkled Graphite is what an executive who builds AI tools produces instead.

Density is variable, never uniform: hero sections breathe, body sections compress, a single project card gets twice the screen real estate of its neighbors. Every motion layer is intentional — adding one means retiring another (Principle 3).

**Key Characteristics:**
- Graphite `#0e0e10` surface with a glitter grain; silver `#e6e6ea` as the only signal
- Light falls on the surface: a soft diagonal sheen per chapter, and a small lamp on the cursor
- Variable section rhythm (96px → 8rem → custom) — never uniform padding everywhere
- Mono-cased labels at `0.28em` letter-spacing carrying state, status, and meta-context
- Crisp 4px corners on buttons and instruments; pills only for chips and nav
- Type breaks letter-by-letter on hero, lands solid in body — kinetic at entry, settled in content

## 2. Colors: The Sparkled Graphite Palette

A dark mineral surface, one silver signal, two cool accents reserved for identity, and three neutral greys for hierarchy. No hue on the home page.

### Primary

- **Graphite** (`#0e0e10`): The surface itself. The default for every section, every page, every modal. Never `#000` — `#000` reads dead; graphite carries a trace of cool that holds depth under the grain.
- **Silver Signal** (`#e6e6ea`): The glint. Carries focus, status pings, link hover and accent text (the serif italic). It differs from body text by brightness and face, never by hue.
- **Silver Deep** (`#a3a3ab`) / **Silver Glow** (`#3a3a41`): Pressed states, tints, the scrollbar.

### Secondary

- **Cyan Pulse** (`#22d3ee`): Reserved for projects in the *Lecture Insight* and *Data Story* identity bands (per-card accent). Never used as a global accent.
- **Fuchsia Flare** (`#e879f9`): Reserved for specific projects flagged as bold/experimental (AI Evolution Stats, etc.). Never paired with Cyan Pulse on the same surface.
- **Project hues**: each project page keeps its own accent (its particle tint and reading-progress line). The home page stays graphite.

### Neutral

- **Graphite Deep** (`#0a0a0b`): Section breaks darker than Graphite, a tonal step without a border.
- **Void** (`#08080a`): The floor under full-WebGL chapters so the particle glow has true black headroom. Never a section background on its own.
- **Veil** (`rgba(14,14,16,0.80)`) / **Veil Soft** (`rgba(14,14,16,0.55)`): Panels that sit over the live field and the grain: the hero instrument, text panels. Solid rgba, not backdrop-blur.
- **Pewter Body** (`#cfcfd4`): Default body text on Graphite.
- **Pewter Mute** (`#8e8e96`): Secondary text, captions, meta. About 5.9:1 on Graphite.
- **Chalk** (`#fafafa`): The most important typographic weight on a surface, and the primary button.
- **Border Faint** (`rgba(255,255,255,0.05)`): The only horizontal divider in the system.

### Light theme: Graphite on Paper

The same grain, inverted: dark specks on a pale aluminium surface (`#ececee`), body `#36363c`, mute `#66666e`, and the signal becomes graphite itself (`#1c1c20`).

### Named Rules

**The Glint Rule.** Silver Signal is a glint, not a fill. It marks one live thing at a time (a status dot, the active step, a focused control). Large areas stay graphite.

**The Identity Lane Rule.** Cyan Pulse, Fuchsia Flare and project hues belong to *specific named artifacts* — they are project identities, not global colors. A new section may not adopt them as accents; only a new project with a defined identity may.

**The No-Black Rule.** `#000` and `#fff` are forbidden as surface or text values. The one exception is the grain's light map in `home/Atmosphere.tsx`, which is a mask, not a surface.

## 3. Typography

**Display Font:** Clash Display (variable 200–700, self-hosted, Fontshare FFL) — set semibold (600) and tight (`-0.02em`), mixed case. Its angular counters rhyme with the particle geometry of the v2 scene.
**Editorial Accent:** Instrument Serif italic (self-hosted, OFL) — the human voice. Single accent words and pull quotes only, never full headlines.
**Body Font:** Helvetica Neue (system stack) — regular weight, generous line-height, never tracked. Zero bytes; the identity faces above do the brand work.
**Label/Mono Font:** JetBrains Mono (variable, self-hosted, OFL) — uppercase meta-labels at extreme letter-spacing; tabular numerals for metrics.

**Character:** An engineered grotesk carries display, a serif italic interrupts it with a human voice, and mono carries state. Weight + size + tracking still do the hierarchy work; uppercase now belongs to mono labels alone.

### Hierarchy

- **Display** (Clash 600, `clamp(3.5rem, 9vw, 9rem)`, line-height 0.92, tracking `-0.02em`): Hero only. Often broken letter-by-letter for kinetic entry. Mixed case.
- **Headline** (Clash 600, `clamp(2rem, 4vw, 3.5rem)`, line-height 1, tracking `-0.02em`): Section openers. Mixed case.
- **Serif Accent** (Instrument Serif italic 400, inherits size): One or two words inside a display/headline lockup, or a standalone pull quote. The only italic in the system.
- **Title** (Clash 500, `1.25rem`, line-height 1.3): Card titles, project names. Sentence case.
- **Body** (400, `1rem`, line-height 1.6): Default reading text. Cap line length at 65–75ch.
- **Label** (JetBrains Mono 500, `0.6875rem`, line-height 1, tracking `0.28em`, UPPERCASE): Meta-labels (`AI / DATA / OPS`), section eyebrows, status pings. In Pewter Mute, or Silver Signal when it carries state.

### Named Rules

**The Display-Voice Rule.** Display is Clash 600 tight (`-0.02em`), mixed case, never uppercase. Clash at 600 reads heavier than Helvetica at 900; anything looser at hero scale reads as a different brand.

**The Serif-Interrupt Rule.** Instrument Serif appears only in italic, only on one or two words per lockup or a standalone quote. It marks the human exception inside the engineered pattern. A full serif headline is forbidden.

**The Mono-Label Rule.** Mono is reserved for labels at `≥0.25em` letter-spacing in UPPERCASE. Never used for body, never for headlines. It is a status-indicator typeface in this system, not a code-display typeface.

**The No-Gradient-Text Rule.** `background-clip: text` combined with a gradient is forbidden by name. Emphasis comes from weight (400 → 900) and size (1rem → 7.5rem), not from rainbow.

## 4. Elevation

The system is **flat by default**. Depth comes from light on the surface (the sheen and the lamp), tonal stepping (Graphite → Graphite Deep) and motion, not from box-shadow.

### Shadow Vocabulary

- **Glint** (`box-shadow: 0 0 14px rgba(255,255,255,0.45)`): Only on live-status points: the current career stop, the active step, the flight marker.
- **Brutalist Hard-Shadow** (`box-shadow: 8px 8px 0px 0px var(--shadow-color)`): Reserved for legacy sections only (kept for the few brutalism-styled elements in `_backup/`). Not for new components.

### Named Rules

**The Flat-By-Default Rule.** New components ship with no `box-shadow` at rest. Shadows appear only as a response to state — hover, active, focus, or "live."

**The Light Is Surface, Not Shadow Rule.** The sheen and the lamp light the graphite behind the content. They never sit under a component as elevation.

## 5. Components

### Buttons

- **Shape:** Crisp rectangle, `4px` radius.
- **Primary:** Chalk background, Graphite text, padding `12px 28px`. Hover: Silver Signal, no transform. Used once or twice per page max.
- **Ghost:** Transparent background, 1px Silver Signal/30 border, Silver Signal text. Hover: Silver/10 fill, text to Chalk.
- **Magnetic behavior:** Primary CTAs bind to cursor proximity within `~80px` and translate up to `~12px` toward the cursor on a spring curve. Disabled under `prefers-reduced-motion`.

### Chips / Meta-pills

- **Style:** Hairline border, pill radius, mono label in Pewter. Optional leading silver dot (`animate-ping` on the hero's "Now").
- **Use:** Section eyebrows, project badges, status indicators ("LIVE", "NOW").

### Instruments

- **Style:** Veil background, 1px hairline, `4px` radius, `20px` padding. A title in Clash 500, rows of a name, a mono sub-line, and a reading on the right: ten cells, one per 10%, lit in Chalk.
- **Use:** The hero's "Automated each year" panel (`home/HeroInstrument.tsx`). Data comes from the same source as the chapter that tells the story in full (`home/automation.ts`). An instrument reads, it never decorates: no invented figures.

### Cards / Section Containers

- **Corner Style:** `12px` (lg) on cards, `0` on full-bleed sections.
- **Background:** Graphite with optional Border Faint hairline.
- **Shadow Strategy:** None at rest. Hover: border lightens to `rgba(255,255,255,0.15)`, no shadow.
- **Internal Padding:** Variable — `24px` on dense cards, `48px` on hero cards, `32px` default. Identical padding across all cards is forbidden (see The Variation Rule below).

### Inputs / Fields

- **Style:** Transparent background, 1px Border Faint stroke at rest, pill or `8px` radius depending on context, Slate Body text, Slate Mute placeholder.
- **Focus:** Outline `2px` in Silver Signal at 90% (graphite in the light theme), `3px` outline-offset, `4px` outline-radius. The same focus ring used on every interactive element site-wide for consistency.

### Navigation

- **Top nav:** Fixed pill-shaped scroll-aware container, dark glass over Graphite with `~12% opacity` and minimal blur. Active section pill fills with a faint panel tint. Scroll progress bar at top — 1px tall, Silver Signal fill.
- **Mobile:** Full-screen overlay opens from a hamburger; same pill treatment for items.

### Home Atmosphere

The sparkled graphite itself (`home/Atmosphere.tsx`). A long, soft sheen of light lies across the surface and travels to where each chapter's subject sits (the portrait, the numeral, the address). A glitter grain (`public/textures/glitter.webp`, made by `scripts/glitter-texture.py`) is faint everywhere and bright where the sheen falls; a small lamp on the cursor makes the grain glint as it moves. The lit grain is the texture multiplied by a light map and screened onto the page from a body-level layer between the scene canvas and the content, so it reaches the particles too. Transform and opacity only.

### Rise Headings

Chapter headings on the home page lift word by word out of their baseline the first time they enter view (`home/Rise.tsx`). The mask is a `clip-path`, so Clash and the serif accent keep one baseline. Under reduced motion they render in place.

### Type Interlude

One band of oversized Clash between the project index and the career path (`home/Interlude.tsx`): two rows, lit and ghost words alternating, moved only by the scroll. Ghost words are a low-alpha fill, never an outline. One per page.

### Signature Component: The Cinematic Reel Frame

A 16:9 letterboxed black frame with 5% inner padding, no border at rest. Plays a Remotion-rendered loop (or live canvas) inside. Captions overlay in the bottom-left corner using the Label style. Replaces the bar-chart-and-card cliché in body sections — what would normally be "a chart" is "a small running film" with the same data conveyed kinetically.

## 6. Do's and Don'ts

### Do:
- **Do** use Graphite (`#0e0e10`) as the canonical dark surface — never `#000`.
- **Do** keep the home page free of hue. Silver glints carry state; project hues stay on their projects.
- **Do** vary section padding deliberately (96px / 8rem / custom). Identical padding is monotony.
- **Do** pair every Silver Signal cue with size, weight or face contrast; brightness alone is a weak cue.
- **Do** retire one motion layer when adding another. The site already has Three.js + GSAP + Framer Motion + neural canvas; adding Remotion means subtracting one of those, not stacking.
- **Do** respect `prefers-reduced-motion` on every animation: instant reveals, paused marquees, no autoplay video, restored native cursor.

### Don't:
- **Don't** use corporate LinkedIn blue (`#0A66C2`) anywhere. PRODUCT.md names this as an anti-reference.
- **Don't** use `background-clip: text` with a gradient. Forbidden by name (anti-reference: AI-slop dev portfolio).
- **Don't** apply glassmorphism as a default surface. Rare and purposeful or nothing (anti-reference: AI-slop dev portfolio).
- **Don't** ship the SaaS hero-metric template (big number, small label, supporting stats, gradient accent). Forbidden by name (anti-reference: Generic SaaS / startup landing).
- **Don't** ship identical 3-up card grids of `icon + heading + description`. Forbidden by name (anti-reference: AI-slop dev portfolio).
- **Don't** use neon-on-black cyberpunk palettes. Forbidden by name (anti-reference: AI-slop dev portfolio).
- **Don't** use mint/teal grids, animated coin/token particles, or faux "Launch App" CTAs. Forbidden by name (anti-reference: Crypto / web3 maximalism).
- **Don't** use `border-left` greater than 1px as a colored accent stripe. Rewrite with full borders or background tints.
- **Don't** use em dashes in copy. Use commas, colons, semicolons, periods, or parentheses.
- **Don't** use `#000` or `#fff` as raw values without deliberate role assignment. Tinted neutrals only.
