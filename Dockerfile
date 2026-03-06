# ========== 阶段一：构建 ==========
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖（利用层缓存）
COPY package.json package-lock.json* yarn.lock* ./
RUN corepack enable yarn 2>/dev/null || true && \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else npm ci 2>/dev/null || npm install; fi

COPY . .

# 构建静态站点
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

# ========== 阶段二：运行 ==========
FROM nginx:alpine

# 复制构建产物到 nginx 默认站点目录
COPY --from=builder /app/build /usr/share/nginx/html

# 使用自定义 nginx 配置（支持 SPA 路由、gzip、缓存等）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
