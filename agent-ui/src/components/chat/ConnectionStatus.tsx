import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  onReconnect: () => void;
}

/**
 * ConnectionStatus component displays the WebSocket connection state
 */
export const ConnectionStatus: React.FC<ConnectionStatusProps> = React.memo(({
  isConnected,
  isConnecting,
  onReconnect,
}) => {
  if (isConnecting) {
    return (
      <output 
        className="flex items-center gap-2 text-sm text-yellow-600"
        aria-live="polite"
      >
        <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" aria-hidden="true" />
        <span>Connecting...</span>
      </output>
    );
  }

  if (!isConnected) {
    return (
      <button
        onClick={onReconnect}
        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
        aria-label="Reconnect to chat server"
      >
        <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
        <span>Disconnected - Click to reconnect</span>
      </button>
    );
  }

  return (
    <output 
      className="flex items-center gap-2 text-sm text-green-600"
      aria-live="polite"
    >
      <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
      <span>Connected</span>
    </output>
  );
});

ConnectionStatus.displayName = 'ConnectionStatus';