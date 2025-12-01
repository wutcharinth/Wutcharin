import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
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

// 2. Election Chatbot
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

// 3. Resume Builder Parser
app.post('/api/resume/parse', async (req, res) => {
    try {
        const { text } = req.body;

        if (!process.env.VITE_GEMINI_API_KEY) {
            return res.status(500).json({ error: 'API Key missing on server' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
