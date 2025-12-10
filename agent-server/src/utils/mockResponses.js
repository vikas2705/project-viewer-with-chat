/**
 * Generates a mock response based on user message keywords
 * @param {string} message - User's message
 * @returns {string} - Mock response
 */
export function getMockResponse(message) {
  const text = message.toLowerCase();

  const responses = {
    greeting: 'Hello! How can I help you today? I am your AI assistant and ready to answer any questions you might have.',
    howAreYou: "I'm doing great, thank you for asking! As an AI, I'm always ready and eager to help. What can I do for you today?",
    weather: "I don't have access to real-time weather data, but I'd recommend checking a weather service like weather.com or your phone's weather app for accurate forecasts.",
    help: "I'd be happy to help! You can ask me questions about various topics, get explanations, or have a conversation. What would you like to know?",
    thank: "You're welcome! Is there anything else I can help you with?",
    name: "I'm your friendly AI assistant! I'm here to help you with questions and have conversations.",
    capabilities: "I can help you with a variety of tasks! I can answer questions, have conversations, provide explanations, and more. Just ask me anything!",
  };

  if (text.includes('hi') || text.includes('hello')) {
    return responses.greeting;
  }
  if (text.includes('how are you')) {
    return responses.howAreYou;
  }
  if (text.includes('weather')) {
    return responses.weather;
  }
  if (text.includes('help')) {
    return responses.help;
  }
  if (text.includes('thank')) {
    return responses.thank;
  }
  if (text.includes('name')) {
    return responses.name;
  }
  if (text.includes('what can you do')) {
    return responses.capabilities;
  }

  return `Thanks for your message: "${message}". I'm currently running in demo mode. To get real AI responses, make sure your Gemini API key from https://aistudio.google.com/app/apikey is set in the .env file!`;
}
