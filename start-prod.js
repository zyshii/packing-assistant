#!/usr/bin/env node

// Production startup script that ensures build is done before starting
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

const distPath = path.join(process.cwd(), 'dist');

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function startProduction() {
  try {
    // Check if dist folder exists, if not, build first
    if (!existsSync(distPath)) {
      console.log('Built files not found. Building application...');
      await runCommand('npm', ['run', 'build']);
    }

    // Start the production server
    console.log('Starting production server...');
    await runCommand('npm', ['start']);
  } catch (error) {
    console.error('Failed to start production server:', error.message);
    process.exit(1);
  }
}

startProduction();