import { useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Check, Copy } from 'lucide-react';
import { MagneticButton, RevealOnScroll } from '../../lib/motion';
import ChapterLabel from './ChapterLabel';
import { addressScene } from './scenes';
import { useChapterScene } from './useChapterScene';
import { useBangkokTime } from './useBangkokTime';
import { EMAIL, INTRO_MAILTO, LINKEDIN, GITHUB, RESUME, copyEmail } from './contact';
import { openIntro } from '../intro/introBus';
import Rise from './Rise';

const terminusScene = () => addressScene(EMAIL);

/**
 * Chapter 05: Connect. The field converges one last time, into the address
 * itself. The real controls sit below it: copy is the fast path, mail the
 * considered one.
 */
export default function Terminus() {
    const ref = useRef<HTMLElement>(null);
    const { sceneOff } = useChapterScene(ref, terminusScene);
    const [copied, setCopied] = useState(false);
    const time = useBangkokTime();

    const onCopy = async () => {
        if (await copyEmail()) {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2200);
        } else {
            // Clipboard blocked: the intro panel has every other route.
            openIntro();
        }
    };

    return (
        <section ref={ref} id="contact" aria-label="Contact" className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 md:px-10">
            <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-between pb-10 pt-chapter text-center">
                <RevealOnScroll staggerChildren={0.1} className="flex flex-col items-center">
                    <div data-reveal-child>
                        <ChapterLabel index="05" name="Connect" className="mb-8" />
                    </div>
                    <Rise
                        className="text-5xl leading-[0.9] tracking-[-0.03em] text-text-strong md:text-7xl lg:text-8xl"
                        parts={['Let\u2019s build', { text: 'the signal.', accent: true, line: true }]}
                    />
                    <p data-reveal-child className="mx-auto mt-8 max-w-xl text-base font-light leading-relaxed text-text-mute md:text-lg">
                        Tell me what you need built: an AI program, a data team, or a working prototype by Friday.
                    </p>
                </RevealOnScroll>

                {/* The stage where the particles spell the address. */}
                <div className={sceneOff ? 'py-10' : 'min-h-[24vh] flex-1'} aria-hidden={!sceneOff}>
                    {sceneOff && (
                        <p className="whitespace-nowrap font-display text-[clamp(1.25rem,6.6vw,1.875rem)] font-semibold tracking-[-0.02em] text-text-strong md:text-6xl">{EMAIL}</p>
                    )}
                </div>

                <div className="flex w-full flex-col items-center gap-10">
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <MagneticButton
                            as="button"
                            type="button"
                            onClick={onCopy}
                            className="group inline-flex items-center gap-3 rounded-full bg-text-strong px-8 py-4 text-sm font-medium tracking-wide text-bg transition-colors hover:bg-signal"
                            data-cursor="copy"
                            aria-label={`Copy email address ${EMAIL}`}
                        >
                            <span className="flex items-center gap-3">
                                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                                <span className="font-mono text-xs uppercase tracking-[0.2em]">{copied ? 'Copied' : EMAIL}</span>
                            </span>
                        </MagneticButton>
                        <a
                            href={INTRO_MAILTO}
                            onClick={(e) => {
                                e.preventDefault();
                                openIntro();
                            }}
                            aria-haspopup="dialog"
                            className="inline-flex items-center gap-2 rounded-full border border-signal/30 px-7 py-4 text-sm font-medium text-signal transition-colors hover:bg-signal/10 hover:text-text-strong"
                        >
                            Write an intro <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                        <span role="status" className="sr-only">
                            {copied ? 'Email address copied to clipboard' : ''}
                        </span>
                    </div>

                    <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.28em]">
                        <li>
                            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-text-mute transition-colors hover:text-text-strong">
                                LinkedIn ↗
                            </a>
                        </li>
                        <li>
                            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="text-text-mute transition-colors hover:text-text-strong">
                                GitHub ↗
                            </a>
                        </li>
                        <li>
                            <a href={RESUME} download="Wutcharin_Thatan_Resume.pdf" className="inline-flex items-center gap-1 text-text-mute transition-colors hover:text-text-strong">
                                Résumé <ArrowDown className="h-3 w-3" aria-hidden="true" />
                            </a>
                        </li>
                    </ul>

                    <footer className="flex w-full flex-col items-center justify-between gap-3 border-t border-hairline pt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-text-mute sm:flex-row">
                        <span>© {new Date().getFullYear()} Wutcharin Thatan</span>
                        <span className="tabular-nums">
                            Bangkok <span className="text-text-strong">{time}</span> · ICT (UTC+7)
                        </span>
                        <span>Signal over noise</span>
                    </footer>
                </div>
            </div>
        </section>
    );
}
