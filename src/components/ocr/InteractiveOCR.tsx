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

                        // Draw box
                        ctx.strokeStyle = '#00ff00';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(x0, y0, width, height);

                        // Draw background for text
                        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
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
        <div className="w-full max-w-6xl mx-auto p-6 bg-bg text-text font-mono rounded-none border-2 border-border shadow-[8px_8px_0px_0px_var(--shadow-color)]">
            <div className="flex items-center justify-between mb-6 border-b-4 border-border pb-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <Sparkles className="text-primary animate-pulse" />
                    GEMINI_VISION_DEMO_V1.0
                </h2>
                <div className="flex items-center gap-4 text-sm font-bold">
                    <span className={`flex items-center gap-2 px-3 py-1 border-2 border-border ${isProcessing ? 'bg-yellow-400 text-black animate-pulse' : 'bg-green-500 text-white'}`}>
                        {isProcessing ? <RefreshCw className="animate-spin w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        STATUS: {status.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Panel: Image Input/Display */}
                <div className="space-y-4">
                    <div className="relative min-h-[400px] bg-white border-2 border-border shadow-[4px_4px_0px_0px_var(--shadow-color)] overflow-hidden flex flex-col items-center justify-center group">
                        {!image ? (
                            <div {...getRootProps()} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                                <input {...getInputProps()} />
                                <Upload className="w-16 h-16 mb-4 text-primary opacity-50 group-hover:scale-110 transition-transform" />
                                <p className="text-xl font-black uppercase tracking-tight">DROP IMAGE HERE</p>
                                <p className="text-sm font-bold opacity-50 mt-2">or click to upload</p>
                                <p className="text-xs font-bold bg-black text-white px-2 py-1 mt-4">SUPPORTS: JPG, PNG</p>
                                <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wide">
                                    (PDF support available in production pipeline)
                                </p>
                            </div>
                        ) : (
                            <div className="relative w-full h-full bg-gray-100 flex items-center justify-center p-4">
                                <img
                                    ref={imageRef}
                                    src={image}
                                    alt="Uploaded"
                                    className="max-w-full max-h-[500px] object-contain border-2 border-border shadow-sm"
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
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-full max-w-xs bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_black]">
                                            <div className="h-4 bg-gray-200 border-2 border-black mb-2">
                                                <motion.div
                                                    className="h-full bg-primary"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <p className="text-center font-bold text-xs uppercase">PROCESSING... {progress}%</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={runOCR}
                            disabled={!image || isProcessing}
                            className="flex-1 py-4 bg-primary text-white border-2 border-border font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2"
                        >
                            <Scan size={20} />
                            INITIATE SCAN
                        </button>
                        <button
                            onClick={reset}
                            disabled={isProcessing}
                            className="px-8 py-4 bg-white text-black border-2 border-border font-black uppercase tracking-widest hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            RESET
                        </button>
                    </div>
                </div>

                {/* Right Panel: Data Output */}
                <div className="bg-black text-green-400 border-2 border-border shadow-[8px_8px_0px_0px_var(--shadow-color)] p-4 font-mono text-sm h-[500px] overflow-y-auto custom-scrollbar relative">
                    <div className="sticky top-0 bg-black/90 backdrop-blur border-b border-green-900/50 pb-2 mb-4 flex items-center gap-2 z-10">
                        <FileText size={16} />
                        <span className="font-bold">TERMINAL OUTPUT</span>
                    </div>

                    {!result ? (
                        <div className="text-gray-500 space-y-2 opacity-70">
                            <p>{'>'} System ready...</p>
                            <p>{'>'} Waiting for input...</p>
                            {image && <p className="text-green-500">{'>'} Image loaded successfully.</p>}
                            {status === 'failed' && (
                                <div className="text-red-500 font-bold">
                                    <p>{'>'} ERROR: Analysis Failed.</p>
                                    <p className="text-xs mt-1 text-red-400">{'>'} DETAILS: {error}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-900 p-3 border border-green-900/30">
                                    <p className="text-xs text-gray-500 mb-1">CONFIDENCE</p>
                                    <p className="text-2xl font-bold text-white">{result.confidence ? result.confidence.toFixed(1) : 'N/A'}%</p>
                                </div>
                                <div className="bg-gray-900 p-3 border border-green-900/30">
                                    <p className="text-xs text-gray-500 mb-1">DETECTED WORDS</p>
                                    <p className="text-2xl font-bold text-white">{result.words ? result.words.length : 0}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-2 uppercase">RAW TEXT EXTRACTION</p>
                                <div className="bg-gray-900 p-4 border border-green-900/30 whitespace-pre-wrap text-white font-sans text-lg leading-relaxed min-h-[100px]">
                                    {result.text ? result.text : <span className="text-gray-500 italic">No text detected in this image.</span>}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-2 uppercase">JSON DATA STREAM</p>
                                <div className="bg-gray-900 p-4 border border-green-900/30 text-xs text-gray-400 overflow-x-auto">
                                    <pre>{JSON.stringify(result.words ? result.words.slice(0, 5) : [], null, 2)}</pre>
                                    {result.words && result.words.length > 5 && <p className="mt-2 text-gray-600">... {result.words.length - 5} more items</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-border flex items-center gap-2 text-xs font-bold uppercase tracking-wide opacity-70">
                <AlertCircle size={14} />
                <span>NOTE: Powered by Google Gemini Vision Pro.</span>
            </div>
        </div>
    );
}
