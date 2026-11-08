"""Build a subject-only particle density map from the illustrated portrait.

Usage: python3 -I scripts/build_portrait_density.py public/portrait.jpg public/scene/portrait-density.png /tmp/preview.png

Background = low-saturation light/gray pixels connected to the top/left/right
borders. Everything else is subject. Density favours light subject areas
(skin, shirt) plus edges, with a floor so the dark suit silhouette reads.
"""
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

src, out, preview = sys.argv[1:4]
N = 200
im = Image.open(src).convert('RGB').resize((N, N), Image.LANCZOS)
a = np.asarray(im).astype(np.float32) / 255.0
r, g, b = a[..., 0], a[..., 1], a[..., 2]
mx, mn = a.max(-1), a.min(-1)
lum = 0.299 * r + 0.587 * g + 0.114 * b
sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)

bgish = (sat < 0.16) & (lum > 0.42)
H, W = bgish.shape
yy, xx = np.mgrid[0:H, 0:W]
# Shirt guard: the white shirt touches the collar; keep flood out of the chest.
bgish &= ~((yy > H * 0.52) & (xx > W * 0.34) & (xx < W * 0.70))
seen = np.zeros_like(bgish)
q = deque()
for x in range(W):
    if bgish[0, x]:
        q.append((0, x)); seen[0, x] = True
for y in range(H):
    for x in (0, W - 1):
        if bgish[y, x] and not seen[y, x]:
            q.append((y, x)); seen[y, x] = True
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < H and 0 <= nx < W and not seen[ny, nx] and bgish[ny, nx]:
            seen[ny, nx] = True
            q.append((ny, nx))

subject = ~seen
# Clean speckle: majority filter via PIL.
m = Image.fromarray((subject * 255).astype(np.uint8)).filter(ImageFilter.ModeFilter(7))
subject = np.asarray(m) > 127

gray = Image.fromarray((lum * 255).astype(np.uint8))
edges = np.asarray(gray.filter(ImageFilter.FIND_EDGES)).astype(np.float32) / 255.0
edges = np.clip(edges * 2.2, 0, 1)

dens = 0.06 + 0.95 * lum ** 2.2 + 0.35 * edges
dens = np.clip(dens, 0, 1) * subject
# Soft fade at bottom so the torso dissolves rather than ending on a hard edge.
fade = np.clip((H - 1 - np.arange(H)) / (H * 0.22), 0, 1)[:, None]
dens = dens * (0.25 + 0.75 * fade)

Image.fromarray((dens * 255).astype(np.uint8)).save(out, optimize=True)

# Preview: sample 20k points by density, draw dots on midnight.
rng = np.random.default_rng(1)
flat = dens.ravel() / dens.sum()
idx = rng.choice(flat.size, 20000, p=flat)
ys, xs = np.divmod(idx, W)
P = 600
canvas = np.zeros((P, P, 3), np.float32)
canvas[:] = (2 / 255, 6 / 255, 23 / 255)
for y, x in zip(ys, xs):
    py = int((y + rng.random()) * P / H); px = int((x + rng.random()) * P / W)
    canvas[max(0, py - 1):py + 1, max(0, px - 1):px + 1] += (0.25, 0.2, 0.4)
Image.fromarray((np.clip(canvas, 0, 1) * 255).astype(np.uint8)).save(preview)
print('subject fraction', subject.mean())
