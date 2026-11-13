/**
 * Pre-rendered hero backdrop: a 15 s seamless loop. Noise ("too many manual
 * steps") is cut to one signal, the signal branches into agents, one branch
 * goes to a person, and everything closes into a ring: shipped.
 * Line work and type are HyperFrames; the ring is Blender (video/hero-reel/).
 *
 * Decorative: muted, looped, hidden from assistive tech. The film is drawn
 * on the site's midnight, so `lighten` melts its edges into the dark page.
 * On the light theme it is inverted (hue kept) and multiplied into the page.
 */
export default function HeroReel() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-14 z-10 h-[46svh] md:inset-0 md:top-0 md:h-auto"
        >
            <video
                className="hero-reel h-full w-full object-contain md:object-cover md:object-[70%_50%]"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/video/hero-reel-poster.jpg"
            >
                <source media="(max-width: 767px)" src="/video/hero-reel-mobile.mp4" type="video/mp4" />
                <source src="/video/hero-reel.webm" type="video/webm" />
                <source src="/video/hero-reel.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
