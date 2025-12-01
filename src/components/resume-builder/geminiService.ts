import type { ResumeData, AISuggestionType } from './types';

export const parseLinkedInProfile = async (text: string): Promise<ResumeData> => {
  try {
    const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : '';
    const apiEndpoint = `${API_URL}/api/resume/parse`;
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Failed to parse resume: HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error parsing LinkedIn data:", error);
    throw error instanceof Error ? error : new Error('Failed to parse resume data');
  }
};

export const improveTextSection = async (
  currentText: string,
  suggestionType: AISuggestionType,
  context?: string
): Promise<string> => {
  try {
    const API_URL = import.meta.env.DEV ? 'http://localhost:3000' : '';
    const apiEndpoint = `${API_URL}/api/resume/improve`;
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentText, suggestionType, context })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `Failed to improve text: HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.text || currentText;
  } catch (error) {
    console.error("Error improving text:", error);
    // Return original text on error, but log the error for debugging
    if (error instanceof Error) {
      console.error("Improvement error details:", error.message);
    }
    return currentText;
  }
};
