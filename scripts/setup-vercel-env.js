#!/usr/bin/env node

/**
 * Script to automatically set Vercel environment variables using Vercel CLI
 * Usage: node scripts/setup-vercel-env.js
 */

import { execSync } from 'child_process';

const GEMINI_API_KEY = 'AIzaSyC9FgOn0tRr8_a6PoimWFRX38LBz2aMVnY';
const ENVIRONMENTS = ['production', 'preview', 'development'];
const VAR_NAMES = ['VITE_GEMINI_API_KEY', 'GEMINI_API_KEY'];

function runCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        return false;
    }
}

function checkVercelCLI() {
    try {
        // Try local first, then global
        execSync('npx vercel --version', { stdio: 'pipe' });
        return 'npx';
    } catch {
        try {
            execSync('vercel --version', { stdio: 'pipe' });
            return 'global';
        } catch {
            return false;
        }
    }
}

function checkLoggedIn(vercelCmd) {
    try {
        execSync(`${vercelCmd} whoami`, { stdio: 'pipe' });
        return true;
    } catch {
        return false;
    }
}

async function setEnvVar(varName, environment, value, vercelCmd) {
    console.log(`  Setting ${varName} for ${environment}...`);
    
    try {
        // Use echo to pipe the value
        execSync(`echo "${value}" | ${vercelCmd} env add ${varName} ${environment}`, { 
            stdio: 'pipe',
            shell: true
        });
        console.log(`  ✅ ${varName} set for ${environment}`);
        return true;
    } catch (error) {
        // Variable might already exist, that's okay
        console.log(`  ⚠️  ${varName} for ${environment} might already exist or error occurred`);
        return false;
    }
}

async function main() {
    console.log('🚀 Setting up Vercel environment variables...\n');

    // Check Vercel CLI
    const vercelCmd = checkVercelCLI();
    if (!vercelCmd) {
        console.log('❌ Vercel CLI not found.');
        console.log('Installing locally...');
        runCommand('npm install --save-dev vercel');
        console.log('✅ Vercel CLI installed locally\n');
    } else {
        console.log(`✅ Vercel CLI found (${vercelCmd === 'npx' ? 'local' : 'global'})\n`);
    }

    const cmd = vercelCmd === 'npx' ? 'npx vercel' : 'vercel';

    // Check if logged in
    if (!checkLoggedIn(cmd)) {
        console.log('⚠️  Not logged in to Vercel.');
        console.log(`Please run: ${cmd} login`);
        process.exit(1);
    }

    // Set environment variables
    for (const varName of VAR_NAMES) {
        console.log(`Setting ${varName}...`);
        for (const env of ENVIRONMENTS) {
            await setEnvVar(varName, env, GEMINI_API_KEY, cmd);
        }
        console.log('');
    }

    console.log('✅ Environment variables configured!\n');
    console.log('📝 Next steps:');
    console.log('   1. Redeploy: vercel --prod');
    console.log('   2. Or push to GitHub to trigger auto-deployment\n');
}

main().catch(console.error);

