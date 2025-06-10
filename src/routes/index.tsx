import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import ChatContainer from '@/components/chat/chat-container';
import ChatHeader from '@/components/chat/chat-header';
import MessageList from '@/components/chat/message-list';
import ChatInput from '@/components/chat/chat-input';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import type { Prompt } from '@/types/Prompt';
import { usePostStream } from '@/hooks/use-post-stream';
import { useChatStore } from '@/stores';
import { SideNavigation } from '@/components/ui/sidebar';
import { useTheme } from '@/hooks/use-theme-context';
import type { ThemeProviderContextType } from '@/providers/ThemeProvider';
import { useMCPStore } from '@/stores/use-mcp';

export const Route = createFileRoute('/')({
  component: Index,
});

class MemoryResponse {
  private _message: string = '';

  // Getter
  get message(): string {
    return this._message;
  }

  set message(message: string) {
    this._message = this.message + message;
  }
}

function Index() {
  const memoryResponse = new MemoryResponse();
  const { sidebarOpen } = useTheme() as unknown as ThemeProviderContextType;

  const setChatResponse = useChatStore(state => state.setChatResponse);
  const clearChatResponse = useChatStore(state => state.clearChatResponse);
  const tool = useChatStore(state => state.tool);
  const mcp = useMCPStore(state => state.mcp);

  const [messages, setMessages] = useState<Array<Prompt>>([
    {
      role: 'system',
      message:
        "You are NivlA AI, a helpful assistant. Answer only the user's most recent question.",
      tools: [],
    }, // system message
    { role: 'assistant', message: 'Hello! How can I help you today?', tools: [] },
  ]);

  const { start, stop, isStreaming, error } = usePostStream({
    messages: messages, // or your Prompt[] input
    tools: tool
      ? mcp[0].tools.filter(toolList => {
          return toolList.name === tool;
        })
      : ([] as unknown as any), // or your PromptTools[] input
    onMessage: (chunk, stream) => {
      setChatResponse(chunk);
      memoryResponse.message = chunk;

      if (stream === 'stop') {
        const trimMessage = memoryResponse.message.replace(/<think>.*?<\/think>/gs, '').trim();
        if (trimMessage !== '') {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              message: trimMessage,
              tools: [],
            },
          ]);
        }

        console.log('CHAT RESPONSE IS:', memoryResponse.message);
        clearChatResponse();
      }
    },
  });
  const handleSend = (message: string) => {
    setMessages(prev => [...prev, { role: 'user', message }]);
  };

  useEffect(() => {
    if (messages[messages.length - 1]?.role === 'user') start();
  }, [messages]);

  return (
    <div>
      <SideNavigation />
      <div className={cn('main flex h-screen flex-col')}>
        <Header isSideNavOpen={sidebarOpen} />
        <div className={cn(sidebarOpen ? 'ml-[300px]' : '', 'flex flex-1 flex-col p-4')}>
          <ChatContainer>
            <MessageList messages={messages} isStreaming={isStreaming} />
          </ChatContainer>
          <ChatInput onSend={handleSend} isSideNavOpen={sidebarOpen} />
        </div>
      </div>
    </div>
  );
}
