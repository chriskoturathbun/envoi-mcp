#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE_URL = process.env.ENVOI_BASE_URL || "https://envoi.work";

function getApiKey(): string {
  const key = process.env.ENVOI_API_KEY;
  if (!key) {
    throw new Error(
      "ENVOI_API_KEY environment variable is required. Register at https://envoi.work to get one."
    );
  }
  return key;
}

async function envoiFetch(
  path: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
    authenticated?: boolean;
  } = {}
): Promise<unknown> {
  const { method = "GET", body, authenticated = true } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authenticated) {
    headers["Authorization"] = `Bearer ${getApiKey()}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Envoi API error (${res.status}): ${text}`);
  }

  return res.json();
}

// --- Server setup ---

const server = new McpServer(
  {
    name: "envoi-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// --- Tools ---

server.tool(
  "register_agent",
  "Register a new AI agent on Envoi.work and get a real email address (@envoi.work)",
  {
    name: z.string().describe("Display name for the agent"),
    email: z
      .string()
      .describe("Desired email handle (e.g. 'myagent' for myagent@envoi.work)"),
    skills: z
      .array(z.string())
      .describe("List of skills/capabilities the agent has"),
    bio: z
      .string()
      .optional()
      .describe("Short bio describing what the agent does"),
  },
  async ({ name, email, skills, bio }) => {
    try {
      const result = await envoiFetch("/api/envoi/register", {
        method: "POST",
        body: { name, email, skills, bio },
        authenticated: false,
      });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Registration failed: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "send_email",
  "Send an email from your agent's @envoi.work address",
  {
    to: z.string().describe("Recipient email address"),
    subject: z.string().describe("Email subject line"),
    body: z.string().describe("Email body (plain text or HTML)"),
  },
  async ({ to, subject, body }) => {
    try {
      const result = await envoiFetch("/api/envoi/send", {
        method: "POST",
        body: { to, subject, body },
      });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to send email: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "check_inbox",
  "List recent emails in the agent's inbox",
  {
    limit: z
      .number()
      .optional()
      .describe("Maximum number of emails to return (default: 20)"),
  },
  async ({ limit }) => {
    try {
      const query = limit ? `?limit=${limit}` : "";
      const result = await envoiFetch(`/api/envoi/inbox${query}`);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to check inbox: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "read_email",
  "Read the full content of a specific email",
  {
    email_id: z.string().describe("The ID of the email to read"),
  },
  async ({ email_id }) => {
    try {
      const result = await envoiFetch(`/api/envoi/email/${email_id}`);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to read email: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "reply_to_email",
  "Reply to an email, maintaining the conversation thread",
  {
    email_id: z.string().describe("The ID of the email to reply to"),
    body: z.string().describe("Reply body (plain text or HTML)"),
  },
  async ({ email_id, body }) => {
    try {
      const result = await envoiFetch(`/api/envoi/email/${email_id}/reply`, {
        method: "POST",
        body: { body },
      });
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Failed to reply: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// --- Start ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
