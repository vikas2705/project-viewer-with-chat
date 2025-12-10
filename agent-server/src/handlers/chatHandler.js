import { sendSafe } from '../utils/websocket.js';
import { getMockResponse } from '../utils/mockResponses.js';
import { sleep } from '../utils/sleep.js';
import { MOCK_RESPONSE_DELAY, STREAM_WORD_DELAY_MIN, STREAM_WORD_DELAY_MAX } from '../constants.js';
import { logger } from '../utils/logger.js';

/**
 * Handles incoming chat messages from WebSocket clients
 * @param {WebSocket} ws - WebSocket connection
 * @param {string} userMessage - User's message content
 * @param {object} model - Gemini AI model instance (if available)
 * @param {boolean} useAI - Whether AI is enabled
 */
export async function handleChatMessage(ws, userMessage, model, useAI) {
  sendSafe(ws, {
    type: 'thinking',
    content: 'Analyzing your question...',
  });

  if (useAI && model) {
    await streamGeminiResponse(ws, userMessage, model);
  } else {
    await sendMockResponse(ws, userMessage);
  }
}

/**
 * Streams response from Gemini AI model
 * @param {WebSocket} ws - WebSocket connection
 * @param {string} userMessage - User's message
 * @param {object} model - Gemini AI model instance
 */
async function streamGeminiResponse(ws, userMessage, model) {
  try {
    sendSafe(ws, { type: 'thinking_done' });

    const result = await model.generateContentStream(userMessage);
    let fullResponse = '';

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        fullResponse += text;
        sendSafe(ws, {
          type: 'stream',
          content: text,
        });
      }
    }

    sendSafe(ws, {
      type: 'done',
      content: fullResponse,
    });
  } catch (error) {
    logger.error(`Gemini Error: ${error.message}`);
    await sendMockResponse(ws, userMessage);
  }
}

/**
 * Sends a mock response with streaming effect
 * @param {WebSocket} ws - WebSocket connection
 * @param {string} userMessage - User's message
 */
async function sendMockResponse(ws, userMessage) {
  await sleep(MOCK_RESPONSE_DELAY);
  sendSafe(ws, { type: 'thinking_done' });
  
  const response = getMockResponse(userMessage);
  const words = response.split(' ');

  for (const word of words) {
    await sleep(STREAM_WORD_DELAY_MIN + Math.random() * (STREAM_WORD_DELAY_MAX - STREAM_WORD_DELAY_MIN));
    sendSafe(ws, {
      type: 'stream',
      content: word + ' ',
    });
  }

  sendSafe(ws, {
    type: 'done',
    content: response,
  });
}
