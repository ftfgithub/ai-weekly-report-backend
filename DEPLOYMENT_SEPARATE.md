# 后端部署指南 - 单独部署后端

由于前后端在同一个仓库中，需要告诉云平台只部署后端部分。

---

## 🔧 方案 1：使用 .gitignore 隔离前端（推荐）

### 步骤 1：创建后端专用的 .gitignore

在仓库根目录创建 `.gitignore` 文件，添加以下内容：

```
# 前端文件（不部署到后端）
src/
index.html
vite.config.ts
tsconfig.json
package.json
package-lock.json
netlify.toml
vercel.json
FRONTEND_DEPLOYMENT.md
deploy-*.bat
deploy-*.sh

# 只保留后端文件
!backend/
```

### 步骤 2：提交并推送

```bash
git add .
git commit -m "Update .gitignore for backend-only deployment"
git push
```

### 步骤 3：在 Railway 部署

1. 访问 [Railway](https://railway.app/)
2. 创建新项目
3. 选择 **Deploy from GitHub repo**
4. 选择你的仓库
5. Railway 会自动检测到只有后端文件

---

## 🔧 方案 2：修改 vercel.json 指定后端路径

### 步骤 1：更新 vercel.json

编辑 `backend/vercel.json`：

```json
{
  "version": 2,
  "buildCommand": "cd backend && npm install && npm run build",
  "outputDirectory": "backend/dist",
  "builds": [
    {
      "src": "backend/src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/src/server.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "PORT": "3001"
  }
}
```

### 步骤 2：提交并推送

```bash
git add backend/vercel.json
git commit -m "Update vercel.json for backend deployment"
git push
```

---

## 🔧 方案 3：创建独立的后端仓库（最简单）

### 步骤 1：创建新的 GitHub 仓库

1. 访问 [GitHub](https://github.com/)
2. 创建新仓库：`ai-weekly-report-backend`
3. 不要初始化 README

### 步骤 2：复制后端文件

```bash
# 在本地项目根目录
mkdir backend-repo
cd backend-repo

# 复制后端文件
cp -r ../backend/* .

# 初始化 Git
git init
git add .
git commit -m "Initial commit: Backend only"

# 推送到新仓库
git remote add origin https://github.com/yourusername/ai-weekly-report-backend.git
git branch -M main
git push -u origin main
```

### 步骤 3：在 Railway 部署

1. 访问 [Railway](https://railway.app/)
2. 创建新项目
3. 选择 **Deploy from GitHub repo**
4. 选择 `ai-weekly-report-backend` 仓库
5. 配置环境变量
6. 部署

---

## 🔧 方案 4：使用 Railway 的 Root Directory 设置

### 步骤 1：在 Railway 配置

1. 访问 Railway Dashboard
2. 选择你的项目
3. 点击 **Settings**
4. 在 **Root Directory** 字段中输入：`backend`

### 步骤 2：重新部署

点击 **Redeploy** 按钮

---

## 📝 推荐方案

### 最佳实践：方案 3（独立仓库）

**为什么推荐**：
- ✅ 最简单直接
- ✅ 避免构建冲突
- ✅ 易于管理
- ✅ 可以独立部署

### 次优方案：方案 1（.gitignore）

**为什么次优**：
- ✅ 不需要创建新仓库
- ✅ 可以在同一个仓库管理
- ❌ 需要仔细配置 .gitignore

---

## 🚨 常见构建错误及解决方案

### 错误 1：找不到 package.json

**原因**：云平台在根目录查找 package.json，但前端和后端都有

**解决方案**：
- 使用方案 1：在 .gitignore 中排除前端
- 使用方案 3：创建独立的后端仓库
- 使用方案 4：在 Railway 设置 Root Directory

### 错误 2：构建命令失败

**原因**：云平台执行了错误的构建命令

**解决方案**：
- 检查 `backend/package.json` 中的 `build` 脚本
- 确保 `backend/vercel.json` 或 `backend/railway.json` 正确配置

### 错误 3：TypeScript 编译错误

**原因**：TypeScript 配置问题或代码错误

**解决方案**：
- 在本地运行 `cd backend && npm run build` 测试
- 检查 `backend/tsconfig.json` 配置
- 查看编译错误并修复

### 错误 4：依赖安装失败

**原因**：网络问题或依赖版本冲突

**解决方案**：
- 在本地运行 `cd backend && npm install` 测试
- 检查 `backend/package-lock.json` 是否正确
- 查看 Railway 的构建日志

---

## 📝 部署检查清单

### 方案 1（.gitignore）
- [ ] 更新 .gitignore 排除前端
- [ ] 提交并推送更改
- [ ] 在 Railway 部署
- [ ] 配置环境变量
- [ ] 测试健康检查

### 方案 2（vercel.json）
- [ ] 更新 backend/vercel.json
- [ ] 提交并推送更改
- [ ] 在 Railway 部署
- [ ] 配置环境变量
- [ ] 测试健康检查

### 方案 3（独立仓库）
- [ ] 创建新的 GitHub 仓库
- [ ] 复制后端文件到新仓库
- [ ] 推送到新仓库
- [ ] 在 Railway 部署
- [ ] 配置环境变量
- [ ] 测试健康检查

### 方案 4（Root Directory）
- [ ] 在 Railway 设置 Root Directory 为 `backend`
- [ ] 重新部署
- [ ] 配置环境变量
- [ ] 测试健康检查

---

## 🎯 推荐操作流程

### 最简单流程（推荐）

1. **创建独立的后端仓库**（方案 3）
2. **在 Railway 部署后端**
3. **配置环境变量**
4. **测试后端 API**
5. **更新前端 .env 连接云端后端**
6. **测试前后端连接**
7. **部署前端到 Vercel**
8. **开始推广赚钱**

### 快速流程（如果不想创建新仓库）

1. **更新 .gitignore 排除前端**（方案 1）
2. **提交并推送更改**
3. **在 Railway 部署**
4. **配置环境变量**
5. **测试后端 API**
6. **更新前端 .env 连接云端后端**
7. **测试前后端连接**

---

**选择一个方案开始部署吧！** 🚀

推荐使用方案 3（独立仓库），这是最简单和最可靠的方法。
