# 后端部署指南 - Web 界面部署（无需 CLI）

由于本地网络问题，推荐使用 Web 界面手动部署，无需安装任何 CLI 工具。

---

## 🚀 方案 1：Railway Web 界面部署（推荐）

### 优点
- ✅ 无需安装 CLI
- ✅ 完全 Web 操作
- ✅ 新用户有 $5 免费额度
- ✅ 支持持久化存储
- ✅ 自动 HTTPS

### 步骤

#### 步骤 1：注册 Railway

1. 访问 [Railway](https://railway.app/)
2. 点击右上角 **Login**
3. 选择登录方式（推荐使用 GitHub）
4. 授权 Railway 访问你的 GitHub

#### 步骤 2：创建新项目

1. 登录后，点击 **New Project**
2. 选择 **Deploy from GitHub repo**
3. 授权 Railway 访问你的 GitHub 仓库
4. 如果还没有仓库，选择 **Empty Project**

#### 步骤 3：配置服务

如果选择 **Empty Project**：

1. 点击 **+ New Service**
2. 选择 **Node.js**
3. 在 **Repository** 字段中，选择你的 GitHub 仓库
4. 如果没有仓库，可以：
   - 将代码推送到 GitHub
   - 或选择 **Public Templates** → **Node.js**

#### 步骤 4：配置环境变量

在项目的 **Variables** 标签页中，添加以下环境变量：

```
NODE_ENV=production
JWT_SECRET=your-strong-secret-key-here-change-this-in-production
QWEN_API_KEY=your_qwen_api_key_here
ZHIPU_API_KEY=your_zhipu_api_key_here
DEEPSEEK_API_KEY=sk-cd00ae14c29446b5aba6994549c9fec4
DEFAULT_AI_PROVIDER=deepseek
ALLOWED_ORIGINS=http://localhost:3002,https://your-frontend-domain.vercel.app
PORT=3001
```

**重要提示**：
- `JWT_SECRET` 必须是一个强密钥（至少 32 位随机字符）
- `ALLOWED_ORIGINS` 需要包含前端域名
- AI API 密钥需要从对应平台获取

#### 步骤 5：部署

1. 点击 **Deploy** 按钮
2. Railway 会自动：
   - 克隆代码
   - 安装依赖
   - 构建项目
   - 启动服务

#### 步骤 6：获取部署 URL

部署成功后，Railway 会提供一个 URL，例如：

```
https://ai-weekly-report-backend-production.up.railway.app
```

复制这个 URL，下一步会用到。

#### 步骤 7：测试部署

访问健康检查接口：

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

## 🚀 方案 2：Render Web 界面部署

### 优点
- ✅ 无需安装 CLI
- ✅ 完全 Web 操作
- ✅ 有免费额度
- ✅ 自动 HTTPS

### 步骤

#### 步骤 1：注册 Render

1. 访问 [Render](https://render.com/)
2. 点击右上角 **Sign Up**
3. 选择登录方式（推荐使用 GitHub）

#### 步骤 2：创建新服务

1. 登录后，点击 **New +**
2. 选择 **Web Service**
3. 在 **GitHub** 中连接你的仓库

#### 步骤 3：配置服务

**基本信息**：
- **Name**: `ai-weekly-report-backend`
- **Region**: 选择最近的区域（如 Singapore）

**构建和部署**：
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

**环境变量**：
点击 **Advanced** → **Add Environment Variable**，添加：

```
NODE_ENV=production
JWT_SECRET=your-strong-secret-key-here
DEEPSEEK_API_KEY=sk-cd00ae14c29446b5aba6994549c9fec4
DEFAULT_AI_PROVIDER=deepseek
ALLOWED_ORIGINS=http://localhost:3002,https://your-frontend-domain.onrender.com
PORT=3001
```

#### 步骤 4：部署

1. 点击 **Create Web Service**
2. Render 会自动部署
3. 等待部署完成（通常需要 2-5 分钟）

#### 步骤 5：获取部署 URL

部署成功后，Render 会提供一个 URL，例如：

```
https://ai-weekly-report-backend.onrender.com
```

---

## 🚀 方案 3：将代码推送到 GitHub，然后部署

### 步骤 1：初始化 Git 仓库

```bash
cd d:\oldData\work\AImoney
git init
```

### 步骤 2：创建 .gitignore

```bash
cat > .gitignore << EOF
node_modules
dist
.env
.env.local
.env.*.local
*.log
.DS_Store
.vscode
.idea
EOF
```

### 步骤 3：提交代码

```bash
git add .
git commit -m "Initial commit: AI Weekly Report Generator"
```

### 步骤 4：推送到 GitHub

1. 访问 [GitHub](https://github.com/)
2. 创建新仓库：`ai-weekly-report-generator`
3. 复制仓库 URL
4. 推送代码：

```bash
git remote add origin https://github.com/yourusername/ai-weekly-report-generator.git
git branch -M main
git push -u origin main
```

### 步骤 5：在 Railway/Render 部署

现在可以在 Railway 或 Render 中选择你的 GitHub 仓库进行部署了。

---

## 🔧 配置前端连接云端后端

### 步骤 1：更新前端配置

编辑 `.env` 文件：

```env
# 本地开发 - 连接云端后端
VITE_API_BASE_URL=https://ai-weekly-report-backend-production.up.railway.app
```

或使用 Render 的 URL：

```env
# 本地开发 - 连接云端后端
VITE_API_BASE_URL=https://ai-weekly-report-backend.onrender.com
```

### 步骤 2：重启前端开发服务器

```bash
# 停止当前服务器（Ctrl+C）
npm run dev
```

### 步骤 3：测试连接

访问 `http://localhost:3002`，尝试：
1. 注册新用户
2. 登录
3. 生成周报
4. 查看套餐

---

## 🧪 测试 API

### 测试健康检查

```bash
curl https://ai-weekly-report-backend-production.up.railway.app/health
```

### 测试注册

```bash
curl -X POST https://ai-weekly-report-backend-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "测试用户"
  }'
```

---

## 📊 成本分析

### Railway

- **免费额度**：$5/月（新用户）
- **超出费用**：按使用量计费
- **预估成本**：$0/月（免费额度足够）

### Render

- **免费额度**：750 小时/月（约 31 天）
- **超出费用**：$7/月
- **预估成本**：$0/月（免费额度足够）

---

## 🚨 常见问题

### 1. 部署失败

**检查清单**：
- [ ] 代码是否已推送到 GitHub
- [ ] `package.json` 中的 `start` 脚本是否正确
- [ ] 环境变量是否全部配置
- [ ] 查看部署日志

### 2. CORS 错误

**解决方案**：
- 确保 `ALLOWED_ORIGINS` 包含前端域名
- 检查前端 API URL 是否正确
- 查看浏览器控制台错误信息

### 3. API 调用失败

**检查清单**：
- [ ] 环境变量是否正确配置
- [ ] AI API 密钥是否有效
- [ ] 查看后端日志
- [ ] 测试健康检查接口

### 4. 404 错误

**解决方案**：
- 检查路由是否正确
- 确认部署 URL 是否正确
- 查看部署日志

---

## 📝 部署检查清单

### 后端部署
- [ ] 注册 Railway/Render 账户
- [ ] 创建新项目
- [ ] 配置环境变量
- [ ] 部署成功
- [ ] 测试健康检查接口
- [ ] 测试注册/登录接口
- [ ] 测试周报生成接口

### 前端配置
- [ ] 更新 `.env` 文件
- [ ] 重启前端开发服务器
- [ ] 测试注册/登录
- [ ] 测试周报生成
- [ ] 测试支付流程

---

## 🎯 推广准备

### 1. 准备推广材料
- [ ] 编写产品介绍
- [ ] 制作演示视频
- [ ] 准备宣传图片
- [ ] 准备使用教程

### 2. 选择推广渠道
- [ ] 小红书
- [ ] 知乎
- [ ] 微博
- [ ] 掘金
- [ ] CSDN
- [ ] GitHub

### 3. 设置定价策略
- [ ] 免费版：3 次/天
- [ ] 月度会员：¥9.9/月
- [ ] 年度会员：¥99/年
- [ ] 企业版：¥999/年

---

**现在就开始部署吧！** 🚀

推荐使用 Railway，因为它有免费额度且完全通过 Web 界面操作，无需 CLI。
