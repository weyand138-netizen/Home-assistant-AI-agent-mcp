#!/usr/bin/env node

/**
 * Home Assistant MCP 服务器
 *
 * 通过 MCP stdio 协议向 AI Agent 提供 Home Assistant 控制能力。
 * 零外部依赖，只需要 Node.js 18+ 环境。
 *
 * 使用方式 — 在支持 MCP 的客户端中添加：
 *   {
 *     "mcpServers": {
 *       "ha": {
 *         "command": "node",
 *         "args": ["路径/ha-mcp-server.mjs"]
 *       }
 *     }
 *   }
 *
 * 可选环境变量：
 *   HA_URL    默认 HA 服务器地址（如 http://192.168.1.100:8123）
 *   HA_TOKEN  默认 HA 访问令牌
 *   也可以在调用工具时通过 url/token 参数传入
 */

import { haServiceDict, lookupService, formatServiceInfo, listDomains, listServices } from './ha-service-dict.mjs'

// ============================================================
// MCP 协议 — JSON-RPC 2.0 over stdio
// ============================================================

process.stdin.setEncoding('utf-8')
process.stdin.on('data', handleMessage)

/** 当前请求 id → AbortController */
const pending = new Map()

// 处理 stdin 的 JSON-RPC 消息（可能一次收到多行）
let buffer = ''
function handleMessage(chunk) {
  buffer += chunk
  const lines = buffer.split('\n')
  // 最后一段可能不完整，留到下次
  buffer = lines.pop() || ''

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed)
      continue
    try {
      const msg = JSON.parse(trimmed)
      handleRequest(msg).catch(err => {
        if (msg.id != null) {
          writeJsonrpcError(msg.id, -32603, `Internal error: ${err.message}`)
        }
      })
    }
    catch (err) {
      // 非法 JSON — 忽略非 JSON-RPC 消息
    }
  }
}

async function handleRequest(msg) {
  const { id, method, params } = msg

  // 通知类消息（无 id）
  if (id == null) {
    if (method === 'notifications/initialized') {
      // 握手完成，啥也不做
      return
    }
    // 其他通知忽略
    return
  }

  switch (method) {
    case 'initialize':
      return handleInitialize(id, params)

    case 'tools/list':
      return handleToolsList(id)

    case 'tools/call':
      return handleToolsCall(id, params)

    default:
      writeJsonrpcError(id, -32601, `Method not found: ${method}`)
  }
}

function writeJsonrpc(id, result) {
  const msg = JSON.stringify({ jsonrpc: '2.0', id, result })
  process.stdout.write(msg + '\n')
}

function writeJsonrpcError(id, code, message, data) {
  const error = { code, message }
  if (data != null)
    error.data = data
  const msg = JSON.stringify({ jsonrpc: '2.0', id, error })
  process.stdout.write(msg + '\n')
}

// ============================================================
// 工具定义
// ============================================================

const HA_CALL_SERVICE_TOOL = {
  name: 'ha_call_service',
  description: '调用 Home Assistant 的服务来控制智能家居设备，如开关灯、设置温度、添加购物项等',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'HA 服务器地址，如 http://192.168.1.100:8123。可通过环境变量 HA_URL 设置默认值',
      },
      token: {
        type: 'string',
        description: 'HA 长期访问令牌。可通过环境变量 HA_TOKEN 设置默认值',
      },
      domain: {
        type: 'string',
        description: '服务 domain，如 light、switch、climate、shopping_list 等',
      },
      service: {
        type: 'string',
        description: '服务名称，如 turn_on、add_item、set_temperature 等',
      },
      body: {
        type: 'string',
        description: '请求体 JSON 字符串，如 {"entity_id":"light.living_room","brightness":255}',
      },
    },
    required: ['domain', 'service'],
  },
}

const HA_GET_STATES_TOOL = {
  name: 'ha_get_states',
  description: '获取 Home Assistant 中所有或指定实体的状态，如灯是否亮着、温度多少、门是否开着',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'HA 服务器地址。可通过环境变量 HA_URL 设置默认值',
      },
      token: {
        type: 'string',
        description: 'HA 长期访问令牌。可通过环境变量 HA_TOKEN 设置默认值',
      },
      entity_id: {
        type: 'string',
        description: '可选，指定实体 ID 如 light.living_room。不传则返回全部实体摘要',
      },
    },
    required: [],
  },
}

const HA_LOOKUP_SERVICE_TOOL = {
  name: 'ha_lookup_service',
  description: '查询 Home Assistant 服务的参数信息。如果不确定某个服务需要什么参数，先用此工具查询。支持模糊搜索 domain',
  inputSchema: {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: '留空即可，此工具不需要连接 HA',
      },
      token: {
        type: 'string',
        description: '留空即可',
      },
      domain: {
        type: 'string',
        description: '服务 domain，如 light、switch、shopping_list。不传则列出所有 domain',
      },
      service: {
        type: 'string',
        description: '服务名称，如 turn_on、add_item。不传则列出该 domain 下的所有服务',
      },
    },
    required: [],
  },
}

// ============================================================
// 工具执行实现
// ============================================================

function resolveHaConfig(params) {
  const url = params.url || process.env.HA_URL || ''
  const token = params.token || process.env.HA_TOKEN || ''
  return {
    url: url ? url.replace(/\/+$/, '') : '',
    token,
  }
}

async function haApiCall(url, token, method, path, body) {
  const response = await fetch(`${url}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30_000),
  })

  const text = await response.text()
  let data
  try {
    data = JSON.parse(text)
  }
  catch {
    data = text
  }

  if (!response.ok) {
    const errMsg = typeof data === 'object' && data.message ? data.message : response.statusText
    throw new Error(`HA API ${response.status}: ${errMsg}`)
  }

  return data
}

function textContent(text) {
  return { type: 'text', text }
}

// ============================================================
// 协议处理器
// ============================================================

function handleInitialize(id) {
  writeJsonrpc(id, {
    protocolVersion: '2024-11-05',
    capabilities: {
      tools: {},
    },
    serverInfo: {
      name: 'ha-mcp-server',
      version: '1.0.0',
    },
  })
}

function handleToolsList(id) {
  writeJsonrpc(id, {
    tools: [
      HA_CALL_SERVICE_TOOL,
      HA_GET_STATES_TOOL,
      HA_LOOKUP_SERVICE_TOOL,
    ],
  })
}

async function handleToolsCall(id, params) {
  const { name, arguments: args } = params

  try {
    let result

    switch (name) {
      case 'ha_call_service':
        result = await executeHaCallService(args || {})
        break
      case 'ha_get_states':
        result = await executeHaGetStates(args || {})
        break
      case 'ha_lookup_service':
        result = executeHaLookupService(args || {})
        break
      default:
        writeJsonrpcError(id, -32601, `Unknown tool: ${name}`)
        return
    }

    writeJsonrpc(id, {
      content: [textContent(result)],
    })
  }
  catch (error) {
    writeJsonrpc(id, {
      content: [textContent(`Error: ${error.message}`)],
      isError: true,
    })
  }
}

// ============================================================
// 工具执行函数
// ============================================================

async function executeHaCallService(args) {
  const { domain, service, body: bodyStr } = args
  const { url, token } = resolveHaConfig(args)

  if (!url) {
    return '错误: 未指定 HA 服务器地址。请在工具参数中传入 url，或设置 HA_URL 环境变量。'
  }
  if (!token) {
    return '错误: 未指定 HA 访问令牌。请在工具参数中传入 token，或设置 HA_TOKEN 环境变量。'
  }
  if (!domain || !service) {
    return '错误: 缺少必要参数 domain 和 service。请指定要调用的服务 domain 和名称。'
  }

  // 解析请求体
  let requestBody = {}
  if (bodyStr) {
    try {
      requestBody = JSON.parse(bodyStr)
    }
    catch {
      return `错误: body 不是有效的 JSON: ${bodyStr}`
    }
  }

  // 检查字典中该服务是否需要 entity_id
  const info = lookupService(domain, service)
  if (info && info.needsEntityId && !requestBody.entity_id) {
    return `服务 ${domain}.${service} 需要指定 entity_id，请用 ha_lookup_service 查询该服务需要的参数后重试。`
  }

  try {
    const data = await haApiCall(url, token, 'POST', `/api/services/${domain}/${service}`, requestBody)

    if (Array.isArray(data) && data.length === 0) {
      return `已成功调用 ${domain}.${service}。`
    }
    return JSON.stringify(data, null, 2)
  }
  catch (error) {
    return `调用 ${domain}.${service} 失败: ${error.message}`
  }
}

async function executeHaGetStates(args) {
  const { url, token } = resolveHaConfig(args)
  const { entity_id: entityId } = args

  if (!url) {
    return '错误: 未指定 HA 服务器地址。请在工具参数中传入 url，或设置 HA_URL 环境变量。'
  }
  if (!token) {
    return '错误: 未指定 HA 访问令牌。请在工具参数中传入 token，或设置 HA_TOKEN 环境变量。'
  }

  try {
    const path = entityId ? `/api/states/${entityId}` : '/api/states'
    const data = await haApiCall(url, token, 'GET', path)

    if (entityId) {
      // 单个实体
      const s = data
      const name = s.attributes?.friendly_name || s.entity_id
      return `• ${name} (${s.entity_id}): ${s.state}`
    }

    // 全部实体 — 摘要形式
    const states = Array.isArray(data) ? data : []
    const summary = states.map(s => {
      const name = s.attributes?.friendly_name || s.entity_id
      return `• ${name} (${s.entity_id}): ${s.state}`
    }).join('\n')

    return `当前共 ${states.length} 个实体：\n${summary}`
  }
  catch (error) {
    return `获取状态失败: ${error.message}`
  }
}

function executeHaLookupService(args) {
  const { domain, service } = args

  if (domain && !service) {
    const services = listServices(domain)
    if (services.length === 0) {
      return `没有找到 domain "${domain}"。可用 domain: ${listDomains().join(', ')}`
    }
    return `Domain "${domain}" 下的服务:\n${services.map(s => `  - ${s}`).join('\n')}`
  }

  if (!domain && !service) {
    return `可用 domain:\n${listDomains().join(', ')}`
  }

  const info = lookupService(domain, service)
  if (!info) {
    const services = listServices(domain)
    if (services.length > 0) {
      return `在 domain "${domain}" 下没有找到服务 "${service}"。可用服务:\n${services.map(s => `  - ${s}`).join('\n')}`
    }
    return `未找到服务 ${domain}.${service}。可用 domain: ${listDomains().join(', ')}`
  }

  return formatServiceInfo(info)
}

// ============================================================
// 启动信息
// ============================================================

// 输出到 stderr 避免干扰 stdio JSON-RPC
console.error('[ha-mcp-server] HA MCP 服务器已启动')
console.error('[ha-mcp-server] 等待 MCP 客户端连接...')

// 保持进程运行
