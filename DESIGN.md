---
name: Wutcharin Portfolio
description: Kinetic executive portfolio for an AI/data leader — black surface, white signal, motion as medium.
colors:
  black: "#050505"
  pure-black: "#000000"
  void: "#000000"
  veil: "#050505c7"
  veil-soft: "#0505058c"
  white-signal: "#fafafa"
  grey-deep: "#a3a3a3"
  grey-glow: "#262626"
  cyan-pulse: "#22d3ee"
  fuchsia-flare: "#e879f9"
  grey-body: "#d4d4d4"
  grey-mute: "#a3a3a3"
  white-pure: "#ffffff"
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
    backgroundColor: "{colors.white-pure}"
    textColor: "{colors.black}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "{colors.white-signal}"
    textColor: "{colors.black}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.white-signal}"
    rounded: "{rounded.pill}"
    padding: "12px 28px"
  button-ghost-hover:
    backgroundColor: "{colors.grey-deep}"
    textColor: "{colors.white-pure}"
  chip-meta:
    backgroundColor: "{colors.grey-glow}"
    textColor: "{colors.white-signal}"
    rounded: "{rounded.pill}"
    padding: "6px 16px"
  card-section:
    backgroundColor: "{colors.black}"
    textColor: "{colors.grey-body}"
    rounded: "{rounded.lg}"
    padding: "32px"
---

# Design System: Wutcharin Portfolio

## 1. Overview

**Creative North Star: "The Black Console"**

A late-night operations room running fintech at scale. The surface is black by design — visitors arrive into a dark room where motion is the only ambient signal, and every lit element is doing real work. The palette is black and white: white carries focus, status, and intent (black does on the light theme), and the home page uses no hue. Cyan and fuchsia appear sparingly, only on artifacts that already earned their own identity (specific projects, specific lectures). The interface is technical without being cyberpunk, kinetic without being maximalist, confident without bragging — it shows the work of an Associate Director who has spent twenty years inside data-and-automation org charts.

The system explicitly rejects four neighbors: the LinkedIn-blue corporate-resume default; the SaaS landing-page hero-metric template; the AI-slop dev-portfolio palette of glassmorphism and rainbow-gradient text; and the crypto/web3 neon-on-black maximalism. Each of those is what a generic AI tool would produce given the same brief. The Black Console is what an executive who builds AI tools produces instead.

Density is variable, never uniform: hero sections breathe, body sections compress, a single project card gets twice the screen real estate of its neighbors. Every motion layer is intentional — adding one means retiring another (Principle 3).

**Key Characteristics:**
- Black `#050505` surface with white as the single signal; black on the light theme
- Variable section rhythm (96px → 8rem → custom) — never uniform padding everywhere
- Mono-cased labels at `0.28em` letter-spacing carrying state, status, and meta-context
- Type breaks letter-by-letter on hero, lands solid in body — kinetic at entry, settled in content
- Pre-rendered Remotion video replaces runtime particle systems where it wins on perf

## 2. Colors: The Black Console Palette

A dark operator's room in black and white, two cool accents reserved for identity, and three neutral greys for hierarchy.

### Primary

- **Black** (`#050505`): The room itself. The default surface for every section, every page, every modal.
- **White Signal** (`#fafafa`): The single accent: focus, status pings, link hover, the serif italic. It differs from body text by brightness and face. On the light theme the signal is black (`#000000`).
- **Grey Deep** (`#a3a3a3`) / **Grey Glow** (`#262626`): The ambient aurora glow behind each chapter's subject, pressed states, tints, the scrollbar.

### Secondary

- **Cyan Pulse** (`#22d3ee`): Reserved for projects in the *Lecture Insight* and *Data Story* identity bands (per-card accent). Never used as a global accent.
- **Fuchsia Flare** (`#e879f9`): Reserved for specific projects flagged as bold/experimental (AI Evolution Stats, etc.). Never paired with Cyan Pulse on the same surface.

### Neutral

- **Pure Black** (`#000000`): Section breaks and the floor under full-WebGL chapters, a tonal step below Black.
- **Veil** (`rgba(5,5,5,0.78)`) / **Veil Soft** (`rgba(5,5,5,0.55)`): The panel tokens between the live particle field and reading text. Solid rgba, not backdrop-blur, by default.
- **Grey Body** (`#d4d4d4`): Default body text on Black.
- **Grey Mute** (`#a3a3a3`): Secondary text, captions, meta. About 8:1 on Black.
- **White Pure** (`#ffffff`): The most important typographic weight on a surface, and the primary button.
- **Border Faint** (`rgba(255,255,255,0.05)`): The only horizontal divider in the system.

The light theme ("Daylight Console") inverts it: `#f5f5f5` surface, `#404040` body, `#6b6b6b` mute, black signal.

### Named Rules

**The No-Hue Rule.** The home page is black and white. Color appears only as a project's own identity, on that project. Signal white marks one live thing at a time; large areas stay black.

**The Identity Lane Rule.** Cyan Pulse and Fuchsia Flare belong to *specific named artifacts* — they are project identities, not global colors. A new section may not adopt them as accents; only a new project with a defined identity may.

**The Token Rule.** Black and white come from tokens (`--color-bg`, `--color-text-strong`, `--color-signal`), never raw hex in components, so the light theme can flip them.

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
- **Label** (JetBrains Mono 500, `0.6875rem`, line-height 1, tracking `0.28em`, UPPERCASE): Meta-labels (`AI / DATA / OPS`), section eyebrows, status pings. In Grey Mute, or White Signal when it carries state.

### Named Rules

**The Display-Voice Rule.** Display is Clash 600 tight (`-0.02em`), mixed case, never uppercase. Clash at 600 reads heavier than Helvetica at 900; anything looser at hero scale reads as a different brand.

**The Serif-Interrupt Rule.** Instrument Serif appears only in italic, only on one or two words per lockup or a standalone quote. It marks the human exception inside the engineered pattern. A full serif headline is forbidden.

**The Mono-Label Rule.** Mono is reserved for labels at `≥0.25em` letter-spacing in UPPERCASE. Never used for body, never for headlines. It is a status-indicator typeface in this system, not a code-display typeface.

**The No-Gradient-Text Rule.** `background-clip: text` combined with a gradient is forbidden by name. Emphasis comes from weight (400 → 900) and size (1rem → 7.5rem), not from rainbow.

## 4. Elevation

The system is **flat by default** with one signature treatment: a soft grey aurora glow as ambient state. There are no rest-state shadows on cards, buttons, or sections — depth is conveyed through tonal stepping (Black → Pure Black) and motion (parallax, scroll-tied opacity), not box-shadow.

### Shadow Vocabulary

- **Ambient White Glow** (`box-shadow: 0 0 18px rgba(255, 255, 255, 0.4)`): Used only on live-status indicators — pulse dots, currently-active nav pills, hover state on the primary CTA. A signal that something is *running*, not a decoration.
- **Brutalist Hard-Shadow** (`box-shadow: 8px 8px 0px 0px var(--shadow-color)`): Reserved for legacy sections only (kept for the few brutalism-styled elements in `_backup/`). Not for new components.

### Named Rules

**The Flat-By-Default Rule.** New components ship with no `box-shadow` at rest. Shadows appear only as a response to state — hover, active, focus, or "live."

**The Aurora Is Color, Not Shadow Rule.** The large blurred glows in hero and reel sections are *backgrounds tinted by blur*, not elevation cues. They live behind content, never under it as elevation.

## 5. Components

### Buttons

- **Shape:** Pill (`9999px`).
- **Primary:** White (`#ffffff`) background, Black text, padding `12px 28px`. Hover: background shifts to Grey Body, no transform. Used once or twice per page max.
- **Ghost:** Transparent background, 1px signal/30 border, White Signal text. Hover: signal/10 background fill. The default action button on dark sections.
- **Magnetic behavior:** Primary CTAs bind to cursor proximity within `~80px` and translate up to `~12px` toward the cursor on a spring curve. Disabled under `prefers-reduced-motion`.

### Chips / Meta-pills

- **Style:** Hairline border, pill radius, mono label. Optional leading 1.5px white dot with `animate-pulse`.
- **Use:** Section eyebrows ("AI / DATA / EXEC"), project badges ("Lecture Insight"), status indicators ("LIVE").

### Cards / Section Containers

- **Corner Style:** `12px` (lg) on cards, `0` on full-bleed sections.
- **Background:** Black with optional Border Faint (`rgba(255,255,255,0.05)`) hairline.
- **Shadow Strategy:** None at rest. Hover: border lightens to `rgba(255,255,255,0.15)`, no shadow.
- **Internal Padding:** Variable — `24px` on dense cards, `48px` on hero cards, `32px` default. Identical padding across all cards is forbidden (see The Variation Rule below).

### Inputs / Fields

- **Style:** Transparent background, 1px Border Faint stroke at rest, pill or `8px` radius depending on context, Slate Body text, Slate Mute placeholder.
- **Focus:** Outline `2px` in the signal colour at 90% (white, or black on the light theme), `3px` outline-offset, `4px` outline-radius. The same focus ring used on every interactive element site-wide for consistency.

### Navigation

- **Top nav:** Fixed pill-shaped scroll-aware container, dark glass over Black with `~12% opacity` and minimal blur. Active section pill fills with a faint panel tint. Scroll progress bar at top — 1px tall, signal fill.
- **Mobile:** Full-screen overlay opens from a hamburger; same pill treatment for items.

### Home Atmosphere

One fixed layer between the particle field and the page (`home/Atmosphere.tsx`). A soft grey aurora travels to where each chapter's subject sits (behind the portrait, behind the numeral, under the address), a faint lamp follows the cursor on pointer devices, and a fine grain gives the black a surface. Transform and opacity only. The aurora is a feeling, not a foreground: it stays outside the 10% Rule's count only while it stays this dim.

### Product Simulations (Work chapter)

The four featured products (Pidngod, SplitBill AI, Jongtoh, Klikr) each have a small, playable 3D simulation of what the product does (`home/work/sims/`). Black and white only: objects are solids in the fill tone with hairline outlines in ink, paper is the lightest surface, and light (an emissive glow, a spotlight cone) marks what just happened. Every simulation is driven by real buttons in its DOM controls, so it works by tap, keyboard and screen reader; the canvas is decoration. Data is honest: Pidngod runs the product's real check engine on its 18 sample documents, and simulations with scripted content say so in their label. Desktop pins the chapter with one stage beside the copy; phones mount each simulation only while it is on screen. The particle field rests while the simulations play (one canvas drawing at a time), and reduced-motion or no-WebGL visitors get the static posters.

### Rise Headings

Chapter headings on the home page lift word by word out of their baseline the first time they enter view (`home/Rise.tsx`). The mask is a `clip-path`, so Clash and the serif accent keep one baseline. Under reduced motion they render in place.

### Type Interlude

One band of oversized Clash between the project index and the career path (`home/Interlude.tsx`): two rows, lit and ghost words alternating, moved only by the scroll. Ghost words are a low-alpha fill, never an outline. One per page.

### Signature Component: The Cinematic Reel Frame

A 16:9 letterboxed black frame with 5% inner padding, no border at rest. Plays a Remotion-rendered loop (or live canvas) inside. Captions overlay in the bottom-left corner using the Label style. Replaces the bar-chart-and-card cliché in body sections — what would normally be "a chart" is "a small running film" with the same data conveyed kinetically.

## 6. Do's and Don'ts

### Do:
- **Do** use Black (`#050505`) from the tokens as the canonical dark surface.
- **Do** keep the home page black and white. Project hues stay on their projects.
- **Do** vary section padding deliberately (96px / 8rem / custom). Identical padding is monotony.
- **Do** pair every signal cue with size, weight or face contrast; brightness alone is a weak cue.
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
- **Don't** hardcode black or white in components. Use the tokens so both themes work.
