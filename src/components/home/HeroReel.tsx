/**
 * Pre-rendered hero film: a 15 s seamless loop. Noise ("too many manual
 * steps") is cut to one signal; the signal becomes code that checks off the
 * patterns and holds the exception for a person; the code branches into
 * agents; everything closes into a ring: shipped.
 * Line work and type are HyperFrames; the ring is Blender (video/hero-reel/).
 *
 * Decorative: muted, looped, hidden from assistive tech. The film is drawn
 * on the site's midnight, so `lighten` melts its edges into the dark page.
 * On the light theme it is inverted (hue kept) and multiplied into the page
 * (see `.hero-reel` in index.css).
 */
export default function HeroReel() {
    return (
        <div
            aria-hidden="true"
            className="hero-reel pointer-events-none absolute inset-x-0 top-14 z-10 h-[44svh] md:inset-x-auto md:right-0 md:top-1/2 md:h-auto md:w-[50vw] md:max-w-[980px] md:-translate-y-1/2"
        >
            <svg width="0" height="0" className="absolute">
                <filter id="hero-reel-paper" colorInterpolationFilters="sRGB">
                    <feComponentTransfer>
                        <feFuncR type="linear" slope="0.996" />
                        <feFuncG type="linear" slope="0.984" />
                        <feFuncB type="linear" slope="0.976" />
                    </feComponentTransfer>
                </filter>
            </svg>
            <video
                className="h-full w-full object-contain md:aspect-[1240/1080] md:h-auto"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/video/hero-reel-stage-poster.jpg"
            >
                <source media="(max-width: 767px)" src="/video/hero-reel-mobile.mp4" type="video/mp4" />
                <source src="/video/hero-reel-stage.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
