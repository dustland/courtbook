# 球场预约系统 (CourtBook)

球场预约系统是一个微信小程序，用于球场预订和日程安排，旨在帮助用户轻松预订和管理他们的球场预约。

## 文档

- [中文开发环境搭建指南](docs/zh/getting-started.md)

## 功能特点

- 用户友好的球场预订界面
- 周视图和日视图日程表
- 预订帮助聊天辅助
- 预约管理
- 用户资料和历史记录跟踪

## 技术栈

- Taro.js 用于跨平台小程序开发
- React 用于 UI 组件
- Sass 用于样式设计
- Taroify 用于 UI 组件
- 微信云函数用于后端服务

## 开发

### 前提条件

- Node.js (v20+)
- pnpm 包管理器
- GitHub CLI

详细的[开发环境搭建指南](docs/zh/getting-started.md)提供了完整的设置说明。

### 快速开始

```bash
# 安装依赖
pnpm install

# 启动微信小程序开发服务器
pnpm dev:weapp
```

### 生产环境构建

```bash
pnpm build:weapp
```

## 云函数

本项目包含用于处理预约和订单的云函数。云函数位于 `cloudfunctions/` 目录中。

### 构建和部署云函数

当您运行 `pnpm build:weapp` 时，云函数会自动构建。构建过程：

1. 编译云函数目录中的 TypeScript 文件
2. 将云函数复制到 `dist/cloudfunctions` 目录
3. 处理 package.json 文件以移除开发依赖

部署云函数的步骤：

1. 使用 `pnpm build:weapp` 构建项目
2. 在微信开发者工具中打开项目
3. 选择"上传"以上传整个项目
4. 上传后，进入微信开发者工具中的云开发控制台
5. 打开云函数部分
6. 您应该能看到列出的云函数
7. 对于每个函数，点击它并根据需要选择"部署"

当您修改云函数时：

1. 修改 `cloudfunctions/` 目录中的文件
2. 运行 `pnpm build:weapp` 重新构建
3. 上传到微信开发者工具
4. 重新部署受影响的函数

### 测试云函数

您可以从微信开发者工具测试云函数：

1. 打开云开发控制台
2. 进入云函数部分
3. 点击一个函数
4. 使用"测试"功能发送测试请求
5. 输入 JSON 测试数据（参见每个函数 README 中的示例）

## 项目结构

- `/src/components`: 可重用 UI 组件
- `/src/pages`: 小程序页面
- `/src/assets`: 静态资源如图标
- `/src/custom-tab-bar`: 导航用的自定义标签栏组件
- `/cloudfunctions`: 后端云函数
  - `/appointments`: 预约管理服务
  - `/users`: 用户管理服务

## 许可证

MIT
