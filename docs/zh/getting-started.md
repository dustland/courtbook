# CourtBook 微信小程序开发环境搭建指南

本文档将指导您如何从零开始搭建 CourtBook 微信小程序的开发环境，包括必要的工具安装、项目配置以及云开发环境的设置。

## 前置要求

在开始开发前，请确保您的电脑上已安装：

- Node.js (推荐 20.x 或以上)
- pnpm (推荐 v7.x 或以上)
- GitHub CLI https://cli.github.com/

## 一、开发工具安装

### 1. 安装微信开发者工具

微信开发者工具是开发和调试微信小程序的必备工具。

1. 访问[微信开发者工具官网](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)下载最新版本
2. 按照安装向导完成安装
3. 打开微信开发者工具并使用微信扫码登录
4. 在首次使用时，建议在「设置」-「通用设置」中启用「开发辅助」功能

### 2. 安装 Visual Studio Code

VS Code 是我们推荐的代码编辑器，它提供了强大的 TypeScript 和 React 支持。

1. 访问[VS Code 官网](https://code.visualstudio.com/)下载并安装
2. 安装以下推荐的扩展插件：
   - ESLint
   - Prettier
   - TypeScript Vue Plugin (Volar)
   - Taroify Extension (如果使用了 Taroify 组件库)
   - Chinese Language Pack (如需中文界面)

## 二、项目设置

### 1. 克隆项目

```bash
gh repo clone dustland/courtbook
cd courtbook
```

### 2. 安装依赖

我们使用 pnpm 作为包管理工具，它比 npm 更快且更节省磁盘空间。

```bash
# 全局安装 pnpm（如果尚未安装）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 3. 项目配置

1. 复制项目根目录下的 `.env.example` 文件，并重命名为 `.env.local`
2. 根据需要修改 `.env.local` 文件中的配置项

## 三、开发流程

### 1. 启动开发服务

```bash
# 开发微信小程序
pnpm dev:weapp

# 开发 H5 版本（用于在浏览器中预览）
pnpm dev:h5
```

执行 `pnpm dev:weapp` 命令后，Taro 将会在 `dist` 目录下生成微信小程序项目文件。

### 2. 在微信开发者工具中预览

1. 打开微信开发者工具
2. 点击左上角「项目」-「导入项目」
3. 设置以下信息：
   - AppID：填入您的微信小程序 AppID（可在微信公众平台获取）
   - 项目名称：自定义，如 "CourtBook"
   - 项目路径：选择项目中的 `dist` 目录
4. 点击「导入」完成项目导入
5. 导入后，开发者工具将自动编译和预览小程序

> 注意：确保在微信开发者工具的「详情」-「本地设置」中勾选「不校验合法域名...」，否则可能无法进行本地开发调试。

### 3. 实时开发

1. 在 VS Code 中编辑源代码（位于 `src` 目录）
2. 每次保存文件后，Taro 会自动重新编译，并更新 `dist` 目录
3. 微信开发者工具会检测到文件变化并自动刷新预览

## 四、微信云开发设置

CourtBook 使用微信云开发作为后端服务，提供数据库、存储和云函数功能。

### 1. 开通云开发

1. 在微信开发者工具中，点击「云开发」按钮
2. 如果是首次使用，请按提示创建云开发环境
3. 记录下云环境 ID，稍后需要配置到项目中

### 2. 配置云环境

1. 打开项目中的 `project.config.json` 文件
2. 找到 `cloudfunctionRoot` 字段，确保其值为 `"cloudfunctions"`
3. 在 `src/app.config.ts` 文件中配置云环境 ID：

```typescript
export default defineAppConfig({
  // ...其他配置
  cloud: {
    env: "你的云环境ID",
  },
  // ...
});
```

### 3. 初始化数据库集合

在云开发控制台中，创建以下数据库集合：

- `appointments`: 存储预约信息
- `courts`: 存储场地信息
- `users`: 存储用户信息
- `messages`: 存储聊天消息

### 4. 部署云函数

1. 在微信开发者工具中，右键点击 `cloudfunctions` 目录下的云函数文件夹
2. 选择「上传并部署」选项
3. 对每个云函数重复此操作

## 五、构建和发布

### 1. 构建生产版本

```bash
# 构建微信小程序（生产环境）
pnpm build:weapp
```

### 2. 上传和发布

1. 在微信开发者工具中，点击「上传」按钮
2. 填写版本号和项目备注
3. 上传完成后，登录[微信公众平台](https://mp.weixin.qq.com/)
4. 在「版本管理」中找到刚才上传的版本
5. 提交审核，等待审核通过后发布

## 常见问题

### 1. 编译错误

如果遇到编译错误，请尝试以下步骤：

```bash
# 清理缓存并重新安装依赖
pnpm clean
pnpm install

# 重新启动开发服务
pnpm dev:weapp
```

### 2. 云函数调用失败

- 确保已正确部署云函数
- 检查云环境 ID 是否正确配置
- 查看微信开发者工具的控制台日志，了解具体错误信息

### 3. 静态资源无法加载

如果图片等静态资源无法正常加载，请检查 `config/index.ts` 中的 `copy` 配置，确保静态资源被正确复制到 `dist` 目录：

```javascript
copy: {
  patterns: [
    { from: "src/assets/", to: "dist/assets/" },
    { from: "src/assets/images/", to: "dist/assets/images/" },
  ];
}
```

## 资源链接

- [Taro 官方文档](https://docs.taro.zone/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
