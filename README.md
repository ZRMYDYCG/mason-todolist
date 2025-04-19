# TodoKit - 极简高效的待办事项管理应用

![image](https://github.com/user-attachments/assets/6f165e3c-8d33-4dce-a056-972825c31916)

一款基于 Next.js 15 构建的现代化 Todo List 应用，集优雅设计、流畅交互和强大功能于一体。

## ✨ 核心特性

### 🎯 核心功能
- **即时任务管理**：快速添加/删除任务，支持 Markdown 格式
- **智能状态切换**：单击复选框标记完成，双击任务文本快速编辑
- **流畅排序**：拖拽任务项实现直观排序
- **数据持久化**：自动本地存储，防止数据丢失
- **多视图模式**：过滤显示进行中/已完成任务

### 🚀 高级功能
- **批量操作**：一键标记所有任务为完成状态
- **数据迁移**：支持 JSON 格式导入/导出
- **响应式设计**：完美适配桌面/移动设备
- **交互反馈**：可视化操作动画（添加/删除/拖拽）
- **快捷键支持**：Enter 提交，Esc 取消编辑

## 🛠️ 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS 3.4
- **交互**: react-beautiful-dnd + framer-motion
- **类型系统**: TypeScript 5.0+
- **状态管理**: React 18 Hooks
- **持久化**: localStorage API

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 9+ / yarn 1.22+

### 安装步骤
```bash
# 克隆仓库
git clone https://github.com/yourusername/todomaster.git

# 进入项目目录
cd todomaster

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产构建
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📚 使用指南

### 基本操作
1. **添加任务**：在输入框输入内容后按 Enter 或点击添加按钮
2. **完成任务**：单击任务前的复选框
3. **编辑任务**：双击任务文本进入编辑模式
4. **删除任务**：点击任务右侧的 × 按钮
5. **拖拽排序**：长按拖动任务到目标位置

### 高级功能
- **批量标记完成**：点击顶部 "全部完成" 按钮
- **数据导出**：侧边栏 > 导出数据 (生成 JSON 文件)
- **数据导入**：侧边栏 > 选择 JSON 文件导入
- **快捷筛选**：侧边栏切换进行中/已完成视图

## 🌟 设计亮点

### 交互优化
- 流畅的动画过渡（添加/删除/排序）
- 拖拽时的视觉反馈（缩放+阴影效果）
- 智能输入框聚焦管理
- 编辑状态自动保存机制

### 技术实现
- 自定义 Hook 封装核心逻辑
- 组件级动画控制
- 防抖的本地存储策略
- 类型安全的 TypeScript 实现
- 响应式布局适配

## 🤝 贡献指南

欢迎通过以下方式参与贡献：
1. Fork 项目仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 发起 Pull Request

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源

---

**让效率触手可及** - 用 TodoMaster 开启您的高效生活 🚀
