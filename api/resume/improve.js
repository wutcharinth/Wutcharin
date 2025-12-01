import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { currentText, suggestionType, context } = req.body;

        if (!process.env.VITE_GEMINI_API_KEY) {
            return res.status(500).json({ error: 'API Key missing on server' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

