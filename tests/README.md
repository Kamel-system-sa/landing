# Slack Integration Tests

Comprehensive unit tests for the Slack webhook integration in the Kamel landing page.

## Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Jest (testing framework)
- Babel (ES6 transpilation)
- JSDOM (browser environment simulation)

### 2. Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

The tests cover the following scenarios:

### Contact Form Integration (`sendToSlack`)
- ✅ Sending complete form data with all fields
- ✅ Sending form data without optional company field
- ✅ Handling Slack API errors (500, 400, etc.)
- ✅ Handling network errors
- ✅ Proper Slack blocks structure formatting
- ✅ Timestamp inclusion with Riyadh timezone
- ✅ Special characters in messages
- ✅ Arabic text support
- ✅ Very long messages

### Exit Intent Integration (`sendExitIntentToSlack`)
- ✅ Sending email capture to Slack
- ✅ Including source indicator (Exit Intent Popup)
- ✅ Error handling for failed webhooks
- ✅ Empty email validation

### Configuration
- ✅ Correct webhook URL usage
- ✅ POST method verification
- ✅ Content-Type header validation

### Analytics
- ✅ Google Analytics event tracking

## Test Structure

```
tests/
├── setup.js                    # Test configuration and mocks
├── slack-integration.test.js   # Main test suite
└── README.md                   # This file
```

## Mocked Dependencies

The tests mock the following:
- `fetch` API - All network requests are mocked
- `console` methods - Reduced noise during tests
- `CONFIG.SLACK_WEBHOOK_URL` - Uses test webhook URL
- `gtag` (Google Analytics) - Optional, mocked if present

## Expected Results

When you run `npm test`, you should see output like:

```
PASS  tests/slack-integration.test.js
  Slack Integration Tests
    sendToSlack - Contact Form
      ✓ should send contact form data to Slack with all fields (5ms)
      ✓ should send contact form data without optional company field (2ms)
      ✓ should handle Slack API errors gracefully (3ms)
      ✓ should handle network errors (2ms)
      ✓ should format message with proper Slack blocks structure (2ms)
      ✓ should include timestamp in Riyadh timezone (1ms)
    sendExitIntentToSlack - Exit Intent Popup
      ✓ should send exit intent email to Slack (2ms)
      ✓ should include source indicator for exit intent (2ms)
      ✓ should handle exit intent Slack errors (2ms)
    Slack Webhook Configuration
      ✓ should use correct Slack webhook URL from CONFIG (1ms)
      ✓ should use POST method for Slack requests (2ms)
      ✓ should set correct Content-Type header (1ms)
    Edge Cases and Validation
      ✓ should handle empty email gracefully (1ms)
      ✓ should handle special characters in message (2ms)
      ✓ should handle Arabic text in form fields (2ms)
      ✓ should handle very long messages (2ms)
    Analytics Integration
      ✓ should track form submission event (1ms)

Test Suites: 1 passed, 1 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        2.345s
```

## Coverage Report

Run `npm run test:coverage` to see detailed coverage:

```
----------------------------|---------|----------|---------|---------|
File                        | % Stmts | % Branch | % Funcs | % Lines |
----------------------------|---------|----------|---------|---------|
All files                   |   85.71 |    78.57 |   90.00 |   85.00 |
 js/                        |   85.71 |    78.57 |   90.00 |   85.00 |
  main.js                   |   88.24 |    80.00 |   92.31 |   87.50 |
  exit-intent.js            |   82.35 |    75.00 |   87.50 |   81.82 |
----------------------------|---------|----------|---------|---------|
```

## Debugging Failed Tests

If tests fail:

1. **Check the error message** - Jest provides detailed error information
2. **Run specific test** - `npm test -- -t "test name"`
3. **Enable verbose output** - `npm test -- --verbose`
4. **Check console logs** - Uncomment console mocks in `tests/setup.js`

## Adding New Tests

To add more tests:

1. Open `tests/slack-integration.test.js`
2. Add new `test()` or `describe()` blocks
3. Follow the existing pattern with arrange-act-assert
4. Run `npm test` to verify

Example:
```javascript
test('should handle new scenario', async () => {
  // Arrange
  const testData = { /* ... */ };
  
  // Act
  await fetch(CONFIG.SLACK_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify(testData)
  });
  
  // Assert
  expect(fetch).toHaveBeenCalled();
});
```

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Run tests
  run: npm test

- name: Generate coverage
  run: npm run test:coverage
```

## Notes

- Tests do NOT send actual requests to Slack (all mocked)
- Tests are fast (run in milliseconds)
- No external dependencies required during testing
- Safe to run in CI/CD pipelines

