# Home Assistant MCP Server

通过 [MCP (Model Context Protocol)](https://modelcontextprotocol.io) 让 AI Agent 直接控制你的 Home Assistant 智能家居设备。

**零外部依赖** — 只需要 Node.js 18+。

## 工具

| 工具 | 功能 | 必需参数 | 可选参数 |
|---|---|---|---|
| `ha_call_service` | 调用 HA 服务（开关灯、调温度等） | domain, service | url, token, body |
| `ha_get_states` | 获取实体状态 | — | url, token, entity_id |
| `ha_lookup_service` | 查询服务参数信息 | — | domain, service |

所有工具都支持通过参数 `url` 和 `token` 传入 HA 凭证，也支持通过环境变量 `HA_URL` 和 `HA_TOKEN` 设置默认值。

## 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/weyand138-netizen/Home-assistant-AI-agent-mcp.git
cd Home-assistant-AI-agent-mcp

# 2. 直接运行（无需 npm install）
node ha-mcp-server.mjs
```

## 在支持 MCP 的客户端中使用

### Claude Desktop

编辑 `claude_desktop_config.json`：

```json
{
  "mcpServers": {
    "ha": {
      "command": "node",
      "args": ["路径/ha-mcp-server.mjs"],
      "env": {
        "HA_URL": "http://192.168.1.100:8123",
        "HA_TOKEN": "你的长期访问令牌"
      }
    }
  }
}
```

### AIRI

在 AIRI 设置 → MCP 配置中，编辑 `mcp.json`：

```json
{
  "mcpServers": {
    "ha": {
      "command": "node",
      "args": ["resources/ha-mcp-server.mjs"],
      "cwd": "Y:\\test2\\airi\\airi-HA"
    }
  }
}
```

也可以不设置环境变量，在对话中直接传参：

> "把客厅灯打开，HA 地址是 http://192.168.1.100:8123，令牌是 xxxxx"

## 测试

```bash
# 启动服务器
node ha-mcp-server.mjs

# 在另一个终端中发送测试消息（MCP 初始化握手）
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node ha-mcp-server.mjs

# 列出工具
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node ha-mcp-server.mjs
```

## 工作原理

```
AI Agent → MCP stdio (JSON-RPC 2.0) → ha-mcp-server.mjs
                                         → Node.js fetch (无 CORS 限制)
                                         → HA REST API (port 8123)
                                         → 智能家居设备
```

## 服务字典

内置 32 个 domain、100+ 个服务的参数信息。包含 `homeassistant`、`light`、`switch`、`climate`、`shopping_list`、`todo`、`scene`、`automation` 等常用领域。

如需更新字典，可在 HA 中执行 `curl http://your-ha:8123/api/services`，按格式整理后替换 `ha-service-dict.mjs`。

## License

MIT
