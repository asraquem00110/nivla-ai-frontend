import type { MCPClient } from '@/lib/mcp';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
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
  mcpClient?: MCPClient;
  processingMcp: boolean;
};

export type MCPStoreActions = {
  setMcp: (mcp: MCPState[]) => void;
  setMcpClient: (mcp: MCPClient) => void;
  setProcessingMcp: (status: boolean) => void;
};

export type MCPStore = MCPStoreState & MCPStoreActions;

export const DEFAULT_MCP_STORE_STATE: MCPStoreState = {
  mcp: [],
  mcpClient: undefined,
  processingMcp: false,
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
      setMcpClient: (mcp: MCPClient) =>
        set(state => {
          state.mcpClient = mcp;
          return state;
        }),
      setProcessingMcp: (status: boolean) =>
        set(state => {
          state.processingMcp = status;
          return state;
        }),
    })),
    {
      name: '__mcp_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
