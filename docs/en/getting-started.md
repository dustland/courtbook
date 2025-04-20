# CourtBook WeChat Mini Program Development Environment Setup Guide

This document will guide you on how to set up the CourtBook WeChat Mini Program development environment from scratch, including necessary tool installation, project configuration, and cloud development environment setup.

## Prerequisites

Before starting development, please ensure the following software is installed on your computer:

- Node.js (recommended 20.x or above)
- pnpm (recommended v7.x or above)
- GitHub CLI https://cli.github.com/

## I. Development Tools Installation

### 1. Install WeChat Developer Tools

WeChat Developer Tools is essential for developing and debugging WeChat Mini Programs.

1. Visit the [WeChat Developer Tools website](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) to download the latest version
2. Complete the installation following the installation wizard
3. Open WeChat Developer Tools and log in by scanning the QR code with WeChat
4. For first-time use, it's recommended to enable "Development Assistance" in "Settings" - "General Settings"

### 2. Install Visual Studio Code

VS Code is our recommended code editor, which provides powerful TypeScript and React support.

1. Visit the [VS Code website](https://code.visualstudio.com/) to download and install
2. Install the following recommended extensions:
   - ESLint
   - Prettier
   - TypeScript Vue Plugin (Volar)
   - Taroify Extension (if using the Taroify component library)
   - Chinese Language Pack (if you need a Chinese interface)

## II. Project Setup

### 1. Clone the Project

```bash
gh repo clone dustland/courtbook
cd courtbook
```

### 2. Install Dependencies

We use pnpm as our package manager, which is faster and more disk space efficient than npm.

```bash
# Globally install pnpm (if not already installed)
npm install -g pnpm

# Install project dependencies
pnpm install
```

### 3. Project Configuration

1. Copy the `.env.example` file in the project root directory and rename it to `.env.local`
2. Modify the configuration items in the `.env.local` file as needed

## III. Development Process

### 1. Start the Development Service

```bash
# Develop WeChat Mini Program
pnpm dev:weapp

# Develop H5 version (for browser preview)
pnpm dev:h5
```

After executing the `pnpm dev:weapp` command, Taro will generate WeChat Mini Program project files in the `dist` directory.

### 2. Preview in WeChat Developer Tools

1. Open WeChat Developer Tools
2. Click "Project" - "Import Project" in the upper left corner
3. Set the following information:
   - AppID: Enter your WeChat Mini Program AppID (available from the WeChat public platform)
   - Project name: Customize, such as "CourtBook"
   - Project path: Select the `dist` directory in the project
4. Click "Import" to complete the project import
5. After importing, the developer tool will automatically compile and preview the Mini Program

> Note: Make sure to check "Do not verify legal domains..." in "Details" - "Local Settings" in WeChat Developer Tools, otherwise local development debugging may not be possible.

### 3. Real-time Development

1. Edit the source code in VS Code (located in the `src` directory)
2. After each file save, Taro will automatically recompile and update the `dist` directory
3. WeChat Developer Tools will detect file changes and automatically refresh the preview

## IV. WeChat Cloud Development Setup

CourtBook uses WeChat cloud development as a backend service, providing database, storage, and cloud function capabilities.

### 1. Activate Cloud Development

1. In WeChat Developer Tools, click the "Cloud Development" button
2. If it's your first time using it, follow the prompts to create a cloud development environment
3. Record the cloud environment ID, which will need to be configured in the project later

### 2. Configure Cloud Environment

1. Open the `project.config.json` file in the project
2. Find the `cloudfunctionRoot` field and ensure its value is `"cloudfunctions"`
3. Configure the cloud environment ID in the `src/app.config.ts` file:

```typescript
export default defineAppConfig({
  // ...other configurations
  cloud: {
    env: "your-cloud-environment-ID",
  },
  // ...
});
```

### 3. Initialize Database Collections

In the cloud development console, create the following database collections:

- `appointments`: Store appointment information
- `courts`: Store venue information
- `users`: Store user information
- `messages`: Store chat messages

### 4. Deploy Cloud Functions

1. In WeChat Developer Tools, right-click on the cloud function folder under the `cloudfunctions` directory
2. Select the "Upload and Deploy" option
3. Repeat this operation for each cloud function

## V. Build and Publish

### 1. Build Production Version

```bash
# Build WeChat Mini Program (production environment)
pnpm build:weapp
```

### 2. Upload and Publish

1. In WeChat Developer Tools, click the "Upload" button
2. Fill in the version number and project notes
3. After uploading, log in to the [WeChat public platform](https://mp.weixin.qq.com/)
4. Find the version you just uploaded in "Version Management"
5. Submit for review, and publish after the review is approved

## Common Issues

### 1. Compilation Errors

If you encounter compilation errors, try the following steps:

```bash
# Clean cache and reinstall dependencies
pnpm clean
pnpm install

# Restart the development service
pnpm dev:weapp
```

### 2. Cloud Function Call Failures

- Ensure cloud functions are correctly deployed
- Check if the cloud environment ID is correctly configured
- View the console logs in WeChat Developer Tools to understand specific error information

### 3. Static Resources Not Loading

If static resources such as images cannot be loaded normally, check the `copy` configuration in `config/index.ts` to ensure that static resources are correctly copied to the `dist` directory:

```javascript
copy: {
  patterns: [
    { from: "src/assets/", to: "dist/assets/" },
    { from: "src/assets/images/", to: "dist/assets/images/" },
  ];
}
```

## Resource Links

- [Taro Official Documentation](https://docs.taro.zone/)
- [WeChat Mini Program Development Documentation](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [WeChat Cloud Development Documentation](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
