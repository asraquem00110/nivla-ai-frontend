// usePostStream.ts
import { useRef, useState } from 'react';
import type { Prompt, PromptTools } from '@/types/Prompt';

type StreamOptions = {
  messages?: Prompt[];
  tools?: PromptTools[];
  onMessage?: (chunk: string, stream: string) => void;
};

export const usePostStream = (options: StreamOptions) => {
  const controllerRef = useRef<AbortController | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const start = async () => {
    setIsStreaming(true);
    setError(null);

    controllerRef.current = new AbortController();

    try {
      const response = await fetch('http://localhost:3001/send-message', {
        method: 'POST',
        body: JSON.stringify({
          messages: options.messages,
          tools: options.tools,
        }),
        headers: { 'Content-Type': 'application/json' },
        signal: controllerRef.current.signal,
      });
      // Check if the response is streamable or normal JSON
      const contentType = response.headers.get('content-type');
      const isStream =
        contentType &&
        (contentType.includes('text/event-stream') || contentType.includes('text/plain'));

      if (!isStream) {
        // Handle normal JSON response
        const responseJSON = await response.json();
        console.log(responseJSON.message);
        const tool_called = responseJSON.message.tool_calls;
        console.log(tool_called);

        options.onMessage?.(responseJSON.message.content, 'stop');

        if (tool_called) {
          // Check if tools_called is available
          // Abort Stream if yes
          // Call MCP Server Tool
          controllerRef.current?.abort();
          setIsStreaming(false);
          return;
        }
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body.');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        console.log(chunk);
        const lines = chunk.split('\n');
        for (const line of lines) {
          let content = '';
          let stream = '';
          let tools_called = '';
          if (line.startsWith('data: ')) {
            content = JSON.parse(line.slice(6));
          }

          if (line.startsWith('done_reason: ')) {
            stream = line.slice(13);
          }

          if (line.startsWith('tools_called: ')) {
            tools_called = line.slice(14);
          }

          options.onMessage?.(content, stream);

          if (tools_called && tools_called.trim() !== '' && tools_called.trim() !== 'undefined') {
            // Check if tools_called is available
            // Abort Stream if yes
            // Call MCP Server Tool
            console.log('CALLING MCP TOOL:', tools_called);
            controllerRef.current?.abort();
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const stop = () => {
    controllerRef.current?.abort();
    setIsStreaming(false);
  };

  return {
    start,
    stop,
    isStreaming,
    error,
  };
};
