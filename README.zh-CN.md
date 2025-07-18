# Zilo

<img src="/public/preview.png">

Zilo 是一款现代化的书签管理器，帮助你轻松整理和访问常用网站。与传统书签工具不同，Zilo 支持自定义全局背景色，可无缝适配 Safari 及系统主题。

## 功能特性

- 🚀 **添加、编辑、删除书签**：轻松管理你喜欢的网站。
- 🖱️ **拖拽排序**：支持拖拽调整网站顺序，操作直观。
- 💾 **本地存储**：所有数据保存在浏览器本地，安全且持久。
- 📦 **导入/导出**：支持 JSON 文件备份和迁移书签。
- 🌗 **深色模式**：界面美观，自动适配系统主题。
- ⚡ **键盘与鼠标翻页**：支持 W/S 键或鼠标滚轮快速翻页。
- 🖼️ **自动获取网站图标**：自动解析网站 favicon，也可自定义上传。
- 🛠️ **技术栈**：Next.js、React、Tailwind CSS、dnd-kit、framer-motion、shadcn/ui。

## 快速开始

### 环境要求

- Node.js >= 18
- 推荐使用 pnpm，也可用 npm/yarn

### 安装依赖

```bash
pnpm install
# 或
npm install
# 或
yarn install
```

### 启动开发环境

```bash
pnpm dev
# 或
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产环境

```bash
pnpm build
# 或
npm run build
# 或
yarn build
```

### 启动生产环境

```bash
pnpm start
# 或
npm start
# 或
yarn start
```

## 目录结构

- `app/` - 应用主页面与布局
- `components/` - UI 组件
- `hooks/` - 自定义 React hooks
- `lib/` - 工具函数
- `types/` - TypeScript 类型定义
- `public/` - 静态资源

## 许可证

MIT