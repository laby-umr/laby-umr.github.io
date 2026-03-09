# 静态文件部署 Dockerfile
FROM nginx:latest

# 复制构建好的静态文件到 nginx 目录
COPY build /usr/share/nginx/html

# 使用自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]