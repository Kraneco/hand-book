# 后台管理系统设置指南

## 项目概述

这是一个基于 Next.js 的收纳册进销存后台管理系统，具有以下功能：

- 商品管理（收纳册列表和管理）
- 材料管理（进销存系统）
- 明暗主题切换
- 收纳册与材料的关联销售

## 安装依赖

```bash
npm install
```

## 运行开发服务器

```bash
npm run dev
```

然后在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
src/
├── app/                 # Next.js 应用目录 (App Router)
│   ├── globals.css     # 全局样式
│   ├── layout.tsx      # 根布局（包含公共Layout）
│   ├── page.tsx        # 首页（仪表板）
│   ├── products/       # 商品管理页面
│   │   └── page.tsx    # /products 路由
│   ├── materials/      # 材料管理页面
│   │   └── page.tsx    # /materials 路由
│   └── notebooks/      # 收纳册管理页面
│       └── page.tsx    # /notebooks 路由
├── components/         # React 组件
│   ├── Layout/         # 布局组件
│   │   ├── Header.tsx  # 头部组件
│   │   ├── Sidebar.tsx # 侧边栏（带路由导航）
│   │   └── MainLayout.tsx # 主布局
│   ├── Products/       # 产品相关组件
│   │   ├── ProductList.tsx # 产品列表
│   │   └── NotebookManagement.tsx # 收纳册管理
│   └── Materials/      # 材料相关组件
│       ├── MaterialOverview.tsx # 材料总览
│       └── MaterialDetail.tsx # 材料详情
└── stores/            # Zustand 状态管理
    ├── themeStore.ts  # 主题状态
    ├── productStore.ts # 产品状态
    └── materialStore.ts # 材料状态
```

## 功能说明

### 1. 商品管理

- 查看所有收纳册产品
- 筛选和搜索功能
- 显示库存状态

### 2. 收纳册管理

- 显示收纳册与材料的对应关系
- 销售功能（自动扣除材料库存）
- 材料消耗配置：
  - 法棍、TN、A6：2 个环扣 + 1 张 A4 硫酸纸
  - 小面包：1 个环扣 + 1 张 B5 硫酸纸
  - A7：1 个环扣 + 1 张 A4 硫酸纸

### 3. 材料管理

- 进销存表格显示
- 库存状态监控
- 详细交易记录
- 材料层级结构（透明环的 5 种颜色）

### 4. 主题切换

- 支持明暗两种主题
- 主题状态持久化存储
- 防止页面刷新时的样式闪烁
- 头部有主题切换按钮

## 技术栈

- **框架**: Next.js 15 + React 19
- **状态管理**: Zustand
- **UI 组件**: Ant Design (中文语言包)
- **样式**: Tailwind CSS
- **HTTP 请求**: Axios
- **语言**: TypeScript

## 路由结构

- `/` - 首页仪表板，显示统计数据和快速操作
- `/products` - 商品列表页面
- `/materials` - 材料管理页面（进销存）
- `/notebooks` - 收纳册管理页面

## 开发说明

1. 使用 Next.js 13+ App Router 进行路由管理
2. 所有组件都使用 TypeScript 进行类型检查
3. 使用 Zustand 进行状态管理，数据持久化
4. 响应式设计，支持移动端
5. 组件化架构，便于维护和扩展
6. 公共布局在根 layout.tsx 中定义，所有页面共享
7. Ant Design 已配置中文语言包，所有组件默认显示中文
8. 集成骨架屏和 Loading 组件，提升用户体验
9. 完善的主题切换系统，防止样式闪烁
10. 包含 404 错误页面
11. 优化明暗主题下的文字颜色对比度，确保可读性

## 待完善功能

- [x] ~~添加路由系统~~ ✅ 已完成 (使用 Next.js App Router)
- [x] ~~页面加载状态~~ ✅ 已完成 (骨架屏 + Loading 组件)
- [x] ~~错误处理页面~~ ✅ 已完成 (404 页面)
- [x] ~~修复主题切换~~ ✅ 已完成 (防止样式闪烁)
- [ ] 实现真实的 API 接口
- [ ] 添加用户认证
- [ ] 数据导出功能
- [ ] 更多图表和统计功能
- [ ] 添加面包屑导航
