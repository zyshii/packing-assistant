#!/usr/bin/env node

// Simple production entry point
// This can be used as: node production.js

const { execSync } = require('child_process');
const path = require('path');

// Set production environment
process.env.NODE_ENV = 'production';

try {
  console.log('🏗️  Building production assets...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('🚀 Starting production server...');
  execSync('node dist/index.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Production startup failed:', error.message);
  process.exit(1);
}