import React from 'react';

type Props = {
  sender?: string;
  text?: string;
};

export default function MessageBubble({ sender, text }: Props) {
  const isUser = sender === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-lg rounded-lg px-4 py-2 md:max-w-2xl ${
          isUser
            ? 'rounded-br-none bg-blue-500 text-white'
            : 'rounded-bl-none bg-gray-200 text-gray-800'
        }`}
      >
        {text}
      </div>
    </div>
  );
}
