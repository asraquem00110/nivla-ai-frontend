import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores';
import { useState } from 'react';
import { FaPaperclip, FaSliders, FaGear } from 'react-icons/fa6';
import Modal from '../modals/modal';
import { useMCPStore, type MCPStoreState } from '@/stores/use-mcp';

export default function ChatInput({
  onSend,
  isSideNavOpen,
}: {
  onSend: (text: string) => void;
  isSideNavOpen?: boolean;
}) {
  const appendFile = useChatStore(state => state.appendFile);
  const removeFile = useChatStore(state => state.removeFile);
  const fileList = useChatStore(state => state.fileList);
  const setTool = useChatStore(state => state.setTool);
  const tool = useChatStore(state => state.tool);
  const mcp = useMCPStore(state => state.mcp);
  const [input, setInput] = useState('');
  const [showToolModal, setShowToolModal] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectTool = (mcp: MCPStoreState['mcp'][number], index: number) => {
    setShowToolModal(false);
    const tool = mcp.tools[index].name;
    setTool(tool);
  };

  return (
    <>
      <Modal isOpen={showToolModal} onClose={() => setShowToolModal(false)}>
        <div className="w-[400px]">
          <h2 className="mb-2 text-lg font-semibold">Available MCP Servers</h2>
          <ul>
            {Array.isArray(mcp) && mcp.length > 0 ? (
              mcp.map((server: any, idx: number) => (
                <li key={idx} className="mb-4 border-b pb-2">
                  <div className="font-medium">{server.name || `Server ${idx + 1}`}</div>
                  <span className="text-sm">Version: {server.version}</span>
                  <div className="mt-1">
                    <span className="text-sm font-semibold">Tools:</span>
                    <ul className="mt-1 ml-4">
                      {server.tools?.map((tool: any, tIdx: number) => (
                        <li
                          key={tIdx}
                          className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-gray-100"
                          onClick={() => selectTool(server, tIdx)}
                          title={tool.description}
                        >
                          <span className="font-medium">{tool.name}</span>
                          <span className="ml-2 text-xs text-gray-500">{tool.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))
            ) : (
              <li>No MCP servers found.</li>
            )}
          </ul>
        </div>
      </Modal>
      <div
        className={cn(
          'fixed right-0 bottom-0 left-0 flex items-end gap-2 border-t border-gray-300 bg-white p-4',
          isSideNavOpen ? 'pl-[320px]' : 'pl-[60px]',
          'flex-col'
        )}
      >
        <textarea
          className="w-full resize-none rounded border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={2}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
        />

        <div className="flex flex-row">
          <div className="mr-5 flex flex-1 flex-row items-center gap-2">
            {fileList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {fileList.map((file, index) => (
                  <span
                    key={index}
                    className="relative inline-flex items-center rounded bg-gray-200 px-2 py-1 text-sm text-gray-700"
                  >
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    <button
                      type="button"
                      className={cn(
                        'absolute -top-2 -right-2 cursor-pointer rounded-full bg-white p-1 text-xs text-gray-500 hover:bg-gray-200'
                      )}
                      aria-label="Remove tool"
                      onClick={() => removeFile(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            {tool && (
              <div className="relative flex flex-wrap gap-2">
                <span
                  key="tool-index"
                  className="relative inline-flex items-center rounded bg-blue-100 px-2 py-1 text-sm text-blue-700"
                >
                  <FaGear className="mr-1 h-3 w-3" />
                  {tool}
                  <button
                    type="button"
                    className={cn(
                      'absolute -top-2 -right-2 cursor-pointer rounded-full bg-white p-1 text-xs text-gray-500 hover:bg-gray-200'
                    )}
                    aria-label="Remove tool"
                    onClick={() => setTool(undefined)}
                  >
                    ×
                  </button>
                </span>
              </div>
            )}
          </div>

          <label className="mr-3 flex cursor-pointer flex-row items-center justify-center">
            <FaPaperclip className="h-4 w-4" />
            <input
              type="file"
              accept=".pdf,.csv,.json,.doc,.docx,application/pdf,text/csv,application/json,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  appendFile(file);
                }
              }}
            />
          </label>
          <div
            onClick={() => setShowToolModal(true)}
            className="flex cursor-pointer flex-row items-center justify-center"
          >
            <FaSliders className="h-4 w-4" />
            <span className="mr-2 ml-1">Tools</span>
          </div>
        </div>
      </div>
    </>
  );
}
