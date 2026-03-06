# Docker 部署说明

本项目为 Docusaurus 静态站点，通过 Docker 多阶段构建：先使用 Node 构建，再用 Nginx 提供静态文件服务。

## GitHub CI 说明

仓库已配置三种 GitHub Actions 工作流：

| 工作流 | 触发条件 | 作用 |
|--------|----------|------|
| **CI** (`.github/workflows/ci.yml`) | 每次 push / 每个 PR 到 main 或 master | 安装依赖并执行 `npm run build`，用于检查是否构建通过 |
| **Deploy to GitHub Pages** (`.github/workflows/deploy.yml`) | push 到 main/master | 构建站点并部署到 GitHub Pages |
| **Deploy to Server** (`.github/workflows/deploy-to-server.yml`) | push 到 main/master | 构建镜像 → 推送到 GHCR → SSH 到 120.48.86.168 拉取并启动 |

推送到 main/master 后，在仓库 **Actions** 页可查看运行结果。

### 自动部署到自建服务器 (120.48.86.168，CentOS 7)

**Deploy to Server** 会在每次 push 到 main/master 时自动把最新镜像部署到 `120.48.86.168`。需要做两件事：配置 GitHub Secrets（SSH）以及服务器安装 Docker/Compose。

SSH 私钥不是从别处“申请”的，而是**你自己生成一对密钥**：公钥放到服务器，私钥内容填到 GitHub。

**步骤一：在本机（Windows 可用 Git Bash / PowerShell，Mac/Linux 用终端）生成一对密钥**

```bash
# 一路回车即可（也可设密码，设了的话 GitHub Actions 里要另配）
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_laby_blog
```

会得到两个文件：
- `deploy_laby_blog` → **私钥**，整份内容复制到 GitHub 的 `SSH_PRIVATE_KEY`
- `deploy_laby_blog.pub` → **公钥**，要放到 CentOS 7 服务器上

**步骤二：把公钥放到 CentOS 7 服务器**

用你平时登录 120.48.86.168 的方式连上去，然后执行（把下面的内容换成你本机 `deploy_laby_blog.pub` 的完整内容）：

```bash
# 在 120.48.86.168 上执行（用你打算给 GitHub 用的登录用户，如 root）
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "这里粘贴 deploy_laby_blog.pub 的完整一行内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**步骤三：把私钥填到 GitHub**

- 打开你本机的 **私钥文件** `deploy_laby_blog`（不要用 .pub）。
- 用记事本等打开，**整份复制**（包括 `-----BEGIN ... KEY-----` 和 `-----END ... KEY-----` 那几行）。
- 到 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**：
  - Name：`SSH_PRIVATE_KEY`
  - Value：粘贴刚才复制的整份私钥，保存。
- 再新建一个 Secret：
  - Name：`SSH_USER`
  - Value：你在 120.48.86.168 上用的登录用户名（例如 `root`）。

**验证：** 在本机执行 `ssh -i ~/.ssh/deploy_laby_blog root@120.48.86.168`（把 root 换成你的 SSH_USER），能免密登录就说明配置对了。

---

#### 2. 在服务器 120.48.86.168（CentOS 7）上做一次性准备

在 120.48.86.168 上以 root（或上面用的那个用户）执行：

```bash
# 安装 Docker（CentOS 7）
yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y docker-ce docker-ce-cli containerd.io
systemctl start docker && systemctl enable docker

# 安装 Docker Compose（选一种方式即可）
# 方式 A：用官方二进制（推荐）
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# 方式 B：用 pip（若已有 Python）
# yum install -y python3-pip && pip3 install docker-compose

# 创建部署目录（与 workflow 里 DEPLOY_PATH 一致）
mkdir -p /opt/laby-blog

# 若仓库为私有，需先登录 GHCR 才能拉取镜像（公开仓库可跳过）
# echo 你的GitHub个人访问令牌 | docker login ghcr.io -u 你的GitHub用户名 --password-stdin
```

完成后，每次 push 到 main/master 会：构建镜像 → 推送到 GHCR →（若已配 SSH）SSH 到服务器执行 `docker compose pull` 和 `docker compose up -d`。站点访问地址：`http://120.48.86.168:8089`。

**若不想开放服务器 22 端口给 GitHub**：在仓库 Variables 里设置 `ENABLE_SSH_DEPLOY=false`，这样 Actions 只负责构建/推送镜像；在服务器上用 **cron 定时** 执行 `docker compose pull && docker compose up -d` 即可。

若使用 GHCR 镜像手动部署，服务器上可：

```bash
# 公开仓库可直接拉取；私有仓库需先登录
docker pull ghcr.io/laby-umr/laby-umr.github.io:latest
docker run -d -p 8089:80 --name laby-blog ghcr.io/laby-umr/laby-umr.github.io:latest
```

---

## 前置要求

- 已安装 [Docker](https://docs.docker.com/get-docker/) 和 [Docker Compose](https://docs.docker.com/compose/install/)
- 远程服务器可 SSH 登录

## 一、本地构建并推送到镜像仓库（可选）

若使用镜像仓库（如 Docker Hub、阿里云 ACR），可在本地构建并推送：

```bash
# 构建镜像
docker build -t your-registry/laby-blog:latest .

# 登录镜像仓库后推送
docker push your-registry/laby-blog:latest
```

## 二、在远程服务器上部署

### 方式 A：服务器上直接构建并运行

1. 将代码传到服务器（Git 或 SCP）：

   ```bash
   # 在服务器上
   git clone <你的仓库地址> laby-blog && cd laby-blog
   # 或在本机 scp -r ./laby-umr.github.io user@服务器IP:~/laby-blog
   ```

2. 使用 Docker Compose 构建并启动：

   ```bash
   docker compose up -d --build
   ```

3. 访问：`http://服务器IP:8089`（端口在 `docker-compose.yml` 的 `ports` 中配置）。

### 方式 B：使用已推送的镜像

在服务器上创建 `docker-compose.yml`（或从仓库拉取），内容改为使用镜像：

```yaml
services:
  blog:
    image: your-registry/laby-blog:latest
    container_name: laby-blog
    ports:
      - "8089:80"
    restart: unless-stopped
```

然后执行：

```bash
docker compose pull
docker compose up -d
```

## 三、仅用 Docker（不用 Compose）

```bash
# 构建
docker build -t laby-blog:latest .

# 运行（映射到 8089 端口）
docker run -d --name laby-blog -p 8089:80 --restart unless-stopped laby-blog:latest
```

## 四、常用命令

| 操作       | 命令 |
|------------|------|
| 查看日志   | `docker compose logs -f blog` |
| 停止       | `docker compose down` |
| 重启       | `docker compose restart blog` |
| 更新并重启 | `git pull && docker compose up -d --build` |

## 五、生产环境建议

1. **HTTPS**：在服务器前加一层 Nginx/Caddy 做反向代理并配置 SSL。
2. **端口**：如需 80 端口，将 `docker-compose.yml` 中 `ports` 改为 `"80:80"`，或由宿主机 Nginx 反代到容器的 80。
3. **域名**：在 `docusaurus.config.js` 中把 `url` 改为你的域名，重新构建镜像后再部署。
