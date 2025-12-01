import { GoogleGenerativeAI } from '@google/generative-ai';

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
    'https://wutcharin.com',
    'https://www.wutcharin.com',
    'https://wutcharin-production.up.railway.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

export default async function handler(req, res) {
    // Enable CORS with proper origin checking
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get API key from environment (Vercel uses process.env directly)
        const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'API Key missing on server' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const { currentText, suggestionType, context } = req.body;

        if (!currentText) {
            return res.status(400).json({ error: 'currentText is required' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

        const prompt = `Rewrite the following text for a resume.
      
      GOAL: ${suggestionType}
      CONTEXT: ${context || 'General'}
      
      RULES:
      - If the context is 'Experience', ALWAYS use Bullet Points (•).
      - If the context is 'Summary', use a Paragraph.
      - Keep it professional and factual.
      - Return ONLY the rewritten text, no explanations.
      
      ORIGINAL TEXT:
      ${currentText}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text: text || currentText });
    } catch (error) {
        console.error("Error improving text:", error);
        res.status(500).json({ error: 'Failed to improve text', details: error.message });
    }
}

