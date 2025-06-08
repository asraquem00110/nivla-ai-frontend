import { MCPClient } from '@/lib/mcp';
import { useMCPStore } from '@/stores/use-mcp';
import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import React, { createContext, useEffect, type ReactNode } from 'react';

interface MCPClientContextType {}

const MCPClientProviderContext = createContext<MCPClientContextType | undefined>(undefined);

const { Provider } = MCPClientProviderContext;

const MCP_URL_LIST = ['http://localhost:3002/mcp'];

interface Props {
  children: ReactNode;
}

export const MCPClientProvider: React.FC<Props> = ({ children }: Props) => {
  const setMcp = useMCPStore(state => state.setMcp);
  useEffect(() => {
    async function connect() {
      const MCP_SERVERS: Array<{
        name: string | undefined;
        version: string | undefined;
        tools: Tool[];
      }> = [];

      await Promise.all(
        MCP_URL_LIST.map(async mcp => {
          const mcpClient = new MCPClient(mcp);
          await mcpClient.connectToServer();

          const tools = await mcpClient.tools;

          const serverinfo = await mcpClient.mcp.getServerVersion();

          MCP_SERVERS.push({
            name: serverinfo?.name,
            version: serverinfo?.version,
            tools,
          });
        })
      );
      // set mcp servers in zustand useMCPStore
      setMcp(MCP_SERVERS);
    }

    connect()
      .then(res => {
        // console.log(res);
      })
      .catch(err => console.log(err));
  }, []);
  return <Provider value={{}}>{children}</Provider>;
};
