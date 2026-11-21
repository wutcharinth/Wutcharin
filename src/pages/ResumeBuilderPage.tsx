import React, { useState, useRef, useEffect } from 'react';
import { Button, TextArea } from '../components/resume-builder/UI';
import { ResumeEditor } from '../components/resume-builder/ResumeEditor';
import { ResumePreview } from '../components/resume-builder/ResumePreview';
import { parseLinkedInProfile } from '../components/resume-builder/geminiService';
import { exportToWord } from '../components/resume-builder/wordExport';
import { exportToHTML } from '../components/resume-builder/htmlExport';
import { TemplateType, LayoutType, FontSize } from '../components/resume-builder/types';
import type { ResumeData, FontFamily } from '../components/resume-builder/types';
import { ArrowRight, Palette, Wand2, Layout, PanelLeft, PanelRight, RectangleVertical, Type, ZoomIn, ZoomOut, FileText, ArrowLeft, ChevronDown, Download, Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ThemeToggle from '../components/ThemeToggle';
import { openConsole } from '../components/console/consoleBus';
import { SectionHeader } from '../components/shared/ShowcaseBlocks';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageHero from '../components/shared/SubPageHero';
import { InlineError, Spinner, Skeleton } from '../components/shared/States';

// Start with empty data
const INITIAL_DATA: ResumeData = {
    fullName: "Your Name",
    title: "Professional Title",
    email: "",
    phone: "",
    linkedinUrl: "",
    portfolioUrl: "",
    summary: "Your professional summary will appear here...",
    experience: [],
    education: [],
    skills: [],
    competencies: []
};

const COLORS = [
    '#000000', // Black (Brutalism default)
    '#2563EB', // Blue
    '#0F172A', // Slate
    '#059669', // Emerald
    '#7C3AED', // Violet
    '#BE123C', // Rose
    '#EA580C', // Orange
    '#FF00FF', // Magenta (Creative)
];

const FONTS: FontFamily[] = ['Inter', 'Roboto', 'Lora', 'Merriweather', 'Playfair Display', 'Space Mono'];

// Resume preview fonts load route-locally so they never block the rest of the
// site. The link persists once added; htmlExport embeds its own copy.
const RESUME_FONTS_ID = 'resume-builder-fonts';
const RESUME_FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap';

const ResumeBuilderPage: React.FC = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
    const [rawText, setRawText] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [step, setStep] = useState<'upload' | 'main'>('upload');
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

    // Design State
    const [template, setTemplate] = useState<TemplateType>(TemplateType.PROFESSIONAL);
    const [layout, setLayout] = useState<LayoutType>(LayoutType.SINGLE_COLUMN);
    const [accentColor, setAccentColor] = useState('#2563EB');
    const [fontFamily, setFontFamily] = useState<FontFamily>('Inter');
    const [fontSize, setFontSize] = useState<FontSize>(FontSize.MEDIUM);

    const printRef = useRef<HTMLDivElement>(null);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (document.getElementById(RESUME_FONTS_ID)) return;
        const link = document.createElement('link');
        link.id = RESUME_FONTS_ID;
        link.rel = 'stylesheet';
        link.href = RESUME_FONTS_HREF;
        document.head.appendChild(link);
    }, []);

    const handleParse = async () => {
        if (!rawText.trim()) return;
        setIsParsing(true);
        setErrorMsg(null);
        try {
            const data = await parseLinkedInProfile(rawText);
            setResumeData(prev => ({ ...prev, ...data }));

            // Auto-set layout if suggested by AI
            if (data.suggestedLayout) {
                setLayout(data.suggestedLayout);
            }

            setStep('main');
            setActiveTab('editor');
        } catch (error) {
            console.error("Parse error:", error);
            const errorMessage = error instanceof Error
                ? `We couldn't parse that text: ${error.message}. Please try pasting different text or fill in the details manually.`
                : "We couldn't parse that text efficiently. Please try pasting different text or fill in the details manually.";
            setErrorMsg(errorMessage);
        } finally {
            setIsParsing(false);
        }
    };

    const handleWordExport = async () => {
        setIsExporting(true);
        setShowExportMenu(false);
        setErrorMsg(null);
        try {
            await exportToWord(resumeData, {
                accentColor,
                fontFamily,
                layout,
                template,
            });
        } catch (error) {
            console.error('Word export failed:', error);
            setErrorMsg('Failed to export Word document. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleHTMLExport = async () => {
        setIsExporting(true);
        setShowExportMenu(false);
        setErrorMsg(null);
        try {
            const element = printRef.current?.querySelector('.resume-preview-container') as HTMLElement;
            if (!element) throw new Error('Resume preview not found');
            await exportToHTML(element, resumeData, {
                accentColor,
                fontFamily,
                template,
                layout,
            });
        } catch (error) {
            console.error('HTML export failed:', error);
            setErrorMsg('Failed to export HTML. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleManualStart = () => {
        setResumeData(INITIAL_DATA);
        setStep('main');
    };

    const cycleFontSize = (direction: 'up' | 'down') => {
        if (direction === 'up') {
            if (fontSize === FontSize.SMALL) setFontSize(FontSize.MEDIUM);
            else if (fontSize === FontSize.MEDIUM) setFontSize(FontSize.LARGE);
        } else {
            if (fontSize === FontSize.LARGE) setFontSize(FontSize.MEDIUM);
            else if (fontSize === FontSize.MEDIUM) setFontSize(FontSize.SMALL);
        }
    };

    return (
        <div className="min-h-screen bg-bg pb-20 font-sans text-text print:!m-0 print:!h-auto print:!min-h-0 print:!bg-white print:!p-0 print:!pb-0 print:!text-black">
            <SEO
                title="AI Resume Builder"
                description="Create a professional, ATS-optimized resume in seconds using AI. Import from LinkedIn or paste your text to get started."
                url="https://wutcharin.com/resume-builder"
            />

            {/* Floating Console Capsule Header aligned with Home & SubPageShell */}
            <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-3.5 sm:px-6 print:hidden">
                <nav
                    aria-label="Resume Architect"
                    className="pointer-events-auto mx-auto flex h-12 max-w-5xl items-center justify-between gap-3 rounded-full border border-hairline-strong bg-bg/88 px-4 backdrop-blur-md sm:px-5"
                >
                    <Link
                        to="/#work"
                        data-cursor="back"
                        className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.26em] text-text-mute transition-colors hover:text-text-strong"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
                        <span>Work</span>
                    </Link>

                    {step === 'main' ? (
                        <div className="flex rounded-full border border-hairline bg-panel p-0.5">
                            <button
                                type="button"
                                onClick={() => setActiveTab('editor')}
                                data-cursor="step"
                                className={`rounded-full px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                                    activeTab === 'editor' ? 'bg-text-strong text-bg' : 'text-text-mute hover:text-text-strong'
                                }`}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('preview')}
                                data-cursor="step"
                                className={`rounded-full px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                                    activeTab === 'preview' ? 'bg-text-strong text-bg' : 'text-text-mute hover:text-text-strong'
                                }`}
                            >
                                Preview
                            </button>
                        </div>
                    ) : (
                        <span className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute sm:flex">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" aria-hidden="true" />
                            Gemini Resume Studio
                        </span>
                    )}

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={openConsole}
                            data-cursor="explore"
                            className="hidden rounded-full border border-hairline px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-text-mute transition-colors hover:border-hairline-strong hover:text-text-strong sm:inline-flex"
                        >
                            Console
                        </button>
                        <ThemeToggle />
                    </div>
                </nav>
            </header>

            <main className="w-full pt-20 print:!m-0 print:!p-0">
                {step === 'upload' ? (
                    <>
                        <SubPageHero
                            badgeLabel="Powered by Gemini AI"
                            BadgeIcon={Wand2}
                            titleLead="Intelligent"
                            titleAccent="Resume Architect."
                            accentColor="#3b82f6"
                            description={
                                <>
                                    Stop wrestling with fragile margins. Decouple career content from layout and transform raw LinkedIn or CV text
                                    into clean, <span className="font-normal text-text-strong">ATS-friendly PDF, Word, and HTML</span> documents.
                                </>
                            }
                            primaryCta={{ label: 'Launch builder', href: '#builder', icon: Wand2 }}
                        />

                        {/* 01 · Architecture & Process */}
                        <section className="mx-auto mb-20 max-w-6xl px-6 md:mb-28 md:px-10">
                            <SectionHeader
                                index="01"
                                eyebrow="Structured architecture"
                                title="Decouple content"
                                accent="from layout."
                                accentColor="#3b82f6"
                                lead="Gemini parses unstructured career text into typed JSON once, letting you switch templates, typography, and export formats without retyping."
                            />

                            <div className="mt-10 grid gap-5 md:grid-cols-3">
                                {[
                                    {
                                        icon: Code,
                                        step: '01',
                                        title: 'Intelligent parsing',
                                        desc: 'Extracts roles, dates, quantified impact bullets, and skill groupings from pasted LinkedIn or CV text.',
                                    },
                                    {
                                        icon: Layout,
                                        step: '02',
                                        title: 'Live layout engine',
                                        desc: 'Switch between Single Column, Sidebar, and Minimalist executive templates with instant typography controls.',
                                    },
                                    {
                                        icon: Download,
                                        step: '03',
                                        title: 'Universal export',
                                        desc: 'Export print-crisp A4 PDFs alongside editable Microsoft Word (.docx) and standalone HTML files.',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.step}
                                        className="rounded-lg border border-hairline bg-panel/50 p-6 transition-colors hover:border-hairline-strong"
                                    >
                                        <div className="mb-5 flex items-center justify-between">
                                            <item.icon className="h-4 w-4 text-blue-500" aria-hidden="true" />
                                            <span className="font-mono text-[10px] tabular-nums text-text-mute">{item.step}</span>
                                        </div>
                                        <h3 className="text-lg font-medium text-text-strong">{item.title}</h3>
                                        <p className="mt-2 text-sm font-light leading-relaxed text-text-mute">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 02 · Interactive Builder Entry */}
                        <section id="builder" className="mx-auto mb-20 max-w-4xl scroll-mt-24 px-6">
                            <div className="frame-ticks relative overflow-hidden rounded-lg border border-hairline bg-panel/60 p-5 md:p-8">
                                <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-4">
                                    <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" aria-hidden="true" />
                                        02 · Input Console
                                    </span>
                                    <span className="font-mono text-[10px] tabular-nums text-text-mute">
                                        {rawText.length > 0 ? `${rawText.length} chars` : 'Paste LinkedIn or CV text'}
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <TextArea
                                        placeholder="Paste your LinkedIn PDF text or current resume content here..."
                                        className="min-h-[210px] resize-y rounded-md border-hairline bg-bg p-5 font-mono text-sm leading-relaxed text-text-strong focus:border-signal"
                                        value={rawText}
                                        onChange={(e) => setRawText(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col items-center justify-between gap-4 border-t border-hairline pt-5 sm:flex-row">
                                    <Button
                                        onClick={handleManualStart}
                                        variant="ghost"
                                        className="text-sm text-text-mute hover:text-text-strong"
                                    >
                                        Start from scratch
                                    </Button>
                                    <Button
                                        onClick={handleParse}
                                        isLoading={isParsing}
                                        disabled={!rawText}
                                        className="w-full rounded-full border-0 bg-text-strong px-7 py-3 text-sm font-medium !text-bg transition-colors hover:bg-signal disabled:opacity-40 sm:w-auto"
                                    >
                                        {isParsing ? 'Analyzing...' : 'Generate Resume'} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>

                                {isParsing && (
                                    <div className="mt-6 space-y-3" aria-hidden="true">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-5/6" />
                                        <Skeleton className="h-3 w-2/3" />
                                    </div>
                                )}

                                {errorMsg && (
                                    <div className="mt-6">
                                        <InlineError>{errorMsg}</InlineError>
                                    </div>
                                )}
                            </div>
                        </section>

                        <ProjectNavigation currentId="resume-builder" />
                    </>
                ) : (
                    <div className="surface-dark px-4 pt-10 text-white">
                        {/* EDITOR TAB */}
                        {activeTab === 'editor' && (
                            <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Edit Your Details</h2>
                                    <Button onClick={() => setActiveTab('preview')}>
                                        Preview Resume <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="bg-panel rounded-xl border border-hairline p-6 md:p-8">
                                    <ResumeEditor data={resumeData} onChange={setResumeData} />
                                </div>
                            </div>
                        )}

                        {/* PREVIEW TAB */}
                        {activeTab === 'preview' && (
                            <div className="animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center print:!block print:!p-0 print:!m-0">

                                {errorMsg && (
                                    <div className="w-full max-w-5xl mb-4 print:hidden">
                                        <InlineError>{errorMsg}</InlineError>
                                    </div>
                                )}

                                {/* TOOLBAR */}
                                <div className="w-full max-w-5xl mb-6 bg-zinc-900 rounded-xl p-4 border border-zinc-800 shadow-sm flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between print:hidden sticky top-20 z-30">

                                    {/* Style Controls Group */}
                                    <div className="flex flex-wrap gap-x-6 gap-y-4 w-full xl:w-auto">

                                        {/* Left Group: Layout & Style */}
                                        <div className="flex gap-6">
                                            {/* Layout Selector */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                    <Layout className="w-3 h-3" /> Layout
                                                </label>
                                                <div className="flex bg-zinc-800 p-1 rounded-lg">
                                                    <button
                                                        onClick={() => setLayout(LayoutType.SINGLE_COLUMN)}
                                                        className={`p-2 rounded hover:bg-zinc-700 hover:shadow-sm transition-all ${layout === LayoutType.SINGLE_COLUMN ? 'bg-zinc-700 shadow-sm text-blue-400' : 'text-gray-400'}`}
                                                        title="Single Column"
                                                    >
                                                        <RectangleVertical size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setLayout(LayoutType.TWO_COLUMN_LEFT)}
                                                        className={`p-2 rounded hover:bg-zinc-700 hover:shadow-sm transition-all ${layout === LayoutType.TWO_COLUMN_LEFT ? 'bg-zinc-700 shadow-sm text-blue-400' : 'text-gray-400'}`}
                                                        title="Left Sidebar"
                                                    >
                                                        <PanelLeft size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setLayout(LayoutType.TWO_COLUMN_RIGHT)}
                                                        className={`p-2 rounded hover:bg-zinc-700 hover:shadow-sm transition-all ${layout === LayoutType.TWO_COLUMN_RIGHT ? 'bg-zinc-700 shadow-sm text-blue-400' : 'text-gray-400'}`}
                                                        title="Right Sidebar"
                                                    >
                                                        <PanelRight size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Template Selector */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                    <Palette className="w-3 h-3" /> Style
                                                </label>
                                                <select
                                                    className="bg-zinc-800 text-sm font-medium text-white focus:outline-none cursor-pointer border-transparent rounded-lg px-3 py-2 hover:bg-zinc-700 transition-colors w-32"
                                                    value={template}
                                                    onChange={(e) => setTemplate(e.target.value as TemplateType)}
                                                >
                                                    {Object.values(TemplateType).map(t => (
                                                        <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Middle Group: Typography */}
                                        <div className="flex gap-6 border-l border-zinc-800 pl-6">
                                            {/* Font Family */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                    <Type className="w-3 h-3" /> Font
                                                </label>
                                                <select
                                                    className="bg-zinc-800 text-sm font-medium text-white focus:outline-none cursor-pointer border-transparent rounded-lg px-3 py-2 hover:bg-zinc-700 transition-colors w-32"
                                                    value={fontFamily}
                                                    onChange={(e) => setFontFamily(e.target.value as FontFamily)}
                                                >
                                                    {FONTS.map(f => (
                                                        <option key={f} value={f}>{f}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Font Size */}
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                    Size
                                                </label>
                                                <div className="flex items-center bg-zinc-800 p-1 rounded-lg">
                                                    <button
                                                        onClick={() => cycleFontSize('down')}
                                                        disabled={fontSize === FontSize.SMALL}
                                                        className="p-2 rounded hover:bg-zinc-700 hover:shadow-sm disabled:opacity-30 transition-all text-gray-400"
                                                    >
                                                        <ZoomOut size={16} />
                                                    </button>
                                                    <span className="text-xs font-medium text-gray-300 w-16 text-center select-none">
                                                        {fontSize.charAt(0) + fontSize.slice(1).toLowerCase()}
                                                    </span>
                                                    <button
                                                        onClick={() => cycleFontSize('up')}
                                                        disabled={fontSize === FontSize.LARGE}
                                                        className="p-2 rounded hover:bg-zinc-700 hover:shadow-sm disabled:opacity-30 transition-all text-gray-400"
                                                    >
                                                        <ZoomIn size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Color Selector */}
                                        <div className="flex flex-col gap-1.5 border-l border-zinc-800 pl-6">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Accent</label>
                                            <div className="flex gap-1.5">
                                                {COLORS.map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => setAccentColor(c)}
                                                        className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${accentColor === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                                                        style={{ backgroundColor: c }}
                                                        aria-label={`Select color ${c}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Export Dropdown */}
                                    <div className="relative">
                                        <Button
                                            onClick={() => setShowExportMenu(!showExportMenu)}
                                            variant="primary"
                                            className="w-full xl:w-auto text-sm py-2.5 px-6 shadow-md font-bold tracking-wide whitespace-nowrap"
                                            disabled={isExporting}
                                        >
                                            {isExporting ? (
                                                <>
                                                    <Spinner size={16} className="-ml-1 mr-2" />
                                                    Exporting...
                                                </>
                                            ) : (
                                                <>
                                                    <Download size={16} className="mr-2" /> Download <ChevronDown size={14} className="ml-1" />
                                                </>
                                            )}
                                        </Button>

                                        {showExportMenu && (
                                            <>
                                                {/* Backdrop to close menu */}
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setShowExportMenu(false)}
                                                />

                                                {/* Dropdown menu */}
                                                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-zinc-800 border border-zinc-700 z-50 overflow-hidden">
                                                    <div className="py-1">
                                                        <button
                                                            onClick={handleHTMLExport}
                                                            className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-700 transition-colors flex items-center gap-3 group"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                                                <Code size={16} className="text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-white">HTML</div>
                                                                <div className="text-xs text-gray-400">View in browser, print to PDF</div>
                                                            </div>
                                                        </button>

                                                        <button
                                                            onClick={handleWordExport}
                                                            className="w-full px-4 py-3 text-left text-sm hover:bg-zinc-700 transition-colors flex items-center gap-3 group"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                                                                <FileText size={16} className="text-indigo-400" />
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-white">Word (.docx)</div>
                                                                <div className="text-xs text-gray-400">Fully editable document</div>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Resume Page Container - Print styles ensure full page width and no transform */}
                                <div className="w-full flex justify-center pb-20 overflow-x-auto print:!p-0 print:!m-0 print:!block print:!w-full print:!overflow-visible print:!bg-white">
                                    <div ref={printRef} className="origin-top transition-transform duration-300 print:!transform-none print:!w-full print:!m-0 print:!p-0">
                                        {/* Note: ResumePreview now handles the container style (white pages + gray gaps) */}
                                        <ResumePreview
                                            key={fontSize} // Force re-render on font size change
                                            data={resumeData}
                                            template={template}
                                            layout={layout}
                                            color={accentColor}
                                            fontFamily={fontFamily}
                                            fontSize={fontSize}
                                        />
                                        {/* Helper text for user */}
                                        <p className="text-center text-xs text-gray-400 mt-4 print:hidden max-w-lg mx-auto leading-relaxed">
                                            The preview above mimics A4 pages. If your content crosses the gray gap, it will be split across pages when printing.
                                            Adjust spacing or text length for best results.
                                        </p>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ResumeBuilderPage;
