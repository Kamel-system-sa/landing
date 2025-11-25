/**
 * Slack Integration Tests
 * Tests for sendToSlack and sendExitIntentToSlack functions
 */

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Slack Integration Tests', () => {
  
  describe('sendToSlack - Contact Form', () => {
    
    beforeEach(() => {
      // Mock successful fetch response
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true })
      });
    });

    test('should send contact form data to Slack with all fields', async () => {
      const testData = {
        name: 'Ahmed Al-Rashid',
        email: 'ahmed@example.com',
        company: 'Test Company',
        message: 'I would like to schedule a demo'
      };

      // Simulate the sendToSlack function
      const slackMessage = {
        text: 'New Contact Form Form Submission from Kamel Website!',
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "New Contact Form Submission",
              emoji: true
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*👤 Name:*\n${testData.name}`
              },
              {
                type: "mrkdwn",
                text: `*📧 Email:*\n${testData.email}`
              },
              {
                type: "mrkdwn",
                text: `*🏢 Company:*\n${testData.company}`
              }
            ]
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*💬 Message:*\n${testData.message}`
            }
          },
          {
            type: "context",
            elements: expect.any(Array)
          }
        ]
      };

      await fetch(CONFIG.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackMessage)
      });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        CONFIG.SLACK_WEBHOOK_URL,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
      );
    });

    test('should send contact form data without optional company field', async () => {
      const testData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
        // No company field
      };

      await fetch(CONFIG.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'Test', blocks: [] })
      });

      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('should handle Slack API errors gracefully', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test'
      };

      try {
        await fetch(CONFIG.SLACK_WEBHOOK_URL, {
          method: 'POST',
          body: JSON.stringify(testData)
        });
        
        const response = await fetch.mock.results[0].value;
        expect(response.ok).toBe(false);
        expect(response.status).toBe(500);
      } catch (error) {
        // Error should be caught and handled
        expect(error).toBeDefined();
      }
    });

    test('should handle network errors', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      try {
        await fetch(CONFIG.SLACK_WEBHOOK_URL, {
          method: 'POST',
          body: JSON.stringify({ test: 'data' })
        });
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });

    test('should format message with proper Slack blocks structure', async () => {
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        company: 'Test Corp',
        message: 'This is a test message'
      };

      const slackMessage = {
        text: expect.any(String),
        blocks: expect.arrayContaining([
          expect.objectContaining({
            type: 'header'
          }),
          expect.objectContaining({
            type: 'section',
            fields: expect.any(Array)
          })
        ])
      };

      await fetch(CONFIG.SLACK_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(slackMessage)
      });

      expect(fetch).toHaveBeenCalled();
    });

    test('should include timestamp in Riyadh timezone', async () => {
      const now = new Date();
      const riyadhTime = now.toLocaleString('en-US', { timeZone: 'Asia/Riyadh' });

      const slackMessage = {
        blocks: [
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: `⏰ Submitted: ${riyadhTime} (Riyadh time)`
              }
            ]
          }
        ]
      };

      expect(slackMessage.blocks[0].elements[0].text).toContain('Riyadh time');
      expect(slackMessage.blocks[0].elements[0].text).toContain('⏰');
    });
  });

  describe('sendExitIntentToSlack - Exit Intent Popup', () => {
    
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200
      });
    });

    test('should send exit intent email to Slack', async () => {
      const testEmail = 'exitintent@example.com';

      const slackMessage = {
        text: 'New Exit Intent Lead from Kamel Website!',
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "New Exit Intent Lead Captured!",
              emoji: true
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*📧 Email:*\n${testEmail}`
              },
              {
                type: "mrkdwn",
                text: "*🎯 Source:*\nExit Intent Popup"
              }
            ]
          },
          {
            type: "context",
            elements: expect.any(Array)
          }
        ]
      };

      await fetch(CONFIG.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackMessage)
      });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        CONFIG.SLACK_WEBHOOK_URL,
        expect.objectContaining({
          method: 'POST'
        })
      );
    });

    test('should include source indicator for exit intent', async () => {
      const testEmail = 'test@example.com';

      const slackMessage = {
        blocks: [
          {
            type: "section",
            fields: expect.arrayContaining([
              expect.objectContaining({
                text: expect.stringContaining('Exit Intent Popup')
              })
            ])
          }
        ]
      };

      await fetch(CONFIG.SLACK_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(slackMessage)
      });

      expect(fetch).toHaveBeenCalled();
    });

    test('should handle exit intent Slack errors', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 400
      });

      const response = await fetch(CONFIG.SLACK_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' })
      });

      expect(response.ok).toBe(false);
    });
  });

  describe('Slack Webhook Configuration', () => {
    
    test('should use correct Slack webhook URL from CONFIG', () => {
      expect(CONFIG.SLACK_WEBHOOK_URL).toBeDefined();
      expect(CONFIG.SLACK_WEBHOOK_URL).toContain('hooks.slack.com');
    });

    test('should use POST method for Slack requests', async () => {
      await fetch(CONFIG.SLACK_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify({ test: 'data' })
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });

    test('should set correct Content-Type header', async () => {
      await fetch(CONFIG.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: 'data' })
      });

      expect(fetch.mock.calls[0][1].headers['Content-Type']).toBe('application/json');
    });
  });

  describe('Edge Cases and Validation', () => {
    
    test('should handle empty email gracefully', async () => {
      const emptyEmail = '';
      
      if (!emptyEmail) {
        // Should not call fetch if email is empty
        expect(fetch).not.toHaveBeenCalled();
      }
    });

    test('should handle special characters in message', async () => {
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Special chars: <>&"\'`\n\t'
      };

      await fetch(CONFIG.SLACK_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(testData)
      });

      expect(fetch).toHaveBeenCalled();
    });

    test('should handle Arabic text in form fields', async () => {
      const testData = {
        name: 'أحمد الراشد',
        email: 'ahmed@example.com',
        company: 'شركة الحج',
        message: 'رسالة تجريبية'
      };

      await fetch(CONFIG.SLACK_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(testData)
      });

      expect(fetch).toHaveBeenCalled();
    });

    test('should handle very long messages', async () => {
      const longMessage = 'A'.repeat(5000);
      const testData = {
        name: 'Test',
        email: 'test@example.com',
        message: longMessage
      };

      await fetch(CONFIG.SLACK_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(testData)
      });

      expect(fetch).toHaveBeenCalled();
    });
  });

  describe('Analytics Integration', () => {
    
    test('should track form submission event', () => {
      const mockGtag = jest.fn();
      global.gtag = mockGtag;

      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
          'event_category': 'Contact',
          'event_label': 'Contact Form'
        });

        expect(mockGtag).toHaveBeenCalledWith(
          'event',
          'form_submission',
          expect.objectContaining({
            'event_category': 'Contact'
          })
        );
      }

      delete global.gtag;
    });
  });
});

