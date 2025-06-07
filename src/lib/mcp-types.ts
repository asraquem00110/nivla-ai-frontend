import type {
  CallToolResult,
  CompatibilityCallToolResult,
} from '@modelcontextprotocol/sdk/types.js';

export interface MCPClientInterface {
  connectToServer: () => void;
  disconnect: () => void;
  callTool: (
    name: string,
    arguments_: Record<string, any>
  ) => Promise<CallToolResult | CompatibilityCallToolResult>;
}
