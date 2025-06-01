import MessageBubble from '@/components/chat/message-bubble';

type Props = {
  messages: { role?: string; message?: string }[];
};

export default function MessageList({ messages }: Props) {
  return (
    <div className="flex-1 space-y-2 overflow-y-auto px-4 py-2 pb-[150px]">
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} sender={msg.role} text={msg.message} />
      ))}
    </div>
  );
}
