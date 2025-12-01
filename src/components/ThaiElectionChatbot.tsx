import { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { motion, AnimatePresence } from 'framer-motion';
import electionDataRaw from '../data/election-2023.json';
import fullElectionData from '../data/full_election_results.json';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

interface Message {
    id: string;
    role: 'user' | 'ai';
    text: string;
    timestamp: Date;
}

const DEFAULT_INSIGHT = `The 2023 Thai General Election marked a seismic shift in the kingdom's political landscape. 

Against all odds, the **Move Forward Party**, led by Pita Limjaroenrat, surged to victory, capturing **151 seats** and painting Bangkok orange. This wasn't just an election; it was a referendum on the future.

Ask me anything about the results, regional breakdowns, or the numbers behind this historic vote.`;

export default function ThaiElectionChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            role: 'ai',
            text: DEFAULT_INSIGHT,
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare Context
            const context = JSON.stringify({
                summary: electionDataRaw,
                detailed_results: fullElectionData
            });

            const systemInstruction = `
                You are an expert AI Political Analyst specializing in the 2023 Thai General Election.
                
                CURRENT DATE: ${new Date().toLocaleDateString()}
                
                ROLE & TONE:
                - You are a cinematic storyteller and a data scientist combined.
                - Your insights must be **strictly data-driven** based ONLY on the provided JSON context or Google Search results.
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
                ${context}
            `;

            const model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
                systemInstruction: systemInstruction,
                tools: [
                    {
                        functionDeclarations: [
                            {
                                name: "calculate",
                                description: "Evaluates a mathematical expression to perform calculations.",
                                parameters: {
                                    type: SchemaType.OBJECT,
                                    properties: {
                                        expression: {
                                            type: SchemaType.STRING,
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

            // Convert messages to history format
            // We filter out the 'init' message if it's just the welcome text, or map it as model role.
            const history = messages
                .filter(m => m.id !== 'init')
                .map(m => ({
                    role: m.role === 'ai' ? 'model' : 'user',
                    parts: [{ text: m.text }]
                }));

            const chat = model.startChat({
                history: history
            });

            let result = await chat.sendMessage(userMessage.text);
            let response = await result.response;
            let functionCalls = response.functionCalls();

            // Handle Function Calls (Calculator)
            while (functionCalls && functionCalls.length > 0) {
                const call = functionCalls[0]; // Handle one call at a time for simplicity
                if (call.name === 'calculate') {
                    const { expression } = call.args as { expression: string };
                    console.log("Calculating:", expression);

                    let calculationResult;
                    try {
                        // Safe evaluation: only allow numbers and math operators
                        if (/^[0-9+\-*/().\s]+$/.test(expression)) {
                            // eslint-disable-next-line no-new-func
                            calculationResult = new Function('return ' + expression)();
                        } else {
                            calculationResult = "Error: Invalid characters in expression.";
                        }
                    } catch (e) {
                        calculationResult = "Error: Calculation failed.";
                    }

                    // Send result back to model
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
                    break; // Unknown function
                }
            }

            const text = response.text();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                text: text,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'ai',
                text: "I'm having trouble analyzing the data right now. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl flex items-center gap-2 transition-all ${isOpen ? 'hidden' : 'flex'
                    } bg-gradient-to-r from-orange-500 to-red-600 text-white border-2 border-white/20`}
            >
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span className="font-bold hidden md:block">Ask AI Analyst</span>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-zinc-800 border-b border-zinc-700 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Election AI Analyst</h3>
                                    <p className="text-xs text-zinc-400">Powered by Gemini 2.5</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-900/95">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700'
                                            }`}
                                    >
                                        {msg.role === 'ai' ? (
                                            // Simple bold rendering
                                            msg.text.split('**').map((part, i) =>
                                                i % 2 === 1 ? <strong key={i} className="text-orange-400 font-bold">{part}</strong> : part
                                            )
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-800 p-4 rounded-2xl rounded-bl-none border border-zinc-700">
                                        <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-zinc-800 border-t border-zinc-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about the election results..."
                                    className="flex-1 bg-zinc-900 border border-zinc-600 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-500"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
