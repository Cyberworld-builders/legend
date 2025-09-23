#!/usr/bin/env node

/**
 * Production Test Script
 * 
 * This script runs tests against the production deployment
 * to ensure all pages are accessible and working correctly.
 */

const { execSync } = require('child_process');

const PRODUCTION_URL = 'https://cyberworldbuilders.com';

console.log('🚀 Running production tests...');
console.log(`Testing against: ${PRODUCTION_URL}`);

try {
  // Set the production URL and run tests
  process.env.TEST_BASE_URL = PRODUCTION_URL;
  
  // Run the 404 check tests against production
  execSync('npm run test:404', { 
    stdio: 'inherit',
    env: { ...process.env, TEST_BASE_URL: PRODUCTION_URL }
  });
  
  console.log('✅ Production tests completed successfully!');
  
} catch (error) {
  console.error('❌ Production tests failed:');
  console.error(error.message);
  process.exit(1);
}
