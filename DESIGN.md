---
name: Wutcharin Portfolio
description: Kinetic executive portfolio for an AI/data leader — dark midnight surface, violet-led accents, motion as medium.
colors:
  midnight-deep: "#020617"
  ink: "#050505"
  violet-signal: "#a78bfa"
  violet-deep: "#7c3aed"
  violet-glow: "#4c1d95"
  cyan-pulse: "#22d3ee"
  fuchsia-flare: "#e879f9"
  slate-body: "#cbd5e1"
  slate-mute: "#94a3b8"
  white-pure: "#ffffff"
  border-faint: "#ffffff0d"
typography:
  display:
    fontFamily: "'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(3rem, 8vw, 7.5rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.5rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "'Helvetica Neue', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "'Courier New', Courier, monospace"
    fontSize: "0.625rem"
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
    backgroundColor: "{colors.white-pure}"
    textColor: "{colors.midnight-deep}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "{colors.violet-signal}"
    textColor: "{colors.midnight-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.violet-signal}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  button-ghost-hover:
    backgroundColor: "{colors.violet-deep}"
    textColor: "{colors.white-pure}"
  chip-meta:
    backgroundColor: "{colors.violet-glow}"
    textColor: "{colors.violet-signal}"
    rounded: "{rounded.pill}"
    padding: "6px 16px"
  card-section:
    backgroundColor: "{colors.midnight-deep}"
    textColor: "{colors.slate-body}"
    rounded: "{rounded.lg}"
    padding: "32px"
---

# Design System: Wutcharin Portfolio

## 1. Overview

**Creative North Star: "The Midnight Console"**

A late-night operations room running fintech at scale. The surface is dim by design — visitors arrive into a near-black room where motion is the only ambient signal, and every glowing element is doing real work. Violet is the operator's accent: a single hue that carries focus, status, and intent. Cyan and fuchsia appear sparingly, only on artifacts that already earned their own identity (specific projects, specific lectures). The interface is technical without being cyberpunk, kinetic without being maximalist, confident without bragging — it shows the work of an Associate Director who has spent twenty years inside data-and-automation org charts.

The system explicitly rejects four neighbors: the LinkedIn-blue corporate-resume default; the SaaS landing-page hero-metric template; the AI-slop dev-portfolio palette of glassmorphism and rainbow-gradient text; and the crypto/web3 neon-on-black maximalism. Each of those is what a generic AI tool would produce given the same brief. The Midnight Console is what an executive who builds AI tools produces instead.

Density is variable, never uniform: hero sections breathe, body sections compress, a single project card gets twice the screen real estate of its neighbors. Every motion layer is intentional — adding one means retiring another (Principle 3).

**Key Characteristics:**
- Near-black `#020617` surface with violet `#a78bfa` as the single signal color
- Variable section rhythm (96px → 8rem → custom) — never uniform padding everywhere
- Mono-cased labels at `0.28em` letter-spacing carrying state, status, and meta-context
- Type breaks letter-by-letter on hero, lands solid in body — kinetic at entry, settled in content
- Pre-rendered Remotion video replaces runtime particle systems where it wins on perf

## 2. Colors: The Midnight Console Palette

A dim operator's room with one signal color, two cool accents reserved for identity, and three cool neutrals for hierarchy.

### Primary

- **Midnight Deep** (`#020617`): The room itself. The default surface for every section, every page, every modal. Never `#000` — `#000` reads dead; this carries a 0.005-chroma blue tint that holds depth.
- **Violet Signal** (`#a78bfa`): The single accent that carries focus, status pings, link hover, and meta-label color. Rare by rule (see The 10% Rule below). When you see it, something is alive.
- **Violet Deep** (`#7c3aed`): The pressed/active state of Violet Signal. Also used for ambient blur-glow auroras (`bg-violet-600/20 blur-[120px]`) where the color is a feeling, not a foreground.

### Secondary

- **Cyan Pulse** (`#22d3ee`): Reserved for projects in the *Lecture Insight* and *Data Story* identity bands (per-card accent). Never used as a global accent.
- **Fuchsia Flare** (`#e879f9`): Reserved for specific projects flagged as bold/experimental (AI Evolution Stats, etc.). Never paired with Cyan Pulse on the same surface.

### Neutral

- **Ink** (`#050505`): Section breaks darker than Midnight Deep. Used to mark a tonal step between sections without introducing a border.
- **Slate Body** (`#cbd5e1`): The default body-text color against Midnight Deep. Hits 9.4:1 contrast — well above WCAG AA.
- **Slate Mute** (`#94a3b8`): Secondary text, captions, deprecated meta. Hits 5.7:1 contrast.
- **White Pure** (`#ffffff`): Reserved for the most important typographic weight on a surface. Never the default text color.
- **Border Faint** (`rgba(255,255,255,0.05)`): The only horizontal divider in the system. No 1px gray borders — only this near-invisible white wash.

### Named Rules

**The 10% Rule.** Violet Signal is used on no more than 10% of any given screen by visual area. Its rarity is the point — when it appears, it carries meaning. A page full of violet is a page full of nothing.

**The Identity Lane Rule.** Cyan Pulse and Fuchsia Flare belong to *specific named artifacts* — they are project identities, not global colors. A new section may not adopt them as accents; only a new project with a defined identity may.

**The No-Black Rule.** `#000` and `#fff` are forbidden as raw values. Use Midnight Deep (`#020617`) and White Pure (`#ffffff`) — the latter is the literal hex but only by deliberate role assignment. Tinted neutrals only for everything else.

## 3. Typography

**Display Font:** Helvetica Neue (with Arial fallback) — set very heavy (900) and very tight (`-0.04em`).
**Body Font:** Helvetica Neue (with Arial fallback) — regular weight, generous line-height, never tracked.
**Label/Mono Font:** Courier New — used exclusively for uppercase meta-labels at extreme letter-spacing.

**Character:** A single sans family carrying both display and body, with weight + size + tracking doing all the hierarchy work. Mono appears as a deliberate counter-voice on labels — terminal-adjacent without being terminal-cosplay.

### Hierarchy

- **Display** (900, `clamp(3rem, 8vw, 7.5rem)`, line-height 0.9, tracking `-0.04em`): Hero only. Often broken letter-by-letter for kinetic entry.
- **Headline** (900, `clamp(2rem, 4vw, 3.5rem)`, line-height 1, tracking `-0.03em`): Section openers. UPPERCASE.
- **Title** (600, `1.25rem`, line-height 1.3): Card titles, project names. Sentence case.
- **Body** (400, `1rem`, line-height 1.6): Default reading text. Cap line length at 65–75ch.
- **Label** (Courier New 500, `0.625rem`, line-height 1, tracking `0.28em`, UPPERCASE): Meta-labels (`AI / DATA / OPS`), section eyebrows, status pings. Always violet-300 (`#c4b5fd`) at 70% opacity.

### Named Rules

**The Heavy-and-Tight Rule.** Display weight is 900, never 700. Display tracking is `-0.04em`, never default. Anything lighter or looser at hero scale reads as a different brand.

**The Mono-Label Rule.** Mono is reserved for labels at `≥0.25em` letter-spacing in UPPERCASE. Never used for body, never for headlines. It is a status-indicator typeface in this system, not a code-display typeface.

**The No-Gradient-Text Rule.** `background-clip: text` combined with a gradient is forbidden by name. Emphasis comes from weight (400 → 900) and size (1rem → 7.5rem), not from rainbow.

## 4. Elevation

The system is **flat by default** with one signature treatment: violet aurora glow as ambient state. There are no rest-state shadows on cards, buttons, or sections — depth is conveyed through tonal stepping (Midnight Deep → Ink) and motion (parallax, scroll-tied opacity), not box-shadow.

### Shadow Vocabulary

- **Ambient Violet Glow** (`box-shadow: 0 0 18px rgba(139, 92, 246, 0.6)`): Used only on live-status indicators — pulse dots, currently-active nav pills, hover state on the primary CTA. A signal that something is *running*, not a decoration.
- **Brutalist Hard-Shadow** (`box-shadow: 8px 8px 0px 0px var(--shadow-color)`): Reserved for legacy sections only (kept for the few brutalism-styled elements in `_backup/`). Not for new components.

### Named Rules

**The Flat-By-Default Rule.** New components ship with no `box-shadow` at rest. Shadows appear only as a response to state — hover, active, focus, or "live."

**The Aurora Is Color, Not Shadow Rule.** The large blurred violet/fuchsia orbs in hero and reel sections are *backgrounds tinted by blur*, not elevation cues. They live behind content, never under it as elevation.

## 5. Components

### Buttons

- **Shape:** Pill (`9999px`).
- **Primary:** White (`#ffffff`) background, Midnight Deep (`#020617`) text, padding `12px 28px`. Hover: background shifts to Violet Signal, text stays Midnight Deep, no transform. Used once or twice per page max.
- **Ghost:** Transparent background, 1px violet/30 border, Violet Signal text. Hover: violet/10 background fill, Violet Signal → White text. The default action button on dark sections.
- **Magnetic behavior:** Primary CTAs bind to cursor proximity within `~80px` and translate up to `~12px` toward the cursor on a spring curve. Disabled under `prefers-reduced-motion`.

### Chips / Meta-pills

- **Style:** Violet-glow background (`rgba(76, 29, 149, 0.08)`), Violet Signal text, 1px violet/20 border, pill radius. Optional leading 1.5px violet dot with `animate-pulse`.
- **Use:** Section eyebrows ("AI / DATA / EXEC"), project badges ("Lecture Insight"), status indicators ("LIVE").

### Cards / Section Containers

- **Corner Style:** `12px` (lg) on cards, `0` on full-bleed sections.
- **Background:** Midnight Deep with optional Border Faint (`rgba(255,255,255,0.05)`) hairline.
- **Shadow Strategy:** None at rest. Hover: border lightens to `rgba(255,255,255,0.15)`, no shadow.
- **Internal Padding:** Variable — `24px` on dense cards, `48px` on hero cards, `32px` default. Identical padding across all cards is forbidden (see The Variation Rule below).

### Inputs / Fields

- **Style:** Transparent background, 1px Border Faint stroke at rest, pill or `8px` radius depending on context, Slate Body text, Slate Mute placeholder.
- **Focus:** Outline `2px solid rgba(167, 139, 250, 0.9)` (Violet Signal at 90% alpha), `3px` outline-offset, `4px` outline-radius. The same focus ring used on every interactive element site-wide for consistency.

### Navigation

- **Top nav:** Fixed pill-shaped scroll-aware container, dark glass over Midnight Deep with `~12% opacity` and minimal blur. Active section pill fills with `rgba(167, 139, 250, 0.10)` background and Violet Signal border. Scroll progress bar at top — 1px tall, Violet Signal fill.
- **Mobile:** Full-screen overlay opens from a hamburger; same pill treatment for items.

### Signature Component: The Cinematic Reel Frame

A 16:9 letterboxed black frame with 5% inner padding, no border at rest. Plays a Remotion-rendered loop (or live canvas) inside. Captions overlay in the bottom-left corner using the Label style. Replaces the bar-chart-and-card cliché in body sections — what would normally be "a chart" is "a small running film" with the same data conveyed kinetically.

## 6. Do's and Don'ts

### Do:
- **Do** use Midnight Deep (`#020617`) as the canonical dark surface — never `#000`.
- **Do** keep Violet Signal under 10% of any screen by visual area. Rarity is the design.
- **Do** vary section padding deliberately (96px / 8rem / custom). Identical padding is monotony.
- **Do** pair every Violet Signal cue with size or weight contrast, so color blindness doesn't lose the meaning.
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
