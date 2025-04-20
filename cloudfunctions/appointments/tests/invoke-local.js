/**
 * Local invoker for cloud function testing
 * 
 * This script allows you to test the cloud function locally by directly
 * requiring the compiled JavaScript and calling the main function with
 * the provided event data.
 */

// Mock the wx-server-sdk for local testing
const mockDb = {
  collection: (name) => ({
    doc: (id) => ({
      get: () => Promise.resolve({ data: {} }),
      update: (data) => Promise.resolve({}),
      set: (data) => Promise.resolve({}),
      remove: () => Promise.resolve({}),
    }),
    add: (data) => Promise.resolve({ _id: 'mock-id-' + Date.now() }),
    where: () => ({
      get: () => Promise.resolve({ data: [] }),
      count: () => Promise.resolve({ total: 0 }),
    }),
    count: () => Promise.resolve({ total: 0 }),
    orderBy: () => mockDb.collection(name),
    limit: () => mockDb.collection(name),
    skip: () => mockDb.collection(name),
    get: () => Promise.resolve({ data: [] }),
  }),
  command: {
    eq: (val) => ({ $eq: val }),
    neq: (val) => ({ $ne: val }),
    lt: (val) => ({ $lt: val }),
    lte: (val) => ({ $lte: val }),
    gt: (val) => ({ $gt: val }),
    gte: (val) => ({ $gte: val }),
    in: (val) => ({ $in: val }),
    nin: (val) => ({ $nin: val }),
    and: (val) => ({ $and: val }),
    or: (val) => ({ $or: val }),
  },
  serverDate: () => ({ getTime: () => Date.now() }),
  Geo: {},
  RegExp: {},
};

// Mock the wx-server-sdk module
require.cache[require.resolve('wx-server-sdk')] = {
  exports: {
    default: {
      init: () => {},
      DYNAMIC_CURRENT_ENV: 'local-env',
      database: () => mockDb,
    }
  }
};

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