import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {
  LoggingMessageNotificationSchema,
  type CallToolResult,
  type CompatibilityCallToolResult,
  type Tool,
} from '@modelcontextprotocol/sdk/types.js';
import type { MCPClientInterface } from './mcp-types';

export class MCPClient implements MCPClientInterface {
  private _mcp: Client;
  private transport: StreamableHTTPClientTransport | null = null;
  private _tools: Tool[] = [];
  private _serverUrl: string;

  constructor(serverUrl: string) {
    this._mcp = new Client({
      name: 'local-mcp-client',
      version: '1.0.0',
    });
    this._serverUrl = serverUrl;
  }

  get tools() {
    return this._tools;
  }

  get mcp() {
    return this._mcp;
  }

  async connectToServer() {
    try {
      this._mcp.onerror = error => {
        console.error('\x1b[31mClient error:', error, '\x1b[0m');
      };

      this.transport = new StreamableHTTPClientTransport(new URL(this._serverUrl), {
        requestInit: {
          headers: {
            'x-api-key': 'sample-api-key',
          },
        },
      });
      await this._mcp.connect(this.transport);

      // Test basic functionality
      try {
        const toolsResult = await this._mcp.listTools();
        this._tools = toolsResult.tools.map(tool => {
          return {
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
          };
        });
      } catch (toolsError) {
        console.warn('Failed to list tools, but connection seems established:', toolsError);
      }
    } catch (e) {
      console.error('Failed to connect to MCP server:', e);

      // Provide more specific error information
      if (e instanceof Error) {
        if (e.message.includes('405')) {
          console.error(
            'Server returned 405 Method Not Allowed. Check if your MCP server is configured correctly.'
          );
          console.error(
            'Make sure the server supports the MCP protocol and is listening on the correct endpoint.'
          );
        } else if (e.message.includes('ECONNREFUSED')) {
          console.error('Connection refused. Make sure your MCP server is running on port 3002.');
        }
      }

      throw e;
    }
  }

  async disconnect() {
    try {
      if (this.transport) {
        await this._mcp.close();
        await this.transport.terminateSession();
        this.transport = null;
        console.log('Disconnected from MCP server');
      }
    } catch (e) {
      console.error('Error during disconnect:', e);
    }
  }

  async callTool(
    name: string,
    arguments_: Record<string, any>
  ): Promise<CallToolResult | CompatibilityCallToolResult> {
    try {
      if (!this.transport) {
        throw new Error('Not connected to MCP server');
      }

      const result = await this._mcp.callTool({
        name,
        arguments: arguments_,
      });

      return result;
    } catch (e) {
      console.error(`Failed to call tool ${name}:`, e);
      throw e;
    }
  }
}
