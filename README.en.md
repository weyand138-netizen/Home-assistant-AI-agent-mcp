**English** | [中文](README.md)

# Home Assistant MCP Server

Let AI agents control your Home Assistant smart home devices via [MCP (Model Context Protocol)](https://modelcontextprotocol.io).

**Zero external dependencies** — just Node.js 18+.

## Prerequisites

- Node.js 18+
- A running Home Assistant instance
- A Home Assistant Long-Lived Access Token

## Tools

| Tool | Description | Required Params | Optional Params |
|---|---|---|---|
| `ha_call_service` | Call a HA service (turn on/off lights, set temperature, etc.) | domain, service | url, token, body |
| `ha_get_states` | Get entity states | — | url, token, entity_id |
| `ha_lookup_service` | Look up service parameter info | — | domain, service |

All tools accept `url` and `token` as direct parameters, or fall back to `HA_URL` and `HA_TOKEN` environment variables.

## Quick Start

```bash
git clone https://github.com/weyand138-netizen/Home-assistant-AI-agent-mcp.git
cd Home-assistant-AI-agent-mcp

# Run directly (no npm install needed)
node ha-mcp-server.mjs
```

## Usage with MCP Clients

### Claude Desktop

Edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ha": {
      "command": "node",
      "args": ["path/to/ha-mcp-server.mjs"],
      "env": {
        "HA_URL": "http://192.168.1.100:8123",
        "HA_TOKEN": "your-long-lived-access-token"
      }
    }
  }
}
```

### Other MCP Clients

Works with any MCP client that supports stdio transport. You can also pass credentials directly in conversation:

> "Turn on the living room light, HA address is http://192.168.1.100:8123, token is xxxxx"

## Testing

```bash
# Start the server
node ha-mcp-server.mjs

# Or debug with MCP Inspector
npx @modelcontextprotocol/inspector node ha-mcp-server.mjs
```

## How It Works

```
AI Agent → MCP stdio (JSON-RPC 2.0) → ha-mcp-server.mjs
                                         → Node.js fetch (no CORS restrictions)
                                         → HA REST API (port 8123)
                                         → Smart home devices
```

## Service Dictionary

Built-in parameter info for 32 domains and 100+ services. Includes `homeassistant`, `light`, `switch`, `climate`, `shopping_list`, `todo`, `scene`, `automation`, and more.

To update the dictionary, run `curl http://your-ha:8123/api/services` on your HA instance, format the output, and replace `ha-service-dict.mjs`.

## License

MIT

---

*I'm a beginner, this might not be perfect — feedback is welcome 🙏*
