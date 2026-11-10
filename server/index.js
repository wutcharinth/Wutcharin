import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from root directory (one level up from server/)
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const port = process.env.PORT || 3000;

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
    'https://wutcharin.com',
    'https://www.wutcharin.com',
    'https://wutcharin-production.up.railway.app',
    'https://wutcharin-portfolio-p9pg07jfy-wthatans-projects.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());

// Configure Multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');

// --- API Endpoints ---

// 1. OCR Analysis
app.post('/api/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        if (!process.env.VITE_GEMINI_API_KEY) {
            console.error('API Key missing');
            return res.status(500).json({ error: 'Server configuration error: API Key missing' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const imagePart = {
            inlineData: {
                data: req.file.buffer.toString('base64'),
                mimeType: req.file.mimetype,
            },
        };

        const prompt = `
      Perform OCR on this image. Extract all visible text.
      Return the response in this JSON format:
      {
        "text": "Full extracted text here...",
        "confidence": 95,
        "words": [
          { "text": "Word1", "confidence": 99, "bbox": { "x0": 10, "y0": 10, "x1": 50, "y1": 20 } },
          ...
        ]
      }
      CRITICAL: Return precise bounding box coordinates (bbox) for EVERY single word detected.
      The coordinates (x0, y0, x1, y1) must be in pixels relative to the image dimensions.
      x0/y0 is top-left, x1/y1 is bottom-right.
      Ensure the JSON is valid and strictly follows the format.
    `;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean up the response to ensure it's valid JSON
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const parsedData = JSON.parse(jsonString);
            res.json(parsedData);
        } catch (e) {
            console.error('Failed to parse Gemini response:', text);
            // Fallback if JSON parsing fails
            res.json({
                text: text,
                confidence: 0,
                words: []
            });
        }

    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Failed to process image', details: error.message });
    }
});

// 2. Resume Builder Parser
app.post('/api/resume/parse', async (req, res) => {
    try {
        const { text } = req.body;

        if (!process.env.VITE_GEMINI_API_KEY) {
            return res.status(500).json({ error: 'API Key missing on server' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `You are an expert Resume Writer and Data Extractor.
      
      TASK:
      1. Extract structured data from the provided text.
      2. If 'skills' are missing or sparse, GENERATE relevant technical/hard skills based on the job descriptions.
      3. GENERATE a list of 'competencies' (soft skills/core strengths like Leadership, Strategic Planning) based on the experience level.
      4. Ensure the summary is professional and executive-level.
      5. Analyze the content volume and SUGGEST the best layout (suggestedLayout).
      6. Format ALL experience descriptions as concise BULLET POINTS (•). Do not use paragraphs for experience descriptions.
      
      RULES:
      - Use ONLY the provided text for factual details (dates, companies, roles).
      - You MAY infer/generate Skills and Competencies if they are not explicitly listed in the text, based on the context of the roles.
      - Do NOT invent companies or degrees.
      - Experience descriptions MUST be bullet points.
      - Return ONLY valid JSON in the specified format.
      
      RAW TEXT:
      ${text}
      
      OUTPUT FORMAT (JSON):
      {
        "fullName": "Name",
        "title": "Professional Title",
        "email": "Email",
        "phone": "Phone",
        "linkedinUrl": "URL",
        "portfolioUrl": "URL",
        "summary": "Summary text",
        "suggestedLayout": "SINGLE_COLUMN" | "TWO_COLUMN_LEFT" | "TWO_COLUMN_RIGHT",
        "experience": [
          { "id": "generate_uuid", "role": "Role", "company": "Company", "period": "Dates", "description": "• Bullet 1\\n• Bullet 2" }
        ],
        "education": [
          { "id": "generate_uuid", "degree": "Degree", "school": "School", "year": "Year" }
        ],
        "skills": [
          { "id": "generate_uuid", "name": "Skill Name" }
        ],
        "competencies": [
          { "id": "generate_uuid", "name": "Competency Name" }
        ]
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // Clean markdown code blocks if present
        let jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Try to extract JSON if it's wrapped in other text
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }

        let parsedData;
        try {
            parsedData = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error("Failed to parse JSON response:", jsonStr);
            throw new Error(`Invalid JSON response from AI: ${parseError.message}`);
        }

        res.json(parsedData);
    } catch (error) {
        console.error("Error parsing resume data:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Failed to parse resume data', details: errorMessage });
    }
});

// 4. Resume Builder Text Improver
app.post('/api/resume/improve', async (req, res) => {
    try {
        const { currentText, suggestionType, context } = req.body;

        if (!process.env.VITE_GEMINI_API_KEY) {
            return res.status(500).json({ error: 'API Key missing on server' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

// Export for Vercel serverless functions
export default app;

// Only listen if not in Vercel environment
if (process.env.VERCEL !== '1') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
