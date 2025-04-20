# CourtBook

CourtBook is a WeChat Mini Program for court booking and scheduling, designed to help users easily book and manage their court reservations.

## Documentation

- [English Getting Started Guide](docs/en/getting-started.md)
- [中文开发环境搭建指南](docs/zh/getting-started.md)

## Features

- User-friendly interface for booking courts
- Weekly and daily schedule views
- Chat assistance for booking help
- Appointment management
- User profile and history tracking

## Technology Stack

- Taro.js for cross-platform Mini Program development
- React for UI components
- Sass for styling
- Taroify for UI components
- WeChat Cloud Functions for backend services

## Development

### Prerequisites

- Node.js (v20+)
- pnpm package manager
- GitHub CLI

See the detailed [getting started guide](docs/en/getting-started.md) for complete setup instructions.

### Getting Started

```bash
# Install dependencies
pnpm install

# Start development server for WeChat Mini Program
pnpm dev:weapp
```

### Build for Production

```bash
pnpm build:weapp
```

## Cloud Functions

This project includes cloud functions for handling appointments and bookings. The cloud functions are located in the `cloudfunctions/` directory.

### Building and Deploying Cloud Functions

The cloud functions are built automatically when you run `pnpm build:weapp`. The build process:

1. Compiles TypeScript files in the cloud functions directories
2. Copies the cloud functions to the `dist/cloudfunctions` directory
3. Processes package.json files to remove development dependencies

To deploy the cloud functions:

1. Build the project with `pnpm build:weapp`
2. Open the project in WeChat Developer Tools
3. Select "Upload" to upload the entire project
4. After uploading, go to the Cloud Development console in WeChat Developer Tools
5. Open the Cloud Functions section
6. You should see your cloud functions listed
7. For each function, click on it and select "Deploy" if needed

When you modify a cloud function:

1. Make your changes to files in the `cloudfunctions/` directory
2. Run `pnpm build:weapp` to rebuild
3. Upload to WeChat Developer Tools
4. Re-deploy the affected functions

### Testing Cloud Functions

You can test cloud functions from the WeChat Developer Tools:

1. Open the Cloud Development console
2. Go to the Cloud Functions section
3. Click on a function
4. Use the "Test" feature to send test requests
5. Enter JSON test data (see examples in each function's README)

## Project Structure

- `/src/components`: Reusable UI components
- `/src/pages`: Mini Program pages
- `/src/assets`: Static assets like icons
- `/src/custom-tab-bar`: Custom tab bar component for navigation
- `/cloudfunctions`: Backend cloud functions
  - `/appointments`: Appointment management service

## License

MIT
