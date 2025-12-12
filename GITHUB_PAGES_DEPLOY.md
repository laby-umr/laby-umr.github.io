# GitHub Pages 部署完整指南

## 📋 前提条件检查

- ✅ GitHub 账号：laby-umr
- ✅ 仓库名称：laby-blog-private
- ✅ 配置的 URL：https://laby-umr.github.io
- ✅ Docusaurus 项目已就绪

## 🚀 部署方法选择

### 方法 1：手动部署（简单快速）⭐ 推荐新手
一条命令即可部署

### 方法 2：GitHub Actions 自动部署（推荐）⭐⭐⭐
每次推送代码自动部署，无需手动操作

---

## 方法 1️⃣：手动部署

### Step 1: 配置 Git 凭证

确保您已经配置了 Git：
```bash
git config --global user.name "laby-umr"
git config --global user.email "your-email@example.com"
```

### Step 2: 添加 SSH Key 到 GitHub（如果还没有）

检查是否有 SSH Key：
```bash
ls ~/.ssh
```

如果没有，创建 SSH Key：
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

复制公钥：
```bash
# Windows PowerShell
type ~\.ssh\id_ed25519.pub | clip

# 或者直接查看
cat ~\.ssh\id_ed25519.pub
```

添加到 GitHub：
1. 访问 https://github.com/settings/keys
2. 点击 "New SSH key"
3. 粘贴公钥
4. 保存

### Step 3: 使用 Docusaurus 部署命令

```bash
# 设置环境变量（Windows PowerShell）
$env:GIT_USER="laby-umr"

# 部署
npm run deploy
```

或者一条命令：
```bash
GIT_USER=laby-umr npm run deploy
```

**部署过程：**
1. 构建网站 (`npm run build`)
2. 推送到 `gh-pages` 分支
3. 自动发布到 GitHub Pages

### Step 4: 在 GitHub 启用 GitHub Pages

1. 访问仓库设置：`https://github.com/laby-umr/laby-blog-private/settings/pages`
2. 在 **Source** 下选择：
   - Branch: `gh-pages`
   - Folder: `/ (root)`
3. 点击 **Save**

### Step 5: 等待部署完成

- 通常需要 1-5 分钟
- 访问：`https://laby-umr.github.io`

---

## 方法 2️⃣：GitHub Actions 自动部署（推荐）

### Step 1: 创建 GitHub Actions 工作流

创建文件：`.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
      - master
  # 允许手动触发
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build website
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          user_name: github-actions[bot]
          user_email: 41898282+github-actions[bot]@users.noreply.github.com
```

### Step 2: 提交并推送

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: 添加 GitHub Actions 自动部署"
git push
```

### Step 3: 配置 GitHub Pages

1. 访问：`https://github.com/laby-umr/laby-blog-private/settings/pages`
2. **Source** 选择：
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
3. 保存

### Step 4: 查看部署状态

访问：`https://github.com/laby-umr/laby-blog-private/actions`

每次推送代码后，会自动触发部署。

---

## 🎯 部署后验证

### 1. 检查网站是否可访问
```
访问：https://laby-umr.github.io
```

### 2. 检查功能
- [ ] 首页正常显示
- [ ] 博客文章可访问
- [ ] 知识库导航正常
- [ ] 搜索功能工作
- [ ] 图片正确加载
- [ ] 链接都正常

### 3. 检查部署分支
```bash
git fetch
git branch -a
```
应该看到 `remotes/origin/gh-pages`

---

## 🔧 常见问题解决

### 问题 1: 404 错误

**原因**：baseUrl 配置错误

**解决**：检查 `docusaurus.config.js`
```javascript
// 如果部署到 https://laby-umr.github.io
baseUrl: '/'

// 如果部署到 https://laby-umr.github.io/laby-blog-private/
baseUrl: '/laby-blog-private/'
```

### 问题 2: 样式丢失

**原因**：资源路径错误

**解决**：确认 `docusaurus.config.js`
```javascript
url: 'https://laby-umr.github.io',
baseUrl: '/',
```

### 问题 3: 部署失败 - 权限错误

**解决**：
```bash
# 检查 SSH 连接
ssh -T git@github.com

# 设置 GIT_USER
$env:GIT_USER="laby-umr"  # PowerShell
export GIT_USER=laby-umr  # Bash
```

### 问题 4: GitHub Actions 部署失败

**检查**：
1. 访问 Actions 页面查看错误日志
2. 确认 Node 版本兼容
3. 检查依赖安装是否成功

---

## 📝 部署脚本（方便使用）

创建 `deploy.ps1`（Windows PowerShell）:
```powershell
# deploy.ps1
Write-Host "🚀 开始部署到 GitHub Pages..." -ForegroundColor Green

# 设置 Git 用户
$env:GIT_USER = "laby-umr"

# 清理之前的构建
Write-Host "🧹 清理缓存..." -ForegroundColor Yellow
npm run clear

# 部署
Write-Host "📦 构建并部署..." -ForegroundColor Yellow
npm run deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 部署成功！" -ForegroundColor Green
    Write-Host "🌐 访问：https://laby-umr.github.io" -ForegroundColor Cyan
} else {
    Write-Host "❌ 部署失败，请检查错误信息" -ForegroundColor Red
}
```

使用方法：
```powershell
.\deploy.ps1
```

创建 `deploy.sh`（Linux/Mac）:
```bash
#!/bin/bash
echo "🚀 开始部署到 GitHub Pages..."

# 设置 Git 用户
export GIT_USER=laby-umr

# 清理之前的构建
echo "🧹 清理缓存..."
npm run clear

# 部署
echo "📦 构建并部署..."
npm run deploy

if [ $? -eq 0 ]; then
    echo "✅ 部署成功！"
    echo "🌐 访问：https://laby-umr.github.io"
else
    echo "❌ 部署失败，请检查错误信息"
fi
```

使用方法：
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🎨 自定义域名（可选）

### 使用自定义域名

1. 购买域名（如 `example.com`）
2. 在域名提供商添加 DNS 记录：

```
类型: CNAME
名称: www
值: laby-umr.github.io
```

3. 在仓库根目录创建 `static/CNAME` 文件：
```
www.example.com
```

4. 在 GitHub Pages 设置中添加自定义域名

---

## 📊 部署流程对比

| 特性 | 手动部署 | GitHub Actions |
|------|----------|----------------|
| 设置难度 | 简单 ⭐ | 中等 ⭐⭐ |
| 部署速度 | 快 | 较慢（需等待 CI） |
| 自动化 | ❌ 需手动运行 | ✅ 自动运行 |
| 适合场景 | 快速测试 | 生产环境 |
| 推荐指数 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## ✅ 快速开始清单

### 首次部署（5 分钟）
- [ ] 配置 SSH Key
- [ ] 运行 `npm run deploy`
- [ ] 在 GitHub 启用 Pages
- [ ] 访问网站验证

### 设置自动部署（10 分钟）
- [ ] 创建 `.github/workflows/deploy.yml`
- [ ] 推送到 GitHub
- [ ] 配置 Pages 设置
- [ ] 验证 Actions 运行成功

---

## 🔗 相关链接

- [GitHub Pages 文档](https://docs.github.com/pages)
- [Docusaurus 部署文档](https://docusaurus.io/docs/deployment)
- [GitHub Actions 文档](https://docs.github.com/actions)

---

**创建时间**: 2025-12-12  
**适用于**: Docusaurus 3.9.2+
