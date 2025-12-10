/**
 * Main server entry point
 * Sets up Express HTTP server and WebSocket server for real-time AI chat
 */

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeGemini } from './services/geminiService.js';
import { handleChatMessage } from './handlers/chatHandler.js';
import { sendSafe } from './utils/websocket.js';
import { DEFAULT_PORT } from './constants.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const wss = new WebSocketServer({ server });

// AI service state
let model = null;
let useAI = false;

/**
 * Health check endpoint
 */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', gemini: useAI });
});

/**
 * WebSocket connection handler
 */
wss.on('connection', (ws) => {
  logger.info('Client connected');

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === 'chat') {
        await handleChatMessage(ws, message.content, model, useAI);
      }
    } catch (error) {
      logger.error(`Error processing message: ${error.message}`);
      sendSafe(ws, { type: 'error', content: 'Failed to process message' });
    }
  });

  ws.on('close', () => {
    logger.info('Client disconnected');
  });

  ws.on('error', (error) => {
    logger.error(`WebSocket error: ${error.message}`);
  });

  sendSafe(ws, { type: 'connected', content: 'Connected to chat server' });
});

/**
 * Starts the server
 */
async function start() {
  logger.info('Initializing server...');
  
  const geminiResult = await initializeGemini();
  model = geminiResult.model;
  useAI = geminiResult.useAI;

  const PORT = process.env.PORT || DEFAULT_PORT;

  server.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`WebSocket available at ws://localhost:${PORT}`);
  });
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

start();
