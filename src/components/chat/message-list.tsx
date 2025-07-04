import { useEffect, useRef } from 'react';
import MessageBubble from '@/components/chat/message-bubble';
import { useChatStore } from '@/stores';
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import TypingLottie from '@/assets/typing.json';
import LoadingLottie from '@/assets/loading.json';
import { useMCPStore } from '@/stores/use-mcp';

type Props = {
  messages: { role?: string; message?: string }[];
  isStreaming?: boolean;
  newestOnTop?: boolean; // add this prop to control order
};

export default function MessageList({ messages, isStreaming = false, newestOnTop = false }: Props) {
  const chatReponse = useChatStore(state => state.chatResponse);
  const processingMcp = useMCPStore(state => state.processingMcp);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when a new user message is added
  useEffect(() => {
    if (!newestOnTop && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, newestOnTop]);

  // Reverse messages if newestOnTop is true
  const displayMessages = newestOnTop ? [...messages].reverse() : messages;

  return (
    <div
      ref={containerRef}
      className="mx-auto max-w-xl flex-1 space-y-2 overflow-y-auto px-4 py-2 pb-[150px]"
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...(newestOnTop ? { flexDirection: 'column-reverse' } : {}),
      }}
    >
      {displayMessages.map((msg, idx) => {
        if (idx > 0 && !['tool'].includes(msg.role as string)) {
          return <MessageBubble key={idx} sender={msg.role} text={msg.message} />;
        }
      })}
      {isStreaming && (
        <Player autoplay loop src={TypingLottie} style={{ height: '100px', width: '100px' }}>
          <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
        </Player>
      )}

      {processingMcp && (
        <div className="relative rounded-lg bg-orange-100">
          <MessageBubble
            sender="system"
            text="Processing MCP Tool"
            style="bg-orange-100 text-orange-900"
          />
          <div className="absolute top-[-15px] right-[-10px]">
            <Player autoplay loop src={LoadingLottie} style={{ height: '80px', width: '80px' }}>
              <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
            </Player>
          </div>
        </div>
      )}

      <span>{chatReponse}</span>
    </div>
  );
}
