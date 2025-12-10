import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import type { Message, WebSocketMessage, ChatProps } from '../../types';
import { AGENT_GREEN, WEBSOCKET_URL, SCROLL_THRESHOLD } from '../../constants';
import { MessageBubble } from './MessageBubble';
import { ThinkingIndicator } from './ThinkingIndicator';
import { ConnectionStatus } from './ConnectionStatus';

const Chat: React.FC<ChatProps> = ({ className = '' }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: '👋 Hi! How can we help?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [thinkingText, setThinkingText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const prevScrollHeightRef = useRef(0);
  

  const currentAssistantIdRef = useRef<string | null>(null);


  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'connected':
        // Connection established
        break;

      case 'thinking':
       
        setThinkingText(message.content);
        break;

      case 'thinking_done':
        break;

      case 'stream':
        
        setThinkingText(null);
        
        if (currentAssistantIdRef.current === null) {
          const assistantId = `assistant-${Date.now()}`;
          currentAssistantIdRef.current = assistantId;
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              type: 'assistant',
              content: message.content,
              timestamp: new Date(),
              isStreaming: true,
              displayContent: message.content,
            },
          ]);
        } else {
       
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === currentAssistantIdRef.current
                ? {
                    ...msg,
                    displayContent: (msg.displayContent || '') + message.content,
                    content: (msg.content || '') + message.content,
                  }
                : msg
            )
          );
        }
        
        if (isAtBottomRef.current && chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
        break;

      case 'done':
     
        if (currentAssistantIdRef.current) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === currentAssistantIdRef.current
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
          currentAssistantIdRef.current = null;
        }
        setThinkingText(null);
        setIsWaiting(false);
        break;

      case 'error':
        
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            type: 'assistant',
            content: message.content || 'Something went wrong. Please try again.',
            timestamp: new Date(),
          },
        ]);
        setThinkingText(null);
        currentAssistantIdRef.current = null;
        setIsWaiting(false);
        break;
    }
  }, []);

  const { isConnected, isConnecting, sendMessage, connect } = useWebSocket({
    url: WEBSOCKET_URL,
    onMessage: handleWebSocketMessage,
    onDisconnect: () => {
      setIsWaiting(false);
      setThinkingText(null);
    },
  });

  
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  const checkIsAtBottom = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
    isAtBottomRef.current = atBottom;
    setShowScrollButton(!atBottom);
  }, []);


  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', checkIsAtBottom);
    return () => container.removeEventListener('scroll', checkIsAtBottom);
  }, [checkIsAtBottom]);

  
  useLayoutEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    if (isAtBottomRef.current) {
      container.scrollTop = container.scrollHeight;
    }

    prevScrollHeightRef.current = container.scrollHeight;
  }, [messages, thinkingText]);

  const handleSend = useCallback((messageText?: string) => {
    const text = (messageText ?? inputValue).trim();
    if (!text || isWaiting) return;

    if (!isConnected) {
      connect();
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsWaiting(true);
    sendMessage(text);
  }, [inputValue, isWaiting, isConnected, connect, sendMessage]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }, [handleSend]);


  return (
    <div className={`relative flex h-full flex-col bg-white ${className}`}>
      <div className="border-b border-gray-100 px-6 py-2">
        <ConnectionStatus 
          isConnected={isConnected}
          isConnecting={isConnecting}
          onReconnect={connect}
        />
      </div>
      <div className="flex-1 overflow-hidden p-6">
        <div
          ref={chatContainerRef}
          className="flex h-full flex-col gap-5 overflow-y-auto pr-4"
          style={{ scrollBehavior: 'smooth' }}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <ThinkingIndicator text={thinkingText} />
          <div ref={messagesEndRef} />
        </div>
      </div>
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110"
          style={{ backgroundColor: AGENT_GREEN }}
          aria-label="Scroll to bottom"
        >
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center rounded-full border border-gray-200 bg-white px-5 py-3 shadow-sm">
          <input
            type="text"
            placeholder={isConnected ? "Type here and press enter..." : "Connect to start chatting..."}
            className="flex-1 border-none text-base text-gray-700 placeholder:text-gray-400 focus:outline-none"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isWaiting || !isConnected}
            aria-label="Chat input"
            aria-describedby="chat-input-description"
          />
          <span id="chat-input-description" className="sr-only">
            Type your message and press Enter to send
          </span>
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isWaiting || !isConnected}
            className="rounded-full px-6 py-2 text-sm font-semibold text-white transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
            style={{ backgroundColor: inputValue.trim() && isConnected ? AGENT_GREEN : undefined }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
