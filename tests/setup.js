// Test setup file - runs before all tests

// Mock CONFIG global
global.CONFIG = {
  SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/TEST/WEBHOOK/URL'
};

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

