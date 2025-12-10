import { useRef, useCallback, useState, useEffect } from 'react';
import type { WebSocketMessage, UseWebSocketOptions } from '../types';
import { RECONNECT_INTERVAL, MAX_RECONNECT_ATTEMPTS } from '../constants';

/**
 * Custom hook for managing WebSocket connections with automatic reconnection
 * 
 * @param options - Configuration options for the WebSocket connection
 * @returns WebSocket connection state and control functions
 */
export function useWebSocket({
  url,
  onMessage,
  onConnect,
  onDisconnect,
  reconnectInterval = RECONNECT_INTERVAL,
  maxReconnectAttempts = MAX_RECONNECT_ATTEMPTS,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Use refs to avoid stale closures in event handlers
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
  }, [onMessage, onConnect, onDisconnect]);

  const connect = useCallback(() => {
   
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('Already connected');
      return;
    }
    if (wsRef.current?.readyState === WebSocket.CONNECTING) {
      console.log('Already connecting');
      return;
    }

    setIsConnecting(true);

    try {
      console.log('Creating WebSocket connection to:', url);
      const ws = new WebSocket(url);

      ws.onopen = () => {
        if (!mountedRef.current) return;
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0;
        onConnectRef.current?.();
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessageRef.current?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;
        onDisconnectRef.current?.();

        // Attempt to reconnect if component is still mounted and we haven't exceeded attempts
        if (mountedRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              connect();
            }
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);

        setIsConnecting(false);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setIsConnecting(false);
    }
  }, [url, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    reconnectAttemptsRef.current = maxReconnectAttempts; 
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, [maxReconnectAttempts]);

  const sendMessage = useCallback((content: string): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type: 'chat', content }));
        return true;
      } catch (error) {
        console.error('Failed to send message:', error);
        return false;
      }
    }
    return false;
  }, []);

  // Auto-connect on mount, cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    sendMessage,
  };
}
