# 任务书：P1-T3 数据管道（ODS → 知识日报 JSON）

## 背景
ODS 数据库存储了 4 个智能体群的全部聊天记录。需要一个脚本，每天从 ODS 读取当日消息，调用 Claude API 生成知识日报，输出为 JSON 文件供网站读取。

## 范围
1. Python 脚本 `scripts/generate_daily.py`：
   - 读取 ODS 数据库中 4 个智能体群的当日消息
   - 过滤掉系统消息、表情、红包等无意义内容
   - 按时间线拼接为上下文
   - 调用 Claude API，Prompt 要求：
     * 把聊天内容内化为知识（不是摘要，是知识输出）
     * 按话题分段
     * 每段标注核心贡献者
     * 输出结构化 JSON
   - 写入 `data/daily/{YYYY-MM-DD}.json`

2. JSON 结构：
```json
{
  "date": "2026-07-02",
  "title": "AI Agent 落地方案 & 报价策略",
  "topics": [
    {
      "title": "话题标题",
      "content": "知识内容（markdown）",
      "contributors": ["贡献者1", "贡献者2"],
      "tags": ["AI Agent", "商业化"]
    }
  ],
  "stats": {
    "total_messages": 523,
    "active_members": 45
  }
}
```

3. 索引文件 `data/index.json`：所有日报的元数据列表

## 输入
- ODS 数据库：`~/.group-digest-runtime/wechat_ods.db`
- 目标群：group_name LIKE '%智能体%'
- Claude API Key：从环境变量 `ANTHROPIC_API_KEY` 读取

## 交付物
- `scripts/generate_daily.py`
- `scripts/generate_index.py`（重建索引）
- `data/daily/` 目录结构
- 示例输出（用真实数据生成 1 天的日报）

## 约束
- Python 3.11+，依赖最小化（sqlite3 + anthropic SDK）
- 4 群消息合在一起处理，不分群
- 单日消息过多时分批调用 API（每批不超过 100K tokens）
- 生成失败不能影响已有数据
