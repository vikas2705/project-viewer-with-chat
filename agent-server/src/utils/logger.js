const LOG_LEVELS = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  WARN: 'WARN',
};


function formatLog(level, message) {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message}`;
}

export const logger = {
  info: (message) => console.log(formatLog(LOG_LEVELS.INFO, message)),
  error: (message) => console.error(formatLog(LOG_LEVELS.ERROR, message)),
  warn: (message) => console.warn(formatLog(LOG_LEVELS.WARN, message)),
};

