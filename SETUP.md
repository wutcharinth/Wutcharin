# Quick Setup Guide

## Automatic Vercel Environment Variable Configuration

To automatically configure the Gemini API key in Vercel:

### Step 1: Login to Vercel
```bash
npx vercel login
```

### Step 2: Run the setup script
```bash
npm run setup:vercel
```

This will automatically set:
- `VITE_GEMINI_API_KEY` for production, preview, and development
- `GEMINI_API_KEY` for production, preview, and development (for serverless functions)

### Step 3: Redeploy
After setting the environment variables, redeploy your project:
```bash
npx vercel --prod
```

Or push a new commit to trigger auto-deployment.

## Manual Setup (Alternative)

If you prefer to set it manually:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - **Key**: `VITE_GEMINI_API_KEY`
   - **Value**: `AIzaSyC9FgOn0tRr8_a6PoimWFRX38LBz2aMVnY`
   - **Environments**: Production, Preview, Development
5. Add another:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyC9FgOn0tRr8_a6PoimWFRX38LBz2aMVnY`
   - **Environments**: Production, Preview, Development

## Verify Setup

After deployment, test the API:
- Visit: `https://wutcharin.com/api/test-env`
- This will show if the environment variables are accessible

