# 智能体知识库 — 项目说明书

## 项目概述

为"智能体先锋队"社群（4 个微信群）建设知识沉淀网站。将每日群聊内容通过 AI 内化为结构化知识日报，同时收集群内分享的文档资料，形成可搜索、可浏览的社群知识库。

## 核心需求

1. **每日知识日报**：4 群消息合一，AI 生成当日知识总结（不是摘要，是知识内化）
2. **文档库**：自动抓取群内分享的文件/链接，在线预览
3. **主题专栏**：按话题聚合知识（如"某人系列分享"），AI 自动归类 + 手动策展
4. **访问控制**：密码门，每周一自动轮换密码
5. **UI 风格**：币安暗色风格，移动端优先

## 技术栈

- **框架**：Next.js 15 (App Router)
- **部署**：Vercel 免费版
- **数据**：ODS SQLite 数据库 → 每日同步生成 JSON 数据文件
- **AI 生成**：Claude API 生成知识日报
- **搜索**：客户端全文搜索（Fuse.js 或 MiniSearch）
- **样式**：Tailwind CSS

## 数据源

### ODS 数据库位置
- 生产环境：`~/.group-digest-runtime/wechat_ods.db`
- 项目副本：`~/Desktop/项目/群信息/wechat_ods.db`

### 目标群（4 个，合并为一个社群）
- 智能体先锋队一群（99,481 条消息）
- 智能体先锋队二群（19,850 条）
- 智能体先锋队三群（15,405 条）
- 智能体先锋队四群（6,798 条）

### 消息表结构（messages）
```sql
CREATE TABLE messages (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  group_name   TEXT NOT NULL,
  sender       TEXT NOT NULL,
  sent_at      TEXT NOT NULL,             -- YYYY-MM-DD HH:MM:SS
  content      TEXT DEFAULT '',
  msg_type     TEXT DEFAULT 'text',       -- text/image/system/file/link/...
  raw_line     TEXT DEFAULT '',
  imported_at  TEXT,
  sender_wxid  TEXT DEFAULT '',
  sender_name_source TEXT DEFAULT '',
  message_server_id TEXT DEFAULT '',
  UNIQUE(group_name, sender, sent_at, content)
);
```

### 文件/链接消息
- file 类型：82 条 + 文件消息：110 条 = 192 条
- link 类型：36 条 + 链接消息：158 条 = 194 条

## 分期交付计划

### P1 — MVP（当前阶段）
- [ ] 项目脚手架（Next.js + Tailwind + 币安暗色主题）
- [ ] 密码门页面（输入密码 → 进入网站）
- [ ] 每日知识日报列表页（按日期倒序）
- [ ] 知识日报详情页（展示 AI 生成的知识内容）
- [ ] 数据管道脚本（ODS → AI 生成 → JSON 文件）
- [ ] 移动端适配

### P2 — 文档库
- [ ] 文档上传/自动抓取
- [ ] 文档在线预览
- [ ] 文档分类管理

### P3 — 智能化
- [ ] 全文搜索
- [ ] AI 自动标签
- [ ] 主题专栏聚合页
- [ ] 贡献者排行

## 架构决策

### 为什么不用 Supabase
- 数据量不大（JSON 文件足够），减少外部依赖
- ODS 同步通过脚本完成，生成静态 JSON 文件
- Vercel 部署零成本

### 数据同步流程
```
VPS ODS (SQLite) 
  → 本地脚本读取当日 4 群消息
  → Claude API 生成知识日报
  → 输出 JSON 文件到 data/ 目录
  → git push → Vercel 自动部署
```

### 密码系统
- 密码存储在环境变量（Vercel）
- 客户端输入密码 → API Route 验证 → 设置 cookie
- 每周一 cron 更新密码 + 推送到微信群

## 编码规范

- TypeScript 严格模式
- 组件采用函数式写法
- 样式用 Tailwind，遵循币安设计语言（暗色背景 #0B0E11，黄色强调 #F0B90B）
- 移动端优先，响应式设计
- 中文内容，界面中文

## 项目负责人
- **总控/PM**：Claude（当前会话）
- **执行**：Codex + Agent 子线程
- **验收**：用户（旺总）
