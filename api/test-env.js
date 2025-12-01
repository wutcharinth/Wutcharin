export default async function handler(req, res) {
    // Test endpoint to check environment variables
    const hasViteKey = !!process.env.VITE_GEMINI_API_KEY;
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    const allKeys = Object.keys(process.env).filter(k => k.includes('GEMINI') || k.includes('API'));
    
    res.json({
        hasViteKey,
        hasGeminiKey,
        allKeys,
        nodeEnv: process.env.NODE_ENV,
        message: hasViteKey || hasGeminiKey 
            ? 'API key found!' 
            : 'API key NOT found. Check Vercel environment variables.'
    });
}

