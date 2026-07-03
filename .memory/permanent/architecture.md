# 架构决策记录

## 2026-07-02 立项

### 技术选型
- Next.js 15 + Tailwind + Vercel：用户有 AI Shop 项目经验，复用技术栈
- SQLite ODS → JSON 文件 → SSG：最简架构，零外部数据库依赖
- 密码门而非用户系统：降低群友使用门槛

### 数据流
ODS(VPS) → Python脚本(本地) → JSON文件 → Git Push → Vercel SSG

### 关键约束
- 4 群合一展示，不分群
- 知识内化（不是摘要），按话题分段
- 移动端优先（用户从微信点链接进来）
- 币安暗色 UI
