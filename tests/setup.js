// Test setup file - runs before all tests

const fs = require('fs');
const path = require('path');

// Load CONFIG from config.json
try {
  const configPath = path.join(__dirname, '..', 'config.json');
  const configData = fs.readFileSync(configPath, 'utf8');
  global.CONFIG = JSON.parse(configData);
} catch (error) {
  // Fallback to mock config if file not found (e.g., in CI/CD)
  console.warn('Warning: config.json not found, using mock configuration');
  global.CONFIG = {
    SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/TEST/WEBHOOK/URL'
  };
}

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

