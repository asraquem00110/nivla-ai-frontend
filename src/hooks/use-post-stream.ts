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
        options.onMessage?.(responseJSON.message.content, 'stop');
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body.');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          let content = '';
          let stream = '';
          if (line.startsWith('data: ')) {
            content = JSON.parse(line.slice(6));
          }

          if (line.startsWith('done_reason: ')) {
            stream = line.slice(13);
          }

          options.onMessage?.(content, stream);
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
