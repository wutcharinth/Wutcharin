# Hero reel

A 15-second seamless loop for the home hero.

## Story

1. **Noise.** One line, then "too many manual steps / spreadsheets" and a cloud of finance-ops fragments.
2. **Cut.** A flash clears it.
3. **One signal.** A violet point draws a line.
4. **Agents.** The line branches into labelled agents: reconciliation, collections, payout checks, month-end close, risk flags. One branch is "the exception", which goes to a person.
5. **Shipped.** Everything gathers into a glossy ring, then closes back to the opening line, so the last frame is the first.

## How it is made

| Part | Tool | Source |
|---|---|---|
| Line work, type, timing, composite | [HyperFrames](https://hyperframes.heygen.com) (HTML + GSAP) | `hyperframes/index.html` |
| Glossy 3D ring | Blender (Cycles, as the `bpy` Python module) | `blender/ring.py` |
| Web encodes | ffmpeg | `build.sh` |

Colours, fonts and label styles come from the site's dark theme (`src/index.css`): midnight `#020617`, violet `#a78bfa` / `#7c3aed`, Clash Display, JetBrains Mono. The stage is centred at (1250, 540) of 1920×1080, so the left of the frame stays empty for the headline.

## Rebuild

```bash
pip install bpy
python blender/ring.py --out /tmp/ring --res 640 --samples 32
```

```bash
FRAMES=/tmp/ring ./build.sh ring
```

```bash
./build.sh render
```

```bash
./build.sh web
```

`build.sh web` writes to `public/video/`:

- `hero-reel.webm`, `hero-reel.mp4`: 1920×1080
- `hero-reel-mobile.mp4`: the stage only, for phones
- posters for both

To check frames before rendering, run `npx hyperframes snapshot --at 2.2,8.2,11.8` inside `hyperframes/`.

## On the site

`src/components/home/HeroReel.tsx` plays the reel behind the hero. It is opt-in for now: add `?hero=reel` to the URL. That also turns off the live particle field, so only one motion layer runs. Visitors who prefer reduced motion never get the video.

On the light theme the video is inverted with its hue kept, and blended into the page (`.hero-reel` in `src/index.css`).
