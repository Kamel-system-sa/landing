#!/usr/bin/env node

/**
 * Sync Configuration Script
 * Reads config.json and generates js/config.js for browser use
 */

const fs = require('fs');
const path = require('path');

const CONFIG_JSON_PATH = path.join(__dirname, '..', 'config.json');
const OUTPUT_JS_PATH = path.join(__dirname, '..', 'js', 'config.js');

function syncConfig() {
  try {
    // Check if config.json exists
    if (!fs.existsSync(CONFIG_JSON_PATH)) {
      console.error('❌ Error: config.json not found!');
      console.error('Please copy config.example.json to config.json and fill in your values.');
      process.exit(1);
    }

    // Read and parse config.json
    const configData = fs.readFileSync(CONFIG_JSON_PATH, 'utf8');
    let config;
    
    try {
      config = JSON.parse(configData);
    } catch (parseError) {
      console.error('❌ Error: Invalid JSON in config.json');
      console.error(parseError.message);
      process.exit(1);
    }

    // Validate required fields
    if (!config.SLACK_WEBHOOK_URL) {
      console.error('❌ Error: SLACK_WEBHOOK_URL is required in config.json');
      process.exit(1);
    }

    // Generate js/config.js content
    const jsContent = `// Configuration File for Kamel Landing Page
// ⚠️ AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// This file is generated from config.json
// To update configuration, edit config.json and run: npm run sync:config

const CONFIG = ${JSON.stringify(config, null, 2)};

// Export for browser use
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
`;

    // Write to js/config.js
    fs.writeFileSync(OUTPUT_JS_PATH, jsContent, 'utf8');

    console.log('✅ Configuration synced successfully!');
    console.log(`   Source: config.json`);
    console.log(`   Output: js/config.js`);
  } catch (error) {
    console.error('❌ Error syncing configuration:', error.message);
    process.exit(1);
  }
}

// Run the sync
syncConfig();

