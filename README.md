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

## Project Structure

- `/src/components`: Reusable UI components
- `/src/pages`: Mini Program pages
- `/src/assets`: Static assets like icons
- `/src/custom-tab-bar`: Custom tab bar component for navigation

## License

MIT
