/**
 * Safely sends a message to a WebSocket client
 * dummy comment
 * @param {WebSocket} ws - WebSocket connection
 * @param {object} data - Data to send
 * @returns {boolean} - Whether the message was sent successfully
 */
export function sendSafe(ws, data) {
  if (ws.readyState === 1) { // WebSocket.OPEN
    try {
      ws.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      return false;
    }
  }
  return false;
}
