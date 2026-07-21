# 智能体先锋队知识库

社群知识沉淀平台 + Token 消耗排行榜。

线上站点：[znt.group](https://znt.group)

## 功能

### 知识日报

将微信社群每日聊天内容通过 AI 生成结构化知识日报，支持按日期浏览、全文搜索、话题聚合。

### Token 消耗榜

类似 [生财有术 TokenRank](https://scys.com/tokenrank/) 的 AI Token 消耗排行榜。

- 用户注册后获取专属令牌，运行安装命令即可自动采集本机 Codex / Claude Code 用量
- 支持多时间维度（今天、近 3 天、近 7 天）和多统计口径（含缓存、不含缓存、预计费用）
- 排行榜展示 Top 20，包含工具分布、设备数、连续天数等

### 其他功能

- 密码门访问控制
- 可信知识库与文档管理
- 热门话题 & 贡献者排行

## 技术栈

- **框架**: Next.js 15 (App Router)
- **部署**: Vercel
- **存储**: Vercel Blob（排行榜数据）
- **样式**: Tailwind CSS
- **数据管道**: ODS SQLite → AI 生成 → JSON 静态文件

## 快速开始

```bash
git clone https://github.com/wangzong2026/ZNTXFD.git
cd ZNTXFD
npm install
```

复制环境变量模板并填入你的配置：

```bash
cp .env.example .env.local
```

| 变量 | 说明 |
|------|------|
| `ACCESS_PASSWORD` | 网站访问密码 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob 存储令牌 |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL（可选） |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis Token（可选） |

启动开发服务器：

```bash
npm run dev
```

## Token 消耗榜 — 接入方式

注册账号后，在「我的」页面获取安装命令：

```bash
curl -fsSL https://znt.group/token-rank/install.sh | bash -s -- \
  --token <你的专属令牌> \
  --endpoint https://znt.group/api/token-rank/upload
```

脚本会自动采集本机 Codex / Claude Code 的 token 用量并定期上报，不上传代码或对话内容。

## 项目结构

```
src/
├── app/
│   ├── token-rank/       # Token 消耗榜页面
│   ├── daily/            # 知识日报页面
│   ├── knowledge/        # 知识库页面
│   ├── topics/           # 话题聚合页
│   ├── api/
│   │   ├── token-rank/   # 排行榜 API（注册/登录/上报/排行）
│   │   └── auth/         # 密码验证
│   └── login/            # 登录页
├── lib/
│   ├── tokenRankStore.ts # 排行榜数据层（Vercel Blob）
│   └── data.ts           # 知识日报数据层
data/                     # 知识日报 JSON 数据
public/
└── token-rank/           # 采集脚本（install.sh）
```

## 开源协议

[MIT](LICENSE)
