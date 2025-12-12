# PowerShell 部署脚本
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
