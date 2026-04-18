import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { MagneticButton, SplitText, gsap } from '../../lib/motion';

interface SubPageHeroProps {
    /** Small text badge (e.g. "Data Storytelling") */
    badgeLabel: string;
    BadgeIcon?: LucideIcon;
    /** The main title. First word(s) white, gradient word/line appended after a line break. */
    titleLead: string;
    titleAccent: string;
    /** Description paragraph */
    description: ReactNode;
    /** Accent color used for the aurora glow, CTAs, gradient, and borders (hex/rgb) */
    accentColor: string;
    /** Secondary accent for the gradient (optional — defaults to lighter variant) */
    accentColor2?: string;
    /** Primary CTA — use anchor href (#demo) or external URL */
    primaryCta?: { label: string; href: string; icon?: LucideIcon; external?: boolean };
    /** Secondary CTA */
    secondaryCta?: { label: string; href: string; icon?: LucideIcon; external?: boolean };
    /** Section number shown in the corner meta (e.g. "01") */
    index?: string;
}

/**
 * Consistent cinematic hero for every project sub-page:
 *   • Mouse-parallaxed aurora glow
 *   • Kinetic SplitText title with gradient accent word
 *   • Border-left description quote
 *   • Magnetic CTAs
 *   • Corner meta (section index, scroll hint)
 *   • Subtle scroll-based fade/parallax so it dissolves into the content below
 */
export default function SubPageHero({
    badgeLabel,
    BadgeIcon,
    titleLead,
    titleAccent,
    description,
    accentColor,
    accentColor2,
    primaryCta,
    secondaryCta,
    index = '01',
}: SubPageHeroProps) {
    const auroraRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const gradColor2 = accentColor2 || accentColor;

    const { scrollY } = useScroll();
    const parallaxY = useTransform(scrollY, [0, 500], [0, 100]);
    const fadeOpacity = useTransform(scrollY, [0, 400], [1, 0.2]);

    useEffect(() => {
        const el = auroraRef.current;
        if (!el) return;
        const onMove = (e: MouseEvent) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * 2;
            const ny = (e.clientY / window.innerHeight - 0.5) * 2;
            gsap.to(el, { x: nx * 18, y: ny * 18, duration: 0.8, ease: 'power2.out' });
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    return (
        <section ref={heroRef} className="relative overflow-hidden">
            {/* Aurora wash */}
            <div ref={auroraRef} className="pointer-events-none absolute inset-0 will-change-transform" aria-hidden="true">
                <div
                    className="absolute -top-24 right-[-10%] h-[44rem] w-[44rem] rounded-full blur-[140px]"
                    style={{ backgroundColor: accentColor, opacity: 0.18 }}
                />
                <div
                    className="absolute top-[30%] left-[-12%] h-[30rem] w-[30rem] rounded-full blur-[140px] animate-float-slow"
                    style={{ backgroundColor: gradColor2, opacity: 0.1 }}
                />
            </div>

            {/* Corner meta */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="hidden lg:flex absolute top-8 right-10 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 z-10"
            >
                <span className="h-px w-10 bg-white/20" />
                {index} / Project
            </motion.div>

            {/* Content */}
            <motion.div
                style={{ y: parallaxY, opacity: fadeOpacity }}
                className="relative max-w-7xl mx-auto px-6 pt-16 pb-28 lg:pt-20 lg:pb-32 will-change-transform"
            >
                <div className="max-w-4xl">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full border backdrop-blur-sm"
                        style={{ borderColor: `${accentColor}33`, backgroundColor: `${accentColor}10` }}
                    >
                        {BadgeIcon && <BadgeIcon className="w-3 h-3" style={{ color: accentColor }} />}
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em]" style={{ color: accentColor }}>
                            {badgeLabel}
                        </span>
                    </motion.div>

                    {/* Title */}
                    <div className="mb-8">
                        <SplitText
                            as="h1"
                            trigger="load"
                            mode="words"
                            stagger={0.06}
                            duration={1}
                            className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-[-0.03em] text-white leading-[0.95] block"
                        >
                            {titleLead}
                        </SplitText>
                        <SplitText
                            as="h1"
                            trigger="load"
                            mode="words"
                            stagger={0.06}
                            delay={0.2}
                            duration={1}
                            className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-[-0.03em] leading-[0.95] block mt-1"
                        >
                            {titleAccent}
                        </SplitText>
                        {/* Gradient underline under the accent word */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-6 h-[2px] w-32 origin-left"
                            style={{ background: `linear-gradient(90deg, ${accentColor}, ${gradColor2}, transparent)` }}
                        />
                    </div>

                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="max-w-2xl text-base md:text-lg text-slate-300 font-light leading-relaxed mb-12 pl-6 border-l"
                        style={{ borderColor: `${accentColor}66` }}
                    >
                        {description}
                    </motion.div>

                    {/* CTAs */}
                    {(primaryCta || secondaryCta) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4, duration: 0.8 }}
                            className="flex flex-wrap gap-3"
                        >
                            {primaryCta && <CtaButton {...primaryCta} primary accentColor={accentColor} />}
                            {secondaryCta && <CtaButton {...secondaryCta} accentColor={accentColor} />}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </section>
    );
}

function CtaButton({
    label,
    href,
    icon: Icon = ArrowRight,
    external,
    primary,
    accentColor,
}: {
    label: string;
    href: string;
    icon?: LucideIcon;
    external?: boolean;
    primary?: boolean;
    accentColor: string;
}) {
    const isHash = href.startsWith('#');
    const handleClick = (e: React.MouseEvent) => {
        if (isHash) {
            e.preventDefault();
            const id = href.slice(1);
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <MagneticButton
            as="a"
            href={href}
            onClick={handleClick}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className={`group relative px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-colors flex items-center gap-2 ${primary
                ? 'text-slate-950'
                : 'text-white border border-white/15 hover:bg-white/5'
                }`}
            data-cursor={primary ? 'view' : 'open'}
            style={primary ? { backgroundColor: '#fff' } : {
                // Outline CTA — accent-tinted hover handled by the border + hover:bg above
            }}
        >
            <Icon className="w-4 h-4" style={primary ? { color: accentColor } : undefined} />
            <span>{label}</span>
        </MagneticButton>
    );
}
