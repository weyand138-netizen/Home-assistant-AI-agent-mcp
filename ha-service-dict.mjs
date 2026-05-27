/**
 * Home Assistant 服务字典
 *
 * 记录了每个服务的 domain、可用服务名称和参数字段。
 * 数据基于 HA REST API /api/services 整理。
 */

// prettier-ignore
export const haServiceDict = [
  // ── persistent_notification ──
  { domain: 'persistent_notification', service: 'create', description: '创建持久通知', needsEntityId: false, fields: [
    { name: 'message', required: true, description: '通知消息内容', example: 'Please check your configuration.' },
    { name: 'title', required: false, description: '通知标题' },
    { name: 'notification_id', required: false, description: '通知 ID' },
  ] },
  { domain: 'persistent_notification', service: 'dismiss', description: '关闭通知', needsEntityId: false, fields: [
    { name: 'notification_id', required: true, description: '要关闭的通知 ID' },
  ] },
  { domain: 'persistent_notification', service: 'dismiss_all', description: '关闭所有通知', needsEntityId: false, fields: [] },

  // ── homeassistant ──
  { domain: 'homeassistant', service: 'turn_on', description: '打开实体', needsEntityId: true, fields: [] },
  { domain: 'homeassistant', service: 'turn_off', description: '关闭实体', needsEntityId: true, fields: [] },
  { domain: 'homeassistant', service: 'toggle', description: '切换实体开关', needsEntityId: true, fields: [] },
  { domain: 'homeassistant', service: 'stop', description: '停止 Home Assistant', needsEntityId: false, fields: [] },
  { domain: 'homeassistant', service: 'restart', description: '重启 Home Assistant', needsEntityId: false, fields: [] },
  { domain: 'homeassistant', service: 'check_config', description: '检查配置文件', needsEntityId: false, fields: [] },
  { domain: 'homeassistant', service: 'update_entity', description: '刷新实体状态', needsEntityId: true, fields: [] },
  { domain: 'homeassistant', service: 'reload_core_config', description: '重新加载核心配置', needsEntityId: false, fields: [] },
  { domain: 'homeassistant', service: 'set_location', description: '设置 Home Assistant 位置', needsEntityId: false, fields: [
    { name: 'latitude', required: true, description: '纬度' },
    { name: 'longitude', required: true, description: '经度' },
    { name: 'elevation', required: false, description: '海拔（米）' },
  ] },
  { domain: 'homeassistant', service: 'save_persistent_states', description: '保存持久状态', needsEntityId: false, fields: [] },
  { domain: 'homeassistant', service: 'reload_custom_templates', description: '重新加载自定义模板', needsEntityId: false, fields: [] },
  { domain: 'homeassistant', service: 'reload_config_entry', description: '重新加载配置条目', needsEntityId: true, fields: [
    { name: 'entry_id', required: false, description: '配置条目 ID' },
  ] },
  { domain: 'homeassistant', service: 'reload_all', description: '重新加载所有', needsEntityId: false, fields: [] },

  // ── system_log ──
  { domain: 'system_log', service: 'clear', description: '清除系统日志', needsEntityId: false, fields: [] },
  { domain: 'system_log', service: 'write', description: '写入系统日志', needsEntityId: false, fields: [
    { name: 'message', required: true, description: '日志消息' },
    { name: 'level', required: false, description: '日志级别（debug/info/warning/error/critical）' },
    { name: 'logger', required: false, description: '日志记录器名称' },
  ] },

  // ── logger ──
  { domain: 'logger', service: 'set_default_level', description: '设置默认日志级别', needsEntityId: false, fields: [
    { name: 'level', required: true, description: '日志级别' },
  ] },
  { domain: 'logger', service: 'set_level', description: '设置指定日志记录器级别', needsEntityId: false, fields: [] },

  // ── frontend ──
  { domain: 'frontend', service: 'set_theme', description: '设置主题', needsEntityId: false, fields: [
    { name: 'name', required: false, description: '主题名称' },
    { name: 'name_dark', required: false, description: '暗色主题名称' },
  ] },
  { domain: 'frontend', service: 'reload_themes', description: '重新加载主题', needsEntityId: false, fields: [] },

  // ── recorder ──
  { domain: 'recorder', service: 'purge', description: '清除历史数据', needsEntityId: false, fields: [
    { name: 'keep_days', required: false, description: '保留天数' },
    { name: 'repack', required: false, description: '是否重新打包数据库' },
    { name: 'apply_filter', required: false, description: '是否应用过滤器' },
  ] },
  { domain: 'recorder', service: 'purge_entities', description: '清除实体历史', needsEntityId: false, fields: [
    { name: 'entity_id', required: false, description: '要清除的实体 ID' },
    { name: 'domains', required: false, description: '要清除的 domain' },
    { name: 'entity_globs', required: false, description: '实体 glob 匹配' },
    { name: 'keep_days', required: false, description: '保留天数' },
  ] },
  { domain: 'recorder', service: 'enable', description: '启用记录器', needsEntityId: false, fields: [] },
  { domain: 'recorder', service: 'disable', description: '禁用记录器', needsEntityId: false, fields: [] },

  // ── backup ──
  { domain: 'backup', service: 'create', description: '创建备份', needsEntityId: false, fields: [] },
  { domain: 'backup', service: 'create_automatic', description: '创建自动备份', needsEntityId: false, fields: [] },

  // ── conversation ──
  { domain: 'conversation', service: 'process', description: '处理自然语言指令', needsEntityId: false, fields: [
    { name: 'text', required: true, description: '要处理的文本' },
    { name: 'language', required: false, description: '语言代码（如 zh-cn）' },
    { name: 'agent_id', required: false, description: '对话代理 ID' },
    { name: 'conversation_id', required: false, description: '对话 ID（用于上下文）' },
  ] },
  { domain: 'conversation', service: 'reload', description: '重新加载对话代理', needsEntityId: false, fields: [
    { name: 'language', required: false, description: '语言代码' },
    { name: 'agent_id', required: false, description: '对话代理 ID' },
  ] },

  // ── camera ──
  { domain: 'camera', service: 'turn_on', description: '打开摄像头', needsEntityId: true, fields: [] },
  { domain: 'camera', service: 'turn_off', description: '关闭摄像头', needsEntityId: true, fields: [] },
  { domain: 'camera', service: 'enable_motion_detection', description: '启用运动检测', needsEntityId: true, fields: [] },
  { domain: 'camera', service: 'disable_motion_detection', description: '禁用运动检测', needsEntityId: true, fields: [] },
  { domain: 'camera', service: 'snapshot', description: '拍摄快照', needsEntityId: true, fields: [
    { name: 'filename', required: true, description: '保存路径' },
  ] },
  { domain: 'camera', service: 'play_stream', description: '播放摄像头流', needsEntityId: true, fields: [
    { name: 'media_player', required: true, description: '播放媒体设备 entity_id' },
    { name: 'format', required: false, description: '流格式（hls 等）' },
  ] },
  { domain: 'camera', service: 'record', description: '录制视频', needsEntityId: true, fields: [
    { name: 'filename', required: true, description: '保存路径' },
    { name: 'duration', required: false, description: '录制时长（秒）' },
    { name: 'lookback', required: false, description: '回看时长（秒）' },
  ] },

  // ── scene ──
  { domain: 'scene', service: 'turn_on', description: '激活场景', needsEntityId: true, fields: [
    { name: 'transition', required: false, description: '过渡时间（秒）' },
  ] },
  { domain: 'scene', service: 'reload', description: '重新加载场景', needsEntityId: false, fields: [] },
  { domain: 'scene', service: 'apply', description: '应用场景设置', needsEntityId: false, fields: [
    { name: 'entities', required: true, description: '实体状态映射 YAML' },
    { name: 'transition', required: false, description: '过渡时间（秒）' },
  ] },
  { domain: 'scene', service: 'create', description: '创建场景', needsEntityId: false, fields: [
    { name: 'scene_id', required: true, description: '场景 ID' },
    { name: 'entities', required: false, description: '实体状态映射' },
    { name: 'snapshot_entities', required: false, description: '快照实体列表' },
  ] },
  { domain: 'scene', service: 'delete', description: '删除场景', needsEntityId: true, fields: [] },

  // ── script ──
  { domain: 'script', service: 'turn_on', description: '启用脚本', needsEntityId: true, fields: [] },
  { domain: 'script', service: 'turn_off', description: '禁用脚本', needsEntityId: true, fields: [] },
  { domain: 'script', service: 'toggle', description: '切换脚本', needsEntityId: true, fields: [] },
  { domain: 'script', service: 'reload', description: '重新加载脚本', needsEntityId: false, fields: [] },

  // ── automation ──
  { domain: 'automation', service: 'trigger', description: '触发自动化', needsEntityId: true, fields: [
    { name: 'skip_condition', required: false, description: '跳过条件判断' },
  ] },
  { domain: 'automation', service: 'turn_on', description: '启用自动化', needsEntityId: true, fields: [] },
  { domain: 'automation', service: 'turn_off', description: '关闭自动化', needsEntityId: true, fields: [
    { name: 'stop_actions', required: false, description: '停止正在执行的动作' },
  ] },
  { domain: 'automation', service: 'toggle', description: '切换自动化', needsEntityId: true, fields: [] },
  { domain: 'automation', service: 'reload', description: '重新加载自动化', needsEntityId: false, fields: [] },

  // ── input_boolean ──
  { domain: 'input_boolean', service: 'turn_on', description: '打开布尔输入', needsEntityId: true, fields: [] },
  { domain: 'input_boolean', service: 'turn_off', description: '关闭布尔输入', needsEntityId: true, fields: [] },
  { domain: 'input_boolean', service: 'toggle', description: '切换布尔输入', needsEntityId: true, fields: [] },
  { domain: 'input_boolean', service: 'reload', description: '重新加载布尔输入', needsEntityId: false, fields: [] },

  // ── input_button ──
  { domain: 'input_button', service: 'press', description: '按下按钮', needsEntityId: true, fields: [] },
  { domain: 'input_button', service: 'reload', description: '重新加载按钮', needsEntityId: false, fields: [] },

  // ── timer ──
  { domain: 'timer', service: 'start', description: '启动定时器', needsEntityId: true, fields: [
    { name: 'duration', required: false, description: '持续时间（如 00:01:00 或 60 秒）' },
  ] },
  { domain: 'timer', service: 'pause', description: '暂停定时器', needsEntityId: true, fields: [] },
  { domain: 'timer', service: 'cancel', description: '取消定时器', needsEntityId: true, fields: [] },
  { domain: 'timer', service: 'finish', description: '完成定时器', needsEntityId: true, fields: [] },
  { domain: 'timer', service: 'change', description: '修改定时器', needsEntityId: true, fields: [
    { name: 'duration', required: true, description: '修改的持续时间（正数加/负数减）' },
  ] },
  { domain: 'timer', service: 'reload', description: '重新加载定时器', needsEntityId: false, fields: [] },

  // ── input_select ──
  { domain: 'input_select', service: 'select_first', description: '选择第一个选项', needsEntityId: true, fields: [] },
  { domain: 'input_select', service: 'select_last', description: '选择最后一个选项', needsEntityId: true, fields: [] },
  { domain: 'input_select', service: 'select_next', description: '选择下一个选项', needsEntityId: true, fields: [
    { name: 'cycle', required: false, description: '是否循环' },
  ] },
  { domain: 'input_select', service: 'select_previous', description: '选择上一个选项', needsEntityId: true, fields: [
    { name: 'cycle', required: false, description: '是否循环' },
  ] },
  { domain: 'input_select', service: 'select_option', description: '选择指定选项', needsEntityId: true, fields: [
    { name: 'option', required: true, description: '要选择的选项值' },
  ] },
  { domain: 'input_select', service: 'set_options', description: '设置选项列表', needsEntityId: true, fields: [
    { name: 'options', required: true, description: '选项列表，JSON 数组' },
  ] },
  { domain: 'input_select', service: 'reload', description: '重新加载下拉选择', needsEntityId: false, fields: [] },

  // ── logbook ──
  { domain: 'logbook', service: 'log', description: '写入日志条目', needsEntityId: false, fields: [
    { name: 'name', required: true, description: '事件名称' },
    { name: 'message', required: true, description: '日志消息' },
    { name: 'entity_id', required: false, description: '关联的实体 ID' },
    { name: 'domain', required: false, description: '关联的 domain' },
  ] },

  // ── input_number ──
  { domain: 'input_number', service: 'set_value', description: '设置数值', needsEntityId: true, fields: [
    { name: 'value', required: true, description: '要设置的数值' },
  ] },
  { domain: 'input_number', service: 'increment', description: '增加数值', needsEntityId: true, fields: [] },
  { domain: 'input_number', service: 'decrement', description: '减少数值', needsEntityId: true, fields: [] },
  { domain: 'input_number', service: 'reload', description: '重新加载数值输入', needsEntityId: false, fields: [] },

  // ── input_text ──
  { domain: 'input_text', service: 'set_value', description: '设置文本值', needsEntityId: true, fields: [
    { name: 'value', required: true, description: '要设置的文本' },
  ] },
  { domain: 'input_text', service: 'reload', description: '重新加载文本输入', needsEntityId: false, fields: [] },

  // ── input_datetime ──
  { domain: 'input_datetime', service: 'set_datetime', description: '设置日期时间', needsEntityId: true, fields: [
    { name: 'date', required: false, description: '日期（如 2019-04-20）' },
    { name: 'time', required: false, description: '时间（如 05:04:20）' },
    { name: 'datetime', required: false, description: '日期时间（如 2019-04-20 05:04:20）' },
    { name: 'timestamp', required: false, description: 'Unix 时间戳' },
  ] },
  { domain: 'input_datetime', service: 'reload', description: '重新加载日期时间输入', needsEntityId: false, fields: [] },

  // ── shopping_list ──
  { domain: 'shopping_list', service: 'add_item', description: '添加购物项', needsEntityId: false, fields: [
    { name: 'name', required: true, description: '项目名称' },
  ] },
  { domain: 'shopping_list', service: 'remove_item', description: '移除购物项', needsEntityId: false, fields: [
    { name: 'name', required: true, description: '要移除的项目名称' },
  ] },
  { domain: 'shopping_list', service: 'complete_item', description: '标记购物项为已完成', needsEntityId: false, fields: [
    { name: 'name', required: true, description: '项目名称' },
  ] },
  { domain: 'shopping_list', service: 'incomplete_item', description: '标记购物项为未完成', needsEntityId: false, fields: [
    { name: 'name', required: true, description: '项目名称' },
  ] },
  { domain: 'shopping_list', service: 'complete_all', description: '标记所有为已完成', needsEntityId: false, fields: [] },
  { domain: 'shopping_list', service: 'incomplete_all', description: '标记所有为未完成', needsEntityId: false, fields: [] },
  { domain: 'shopping_list', service: 'clear_completed_items', description: '清除已完成的购物项', needsEntityId: false, fields: [] },
  { domain: 'shopping_list', service: 'sort', description: '排序购物清单', needsEntityId: false, fields: [
    { name: 'reverse', required: false, description: '是否反向排序' },
  ] },

  // ── counter ──
  { domain: 'counter', service: 'increment', description: '计数器加一', needsEntityId: true, fields: [] },
  { domain: 'counter', service: 'decrement', description: '计数器减一', needsEntityId: true, fields: [] },
  { domain: 'counter', service: 'reset', description: '重置计数器', needsEntityId: true, fields: [] },
  { domain: 'counter', service: 'set_value', description: '设置计数器值', needsEntityId: true, fields: [
    { name: 'value', required: true, description: '要设置的值' },
  ] },

  // ── notify ──
  { domain: 'notify', service: 'send_message', description: '发送通知消息', needsEntityId: true, fields: [
    { name: 'message', required: true, description: '消息内容' },
    { name: 'title', required: false, description: '消息标题' },
  ] },
  { domain: 'notify', service: 'persistent_notification', description: '发送持久通知', needsEntityId: false, fields: [
    { name: 'message', required: true, description: '消息内容' },
    { name: 'title', required: false, description: '通知标题' },
    { name: 'data', required: false, description: '平台特定数据' },
  ] },
  { domain: 'notify', service: 'notify', description: '发送通知', needsEntityId: false, fields: [
    { name: 'message', required: true, description: '消息内容' },
    { name: 'title', required: false, description: '标题' },
    { name: 'target', required: false, description: '目标' },
    { name: 'data', required: false, description: '平台特定数据' },
  ] },

  // ── todo ──
  { domain: 'todo', service: 'add_item', description: '添加待办事项', needsEntityId: true, fields: [
    { name: 'item', required: true, description: '待办事项内容' },
    { name: 'due_date', required: false, description: '截止日期（如 2023-11-17）' },
    { name: 'due_datetime', required: false, description: '截止日期时间（如 2023-11-17 13:30:00）' },
    { name: 'description', required: false, description: '详细描述' },
  ] },
  { domain: 'todo', service: 'update_item', description: '更新待办事项', needsEntityId: true, fields: [
    { name: 'item', required: true, description: '待办事项内容' },
    { name: 'rename', required: false, description: '重命名为' },
    { name: 'status', required: false, description: '状态（needs_action/completed）' },
    { name: 'due_date', required: false, description: '截止日期' },
    { name: 'due_datetime', required: false, description: '截止日期时间' },
    { name: 'description', required: false, description: '详细描述' },
  ] },
  { domain: 'todo', service: 'remove_item', description: '移除待办事项', needsEntityId: true, fields: [
    { name: 'item', required: true, description: '要移除的事项内容' },
  ] },
  { domain: 'todo', service: 'get_items', description: '获取待办事项列表', needsEntityId: true, fields: [
    { name: 'status', required: false, description: '过滤状态（needs_action/completed）' },
  ] },
  { domain: 'todo', service: 'remove_completed_items', description: '移除已完成事项', needsEntityId: true, fields: [] },

  // ── weather ──
  { domain: 'weather', service: 'get_forecasts', description: '获取天气预报', needsEntityId: true, fields: [
    { name: 'type', required: true, description: '预报类型（daily/hourly/twice_daily）' },
  ] },

  // ── ffmpeg ──
  { domain: 'ffmpeg', service: 'start', description: '启动 FFmpeg', needsEntityId: true, fields: [] },
  { domain: 'ffmpeg', service: 'stop', description: '停止 FFmpeg', needsEntityId: true, fields: [] },
  { domain: 'ffmpeg', service: 'restart', description: '重启 FFmpeg', needsEntityId: true, fields: [] },

  // ── tts ──
  { domain: 'tts', service: 'speak', description: '文字转语音播放', needsEntityId: false, fields: [
    { name: 'media_player_entity_id', required: true, description: '播放设备 entity_id' },
    { name: 'message', required: true, description: '要朗读的文本' },
    { name: 'cache', required: false, description: '是否缓存' },
    { name: 'language', required: false, description: '语言代码' },
    { name: 'options', required: false, description: '平台特定选项' },
  ] },
  { domain: 'tts', service: 'clear_cache', description: '清除 TTS 缓存', needsEntityId: false, fields: [] },

  // ── zone ──
  { domain: 'zone', service: 'reload', description: '重新加载区域', needsEntityId: false, fields: [] },

  // ── person ──
  { domain: 'person', service: 'reload', description: '重新加载人员', needsEntityId: false, fields: [] },

  // ── schedule ──
  { domain: 'schedule', service: 'reload', description: '重新加载日程', needsEntityId: false, fields: [] },
  { domain: 'schedule', service: 'get_schedule', description: '获取日程', needsEntityId: true, fields: [] },

  // ── cloud ──
  { domain: 'cloud', service: 'remote_connect', description: '连接 HA Cloud', needsEntityId: false, fields: [] },
  { domain: 'cloud', service: 'remote_disconnect', description: '断开 HA Cloud', needsEntityId: false, fields: [] },
]

/**
 * 根据 domain 和 service 查找服务信息
 */
export function lookupService(domain, service) {
  return haServiceDict.find(s => s.domain === domain && s.service === service)
}

/**
 * 将服务信息格式化为可读文本
 */
export function formatServiceInfo(info) {
  const lines = [
    `服务: ${info.domain}.${info.service}`,
    `说明: ${info.description}`,
    `需要 entity_id: ${info.needsEntityId ? '是' : '否'}`,
  ]

  if (info.fields.length > 0) {
    lines.push('参数字段:')
    for (const field of info.fields) {
      const req = field.required ? '必填' : '可选'
      const example = field.example ? ` (示例: ${field.example})` : ''
      lines.push(`  - ${field.name} [${req}]${example}: ${field.description}`)
    }
  }
  else {
    lines.push('参数字段: 无')
  }

  return lines.join('\n')
}

/**
 * 列出所有可用的 domain
 */
export function listDomains() {
  const domains = new Set(haServiceDict.map(s => s.domain))
  return [...domains].sort()
}

/**
 * 列出指定 domain 下的所有服务
 */
export function listServices(domain) {
  return haServiceDict
    .filter(s => s.domain === domain)
    .map(s => s.service)
}
