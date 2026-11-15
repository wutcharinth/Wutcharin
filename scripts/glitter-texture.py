"""Tileable glitter tile for the Sparkled Graphite surface (public/textures/glitter.webp).

White specks on black, 384 px, seed 7. Run: python3 scripts/glitter-texture.py out.png 384,
then convert to lossless WebP (Pillow: Image.open(p).save(q, lossless=True, method=6)).
"""
import sys, numpy as np
from PIL import Image

def gaussian_filter(a, sigma, mode='wrap'):
    # Periodic Gaussian blur via FFT, so the tile wraps seamlessly.
    fy = np.fft.fftfreq(a.shape[0])[:, None]; fx = np.fft.fftfreq(a.shape[1])[None, :]
    k = np.exp(-2 * (np.pi * sigma) ** 2 * (fx ** 2 + fy ** 2))
    return np.real(np.fft.ifft2(np.fft.fft2(a) * k))
N = int(sys.argv[2]) if len(sys.argv) > 2 else 384
rng = np.random.default_rng(7)
n = gaussian_filter(rng.random((N, N)), 0.65, mode='wrap')
n = (n - n.mean()) / n.std()
grain = np.clip((n - 0.35) / 2.2, 0, 1) ** 1.35          # dense, mostly dim specks
g = np.zeros((N, N)); idx = rng.random((N, N)) < 0.0022  # rare glints
g[idx] = rng.uniform(0.55, 1.0, idx.sum())
g = np.maximum(g, gaussian_filter(g, 0.8, mode='wrap') * 2.2)
img = np.clip(grain * 0.85 + g, 0, 1)
q = np.round(img * 15) / 15                                # 16 levels: compresses well
Image.fromarray((q * 255).astype(np.uint8), 'L').save(sys.argv[1], optimize=True)
print('coverage', (q > 0.05).mean().round(3), 'mean', q.mean().round(3))
