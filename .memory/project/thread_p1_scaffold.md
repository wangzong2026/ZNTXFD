# 任务书：P1-T1 项目脚手架 + 币安暗色主题

## 背景
智能体知识库项目 MVP 阶段，需要搭建 Next.js 项目基础结构和币安风格暗色 UI 系统。

## 范围
1. 初始化 Next.js 15 项目（App Router, TypeScript, Tailwind CSS）
2. 搭建币安暗色主题系统：
   - 背景色 #0B0E11（主背景）、#1E2329（卡片背景）、#2B3139（悬浮/边框）
   - 强调色 #F0B90B（币安黄）、#F8D12F（浅黄）
   - 文字色 #EAECEF（主文字）、#848E9C（次要文字）、#474D57（禁用文字）
   - 成功 #0ECB81、危险 #F6465D
3. 建立全局布局（Header + Sidebar + Main Content）
4. 移动端响应式基础框架
5. 配置 Tailwind 自定义主题

## 输入
- 参考：币安交易所网页版 UI 风格
- 项目路径：~/Desktop/agent-knowledge-base/

## 交付物
- 可运行的 Next.js 项目
- 全局布局组件（桌面端侧边栏 + 移动端底部导航）
- 主题配置文件
- 首页骨架页面

## 约束
- 不安装多余依赖，Tailwind 能解决的不引入 UI 库
- TypeScript strict mode
- 所有文字中文
- 移动端优先设计
