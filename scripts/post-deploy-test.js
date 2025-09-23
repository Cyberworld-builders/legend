#!/usr/bin/env node

/**
 * Post-Deploy Test Script
 * 
 * This script runs after a Vercel deployment to verify
 * that the deployment was successful and all pages are accessible.
 */

const { execSync } = require('child_process');

// Get the deployment URL from environment variables
const DEPLOYMENT_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : 'https://cyberworldbuilders.com';

console.log('🔍 Running post-deployment tests...');
console.log(`Testing deployment: ${DEPLOYMENT_URL}`);

try {
  // Set the deployment URL and run tests
  process.env.TEST_BASE_URL = DEPLOYMENT_URL;
  
  // Run the 404 check tests against the deployment
  execSync('npm run test:404', { 
    stdio: 'inherit',
    env: { ...process.env, TEST_BASE_URL: DEPLOYMENT_URL }
  });
  
  console.log('✅ Post-deployment tests completed successfully!');
  console.log(`🎉 Deployment at ${DEPLOYMENT_URL} is working correctly!`);
  
} catch (error) {
  console.error('❌ Post-deployment tests failed:');
  console.error(error.message);
  console.error(`🚨 Deployment at ${DEPLOYMENT_URL} has issues!`);
  process.exit(1);
}
