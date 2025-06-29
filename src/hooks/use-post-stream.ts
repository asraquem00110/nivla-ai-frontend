// usePostStream.ts
import { useRef, useState } from 'react';
import type { Prompt, PromptTools } from '@/types/Prompt';
import { useChatStore } from '@/stores';
import { useMCPStore } from '@/stores/use-mcp';
import type { CallToolRequest, CallToolResult } from '@modelcontextprotocol/sdk/types.js';

type StreamOptions = {
  messages?: Prompt[];
  tools?: PromptTools[];
  onMessage?: (chunk: string, stream: string) => void;
};

export const usePostStream = (options: StreamOptions) => {
  const controllerRef = useRef<AbortController | null>(null);
  const clearChatResponse = useChatStore(state => state.clearChatResponse);
  const mcpClient = useMCPStore(state => state.mcpClient);
  const setProcessingMcp = useMCPStore(state => state.setProcessingMcp);
  const setFileList = useChatStore(state => state.setFileList);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fileList = useChatStore(state => state.fileList);

  const start = async () => {
    setIsStreaming(true);
    setError(null);

    controllerRef.current = new AbortController();

    try {
      if (fileList.length > 0) {
        console.log(fileList[0].file);
        const formData = new FormData();
        formData.append('file', fileList[0].file as unknown as File);
        await fetch('http://localhost:3001/file-upload', {
          method: 'POST',
          body: formData,
        });
      }

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

        const tool_called = responseJSON.message.tool_calls;

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
        // console.log(chunk);
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
            console.log('START PROCESSING WITH TOOL ...');
            setProcessingMcp(true);
            const parsedTool = JSON.parse(tools_called);
            if (!parsedTool) return;
            const toolSpecs = parsedTool[0].function as {
              name: string;
              arguments: Record<string, any>;
            };

            controllerRef.current?.abort();
            const toolResponse = (await mcpClient?.callTool(
              toolSpecs.name,
              toolSpecs.arguments
            )) as CallToolResult;

            options.messages?.push({
              role: 'tool',
              // message: toolResponse.content[0].text as unknown as string,
              message: `Context: ${toolResponse.content[0].text as unknown as string}\nQuestion: ${options.messages[options.messages.length - 1].message}`,
            });

            start()
              .then(res => {
                console.log('END PROCESSING WITH TOOL ...');
                setProcessingMcp(false);
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setIsStreaming(false);
      clearChatResponse();
      setFileList([]);
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
