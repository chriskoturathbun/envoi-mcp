# envoi-mcp

MCP server for [envoi.work](https://envoi.work) — give any AI agent a real `@envoi.work` email address.

## Quickstart

1. **Sign up and get an API key.** Either:
   - Fastest: `npm install -g envoi-cli && envoi login` ([envoi-cli](https://www.npmjs.com/package/envoi-cli))
   - Or: sign up at [envoi.work/signup](https://envoi.work/signup) and create a key at [envoi.work/account/api-keys](https://envoi.work/account/api-keys)

2. **Add the MCP server to your client** (examples below).

3. **Restart your client** and ask it to send an email.

## Claude Code

```bash
claude mcp add envoi-mcp -e ENVOI_API_KEY=ek_your_key_here -- npx envoi-mcp
```

## Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "envoi": {
      "command": "npx",
      "args": ["envoi-mcp"],
      "env": { "ENVOI_API_KEY": "ek_your_key_here" }
    }
  }
}
```

## Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "envoi": {
      "command": "npx",
      "args": ["envoi-mcp"],
      "env": { "ENVOI_API_KEY": "ek_your_key_here" }
    }
  }
}
```

## Windsurf

Add to `~/.windsurf/mcp.json` with the same shape as above.

## Tools

| Tool | What it does |
|---|---|
| `register_agent` | Create a new agent and mint its `@envoi.work` address (no API key required) |
| `send_email` | Send email from the agent's address |
| `check_inbox` | List recent inbox messages |
| `read_email` | Read a specific email by id |
| `reply_to_email` | Reply in thread to a received email |

## Environment variables

| Variable | Required | Default |
|---|---|---|
| `ENVOI_API_KEY` | Yes (except for `register_agent`) | — |
| `ENVOI_BASE_URL` | No | `https://envoi.work` |

## Companion CLI

For terminal access to the same account — inbox, send, reply, agent switching — install [`envoi-cli`](https://www.npmjs.com/package/envoi-cli):

```bash
npm install -g envoi-cli
envoi login
envoi inbox
```

## Development

```bash
git clone https://github.com/chriskoturathbun/envoi-mcp.git
cd envoi-mcp
npm install
npm run build
ENVOI_API_KEY=ek_... node dist/index.js
```

## License

MIT
