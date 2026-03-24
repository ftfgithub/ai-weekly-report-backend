# 后端部署指南

## 🚀 快速部署到云平台

由于本地网络问题，推荐将后端部署到云平台。以下是两种最简单的部署方式：

---

## 方案 1：Vercel 部署（推荐，免费）

### 优点
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自动部署
- ✅ 支持自定义域名

### 步骤

#### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

#### 2. 登录 Vercel
```bash
vercel login
```
按照提示登录你的 Vercel 账户（如果没有，会引导你注册）

#### 3. 部署后端
```bash
cd backend
vercel
```

按照提示操作：
- Set up and deploy? **Yes**
- Which scope? **选择你的用户名**
- Link to existing project? **No**
- What's your project's name? **ai-weekly-report-backend**（或自定义）
- In which directory is your code located? **./**
- Want to override the settings? **No**

#### 4. 配置环境变量

访问 [Vercel Dashboard](https://vercel.com/dashboard)：
1. 选择你的项目
2. 点击 **Settings** → **Environment Variables**
3. 添加以下环境变量：

```
NODE_ENV=production
JWT_SECRET=your-strong-secret-key-here
QWEN_API_KEY=your_qwen_api_key_here
ZHIPU_API_KEY=your_zhipu_api_key_here
DEEPSEEK_API_KEY=sk-cd00ae14c29446b5aba6994549c9fec4
DEFAULT_AI_PROVIDER=deepseek
ALLOWED_ORIGINS=http://localhost:3002,https://your-frontend-domain.vercel.app
```

#### 5. 重新部署
在 Vercel Dashboard 中点击 **Redeploy**，或在本地运行：
```bash
vercel --prod
```

#### 6. 获取部署 URL
部署成功后，Vercel 会提供一个 URL，例如：
```
https://ai-weekly-report-backend.vercel.app
```

---

## 方案 2：Railway 部署（推荐，有免费额度）

### 优点
- ✅ 新用户有 $5 免费额度
- ✅ 支持持久化存储
- ✅ 支持数据库
- ✅ 更灵活的配置

### 步骤

#### 1. 访问 Railway
打开 [Railway](https://railway.app/)

#### 2. 创建新项目
1. 点击 **New Project**
2. 选择 **Deploy from GitHub repo**
3. 授权 Railway 访问你的 GitHub

#### 3. 选择仓库
选择包含后端代码的仓库，或选择 **Empty Project** 然后手动上传

#### 4. 配置服务
1. 点击 **+ New Service**
2. 选择 **Node.js**
3. Railway 会自动检测并配置

#### 5. 配置环境变量
在项目的 **Variables** 标签页中添加：

```
NODE_ENV=production
JWT_SECRET=your-strong-secret-key-here
QWEN_API_KEY=your_qwen_api_key_here
ZHIPU_API_KEY=your_zhipu_api_key_here
DEEPSEEK_API_KEY=sk-cd00ae14c29446b5aba6994549c9fec4
DEFAULT_AI_PROVIDER=deepseek
ALLOWED_ORIGINS=http://localhost:3002,https://your-frontend-domain.vercel.app
PORT=3001
```

#### 6. 部署
Railway 会自动部署，点击 **Deploy** 按钮即可

#### 7. 获取部署 URL
部署成功后，Railway 会提供一个 URL，例如：
```
https://ai-weekly-report-backend.up.railway.app
```

---

## 🔧 配置前端连接云端后端

### 1. 更新前端环境变量

编辑 `.env` 文件：

```env
VITE_API_BASE_URL=https://ai-weekly-report-backend.vercel.app
```

或使用 Railway 的 URL：

```env
VITE_API_BASE_URL=https://ai-weekly-report-backend.up.railway.app
```

### 2. 重启前端开发服务器

```bash
# 停止当前服务器（Ctrl+C）
npm run dev
```

### 3. 测试连接

访问 `http://localhost:3002`，尝试：
- 注册/登录
- 生成周报
- 查看套餐

---

## 🧪 测试 API

### 测试健康检查
```bash
curl https://ai-weekly-report-backend.vercel.app/health
```

预期响应：
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 测试注册
```bash
curl -X POST https://ai-weekly-report-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "测试用户"
  }'
```

---

## 📊 成本分析

### Vercel
- **免费额度**：100GB 带宽/月
- **超出费用**：$40/100GB
- **预估成本**：$0/月（免费额度足够）

### Railway
- **免费额度**：$5/月（新用户）
- **超出费用**：按使用量计费
- **预估成本**：$0/月（免费额度足够）

---

## 🔒 安全建议

1. **不要在代码中硬编码 API 密钥**
2. **使用强 JWT 密钥**（至少 32 位随机字符）
3. **定期轮换 API 密钥**
4. **监控 API 使用量**
5. **设置速率限制**（已配置）

---

## 🚨 常见问题

### 1. 部署失败
- 检查 `package.json` 中的 `start` 脚本
- 确保 TypeScript 编译成功
- 查看部署日志

### 2. CORS 错误
- 确保 `ALLOWED_ORIGINS` 包含前端域名
- 检查前端 API URL 是否正确

### 3. API 调用失败
- 检查环境变量是否正确配置
- 查看 Vercel/Railway 的日志
- 确认 AI API 密钥有效

### 4. 404 错误
- 检查路由是否正确
- 确认 Vercel/Railway 的部署 URL

---

## 📝 下一步

1. ✅ 部署后端到云平台
2. ✅ 更新前端配置
3. ✅ 测试前后端连接
4. ✅ 部署前端到云平台
5. ✅ 开始推广赚钱！

---

## 🎯 推广建议

### 初期（1-2周）
1. **免费试用**：提供 3 次免费生成
2. **社交媒体**：在小红书、知乎、微博推广
3. **技术社区**：在掘金、CSDN、GitHub 发布

### 中期（1-2月）
1. **内容营销**：发布周报写作教程
2. **SEO 优化**：优化关键词排名
3. **用户反馈**：收集并改进产品

### 长期（3-6月）
1. **企业合作**：为企业提供定制服务
2. **功能扩展**：添加更多 AI 工具
3. **生态建设**：构建 AI 工具生态

---

**现在开始部署吧！** 🚀
