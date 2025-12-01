import type { ResumeData, AISuggestionType } from './types';

export const parseLinkedInProfile = async (text: string): Promise<ResumeData> => {
  try {
    const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : '';
    const response = await fetch(`${API_URL}/api/resume/parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error('Failed to parse resume');
    }

    return await response.json();
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
    const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : '';
    const response = await fetch(`${API_URL}/api/resume/improve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentText, suggestionType, context })
    });

    if (!response.ok) {
      throw new Error('Failed to improve text');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error improving text:", error);
    return currentText;
  }
};
