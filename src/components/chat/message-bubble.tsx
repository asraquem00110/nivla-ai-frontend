import { cn } from '@/lib/utils';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Props = {
  sender?: string;
  text?: string;
  style?: string;
};

function parseMessage(text: string) {
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  const parts: Array<{ type: 'code' | 'text'; content: string; language?: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({
      type: 'code',
      content: match[2],
      language: match[1] || 'text',
    });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }
  return parts;
}

export default function MessageBubble({ sender, text = '', style = '' }: Props) {
  const isUser = sender === 'user';
  const parts = parseMessage(text);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={cn(
          'max-w-lg rounded-lg px-4 py-2',
          isUser
            ? 'rounded-br-none bg-blue-500 text-white'
            : 'rounded-bl-none bg-gray-200 text-gray-800',
          style
        )}
      >
        {parts.map((part, idx) =>
          part.type === 'code' ? (
            <SyntaxHighlighter
              key={idx}
              language={part.language}
              style={oneDark}
              customStyle={{ borderRadius: '0.5rem', margin: '1em 0' }}
            >
              {part.content.trim()}
            </SyntaxHighlighter>
          ) : (
            <span key={idx}>{part.content}</span>
          )
        )}
      </div>
    </div>
  );
}
