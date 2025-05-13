import { Pushify } from '@pushify/js';
import z from 'zod';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const { PUSHIFY_KEY, CHANNEL_ID } = Bun.env;
if (!PUSHIFY_KEY || !CHANNEL_ID) {
  throw new Error("PUSHIFY_KEY and CHANNEL_ID environment variables need to be defined");
}

// Create server instance
const server = new McpServer({
  name: "pushify",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "send-notification",
  "Send notification to a device",
  {
    content: z.string().describe("content")
  },
  async({ content }) => {
    const pushify = new Pushify({
      key: PUSHIFY_KEY,
    });
    await pushify.send({
      channel: CHANNEL_ID,
      title: "Message from PAT",
      body: content,
    })


    return {
      content: [
        {
          type: "text",
          text: `Notification sent`,
        }
      ]
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Pushify MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error in main:", err);
  process.exit(1);
})
