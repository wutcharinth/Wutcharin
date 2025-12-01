import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load election data
const electionDataRaw = JSON.parse(fs.readFileSync(join(__dirname, '../src/data/election-2023.json'), 'utf-8'));
const fullElectionData = JSON.parse(fs.readFileSync(join(__dirname, '../src/data/full_election_results.json'), 'utf-8'));

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
}

