#!/bin/bash

# 二手交易平台一键部署脚本
# 适用于无root权限的服务器环境

# 配置变量
PROJECT_NAME="secondhand-marketplace"
GITHUB_REPO="https://github.com/sky123-eng/oo.git"
NODE_VERSION="18"
FRONTEND_PORT="8080"
BACKEND_PORT="3001"

# 颜色定义
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m" # No Color

# 日志函数
echo_green() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_yellow() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo_red() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo_blue() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 错误处理函数
handle_error() {
    echo_red "脚本执行失败: $1"
    exit 1
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 显示帮助信息
display_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --help      显示此帮助信息"
    echo "  --update    仅更新代码并重启服务（不重新安装依赖）"
    echo "  --clean     清理并重新部署（删除现有文件）"
    echo ""
    echo "示例:"
    echo "  $0              # 标准部署"
    echo "  $0 --update     # 仅更新代码"
    echo "  $0 --clean      # 清理并重新部署"
    exit 0
}

# 解析命令行参数
UPDATE_ONLY=false
CLEAN_INSTALL=false

while [ "$1" != "" ]; do
    case $1 in
        --help )           display_help
                           ;;
        --update )         UPDATE_ONLY=true
                           ;;
        --clean )          CLEAN_INSTALL=true
                           ;;
        * )                echo_red "未知选项: $1"
                           display_help
                           ;;
    esac
    shift
done

# 脚本开始
echo_blue "========================================"
echo_blue "二手交易平台一键部署脚本"
echo_blue "========================================"

# 检查当前目录
if [ -d "$PROJECT_NAME" ]; then
    if [ "$CLEAN_INSTALL" = true ]; then
        echo_yellow "检测到现有项目目录，清理安装模式下将删除..."
        rm -rf "$PROJECT_NAME" || handle_error "无法删除现有项目目录"
    else
        echo_yellow "检测到现有项目目录，将在当前目录更新部署"
    fi
fi

# 安装或使用NVM
echo_blue "步骤1: 检查/安装Node Version Manager (NVM)"

if ! command_exists nvm; then
    echo_yellow "NVM未安装，开始安装..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash || handle_error "NVM安装失败"
    
    # 加载NVM环境
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    echo_green "NVM安装成功!"
else
    echo_green "NVM已安装，跳过此步骤"
fi

# 安装Node.js
echo_blue "步骤2: 检查/安装Node.js $NODE_VERSION"

# 加载NVM环境（确保可用）
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

if ! nvm ls | grep -q "v$NODE_VERSION"; then
    echo_yellow "Node.js $NODE_VERSION未安装，开始安装..."
    nvm install "$NODE_VERSION" || handle_error "Node.js安装失败"
    echo_green "Node.js $NODE_VERSION安装成功!"
else
    echo_green "Node.js $NODE_VERSION已安装，切换到此版本..."
    nvm use "$NODE_VERSION" || handle_error "切换Node.js版本失败"
fi

# 显示Node.js和npm版本
echo_green "Node.js版本: $(node --version)"
echo_green "npm版本: $(npm --version)"

# 克隆或更新代码仓库
echo_blue "步骤3: 获取项目代码"

if [ ! -d "$PROJECT_NAME" ]; then
    echo_yellow "克隆代码仓库..."
    git clone "$GITHUB_REPO" "$PROJECT_NAME" || handle_error "代码克隆失败"
    cd "$PROJECT_NAME" || handle_error "无法进入项目目录"
else
    echo_yellow "更新代码仓库..."
    cd "$PROJECT_NAME" || handle_error "无法进入项目目录"
    git pull || handle_error "代码更新失败"
fi

# 安装依赖（如果不是仅更新模式）
if [ "$UPDATE_ONLY" = false ]; then
    echo_blue "步骤4: 安装前端依赖"
    npm install || handle_error "前端依赖安装失败"
    
    echo_blue "步骤5: 安装后端依赖"
    cd backend || handle_error "无法进入后端目录"
    npm install || handle_error "后端依赖安装失败"
    cd .. || handle_error "无法返回项目根目录"
else
    echo_yellow "更新模式下跳过依赖安装步骤"
fi

# 配置环境变量
echo_blue "步骤6: 配置环境变量"

# 配置后端环境变量
cd backend || handle_error "无法进入后端目录"
if [ ! -f ".env" ]; then
    echo_yellow "创建后端.env文件..."
    cat > .env << EOL
# 数据库连接信息
DATABASE_URL="file:./dev.db"
# 服务器配置
PORT=$BACKEND_PORT
HOST=0.0.0.0
EOL
    echo_green "后端.env文件创建成功"
else
    echo_green "后端.env文件已存在，跳过创建"
    # 更新端口配置
    sed -i "s/^PORT=.*/PORT=$BACKEND_PORT/" .env
    sed -i "s/^HOST=.*/HOST=0.0.0.0/" .env
fi
cd .. || handle_error "无法返回项目根目录"

# 构建项目
echo_blue "步骤7: 构建前端项目"
npm run build || handle_error "前端构建失败"

echo_blue "步骤8: 构建后端项目"
cd backend || handle_error "无法进入后端目录"
npm run build || handle_error "后端构建失败"
cd .. || handle_error "无法返回项目根目录"

# 停止现有服务（如果运行中）
echo_blue "步骤9: 停止现有服务（如果运行中）"

# 停止前端服务
FRONTEND_PID=$(ps aux | grep "vite preview" | grep -v grep | awk '{print $2}')
if [ ! -z "$FRONTEND_PID" ]; then
    echo_yellow "停止现有前端服务 (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID || handle_error "停止前端服务失败"
    sleep 2
fi

# 停止后端服务
BACKEND_PID=$(ps aux | grep "node dist/server.js" | grep -v grep | awk '{print $2}')
if [ ! -z "$BACKEND_PID" ]; then
    echo_yellow "停止现有后端服务 (PID: $BACKEND_PID)..."
    kill $BACKEND_PID || handle_error "停止后端服务失败"
    sleep 2
fi

# 启动后端服务
echo_blue "步骤10: 启动后端服务"
cd backend || handle_error "无法进入后端目录"
nohup npm start > backend.log 2>&1 &
BACKEND_PID=$!

echo_green "后端服务启动中... (PID: $BACKEND_PID)"
sleep 3

# 检查后端服务是否启动成功
if ps -p $BACKEND_PID > /dev/null; then
    echo_green "后端服务启动成功!"
    echo_green "后端日志: tail -f backend.log"
else
    echo_red "后端服务启动失败，查看日志:"
    cat backend.log
    handle_error "后端服务启动失败"
fi

cd .. || handle_error "无法返回项目根目录"

# 启动前端预览服务
echo_blue "步骤11: 启动前端预览服务"
nohup npm run preview -- --port $FRONTEND_PORT > frontend.log 2>&1 &
FRONTEND_PID=$!

echo_green "前端服务启动中... (PID: $FRONTEND_PID)"
sleep 3

# 检查前端服务是否启动成功
if ps -p $FRONTEND_PID > /dev/null; then
    echo_green "前端服务启动成功!"
    echo_green "前端日志: tail -f frontend.log"
else
    echo_red "前端服务启动失败，查看日志:"
    cat frontend.log
    handle_error "前端服务启动失败"
fi

# 验证服务可用性
echo_blue "步骤12: 验证服务可用性"

echo_green "等待3秒后检查服务状态..."
sleep 3

# 检查后端服务
echo_green "检查后端服务..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:$BACKEND_PORT > /dev/null; then
    echo_green "✓ 后端服务可访问!"
else
    echo_yellow "⚠ 无法通过curl访问后端服务（可能是防火墙问题），但进程正在运行"
fi

# 检查前端服务
echo_green "检查前端服务..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:$FRONTEND_PORT > /dev/null; then
    echo_green "✓ 前端服务可访问!"
else
    echo_yellow "⚠ 无法通过curl访问前端服务（可能是防火墙问题），但进程正在运行"
fi

# 脚本完成
echo_blue "========================================"
echo_green "部署完成!"
echo_blue "========================================"
echo_green "项目信息:"
echo_green "- 项目名称: $PROJECT_NAME"
echo_green "- 前端地址: http://$(hostname -I | awk '{print $1}'):$FRONTEND_PORT"
echo_green "- 后端地址: http://$(hostname -I | awk '{print $1}'):$BACKEND_PORT"
echo_green "- 本地访问: http://localhost:$FRONTEND_PORT"
echo_blue "========================================"
echo_green "服务管理命令:"
echo_green "- 查看前端日志: tail -f $PROJECT_NAME/frontend.log"
echo_green "- 查看后端日志: tail -f $PROJECT_NAME/backend/backend.log"
echo_green "- 停止服务: 运行 'pkill -f "node dist/server.js"' 和 'pkill -f "vite preview"'"
echo_blue "========================================"
