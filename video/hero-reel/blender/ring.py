"""Hero reel: the glossy ring that closes the film ("shipped.").

A thin torus with a clear-coated violet surface, turning slowly so the
highlights travel. Rendered on pure black so the composition can screen it
over the page's midnight.

    pip install bpy
    python ring.py --out frames_ring [--frames 0,40] [--res 720] [--samples 64]
"""
import argparse, math, os, sys
import bpy

p = argparse.ArgumentParser()
p.add_argument("--out", required=True)
p.add_argument("--res", type=int, default=720)
p.add_argument("--samples", type=int, default=64)
p.add_argument("--count", type=int, default=120)
p.add_argument("--frames", default="")
a = p.parse_args()
os.makedirs(a.out, exist_ok=True)


def srgb(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c]


bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "CYCLES"
sc.cycles.device = "CPU"
sc.cycles.samples = a.samples
sc.cycles.use_denoising = True
sc.render.resolution_x = sc.render.resolution_y = a.res
sc.render.image_settings.file_format = "PNG"
sc.view_settings.view_transform = "Standard"
w = bpy.data.worlds.new("W"); sc.world = w
w.use_nodes = True
w.node_tree.nodes["Background"].inputs[1].default_value = 0.0

bpy.ops.mesh.primitive_torus_add(major_radius=1.0, minor_radius=0.085, major_segments=256, minor_segments=48)
ring = bpy.context.object
bpy.ops.object.shade_smooth()
m = bpy.data.materials.new("Ring"); m.use_nodes = True
b = m.node_tree.nodes["Principled BSDF"]
b.inputs["Base Color"].default_value = (*srgb("#7c3aed"), 1)
b.inputs["Roughness"].default_value = 0.22
b.inputs["Metallic"].default_value = 0.0
b.inputs["Coat Weight"].default_value = 1.0
b.inputs["Coat Roughness"].default_value = 0.05
b.inputs["Emission Color"].default_value = (*srgb("#4c1d95"), 1)
b.inputs["Emission Strength"].default_value = 0.35
ring.data.materials.append(m)
ring.rotation_euler = (math.radians(90), 0, 0)
pivot = bpy.data.objects.new("Pivot", None)
sc.collection.objects.link(pivot)
ring.parent = pivot


def area(name, loc, rot, size, energy, color):
    d = bpy.data.lights.new(name, "AREA"); d.size = size; d.energy = energy; d.color = color
    o = bpy.data.objects.new(name, d); o.location = loc; o.rotation_euler = [math.radians(v) for v in rot]
    sc.collection.objects.link(o)


area("Key", (-2.2, -3.0, 2.6), (58, 0, -36), 3.0, 420, (1, 1, 1))
area("Violet", (2.8, -1.5, -2.0), (120, 0, 62), 4.0, 380, srgb("#a78bfa"))
area("Rim", (0.5, 3.0, 1.0), (-70, 0, 10), 3.0, 260, srgb("#c4b5fd"))
area("Cyan", (-3.0, -0.5, -2.4), (112, 0, -80), 2.0, 70, srgb("#22d3ee"))

cd = bpy.data.cameras.new("C"); cd.type = "ORTHO"; cd.ortho_scale = 2.9
cam = bpy.data.objects.new("C", cd); cam.location = (0, -6, 0); cam.rotation_euler = (math.radians(90), 0, 0)
sc.collection.objects.link(cam); sc.camera = cam

todo = [int(x) for x in a.frames.split(",")] if a.frames else range(a.count)
for f in todo:
    t = f / a.count
    # Face-on with a slow precession so the specular streaks travel around the ring.
    pivot.rotation_euler = (math.radians(14 * math.sin(2 * math.pi * t)), 0, math.radians(18 * math.cos(2 * math.pi * t)))
    sc.render.filepath = os.path.join(a.out, f"ring_{f:04d}.png")
    bpy.ops.render.render(write_still=True)
    print("FRAME", f, flush=True)
