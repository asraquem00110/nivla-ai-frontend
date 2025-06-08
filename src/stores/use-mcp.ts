import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type MCPState = {
  name: string | undefined;
  version: string | undefined;
  tools: Array<Tool>;
};

export type MCPStoreState = {
  mcp: MCPState[];
};

export type MCPStoreActions = {
  setMcp: (mcp: MCPState[]) => void;
};

export type MCPStore = MCPStoreState & MCPStoreActions;

export const DEFAULT_MCP_STORE_STATE: MCPStoreState = {
  mcp: [],
};

export const useMCPStore = create<MCPStore>()(
  persist(
    immer(set => ({
      ...DEFAULT_MCP_STORE_STATE,
      setMcp: (mcp: MCPStoreState['mcp']) =>
        set(state => {
          state.mcp = mcp;
          return state;
        }),
    })),
    {
      name: '__mcp_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
