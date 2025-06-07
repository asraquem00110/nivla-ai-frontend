import { MCPClient } from '@/lib/mcp';
import React, { createContext, useEffect, type ReactNode } from 'react';

interface MCPClientContextType {}

const MCPClientProviderContext = createContext<MCPClientContextType | undefined>(undefined);

const { Provider } = MCPClientProviderContext;

interface Props {
  children: ReactNode;
}

export const MCPClientProvider: React.FC<Props> = ({ children }: Props) => {
  useEffect(() => {
    async function connect() {
      const mcpClient = new MCPClient();
      await mcpClient.connectToServer();

      const tools = await mcpClient.tools;
      console.log('TOOLS AVAILABLE IS:', JSON.stringify(tools));
    }

    connect()
      .then(res => {
        // console.log(res);
      })
      .catch(err => console.log(err));
  }, []);
  return <Provider value={{}}>{children}</Provider>;
};
