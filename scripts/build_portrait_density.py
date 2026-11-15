"""Build the hero's particle density maps from a portrait photo.

Two maps, one per theme, both inside the subject only:
  light map (dark theme)  particles glow where the photo is light, like light
                          on a dark stage: public/scene/portrait-density.png
  ink map (light theme)   dark specks gather where the photo is dark, like a
                          pencil stipple on paper: public/scene/portrait-ink.png
Drawing one map for both themes would show the light theme a negative.

Usage (run from the repo root; the photo and its mask stay out of the repo):

    python3 -I scripts/build_portrait_density.py PHOTO MASK public/scene/portrait-density.png public/scene/portrait-ink.png [preview.png]

PHOTO  the portrait photo (any size)
MASK   a subject mask of the same size: white = person, black = background.
       Made with rembg's person model:
           pip install "rembg[cpu]"
           rembg i -m u2net_human_seg -om PHOTO MASK

The crop is head to mid-chest, with the face about a third of the frame wide,
which is what the hero and the phone layout are framed for. Tune CROP and FACE
below for a new photo: CROP is (left, top, side) in photo pixels (top may be
negative to pad); FACE is the centre of the face in photo pixels.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

N = 256  # map resolution: about one map pixel per particle in the face
CROP = (62, -24, 452)
FACE = (282, 140)  # centre of the face in photo pixels, for the face weighting

photo, mask_path, out, out_ink = sys.argv[1:5]
preview = sys.argv[5] if len(sys.argv) > 5 else None


def crop(img: Image.Image, fill) -> Image.Image:
    left, top, side = CROP
    canvas = Image.new(img.mode, (side, side), fill)
    canvas.paste(img, (-left, -top))
    return canvas.resize((N, N), Image.LANCZOS)


rgb = crop(Image.open(photo).convert('RGB'), (0, 0, 0))
mask = crop(Image.open(mask_path).convert('L'), 0)

a = np.asarray(rgb).astype(np.float32) / 255.0
lum = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
m = np.asarray(mask.filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32) / 255.0
subject = m > 0.5

# Stretch the subject's tones to the full range (ignore the background).
lo, hi = np.percentile(lum[subject], [2, 99.5])
t = np.clip((lum - lo) / max(hi - lo, 1e-6), 0, 1)

# Local detail: what differs from its surroundings (eyes, brows, mouth, lapels).
L = Image.fromarray((t * 255).astype(np.uint8))
blur = np.asarray(L.filter(ImageFilter.GaussianBlur(3))).astype(np.float32) / 255.0
detail = np.clip(np.abs(t - blur) * 3.2, 0, 1)
# Local contrast so the features read at phone size: a broad pass for the
# planes of the face, and a fine pass that only darkens (eyes, brows, the
# line of the mouth), so no feature gets a bright halo.
blur_fine = np.asarray(L.filter(ImageFilter.GaussianBlur(1.6))).astype(np.float32) / 255.0
t = np.clip(t + (t - blur) * 0.6 + np.minimum(t - blur_fine, 0) * 1.4, 0, 1)

# Light carries the image, with a steep curve so dark cloth stays nearly
# empty and the particles go to the face and shirt. The figure keeps its
# shape through a thin outline and the detail term (lapels, collar, hair),
# not through a filled floor, which would spend thousands of particles on
# a dark suit.
fx, fy = (FACE[0] - CROP[0]) / CROP[2], (FACE[1] - CROP[1]) / CROP[2]
yy, xx = np.mgrid[0:N, 0:N] / N
face = np.exp(-(((xx - fx) / 0.22) ** 2 + ((yy - fy) / 0.25) ** 2))
edge = np.asarray(mask.filter(ImageFilter.FIND_EDGES)).astype(np.float32) / 255.0
edge = np.asarray(Image.fromarray((np.clip(edge * 2, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32) / 255.0
dens = 0.018 + 0.95 * t ** 2.1 + 0.3 * detail + 0.55 * np.clip(edge * 1.6, 0, 1)

# The face is what people look for: weight the head over the body, and keep
# the big white shirt from taking the particles the face needs.
dens *= 0.65 + 0.7 * face
dens = np.minimum(dens, 0.7 + 0.3 * face)

# Edge of the figure, soft; and the torso dissolves toward the bottom.
dens *= np.clip(m * 1.15, 0, 1)
fade = np.clip((N - 1 - np.arange(N)) / (N * 0.24), 0, 1)[:, None]
dens *= 0.2 + 0.8 * fade
dens = np.clip(dens, 0, 1)

Image.fromarray((dens * 255).astype(np.uint8), 'L').save(out, optimize=True)
print(f'wrote {out} ({N}x{N}), subject coverage {subject.mean():.2f}, mean {dens.mean():.3f}')

# Ink: darkness carries the image. Hair, brows, eyes and the mouth line are
# dense; skin and shirt are left as paper. The suit is dark too, so it gets
# a capped, lighter fill and its edges, or it would take most of the specks.
dark = 1 - t
dark_detail = np.clip((blur - t) * 3.2, 0, 1)
ink = 0.012 + 0.9 * dark ** 2.4 + 0.35 * dark_detail + 0.5 * np.clip(edge * 1.6, 0, 1)
ink *= 0.55 + 0.8 * face
ink = np.minimum(ink, 0.32 + 0.68 * face)
ink *= np.clip(m * 1.15, 0, 1)
ink *= 0.2 + 0.8 * fade
ink = np.clip(ink, 0, 1)
Image.fromarray((ink * 255).astype(np.uint8), 'L').save(out_ink, optimize=True)
print(f'wrote {out_ink} ({N}x{N}), mean {ink.mean():.3f}')


def render(density: np.ndarray, count: int, px: int, seed: int = 7) -> Image.Image:
    """A rough preview: stratified samples drawn as soft white dots on black."""
    rng = np.random.default_rng(seed)
    flat = density.ravel().astype(np.float64)
    cdf = np.cumsum(flat)
    targets = (np.arange(count) + rng.random(count)) / count * cdf[-1]
    idx = np.searchsorted(cdf, targets)
    x = (idx % N + rng.random(count)) / N * px
    y = (idx // N + rng.random(count)) / N * px
    img = np.zeros((px, px), np.float32)
    np.add.at(img, (np.clip(y.astype(int), 0, px - 1), np.clip(x.astype(int), 0, px - 1)), 0.55 + 0.45 * rng.random(count))
    pim = Image.fromarray(np.clip(img * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
    return Image.fromarray(np.clip(np.asarray(pim).astype(np.float32) * 1.8, 0, 255).astype(np.uint8))


if preview:
    # Light map as glowing dots on black; ink map as dark dots on paper.
    sheet = Image.new('L', (1210, 600), 40)
    sheet.paste(render(dens, 25600, 600), (0, 0))
    paper = Image.fromarray(255 - np.asarray(render(ink, 25600, 600)))
    sheet.paste(paper, (610, 0))
    sheet.save(preview)
