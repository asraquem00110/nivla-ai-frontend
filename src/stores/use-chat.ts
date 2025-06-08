import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type FileMeta = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

export type ChatStoreState = {
  theme: 'light' | 'dark' | 'system';
  fileList: FileMeta[];
  chatResponse: string;
  tool?: string | undefined;
};

export type ChatStoreActions = {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setFileList: (files: File[]) => void;
  appendFile: (file: File) => void;
  removeFile: (index: number) => void;
  setChatResponse: (response: string) => void;
  clearChatResponse: () => void;
  setTool: (tool: string | undefined) => void;
};

export type ChatStore = ChatStoreState & ChatStoreActions;

export const DEFAULT_CHAT_STORE_STATE: ChatStoreState = {
  theme: 'system',
  fileList: [],
  chatResponse: '',
  tool: undefined,
};

export const useChatStore = create<ChatStore>()(
  persist(
    immer(set => ({
      ...DEFAULT_CHAT_STORE_STATE,
      setTheme: (theme: ChatStoreState['theme']) =>
        set(state => {
          state.theme = theme;
          return state;
        }),
      setFileList: (files: ChatStoreState['fileList']) =>
        set(state => {
          state.fileList = files;
          return state;
        }),
      appendFile: (file: File) =>
        set(state => {
          console.log(file);
          state.fileList.push({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          });
          return state;
        }),
      removeFile: (index: number) =>
        set(state => {
          state.fileList.splice(index, 1);
          return state;
        }),
      setChatResponse: (response: string) =>
        set(state => {
          state.chatResponse = state.chatResponse + response;
          return state;
        }),
      clearChatResponse: () =>
        set(state => {
          state.chatResponse = '';
          return state;
        }),
      setTool: (tool: string | undefined) =>
        set(state => {
          state.tool = tool;
          return state;
        }),
    })),
    {
      name: '__chat_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
