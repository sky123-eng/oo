# 二手交易平台 Demo

一个基于 React + Vite + TailwindCSS 构建的二手交易平台前端 Demo 项目。

## 功能特性

- ✅ 商品发布、编辑、删除
- ✅ 多图上传（前端 base64 处理，预留后端接口）
- ✅ 商品搜索、品类筛选、成色标签、价格排序
- ✅ 分页展示
- ✅ localStorage 前端持久化
- ✅ 响应式布局，移动端优先
- ✅ 商品卡片展示（图片、标题、描述、价格、标签等）

## 技术栈

- **React 18** - UI 框架
- **Vite** - 构建工具
- **TailwindCSS** - 样式框架
- **localStorage** - 数据持久化

## 项目结构

```
├── src/
│   ├── components/          # 组件目录
│   │   ├── ItemCard.jsx    # 商品卡片组件
│   │   ├── ItemForm.jsx    # 商品表单组件
│   │   ├── Pagination.jsx  # 分页组件
│   │   └── SearchAndFilter.jsx  # 搜索筛选组件
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useLocalStorage.js  # localStorage Hook
│   │   └── useItems.js     # 商品管理 Hook
│   ├── utils/              # 工具函数
│   │   ├── api.js          # API 接口（预留后端）
│   │   ├── formatters.js   # 格式化函数
│   │   └── imageUtils.js   # 图片处理工具
│   ├── styles/             # 样式文件
│   │   └── index.css       # 全局样式
│   ├── mock/               # Mock 数据
│   │   └── data.js         # 示例数据
│   ├── App.jsx             # 主应用组件
│   └── main.jsx            # 应用入口
├── index.html              # HTML 模板
├── package.json            # 项目配置
├── vite.config.js          # Vite 配置
├── tailwind.config.js      # Tailwind 配置
└── postcss.config.js       # PostCSS 配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 使用说明

1. **发布商品**：点击右上角"发布商品"按钮，填写商品信息并上传图片
2. **搜索商品**：在搜索框输入关键词搜索
3. **筛选商品**：使用分类下拉菜单筛选商品
4. **排序商品**：选择排序方式（价格、时间等）
5. **编辑/删除**：在商品卡片上点击"编辑"或"删除"按钮

## 后端接口预留

项目已预留后端接口结构，位于 `src/utils/api.js`：

- `GET /api/items` - 获取商品列表
- `POST /api/items` - 创建商品
- `PUT /api/items/:id` - 更新商品
- `DELETE /api/items/:id` - 删除商品

图片上传接口预留于 `src/utils/imageUtils.js` 的 `uploadImageToServer` 函数。

## 可扩展性

项目结构支持平滑扩展以下模块：

- 用户系统（登录、注册、个人中心）
- 聊天功能（商品咨询、私信）
- 订单管理（下单、支付、物流）
- 其他业务模块

## 代码风格

- 全部使用函数式组件
- 状态管理使用 React Hooks
- TailwindCSS 用于布局与设计
- 代码注释清晰完整

## 许可证

MIT

