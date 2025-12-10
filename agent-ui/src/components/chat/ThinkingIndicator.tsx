import React from 'react';

interface ThinkingIndicatorProps {
  text: string | null;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = React.memo(({ text }) => {
  if (!text) return null;

  return (
    <output 
      className="flex items-center gap-2 text-gray-500 text-sm py-2"
      aria-live="polite"
      aria-label="AI is thinking"
    >
      <div className="flex gap-1" aria-hidden="true">
        <span 
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
          style={{ animationDelay: '0ms' }} 
        />
        <span 
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
          style={{ animationDelay: '150ms' }} 
        />
        <span 
          className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" 
          style={{ animationDelay: '300ms' }} 
        />
      </div>
      <span className="italic">{text}</span>
    </output>
  );
});

ThinkingIndicator.displayName = 'ThinkingIndicator';
