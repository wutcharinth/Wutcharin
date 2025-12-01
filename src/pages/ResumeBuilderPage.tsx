import React, { useState, useRef } from 'react';
import { Button, TextArea, Card } from '../components/resume-builder/UI';
import { ResumeEditor } from '../components/resume-builder/ResumeEditor';
import { ResumePreview } from '../components/resume-builder/ResumePreview';
import { parseLinkedInProfile } from '../components/resume-builder/geminiService';
import { exportToWord } from '../components/resume-builder/wordExport';
import { TemplateType, LayoutType, FontSize } from '../components/resume-builder/types';
import type { ResumeData, FontFamily } from '../components/resume-builder/types';
import { ArrowRight, Palette, Wand2, Layout, PanelLeft, PanelRight, RectangleVertical, Type, ZoomIn, ZoomOut, FileText, ArrowLeft, FileDown, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

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

    const handleParse = async () => {
        if (!rawText.trim()) return;
        setIsParsing(true);
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
            alert(errorMessage);
        } finally {
            setIsParsing(false);
        }
    };

    const handleWordExport = async () => {
        try {
            await exportToWord(resumeData, {
                accentColor,
                fontFamily,
                layout,
                template,
            });
        } catch (error) {
            console.error('Word export failed:', error);
            alert('Failed to export Word document. Please try again.');
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
        <div className="min-h-screen bg-[#050505] pb-20 font-sans text-white print:!min-h-0 print:!h-auto print:!bg-white print:!pb-0 print:!text-black print:!p-0 print:!m-0">
            <SEO
                title="AI Resume Builder"
                description="Create a professional, ATS-optimized resume in seconds using AI. Import from LinkedIn or paste your text to get started."
                url="https://wutcharin.com/resume-builder"
            />
            {/* Header */}
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center print:hidden transition-all duration-300 ${step === 'upload' ? 'mix-blend-difference' : 'bg-[#050505]/90 backdrop-blur-md border-b border-zinc-800'}`}>
                <Link to="/" className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-widest hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Portfolio
                </Link>

                {step === 'main' ? (
                    <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                        <button
                            onClick={() => setActiveTab('editor')}
                            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'editor' ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'preview' ? 'bg-zinc-800 text-blue-400 shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            Preview
                        </button>
                    </div>
                ) : (
                    <div className="text-sm font-mono text-gray-400 hidden sm:block">AI RESUME BUILDER // 2025</div>
                )}
            </nav>

            <main className="w-full print:!p-0 print:!m-0">
                {step === 'upload' ? (

                    <>
                        {/* Hero Section - Full Screen */}
                        <section className="relative h-screen flex flex-col justify-center items-center px-4 overflow-hidden">
                            {/* Background Gradients/Effects */}
                            <div className="absolute inset-0 z-0 pointer-events-none">
                                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] opacity-40" />
                                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] opacity-40" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-[#050505] z-10" />
                            </div>

                            <div className="relative z-20 text-center max-w-5xl mx-auto mt-[-5vh]">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <Wand2 className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">AI-Powered Professional Tools</span>
                                </div>

                                <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-8 leading-[0.9] text-white animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                                    Resume <br className="hidden md:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Builder</span>
                                </h2>

                                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                                    Transform your LinkedIn profile into a polished, ATS-ready document in seconds.
                                </p>
                            </div>

                            {/* Scroll Indicator */}
                            <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-in fade-in duration-1000 delay-500">
                                <div className="animate-bounce text-white/30 flex flex-col items-center gap-2">
                                    <span className="text-xs uppercase tracking-widest">Scroll to Start</span>
                                    <ArrowRight className="w-6 h-6 rotate-90" />
                                </div>
                            </div>
                        </section>

                        {/* Content Section - Below Fold */}
                        <section className="relative z-20 py-32 bg-[#050505]">
                            <div className="max-w-4xl mx-auto px-4">
                                <div className="mb-16 text-center">
                                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h3>
                                    <p className="text-gray-400">Three simple steps to your perfect resume.</p>
                                </div>

                                <Card className="p-1 md:p-8 shadow-2xl border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl ring-1 ring-white/5">
                                    {/* Steps Grid */}
                                    <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group text-left">
                                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform">
                                                <Download className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">1. Get Data</h3>
                                            <p className="text-sm text-gray-400 leading-relaxed">Export your LinkedIn profile to PDF or copy text from your existing resume.</p>
                                        </div>
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group text-left">
                                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">2. Copy Text</h3>
                                            <p className="text-sm text-gray-400 leading-relaxed">Open the document, select all text (Ctrl+A), and copy it (Ctrl+C).</p>
                                        </div>
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group text-left">
                                            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 border border-blue-600/20 group-hover:scale-110 transition-transform">
                                                <Wand2 className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">3. Generate</h3>
                                            <p className="text-sm text-gray-400 leading-relaxed">Paste below. Our AI will structure, format, and polish your resume instantly.</p>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <div className="relative">
                                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-zinc-900/5 pointer-events-none rounded-lg" />
                                            <TextArea
                                                placeholder="Paste your resume or LinkedIn text here..."
                                                className="min-h-[200px] font-mono text-sm leading-relaxed bg-zinc-950/50 border-zinc-800 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all resize-y p-6 text-gray-300"
                                                value={rawText}
                                                onChange={(e) => setRawText(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 text-right font-medium">
                                            {rawText.length > 0 ? `${rawText.length} characters` : 'Ready to paste'}
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-zinc-800/50">
                                        <Button onClick={handleManualStart} variant="ghost" className="text-gray-400 hover:text-white">
                                            Skip & Fill Manually
                                        </Button>
                                        <Button
                                            onClick={handleParse}
                                            isLoading={isParsing}
                                            disabled={!rawText}
                                            className="w-full sm:w-auto bg-white !text-black hover:bg-gray-200 border-0 shadow-[0_0_20px_rgba(255,255,255,0.2)] font-bold tracking-wide py-3 px-8 text-base disabled:bg-zinc-800 disabled:!text-white disabled:opacity-50 disabled:shadow-none"
                                        >
                                            Generate Resume <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </section>
                    </>
                ) : (
                    <div className="pt-24 px-4">
                        {/* EDITOR TAB */}
                        {activeTab === 'editor' && (
                            <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">Edit Your Details</h2>
                                    <Button onClick={() => setActiveTab('preview')}>
                                        Preview Resume <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 p-6 md:p-8">
                                    <ResumeEditor data={resumeData} onChange={setResumeData} />
                                </div>
                            </div>
                        )}

                        {/* PREVIEW TAB */}
                        {activeTab === 'preview' && (
                            <div className="animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center print:!block print:!p-0 print:!m-0">

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

                                    <Button onClick={handleWordExport} variant="primary" className="w-full xl:w-auto text-sm py-2.5 px-6 shadow-md font-bold tracking-wide whitespace-nowrap">
                                        <FileDown size={16} className="mr-2" /> Download Word
                                    </Button>
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
