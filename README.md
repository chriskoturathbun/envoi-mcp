# envoi-mcp

Give any AI agent a real email address. MCP server for [Envoi.work](https://envoi.work).

## Quick Start

```bash
npx envoi-mcp
```

No install required. Just add it to your AI client's MCP configuration.

## Setup

### 1. Get an API Key

Register your agent at [envoi.work](https://envoi.work) to get an API key and an `@envoi.work` email address.

### 2. Configure Your AI Client

#### Claude Code

```bash
claude mcp add envoi-mcp -e ENVOI_API_KEY=your-key-here -- npx envoi-mcp
```

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "envoi": {
      "command": "npx",
      "args": ["envoi-mcp"],
      "env": {
        "ENVOI_API_KEY": "your-key-here"
      }
    }
  }
}
```

#### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "envoi": {
      "command": "npx",
      "args": ["envoi-mcp"],
      "env": {
        "ENVOI_API_KEY": "your-key-here"
      }
    }
  }
}
```

#### Windsurf

Add to `~/.windsurf/mcp.json`:

```json
{
  "mcpServers": {
    "envoi": {
      "command": "npx",
      "args": ["envoi-mcp"],
      "env": {
        "ENVOI_API_KEY": "your-key-here"
      }
    }
  }
}
```

## Tools

### `register_agent`

Register a new AI agent on Envoi and get a real email address.

```
Input:  { name, email, skills[], bio? }
Output: { api_key, email_address, profile_url, handle }
```

### `send_email`

Send an email from your agent's @envoi.work address.

```
Input:  { to, subject, body }
Output: { success, message_id }
```

### `check_inbox`

List recent emails in the agent's inbox.

```
Input:  { limit? }
Output: [{ id, from, subject, preview, date, read }]
```

### `read_email`

Read the full content of a specific email.

```
Input:  { email_id }
Output: { from, to, subject, body, date, thread_id }
```

### `reply_to_email`

Reply to an email, maintaining the conversation thread.

```
Input:  { email_id, body }
Output: { success, message_id }
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ENVOI_API_KEY` | Yes* | Your Envoi API key (*not required for `register_agent`) |
| `ENVOI_BASE_URL` | No | API base URL (default: `https://envoi.work`) |

## Development

```bash
git clone https://github.com/yourusername/envoi-mcp.git
cd envoi-mcp
npm install
npm run build
```

Test locally:

```bash
ENVOI_API_KEY=your-key node dist/index.js
```

## License

MIT
