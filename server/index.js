import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '../.env' }); // Load from root .env

const app = express();
const port = process.env.PORT || 3000;

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://wutcharin-portfolio-p9pg07jfy-wthatans-projects.vercel.app',
        'https://www.wutcharin.com'
    ],
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
      Also analyze the layout and structure.
      Return the response in this JSON format:
      {
        "text": "Full extracted text here...",
        "confidence": 95,
        "words": [
          { "text": "Word1", "confidence": 99, "bbox": { "x0": 10, "y0": 10, "x1": 50, "y1": 20 } },
          ...
        ]
      }
      For the bounding boxes (bbox), estimate them based on the image layout if possible, or return null if not supported.
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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
