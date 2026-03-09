#!/bin/bash

# 部署脚本
set -e

echo "🚀 开始部署 Fullstack Dev Blog..."

# 检查是否有压缩包需要解压
if [ -f "build.zip" ]; then
    echo "📦 发现 build.zip 压缩包，开始解压..."
    # 创建 build 目录并解压到其中
    mkdir -p build
    unzip -o build.zip -d build
    echo "✅ 解压完成到 build/ 目录"
else
    echo "📁 在当前目录继续部署..."
fi

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否可用
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 停止现有容器
echo "🛑 停止现有容器..."
$COMPOSE_CMD down || true

# 清理旧镜像（可选）
echo "🧹 清理旧镜像..."
docker image prune -f

# 构建并启动新容器
echo "🔨 构建并启动容器..."
$COMPOSE_CMD up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 健康检查
echo "🔍 检查服务状态..."
if curl -f http://localhost:8089/health > /dev/null 2>&1; then
    echo "✅ 部署成功！服务正在运行"
    echo "🌐 访问地址: http://localhost:8089"
else
    echo "❌ 部署失败，请检查日志"
    $COMPOSE_CMD logs
    exit 1
fi

echo "📋 查看运行状态:"
$COMPOSE_CMD ps