
export interface Experience {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
}

export interface Education {
    id: string;
    degree: string;
    school: string;
    year: string;
}

export interface Skill {
    id: string;
    name: string;
}

export interface ResumeData {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    linkedinUrl: string;
    portfolioUrl: string;
    summary: string;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    competencies: Skill[];
    suggestedLayout?: LayoutType; // AI suggestion
}

export const TemplateType = {
    PROFESSIONAL: 'PROFESSIONAL',
    MODERN: 'MODERN',
    SIMPLE: 'SIMPLE',
    CREATIVE: 'CREATIVE',
    BRUTALISM: 'BRUTALISM'
} as const;

export type TemplateType = typeof TemplateType[keyof typeof TemplateType];

export const LayoutType = {
    SINGLE_COLUMN: 'SINGLE_COLUMN',
    TWO_COLUMN_LEFT: 'TWO_COLUMN_LEFT',
    TWO_COLUMN_RIGHT: 'TWO_COLUMN_RIGHT'
} as const;

export type LayoutType = typeof LayoutType[keyof typeof LayoutType];

export type FontFamily = 'Inter' | 'Roboto' | 'Lora' | 'Merriweather' | 'Playfair Display' | 'Space Mono';

export const FontSize = {
    SMALL: 'SMALL',
    MEDIUM: 'MEDIUM',
    LARGE: 'LARGE'
} as const;

export type FontSize = typeof FontSize[keyof typeof FontSize];

export interface AIResponse {
    improvedText: string;
    explanation?: string;
}

export const AISuggestionType = {
    PROFESSIONAL: 'Make it more professional',
    PUNCHY: 'Make it concise and impactful',
    GRAMMAR: 'Fix grammar and flow',
    EXECUTIVE: 'Rewrite for executive level',
} as const;

export type AISuggestionType = typeof AISuggestionType[keyof typeof AISuggestionType];
