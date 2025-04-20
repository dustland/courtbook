/**
 * Real cloud environment invoker for cloud function testing
 * 
 * This script allows you to test the cloud function with the real wx-server-sdk
 * when you have the proper credentials configured.
 * 
 * Note: You need to have the ENV_ID set in your environment or .env file.
 */

// Load environment variables
require('dotenv').config();

// Get the event data from command line args
let eventData = '';
if (process.argv.length > 2) {
  eventData = process.argv[2];
}

const event = JSON.parse(eventData);
const context = {};

async function run() {
  try {
    console.log('📋 Running with event data:', JSON.stringify(event, null, 2));
    console.log('🔑 Using environment:', process.env.ENV_ID || 'Not set (will use default)');
    
    // Require the compiled function
    const { main } = require('../built/index.js');
    
    // Call the function
    const result = await main(event, context);
    
    // Display the result
    console.log('✅ Result:', JSON.stringify(result, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

run(); 