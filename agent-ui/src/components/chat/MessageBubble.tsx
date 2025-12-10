import React from 'react';
import type { Message } from '../../types';
import { AGENT_GREEN } from '../../constants';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = React.memo(({ message }) => {
  const isUser = message.type === 'user';
  const displayText = message.isStreaming ? message.displayContent : message.content;

  if (!isUser && !displayText) {
    return null;
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}>
      <article
        className={`max-w-xl rounded-3xl px-6 py-4 text-lg leading-relaxed ${
          isUser
            ? 'bg-white text-green-400 border-2'
            : 'text-white'
        }`}
        style={
          isUser
            ? { borderColor: AGENT_GREEN, boxShadow: '0 15px 25px rgba(2, 120, 84, 0.15)' }
            : { backgroundColor: AGENT_GREEN }
        }
        aria-label={isUser ? 'Your message' : 'Assistant message'}
      >
        <p className="whitespace-pre-wrap">{displayText}</p>
      </article>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

