import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { LoggingMessageNotificationSchema, type Tool } from '@modelcontextprotocol/sdk/types.js';
import type { MCPClientInterface } from './mcp-types';

export class MCPClient implements MCPClientInterface {
  private mcp: Client;
  private transport: StreamableHTTPClientTransport | null = null;
  private _tools: Tool[] = [];
  private _serverUrl: string;

  constructor(serverUrl: string) {
    this.mcp = new Client({
      name: 'local-mcp-client',
      version: '1.0.0',
    });
    this._serverUrl = serverUrl;
  }

  get tools() {
    return this._tools;
  }

  async connectToServer() {
    try {
      this.mcp.onerror = error => {
        console.error('\x1b[31mClient error:', error, '\x1b[0m');
      };

      // Add more detailed logging
      console.log(`Attempting to connect to MCP server at: ${this._serverUrl}`);
      this.transport = new StreamableHTTPClientTransport(new URL(this._serverUrl), {
        requestInit: {
          headers: {
            'x-api-key': 'sample-api-key',
          },
        },
      });
      await this.mcp.connect(this.transport);

      console.log('Successfully connected to MCP server');

      // Test basic functionality
      try {
        const toolsResult = await this.mcp.listTools();
        this._tools = toolsResult.tools.map(tool => {
          return {
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
          };
        });

        console.log(
          'Connected to server with tools:',
          this._tools.map(({ name, description }) => ({
            name,
            description,
          }))
        );
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
        await this.mcp.close();
        this.transport = null;
        console.log('Disconnected from MCP server');
      }
    } catch (e) {
      console.error('Error during disconnect:', e);
    }
  }

  async callTool(name: string, arguments_: Record<string, any>) {
    try {
      if (!this.transport) {
        throw new Error('Not connected to MCP server');
      }

      const result = await this.mcp.callTool({
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
