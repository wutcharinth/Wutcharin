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
    // Load Election Data
    const electionDataRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/election-2023.json'), 'utf-8'));
    const fullElectionData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/full_election_results.json'), 'utf-8'));

    app.post('/api/chat', async (req, res) => {
        try {
            const { message, history } = req.body;

            if (!process.env.VITE_GEMINI_API_KEY) {
                return res.status(500).json({ error: 'API Key missing on server' });
            }

            const model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                systemInstruction: `
                You are an expert AI Political Analyst specializing in the 2023 Thai General Election.
                
                CURRENT DATE: ${new Date().toLocaleDateString()}
                
                ROLE & TONE:
                - You are a cinematic storyteller and a data scientist combined.
                - Your insights must be **strictly data-driven** based ONLY on the provided JSON context.
                - **NO HALLUCINATIONS**: If the answer is not in the data, explicitly state: "I do not have specific data regarding that inquiry in my current database."
                - Do NOT assume details about candidates or policies not listed in the data.
                
                DATA SOURCES:
                1. "summary": National and provincial level summaries (Parties, Seats, Turnout).
                2. "detailed_results": Candidate-level data for all 400 constituencies (Name, Party, Votes).
                
                TOOLS:
                - **Calculator**: Use this to perform mathematical calculations (sums, percentages, margins) to ensure accuracy.
                
                FORMATTING RULES:
                - Use **bold** for Party Names, Key Figures, and Important Numbers.
                - Use bullet points (•) for lists.
                - Use newlines to separate paragraphs clearly.
                - Keep the response visually clean and easy to read.
                
                DATA CONTEXT:
                ${JSON.stringify({ summary: electionDataRaw, detailed_results: fullElectionData })}
            `,
                tools: [
                    {
                        functionDeclarations: [
                            {
                                name: "calculate",
                                description: "Evaluates a mathematical expression to perform calculations.",
                                parameters: {
                                    type: "OBJECT",
                                    properties: {
                                        expression: {
                                            type: "STRING",
                                            description: "The mathematical expression to evaluate (e.g., '123 + 456', '(500 / 2000) * 100')."
                                        }
                                    },
                                    required: ["expression"]
                                }
                            }
                        ]
                    }
                ]
            });

            const chat = model.startChat({
                history: history || []
            });

            let result = await chat.sendMessage(message);
            let response = await result.response;
            let functionCalls = response.functionCalls();

            // Handle Function Calls (Calculator)
            while (functionCalls && functionCalls.length > 0) {
                const call = functionCalls[0];
                if (call.name === 'calculate') {
                    const { expression } = call.args;
                    console.log("Server Calculating:", expression);

                    let calculationResult;
                    try {
                        if (/^[0-9+\-*/().\s]+$/.test(expression)) {
                            // eslint-disable-next-line no-new-func
                            calculationResult = new Function('return ' + expression)();
                        } else {
                            calculationResult = "Error: Invalid characters in expression.";
                        }
                    } catch (e) {
                        calculationResult = "Error: Calculation failed.";
                    }

                    result = await chat.sendMessage([
                        {
                            functionResponse: {
                                name: 'calculate',
                                response: { result: calculationResult }
                            }
                        }
                    ]);
                    response = await result.response;
                    functionCalls = response.functionCalls();
                } else {
                    break;
                }
            }

            const text = response.text();
            res.json({ text });

        } catch (error) {
            console.error('Chat API Error:', error);
            res.status(500).json({ error: 'Failed to process chat request', details: error.message });
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
