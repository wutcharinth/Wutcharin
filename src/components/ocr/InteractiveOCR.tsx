import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Scan, FileText, RefreshCw, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface OCRResult {
    text: string;
    confidence: number;
    words: {
        text: string;
        bbox: { x0: number; y0: number; x1: number; y1: number } | null;
        confidence: number;
    }[];
}

export default function InteractiveOCR() {
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
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
            setResult(null);
            setProgress(0);
            setStatus('Image Loaded');
            setError(null);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: false
    });

    const runOCR = async () => {
        if (!imageFile) return;

        setIsProcessing(true);
        setStatus('Sending to Gemini Vision...');
        setProgress(20);
        setError(null);

        const formData = new FormData();
        formData.append('image', imageFile);

        const API_URL = import.meta.env.VITE_API_URL || '';

        try {
            const response = await fetch(`${API_URL}/api/analyze`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze image');
            }

            setProgress(80);
            setStatus('Processing Response...');

            const data = await response.json();
            setResult(data);
            setStatus('Analysis Complete');
            setProgress(100);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            setStatus('failed');
            setError(err.message || 'Unknown error occurred during analysis');
        } finally {
            setIsProcessing(false);
        }
    };

    // Draw bounding boxes when result changes
    useEffect(() => {
        if (result && imageRef.current && canvasRef.current) {
            const img = imageRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                result.words.forEach((word) => {
                    if (word.bbox) {
                        const { x0, y0, x1, y1 } = word.bbox;
                        const width = x1 - x0;
                        const height = y1 - y0;

                        ctx.strokeStyle = '#3b82f6';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(x0, y0, width, height);

                        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
                        ctx.fillRect(x0, y0, width, height);
                    }
                });
            }
        }
    }, [result]);

    const reset = () => {
        setImage(null);
        setImageFile(null);
        setResult(null);
        setProgress(0);
        setStatus('Ready');
        setError(null);
    };

    return (
        <div className="w-full max-w-6xl mx-auto rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-5 border-b border-white/8">
                <h2 className="text-base font-medium text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    Gemini Vision — OCR Demo
                </h2>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-mono uppercase tracking-[0.2em] transition-colors ${
                    isProcessing
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                        : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                }`}>
                    {isProcessing
                        ? <RefreshCw className="animate-spin w-3 h-3" />
                        : <CheckCircle2 className="w-3 h-3" />
                    }
                    {isProcessing ? 'Processing' : status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel: Image Input/Display */}
                <div className="space-y-4">
                    <div className="relative min-h-[280px] md:min-h-[400px] bg-slate-900/50 border border-white/8 rounded-xl overflow-hidden flex flex-col items-center justify-center group">
                        {!image ? (
                            <div {...getRootProps()} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-colors">
                                <input {...getInputProps()} />
                                <Upload className="w-12 h-12 mb-4 text-slate-500 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300" />
                                <p className="text-base font-medium text-slate-300 mb-1">Drop image here</p>
                                <p className="text-sm text-slate-500 font-light">or click to upload · JPG, PNG</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-full bg-slate-900/40 flex items-center justify-center p-4">
                                <img
                                    ref={imageRef}
                                    src={image}
                                    alt="Uploaded"
                                    className="max-w-full max-h-[500px] object-contain rounded-lg"
                                />
                                <canvas
                                    ref={canvasRef}
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full max-h-[500px] pointer-events-none"
                                    style={{
                                        width: imageRef.current ? imageRef.current.width : 'auto',
                                        height: imageRef.current ? imageRef.current.height : 'auto',
                                        maxWidth: '100%',
                                        maxHeight: '500px'
                                    }}
                                />
                                {isProcessing && (
                                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
                                        <div className="w-full max-w-xs bg-slate-900/90 border border-white/10 rounded-xl p-5">
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{ background: 'linear-gradient(90deg, #2563eb, #38bdf8)' }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <p className="text-center text-xs font-mono text-slate-400 uppercase tracking-widest">
                                                Processing — {progress}%
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={runOCR}
                            disabled={!image || isProcessing}
                            className="flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all border disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                                backgroundColor: '#2563eb20',
                                borderColor: '#2563eb40',
                                color: '#60a5fa',
                            }}
                            onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#2563eb30'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563eb20'; }}
                        >
                            <Scan size={16} />
                            Initiate scan
                        </button>
                        <button
                            onClick={reset}
                            disabled={isProcessing}
                            className="px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-white/8 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Right Panel: Data Output */}
                <div className="bg-slate-900/60 border border-white/5 rounded-xl p-5 font-mono text-sm h-[300px] md:h-[440px] lg:h-[500px] overflow-y-auto relative">
                    <div className="sticky top-0 bg-slate-900/90 backdrop-blur border-b border-white/5 pb-3 mb-4 flex items-center gap-2 z-10 text-slate-400">
                        <FileText size={14} />
                        <span className="text-[10px] uppercase tracking-widest">Terminal Output</span>
                    </div>

                    {!result ? (
                        <div className="space-y-2">
                            <p className="text-slate-600">{'>'} System ready...</p>
                            <p className="text-slate-600">{'>'} Waiting for input...</p>
                            {image && <p className="text-emerald-400">{'>'} Image loaded successfully.</p>}
                            {status === 'failed' && (
                                <div>
                                    <p className="text-red-400">{'>'} ERROR: Analysis Failed.</p>
                                    <p className="text-xs mt-1 text-red-400/70">{'>'} DETAILS: {error}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1">Confidence</p>
                                    <p className="text-2xl font-medium text-white">{result.confidence ? result.confidence.toFixed(1) : 'N/A'}%</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1">Detected Words</p>
                                    <p className="text-2xl font-medium text-white">{result.words ? result.words.length : 0}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-2">Raw Text Extraction</p>
                                <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5 whitespace-pre-wrap text-slate-200 font-sans text-base leading-relaxed min-h-[100px]">
                                    {result.text ? result.text : <span className="text-slate-500 italic">No text detected in this image.</span>}
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-2">JSON Data Stream</p>
                                <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5 text-xs text-slate-400 overflow-x-auto">
                                    <pre>{JSON.stringify(result.words ? result.words.slice(0, 5) : [], null, 2)}</pre>
                                    {result.words && result.words.length > 5 && <p className="mt-2 text-slate-600">... {result.words.length - 5} more items</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-500 font-light">
                <AlertCircle size={12} />
                <span>Powered by Google Gemini Vision Pro.</span>
            </div>
        </div>
    );
}
