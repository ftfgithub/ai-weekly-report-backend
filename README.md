# AI Weekly Report Generator - Backend

AI 周报生成器后端服务，基于 Node.js + Express + TypeScript 构建。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

服务器运行在 http://localhost:3001

### 构建

```bash
npm run build
```

### 生产模式

```bash
npm start
```

## 📝 环境变量

创建 `.env` 文件：

```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-strong-secret-key-here
DEEPSEEK_API_KEY=your-deepseek-api-key
QWEN_API_KEY=your-qwen-api-key
ZHIPU_API_KEY=your-zhipu-api-key
DEFAULT_AI_PROVIDER=deepseek
ALLOWED_ORIGINS=http://localhost:3002
```

## 📦 项目结构

```
backend/
├── src/
│   ├── config/          # 应用配置
│   ├── middleware/      # 中间件
│   ├── routes/          # 路由
│   ├── services/        # 业务逻辑
│   ├── types/           # TypeScript 类型
│   └── server.ts        # 服务器入口
├── dist/                # 编译输出
├── .env.example         # 环境变量示例
├── tsconfig.json        # TypeScript 配置
└── package.json         # 项目配置
```

## 🔧 技术栈

- Node.js
- Express
- TypeScript
- JWT 认证
- AI 集成（DeepSeek, Qwen, Zhipu）

## 🚀 部署

### Railway 部署（推荐）

1. 访问 [Railway](https://railway.app/)
2. 创建新项目
3. 连接 GitHub 仓库
4. 配置环境变量
5. 自动部署

详细部署指南请参考 [DEPLOYMENT_WEB.md](./DEPLOYMENT_WEB.md)

### Vercel 部署

```bash
npm install -g vercel
vercel --prod
```

## 📋 API 端点

### 认证

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息

### 周报

- `POST /api/weekly-report/generate` - 生成周报
- `GET /api/weekly-report/history` - 获取历史记录

### 支付

- `POST /api/payment/create` - 创建支付订单
- `POST /api/payment/callback` - 支付回调

### 健康检查

- `GET /health` - 健康检查

## 📄 许可证

MIT
