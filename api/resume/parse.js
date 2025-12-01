import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get API key from environment
        // Note: Vercel exposes all env vars to serverless functions, including VITE_ prefixed ones
        const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            // Log available env vars for debugging (without exposing values)
            const envKeys = Object.keys(process.env).filter(k => k.includes('GEMINI') || k.includes('API'));
            console.error('API Key missing. Available env vars:', envKeys);
            return res.status(500).json({ 
                error: 'API Key missing on server',
                debug: process.env.NODE_ENV === 'development' ? { envKeys } : undefined
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const { text } = req.body;

        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'Text is required' });
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
        const errorStack = error instanceof Error ? error.stack : undefined;
        
        // Return more detailed error in development
        res.status(500).json({ 
            error: 'Failed to parse resume data', 
            details: errorMessage,
            ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
        });
    }
}

