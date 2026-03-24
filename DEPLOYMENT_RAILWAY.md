# 后端部署指南 - Railway 快速部署

## 🔧 解决 Railway 构建错误

### 问题原因

Railway 无法确定如何构建应用，因为你推送了整个项目（包含 frontend 和 backend 文件夹）。

### 解决方案

**只推送 backend 文件夹到 GitHub，然后在 Railway 中选择 backend 仓库。**

---

## 🚀 快速部署步骤

### 步骤 1：创建后端 GitHub 仓库

1. 访问 [GitHub](https://github.com/)
2. 创建新仓库：`ai-weekly-report-backend`
3. 不要初始化 README

### 步骤 2：推送 backend 到 GitHub

```bash
# 进入 backend 目录
cd backend

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/yourusername/ai-weekly-report-backend.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 步骤 3：在 Railway 部署

1. 访问 [Railway](https://railway.app/)
2. 点击 **New Project**
3. 选择 **Deploy from GitHub repo**
4. 选择 `ai-weekly-report-backend` 仓库（只包含后端代码）
5. 点击 **Deploy**

### 步骤 4：配置环境变量

在项目的 **Variables** 标签页中，添加：

```
NODE_ENV=production
PORT=3001
JWT_SECRET=your-strong-secret-key-here-change-this-in-production
DEEPSEEK_API_KEY=sk-cd00ae14c29446b5aba6994549c9fec4
DEFAULT_AI_PROVIDER=deepseek
ALLOWED_ORIGINS=http://localhost:3002,https://your-frontend-domain.vercel.app
```

### 步骤 5：重新部署

点击 **Redeploy** 按钮

---

## ✅ 验证部署

### 测试健康检查

```bash
curl https://ai-weekly-report-backend-production.up.railway.app/health
```

预期响应：

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 📝 重要提示

### 为什么这样部署？

- ✅ **清晰的仓库结构**：前端和后端完全分离
- ✅ **避免构建冲突**：Railway 只看到后端代码
- ✅ **易于维护**：可以独立更新前端或后端
- ✅ **快速部署**：Railway 自动检测 Node.js 项目

### Railway 支持的语言

Railway 自动检测以下语言：
- Node.js ✅（我们的后端）
- Python
- Go
- PHP
- Java
- Ruby
- 等等

---

## 🚨 常见问题

### 1. 构建失败：找不到 package.json

**原因**：推送了错误的内容

**解决方案**：
- 确保只推送 backend 文件夹
- 检查 backend/package.json 是否存在

### 2. 环境变量不生效

**解决方案**：
- 确认变量名正确
- 重新部署项目
- 查看部署日志

### 3. API 调用失败

**解决方案**：
- 检查 AI API 密钥是否有效
- 查看后端日志
- 测试健康检查接口

---

## 📊 成本分析

### Railway

- **免费额度**：$5/月（新用户）
- **超出费用**：按使用量计费
- **预估成本**：$0/月（免费额度足够）

### 总成本

- **云平台**：$0/月（免费额度）
- **AI 服务**：¥3-30/月
- **净利润**：¥2,200+/月（假设 100 付费用户）

---

## 🎯 下一步

1. ✅ 创建后端 GitHub 仓库
2. ✅ 推送 backend 到 GitHub
3. ✅ 在 Railway 部署
4. ✅ 配置环境变量
5. ✅ 测试后端 API
6. ✅ 部署前端到 Vercel
7. ✅ 开始推广赚钱！

---

**现在就开始部署吧！** 🚀

确保只推送 backend 文件夹到 GitHub，Railway 就能正确构建了。
