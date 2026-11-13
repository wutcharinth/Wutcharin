#!/usr/bin/env bash
# Hero reel pipeline: Blender (3D ring) -> HyperFrames (line animation, type, composite) -> web encodes.
#
#   python blender/ring.py --out "$FRAMES" --res 640 --samples 32     # pip install bpy; ~6 s per frame on 4 cores
#   FRAMES=/path/to/frames ./build.sh ring      # frames -> hyperframes/assets/ring.mp4
#   ./build.sh render                           # HyperFrames -> hyperframes/renders/hero-reel-master.mp4
#   ./build.sh web                              # encodes into public/video/
set -euo pipefail
cd "$(dirname "$0")"
PUB=../../public/video
BT709="-colorspace bt709 -color_primaries bt709 -color_trc bt709"
M=hyperframes/renders/hero-reel-master.mp4

case "${1:-}" in
  ring)
    ffmpeg -v error -y -framerate 30 -i "$FRAMES/ring_%04d.png" -vf "scale=out_color_matrix=bt709,format=yuv420p" \
      -c:v libx264 -crf 12 -preset slow $BT709 hyperframes/assets/ring.mp4
    ;;
  render)
    (cd hyperframes && npx --yes hyperframes@0.9.41 render -o renders/hero-reel-master.mp4 --fps 30 --quality high --crf 10)
    ;;
  web)
    mkdir -p "$PUB"
    X264="-c:v libx264 -preset slower -profile:v high -g 60 $BT709 -movflags +faststart"
    ffmpeg -v error -y -i "$M" -an -vf "format=yuv420p" $X264 -crf 24 "$PUB/hero-reel.mp4"
    ffmpeg -v error -y -i "$M" -an -vf "format=yuv420p" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -cpu-used 2 -g 60 $BT709 "$PUB/hero-reel.webm"
    # Phones: the stage only (everything lives between x=620 and x=1860), no empty left half.
    ffmpeg -v error -y -i "$M" -an -vf "crop=1240:1080:620:0,scale=828:-2:flags=lanczos,format=yuv420p" $X264 -crf 25 "$PUB/hero-reel-mobile.mp4"
    # Posters: the branching moment.
    ffmpeg -v error -y -ss 8.2 -i "$M" -frames:v 1 -q:v 3 "$PUB/hero-reel-poster.jpg"
    ffmpeg -v error -y -ss 8.2 -i "$PUB/hero-reel-mobile.mp4" -frames:v 1 -q:v 3 "$PUB/hero-reel-mobile-poster.jpg"
    ls -la "$PUB"
    ;;
  *) echo "usage: [FRAMES=dir] $0 ring|render|web"; exit 1 ;;
esac
