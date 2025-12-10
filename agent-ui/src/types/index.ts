export type MessageType = 'user' | 'assistant';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  displayContent?: string;
}

export interface WebSocketMessage {
  type: 'connected' | 'thinking' | 'thinking_done' | 'stream' | 'done' | 'error';
  content: string;
}

export interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface ChatProps {
  className?: string;
}

