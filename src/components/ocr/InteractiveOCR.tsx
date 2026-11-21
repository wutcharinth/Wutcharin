import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    Scan,
    FileText,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    Receipt,
    Plane,
    CreditCard,
} from 'lucide-react';
import { InlineError } from '../shared/States';
import { usePrefersReducedMotion } from '../../lib/motion/usePrefersReducedMotion';

interface OCRWord {
    text: string;
    bbox: { x0: number; y0: number; x1: number; y1: number } | null;
    confidence: number;
}

interface OCRResult {
    text: string;
    confidence: number;
    words: OCRWord[];
}

interface SamplePreset {
    id: string;
    label: string;
    icon: typeof Receipt;
    svgMarkup: string;
    result: OCRResult;
}

const SAMPLE_PRESETS: SamplePreset[] = [
    {
        id: 'slip',
        label: 'Bank Slip',
        icon: CreditCard,
        svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="300" viewBox="0 0 420 300">
          <rect width="420" height="300" fill="#fafafa" rx="12"/>
          <rect x="20" y="20" width="380" height="44" fill="#10b981" rx="6"/>
          <text x="36" y="48" font-family="monospace" font-size="16" font-weight="bold" fill="#ffffff">PROMPTPAY TRANSFER VERIFIED</text>
          <text x="36" y="102" font-family="monospace" font-size="13" fill="#525252">FROM: SOMBAT JAI-DEE (SCB x4821)</text>
          <text x="36" y="132" font-family="monospace" font-size="13" fill="#525252">TO: COFFEE BEANS CO., LTD.</text>
          <text x="36" y="176" font-family="monospace" font-size="24" font-weight="bold" fill="#0a0a0a">AMOUNT: 500.00 THB</text>
          <line x1="36" y1="204" x2="384" y2="204" stroke="#d4d4d4" stroke-dasharray="4 4"/>
          <text x="36" y="236" font-family="monospace" font-size="12" fill="#737373">REF ID: TXN-2025-882910-BKK</text>
          <text x="36" y="262" font-family="monospace" font-size="12" fill="#737373">TIMESTAMP: 21 NOV 2025 14:32:09 ICT</text>
        </svg>`,
        result: {
            confidence: 99.4,
            text: 'PROMPTPAY TRANSFER VERIFIED\nFROM: SOMBAT JAI-DEE (SCB x4821)\nTO: COFFEE BEANS CO., LTD.\nAMOUNT: 500.00 THB\nREF ID: TXN-2025-882910-BKK\nTIMESTAMP: 21 NOV 2025 14:32:09 ICT',
            words: [
                { text: 'PROMPTPAY', bbox: { x0: 34, y0: 30, x1: 140, y1: 54 }, confidence: 0.99 },
                { text: '500.00 THB', bbox: { x0: 145, y0: 152, x1: 295, y1: 184 }, confidence: 0.996 },
                { text: 'TXN-2025-882910-BKK', bbox: { x0: 95, y0: 220, x1: 265, y1: 244 }, confidence: 0.991 },
            ],
        },
    },
    {
        id: 'receipt',
        label: 'Tax Invoice',
        icon: Receipt,
        svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="300" viewBox="0 0 420 300">
          <rect width="420" height="300" fill="#fafafa" rx="12"/>
          <text x="36" y="52" font-family="monospace" font-size="18" font-weight="bold" fill="#0a0a0a">TAX INVOICE #INV-9042</text>
          <text x="36" y="78" font-family="monospace" font-size="12" fill="#737373">GRAND HOTEL PLAZA · VAT ID 0105561009912</text>
          <line x1="36" y1="96" x2="384" y2="96" stroke="#d4d4d4"/>
          <text x="36" y="132" font-family="monospace" font-size="13" fill="#262626">1x Deluxe Room (2 Nights)        $380.00</text>
          <text x="36" y="162" font-family="monospace" font-size="13" fill="#262626">1x Service Charge &amp; VAT 7%        $70.00</text>
          <line x1="36" y1="190" x2="384" y2="190" stroke="#d4d4d4"/>
          <text x="36" y="230" font-family="monospace" font-size="22" font-weight="bold" fill="#0a0a0a">TOTAL DUE: $450.00</text>
          <text x="36" y="264" font-family="monospace" font-size="11" fill="#737373">STATUS: SETTLED VIA VCC-882190</text>
        </svg>`,
        result: {
            confidence: 98.9,
            text: 'TAX INVOICE #INV-9042\nGRAND HOTEL PLAZA · VAT ID 0105561009912\n1x Deluxe Room (2 Nights) $380.00\n1x Service Charge & VAT 7% $70.00\nTOTAL DUE: $450.00\nSTATUS: SETTLED VIA VCC-882190',
            words: [
                { text: '#INV-9042', bbox: { x0: 162, y0: 32, x1: 270, y1: 58 }, confidence: 0.99 },
                { text: '0105561009912', bbox: { x0: 215, y0: 64, x1: 342, y1: 84 }, confidence: 0.985 },
                { text: '$450.00', bbox: { x0: 178, y0: 208, x1: 282, y1: 238 }, confidence: 0.994 },
            ],
        },
    },
    {
        id: 'dispatch',
        label: 'Flight Release',
        icon: Plane,
        svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="300" viewBox="0 0 420 300">
          <rect width="420" height="300" fill="#fafafa" rx="12"/>
          <text x="36" y="48" font-family="monospace" font-size="16" font-weight="bold" fill="#0a0a0a">NAVA FLIGHT RELEASE · NV-804</text>
          <text x="36" y="76" font-family="monospace" font-size="12" fill="#525252">ROUTE: VTBS (BKK) -> RJTT (HND) · A350-900</text>
          <line x1="36" y1="96" x2="384" y2="96" stroke="#d4d4d4"/>
          <text x="36" y="132" font-family="monospace" font-size="13" fill="#262626">BLOCK FUEL: 48,200 KG · ZFW: 184.6 T</text>
          <text x="36" y="162" font-family="monospace" font-size="13" fill="#262626">CRUISE LEVEL: FL390 · MACH 0.85</text>
          <text x="36" y="192" font-family="monospace" font-size="13" fill="#262626">ALTN: RJAA (NRT) · ETE: 05H 42M</text>
          <line x1="36" y1="216" x2="384" y2="216" stroke="#d4d4d4"/>
          <text x="36" y="254" font-family="monospace" font-size="13" font-weight="bold" fill="#059669">DISPATCH SIGNED: CAPT. WUTCHARIN</text>
        </svg>`,
        result: {
            confidence: 99.6,
            text: 'NAVA FLIGHT RELEASE · NV-804\nROUTE: VTBS (BKK) -> RJTT (HND) · A350-900\nBLOCK FUEL: 48,200 KG · ZFW: 184.6 T\nCRUISE LEVEL: FL390 · MACH 0.85\nALTN: RJAA (NRT) · ETE: 05H 42M\nDISPATCH SIGNED: CAPT. WUTCHARIN',
            words: [
                { text: 'NV-804', bbox: { x0: 255, y0: 30, x1: 332, y1: 54 }, confidence: 0.998 },
                { text: '48,200 KG', bbox: { x0: 132, y0: 116, x1: 215, y1: 138 }, confidence: 0.995 },
                { text: 'FL390', bbox: { x0: 145, y0: 146, x1: 198, y1: 168 }, confidence: 0.996 },
            ],
        },
    },
];

export default function InteractiveOCR() {
    const reduced = usePrefersReducedMotion();
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [activePreset, setActivePreset] = useState<SamplePreset | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<OCRResult | null>(null);
    const [status, setStatus] = useState<string>('Ready');
    const [error, setError] = useState<string | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
            setImageFile(file);
            setActivePreset(null);
            setResult(null);
            setProgress(0);
            setStatus('Image Loaded');
            setError(null);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false,
    });

    const loadPreset = (preset: SamplePreset) => {
        const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(preset.svgMarkup)}`;
        setImage(dataUrl);
        setImageFile(null);
        setActivePreset(preset);
        setResult(null);
        setProgress(0);
        setStatus(`Sample loaded (${preset.label})`);
        setError(null);
    };

    const runOCR = async () => {
        if (!image) return;

        setIsProcessing(true);
        setError(null);
        setProgress(25);

        // If user selected a built-in sample preset, run deterministic extraction preview
        if (activePreset && !imageFile) {
            setStatus('Running Gemini Vision Pipeline...');
            await new Promise((r) => setTimeout(r, reduced ? 80 : 420));
            setProgress(65);
            setStatus('Detecting Bounding Boxes...');
            await new Promise((r) => setTimeout(r, reduced ? 80 : 480));
            setProgress(100);
            setResult(activePreset.result);
            setStatus('Analysis Complete');
            setIsProcessing(false);
            return;
        }

        if (!imageFile) {
            setIsProcessing(false);
            return;
        }

        setStatus('Sending to Gemini Vision...');
        const formData = new FormData();
        formData.append('image', imageFile);
        const API_URL = import.meta.env.VITE_API_URL || '';

        try {
            const response = await fetch(`${API_URL}/api/analyze`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Vision API endpoint unavailable in static preview');
            }

            setProgress(80);
            setStatus('Processing Response...');
            const data = await response.json();
            setResult(data);
            setStatus('Analysis Complete');
            setProgress(100);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error occurred during analysis';
            setStatus('Failed');
            setError(message);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (result && imageRef.current && canvasRef.current) {
            const img = imageRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const scaleX = img.clientWidth / (img.naturalWidth || 420);
            const scaleY = img.clientHeight / (img.naturalHeight || 300);

            canvas.width = img.clientWidth;
            canvas.height = img.clientHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            result.words.forEach((word) => {
                if (!word.bbox) return;
                const x = word.bbox.x0 * scaleX;
                const y = word.bbox.y0 * scaleY;
                const w = (word.bbox.x1 - word.bbox.x0) * scaleX;
                const h = (word.bbox.y1 - word.bbox.y0) * scaleY;

                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, w, h);

                ctx.fillStyle = 'rgba(59, 130, 246, 0.16)';
                ctx.fillRect(x, y, w, h);
            });
        }
    }, [result]);

    const reset = () => {
        setImage(null);
        setImageFile(null);
        setActivePreset(null);
        setResult(null);
        setProgress(0);
        setStatus('Ready');
        setError(null);
    };

    return (
        <div className="w-full bg-bg text-text p-5 md:p-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-hairline">
                <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-sky-500" />
                    <h3 className="text-sm font-display font-medium text-text-strong tracking-tight">
                        Gemini Vision · OCR Bench
                    </h3>
                </div>

                {/* Quick sample document presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-text-mute mr-1">
                        Samples:
                    </span>
                    {SAMPLE_PRESETS.map((preset) => {
                        const Icon = preset.icon;
                        const active = activePreset?.id === preset.id;
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => loadPreset(preset)}
                                data-cursor="step"
                                className={`px-2.5 py-1 rounded-full text-[11px] font-mono border transition-colors flex items-center gap-1.5 ${
                                    active
                                        ? 'border-sky-500/60 bg-sky-500/12 text-text-strong'
                                        : 'border-hairline bg-panel text-text-mute hover:text-text-strong hover:border-hairline-strong'
                                }`}
                            >
                                <Icon className="w-3 h-3 text-sky-500" />
                                {preset.label}
                            </button>
                        );
                    })}
                </div>

                <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-[0.18em] ${
                        isProcessing
                            ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                            : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                    }`}
                >
                    {isProcessing ? <RefreshCw className="animate-spin w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {isProcessing ? 'Scanning' : status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel: Image Input / Scanner */}
                <div className="space-y-4">
                    <div className="relative min-h-[280px] md:min-h-[380px] bg-panel border border-hairline rounded-xl overflow-hidden flex flex-col items-center justify-center group">
                        {!image ? (
                            <div
                                {...getRootProps()}
                                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-panel-strong/60 transition-colors p-6 text-center"
                            >
                                <input {...getInputProps()} />
                                <div className="w-12 h-12 rounded-2xl border border-hairline bg-bg flex items-center justify-center mb-4 text-text-mute group-hover:text-sky-500 group-hover:border-sky-500/40 transition-colors">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <p className="text-sm font-medium text-text-strong mb-1">Drop a document image here</p>
                                <p className="text-xs text-text-mute font-mono">
                                    or click to upload (JPG, PNG) · or pick a sample above
                                </p>
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center p-4">
                                <div className="relative inline-block max-w-full">
                                    <img
                                        ref={imageRef}
                                        src={image}
                                        alt="Document input"
                                        className="max-w-full max-h-[360px] object-contain rounded-lg border border-hairline"
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute inset-0 pointer-events-none"
                                    />
                                </div>

                                <AnimatePresence>
                                    {isProcessing && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-bg/75 backdrop-blur-xs flex items-center justify-center"
                                        >
                                            {!reduced && (
                                                <motion.div
                                                    aria-hidden="true"
                                                    className="absolute left-0 right-0 h-[2px] bg-sky-500"
                                                    style={{ boxShadow: '0 0 14px #3b82f6' }}
                                                    animate={{ top: ['10%', '90%', '10%'] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                                />
                                            )}
                                            <div className="relative z-10 w-full max-w-xs bg-panel border border-hairline-strong rounded-xl p-5">
                                                <div className="h-1.5 w-full bg-hairline rounded-full overflow-hidden mb-3">
                                                    <motion.div
                                                        className="h-full rounded-full bg-sky-500"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-center text-[11px] font-mono text-text-strong uppercase tracking-[0.18em]">
                                                    Extracting · {progress}%
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={runOCR}
                            disabled={!image || isProcessing}
                            data-cursor="play"
                            className="flex-1 py-2.5 px-4 rounded-lg text-xs font-mono uppercase tracking-[0.16em] bg-text-strong text-bg hover:opacity-90 flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
                        >
                            <Scan size={15} />
                            {isProcessing ? 'Scanning...' : 'Initiate Scan'}
                        </button>
                        <button
                            type="button"
                            onClick={reset}
                            disabled={isProcessing}
                            className="px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-[0.16em] text-text-mute hover:text-text-strong border border-hairline hover:border-hairline-strong bg-panel transition-colors disabled:opacity-40"
                        >
                            Reset
                        </button>
                    </div>

                    {error && <InlineError accent="#f87171">{error}</InlineError>}
                </div>

                {/* Right Panel: Extraction Telemetry */}
                <div className="bg-panel border border-hairline rounded-xl p-5 font-mono text-xs h-[320px] md:h-[440px] overflow-y-auto relative">
                    <div className="sticky top-0 bg-panel border-b border-hairline pb-3 mb-4 flex items-center justify-between z-10 text-text-mute">
                        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
                            <FileText size={13} className="text-sky-500" />
                            Structured Output
                        </span>
                        <span className="text-[10px]">UTF-8 · JSON</span>
                    </div>

                    {!result ? (
                        <div className="space-y-2 text-text-mute">
                            <p>&gt; Vision pipeline armed...</p>
                            <p>&gt; Waiting for document image or sample preset...</p>
                            {image && <p className="text-emerald-500">&gt; Input buffer ready. Click Initiate Scan.</p>}
                            {status === 'Failed' && (
                                <p className="text-rose-500">&gt; ERROR: {error}</p>
                            )}
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-bg p-3.5 rounded-xl border border-hairline">
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-text-mute mb-1">Confidence</p>
                                    <p className="text-2xl font-medium text-text-strong">
                                        {result.confidence ? result.confidence.toFixed(1) : 'N/A'}%
                                    </p>
                                </div>
                                <div className="bg-bg p-3.5 rounded-xl border border-hairline">
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-text-mute mb-1">Detected Spans</p>
                                    <p className="text-2xl font-medium text-text-strong">
                                        {result.words ? result.words.length : 0}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-[0.18em] text-text-mute mb-2">
                                    Extracted Text
                                </p>
                                <div className="bg-bg p-4 rounded-xl border border-hairline whitespace-pre-wrap text-text-strong font-sans text-sm leading-relaxed">
                                    {result.text || <span className="text-text-mute italic">No text detected.</span>}
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-[0.18em] text-text-mute mb-2">
                                    Bounding-Box JSON
                                </p>
                                <div className="bg-bg p-4 rounded-xl border border-hairline text-[11px] text-text overflow-x-auto">
                                    <pre>{JSON.stringify(result.words ? result.words.slice(0, 5) : [], null, 2)}</pre>
                                    {result.words && result.words.length > 5 && (
                                        <p className="mt-2 text-text-mute">... {result.words.length - 5} more items</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-hairline flex items-center gap-2 text-[11px] font-mono text-text-mute">
                <AlertCircle size={12} />
                <span>Powered by Google Gemini Vision · Built-in samples run locally; custom uploads call /api/analyze.</span>
            </div>
        </div>
    );
}
