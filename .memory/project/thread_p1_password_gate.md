# 任务书：P1-T2 密码门

## 背景
网站仅供社群成员访问，需要在进入任何页面前验证访问密码。密码每周一自动轮换。

## 范围
1. 密码输入页面（全屏，币安风格）
2. API Route 验证密码（`/api/auth/verify`）
3. 验证通过后设置 HTTP-only cookie（有效期 7 天）
4. Middleware 拦截所有页面请求，无有效 cookie 重定向到密码页
5. 密码存储在 Vercel 环境变量 `ACCESS_PASSWORD`

## 输入
- 币安暗色主题系统（依赖 P1-T1）

## 交付物
- `/login` 密码输入页面
- `/api/auth/verify` API Route
- `middleware.ts` 访问控制
- 密码错误时的错误提示 UI

## 约束
- 不做用户注册/登录系统，只有一个共享密码
- cookie name: `kb_access_token`
- 密码验证用 crypto.timingSafeEqual 防时序攻击
- 密码页需要项目 logo 和名称展示
