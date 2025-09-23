# Vercel CLI Usage Guide

## Overview
The Vercel CLI allows you to run your Next.js application in an environment that closely mimics Vercel's production deployment, making it easier to debug and test before deploying.

## Quick Start

### 1. Start Vercel Development Server
```bash
vercel dev
```
This will:
- Start a local server (usually on port 3000)
- Emulate Vercel's serverless functions
- Use Vercel's routing and build system
- Provide better debugging for deployment issues

### 2. Alternative: Use Custom Port
```bash
vercel dev --listen 3001
```
This matches your current `npm run dev` port configuration.

## Key Commands

### Development
```bash
# Start development server
vercel dev

# Start with custom port
vercel dev --listen 3001

# Start with debug output
vercel dev --debug

# Start and open browser automatically
vercel dev --open
```

### Deployment
```bash
# Deploy to preview (staging)
vercel

# Deploy to production
vercel --prod

# Deploy specific directory
vercel ./dist
```

### Environment Variables
```bash
# List environment variables
vercel env ls

# Add environment variable
vercel env add VARIABLE_NAME

# Pull environment variables to .env.local
vercel env pull .env.local

# Remove environment variable
vercel env rm VARIABLE_NAME
```

### Project Management
```bash
# Link to existing Vercel project
vercel link

# View project info
vercel project ls

# View deployment logs
vercel logs

# View specific deployment
vercel logs [deployment-url]
```

## Your Project Specific Notes

### Current Configuration
- **Project Name**: test1
- **Next.js Version**: 15.3.1
- **Current Dev Port**: 3001 (via npm run dev)
- **Build Output**: standalone (optimized for Vercel)

### Recommended Workflow
1. **Development**: Use `vercel dev --listen 3001` to match your current setup
2. **Testing**: Test API routes and serverless functions locally
3. **Deployment**: Use `vercel` for preview deployments before production

### Environment Variables
If you have environment variables in your project:
```bash
# Pull from Vercel (if already deployed)
vercel env pull .env.local

# Or add them manually
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
# etc.
```

## Troubleshooting

### Common Issues
1. **Port conflicts**: Use `--listen` flag to specify port
2. **Environment variables**: Ensure they're set in Vercel dashboard or via CLI
3. **Build errors**: Check `vercel logs` for detailed error messages

### Debug Mode
```bash
vercel dev --debug
```
This provides verbose output for troubleshooting.

## Next Steps
1. Run `vercel dev --listen 3001` in a separate terminal
2. Test your application at http://localhost:3001
3. Compare behavior with your current `npm run dev` setup
4. Use this for debugging deployment-specific issues

## Integration with Your Current Setup
- Your current `npm run dev` runs on port 3001
- Vercel dev can use the same port with `--listen 3001`
- Both can run simultaneously on different ports if needed
- Vercel dev provides better serverless function emulation
