import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ResumeData, AISuggestionType } from './types';

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const parseLinkedInProfile = async (text: string): Promise<ResumeData> => {
    try {
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
          { "id": "generate_uuid", "role": "Role", "company": "Company", "period": "Dates", "description": "• Bullet 1\n• Bullet 2" }
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
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr) as ResumeData;
    } catch (error) {
        console.error("Error parsing LinkedIn data:", error);
        throw error;
    }
};

export const improveTextSection = async (
    currentText: string,
    suggestionType: AISuggestionType,
    context?: string
): Promise<string> => {
    try {
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
        return response.text() || currentText;
    } catch (error) {
        console.error("Error improving text:", error);
        return currentText;
    }
};
