#!/bin/bash

# Script to automatically set Vercel environment variables
# Usage: ./scripts/setup-vercel-env.sh

set -e

GEMINI_API_KEY="AIzaSyC9FgOn0tRr8_a6PoimWFRX38LBz2aMVnY"

echo "🚀 Setting up Vercel environment variables..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "⚠️  Not logged in to Vercel. Please run: vercel login"
    exit 1
fi

echo "✅ Vercel CLI found"
echo ""

# Set environment variables
echo "Setting VITE_GEMINI_API_KEY..."
vercel env add VITE_GEMINI_API_KEY production <<< "$GEMINI_API_KEY" || echo "Variable might already exist"
vercel env add VITE_GEMINI_API_KEY preview <<< "$GEMINI_API_KEY" || echo "Variable might already exist"
vercel env add VITE_GEMINI_API_KEY development <<< "$GEMINI_API_KEY" || echo "Variable might already exist"

echo ""
echo "Setting GEMINI_API_KEY (without VITE_ prefix for serverless functions)..."
vercel env add GEMINI_API_KEY production <<< "$GEMINI_API_KEY" || echo "Variable might already exist"
vercel env add GEMINI_API_KEY preview <<< "$GEMINI_API_KEY" || echo "Variable might already exist"
vercel env add GEMINI_API_KEY development <<< "$GEMINI_API_KEY" || echo "Variable might already exist"

echo ""
echo "✅ Environment variables configured!"
echo ""
echo "📝 Next steps:"
echo "   1. Redeploy your project: vercel --prod"
echo "   2. Or trigger a new deployment by pushing to GitHub"
echo ""

