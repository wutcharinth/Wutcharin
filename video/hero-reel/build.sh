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
    # Lift the render's black to the page's midnight so the ring sits on the composition without a seam.
    ffmpeg -v error -y -framerate 30 -i "$FRAMES/ring_%04d.png" -f lavfi -i "color=0x020617:s=640x640:r=30" \
      -filter_complex "[0]format=gbrp[a];[1]format=gbrp[b];[a][b]blend=all_mode=lighten:shortest=1,scale=out_color_matrix=bt709,format=yuv444p" \
      -c:v libx264 -crf 8 -preset slow -pix_fmt yuv420p $BT709 hyperframes/assets/ring.mp4
    ;;
  render)
    (cd hyperframes && npx --yes hyperframes@0.9.41 render -o renders/hero-reel-master.mp4 --fps 30 --quality high --crf 10)
    ;;
  web)
    mkdir -p "$PUB"
    X264="-c:v libx264 -preset slower -profile:v high -g 60 $BT709 -movflags +faststart"
    # Full frame (1920x1080): the stage sits right of centre, the left is empty midnight.
    ffmpeg -v error -y -i "$M" -an -vf "format=yuv420p" $X264 -crf 24 "$PUB/hero-reel.mp4"
    # Stage only (everything lives between x=620 and x=1860). This is what the site's hero plays.
    ffmpeg -v error -y -i "$M" -an -vf "crop=1240:1080:620:0,format=yuv420p" $X264 -crf 24 "$PUB/hero-reel-stage.mp4"
    ffmpeg -v error -y -i "$M" -an -vf "crop=1240:1080:620:0,scale=828:-2:flags=lanczos,format=yuv420p" $X264 -crf 25 "$PUB/hero-reel-mobile.mp4"
    # Poster: the branching moment.
    ffmpeg -v error -y -ss 9.6 -i "$PUB/hero-reel-stage.mp4" -frames:v 1 -q:v 3 "$PUB/hero-reel-stage-poster.jpg"
    ls -la "$PUB"
    ;;
  *) echo "usage: [FRAMES=dir] $0 ring|render|web"; exit 1 ;;
esac
