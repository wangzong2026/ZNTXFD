# 任务书：P1-T4 知识日报页面

## 背景
网站核心页面，展示 AI 生成的每日知识日报。包含列表页和详情页。

## 范围
1. **日报列表页** `/`（首页）：
   - 按日期倒序展示日报卡片
   - 每张卡片：日期、标题、话题标签、消息数/活跃人数
   - 支持按月份筛选
   - 币安风格卡片布局

2. **日报详情页** `/daily/[date]`：
   - 顶部：日期、标题、统计数据
   - 内容区：按话题分段展示
   - 每个话题：标题、知识内容（支持 markdown 渲染）、贡献者头像/名字、标签
   - 底部：前一天/后一天导航

3. **数据读取**：从 `data/daily/*.json` 和 `data/index.json` 读取

## 输入
- 币安暗色主题（依赖 P1-T1）
- JSON 数据文件（依赖 P1-T3）

## 交付物
- `app/page.tsx`（首页/列表页）
- `app/daily/[date]/page.tsx`（详情页）
- 相关组件：DailyCard, TopicSection, ContributorBadge, TagBadge
- Markdown 渲染组件

## 约束
- 移动端优先，卡片一列；桌面端两列
- Markdown 渲染用 react-markdown，代码块带语法高亮
- 详情页 SSG（getStaticParams），构建时预生成
- 加载状态和空状态处理
