import { GoogleGenerativeAI } from '@google/generative-ai';
import { MODEL_OPTIONS, GEMINI_API_KEY_URL } from '../constants.js';
import { logger } from '../utils/logger.js';

/**
 * Initializes Gemini AI service
 * @returns {Promise<{genAI: GoogleGenerativeAI | null, model: object | null, useAI: boolean}>}
 */
export async function initializeGemini() {
  if (!process.env.GEMINI_API_KEY) {
    logger.info('No GEMINI_API_KEY found - Using mock responses');
    return { genAI: null, model: null, useAI: false };
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Try each model until one works
  for (const modelName of MODEL_OPTIONS) {
    try {
      logger.info(`Trying model: ${modelName}...`);
      const testModel = genAI.getGenerativeModel({ model: modelName });

      // Test the model with a simple request
      const result = await testModel.generateContent('Hi');
      const response = await result.response;
      const text = response.text();

      if (text) {
        logger.info(`Successfully connected to model: ${modelName}`);
        return { genAI, model: testModel, useAI: true };
      }
    } catch (error) {
      const errorMessage = error.message?.substring(0, 50) || 'Unknown error';
      logger.warn(`Model ${modelName} failed: ${errorMessage}...`);
    }
  }

  logger.warn('All models failed - Using mock responses');
  logger.info(`Make sure your API key is from: ${GEMINI_API_KEY_URL}`);
  return { genAI: null, model: null, useAI: false };
}

