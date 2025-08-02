# Deployment Guide

## Issue
The current `.replit` configuration uses development commands which are flagged as security risks during deployment.

## Current Configuration Problem
```
[deployment]
deploymentTarget = "autoscale"
run = ["sh", "-c", "npm run dev"]
```

## Recommended Solutions

### Option 1: Manual .replit Configuration (Requires User Action)
Since the agent cannot modify `.replit` directly, you need to:

1. Open `.replit` file manually
2. Change the deployment section from:
   ```
   [deployment]
   deploymentTarget = "autoscale"
   run = ["sh", "-c", "npm run dev"]
   ```
   
   To:
   ```
   [deployment]
   deploymentTarget = "autoscale"
   run = ["sh", "-c", "npm run build && npm start"]
   ```

### Option 2: Use Production Scripts (Ready Now)
We have production-ready scripts available:

- `npm run build` - Builds production assets
- `npm start` - Starts production server
- `node start-prod.js` - Complete production startup with build

### Option 3: Environment-Based Approach
The current server setup can detect the environment and run accordingly.

## Production Readiness Checklist
- ✅ Build script creates optimized production assets
- ✅ Production server script available
- ✅ Environment variables configured
- ✅ Database setup ready
- ✅ Static assets properly bundled
- ❌ .replit file still configured for development

## Manual Steps Required
1. Edit `.replit` file to use production commands
2. Ensure environment variables are set for production
3. Deploy using Replit's deployment interface

## Alternative Deployment Commands
If you can modify the deployment configuration:

```bash
# For autoscale deployment
npm run build && npm start

# Or using our production script
node start-prod.js
```

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV=production` - Production environment flag
- Any API keys needed for external services