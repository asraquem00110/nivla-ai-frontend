import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores';
import { useState } from 'react';
import { FaPaperclip, FaSliders } from 'react-icons/fa6';
import Modal from '../modals/modal';

export default function ChatInput({
  onSend,
  isSideNavOpen,
}: {
  onSend: (text: string) => void;
  isSideNavOpen?: boolean;
}) {
  const appendFile = useChatStore(state => state.appendFile);
  const fileList = useChatStore(state => state.fileList);
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

  return (
    <>
      <Modal isOpen={showToolModal} onClose={() => setShowToolModal(false)}>
        THIS IS A SAMPLE MODAL
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
          <div className="mt-2 mr-5 flex-1">
            {fileList.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {fileList.map((file, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded bg-gray-200 px-2 py-1 text-sm text-gray-700"
                  >
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </span>
                ))}
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
