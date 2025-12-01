# Deployment Guide

## Vercel Deployment

### Environment Variables

**IMPORTANT**: You must set the following environment variable in Vercel:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: `AIzaSyC9FgOn0tRr8_a6PoimWFRX38LBz2aMVnY`
   - **Environment**: Production, Preview, and Development

### Deployment Steps

1. Push to GitHub (already done)
2. Vercel will automatically deploy from the `main` branch
3. Ensure the environment variable is set in Vercel dashboard
4. Redeploy if needed after setting environment variables

### Verifying AI Functionality

After deployment, test:
- **Chatbot**: Go to `/thai-election` and click "Ask AI Analyst"
- **Resume Builder**: Go to `/resume-builder` and paste resume text

### API Endpoints

- `/api/chat` - Election chatbot
- `/api/resume/parse` - Parse resume text
- `/api/resume/improve` - Improve resume text
- `/api/analyze` - OCR analysis

All endpoints require the `VITE_GEMINI_API_KEY` environment variable.

