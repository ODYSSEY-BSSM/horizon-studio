# Horizon Studio

A powerful roadmap visualization tool built with React Flow that helps you create, manage, and visualize project roadmaps with interactive node-based interfaces.

## Features

- 🗺️ **Interactive Roadmap Visualization** - Create visual roadmaps using React Flow
- 🎯 **Multiple Node Types** - Default, Milestone, and Task nodes with unique styling
- 📊 **Progress Tracking** - Track completion status and progress for milestones
- 💾 **Local & Remote Mode** - Works offline with localStorage or connects to remote API
- 🎨 **Modern UI** - Beautiful interface built with Emotion and Framer Motion
- ⚡ **Real-time Updates** - Powered by TanStack Query for efficient data management
- 📱 **Responsive Design** - Works seamlessly across different screen sizes

## Technology Stack

- **React 18** with TypeScript
- **React Flow** for interactive node-based visualization
- **Zustand** for state management
- **TanStack Query** for data fetching and caching
- **Emotion** for CSS-in-JS styling
- **Framer Motion** for animations
- **Zod** for schema validation
- **Vite** for build tooling
- **Biome** for linting and formatting

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher

### Installation

```bash
# Install dependencies
pnpm install

# Start development server (uses local mode by default)
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## Usage Modes

### Local Mode (Default)

By default, the application runs in local mode using mock data and localStorage for persistence. This allows you to use the application without any backend setup.

**Features in Local Mode:**
- ✅ Sample roadmaps and nodes pre-loaded
- ✅ Full CRUD operations with localStorage persistence
- ✅ All UI features work normally
- ✅ Data persists between sessions

### API Mode

To connect to a remote API, create a `.env.local` file:

```bash
# To use remote API
VITE_USE_LOCAL_API=false
VITE_API_URL=http://your-api-server:3000
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm check` - Run Biome checks (lint + format)
- `pnpm format` - Format code with Biome
- `pnpm lint` - Lint code with Biome

## Project Structure

```
src/
├── components/          # React components
│   ├── nodes/          # Custom React Flow node components
│   ├── RoadmapCanvas.tsx
│   ├── RoadmapManager.tsx
│   └── NodeEditor.tsx
├── services/           # API and data services
│   ├── api.ts         # Main API service
│   ├── mockApi.ts     # Mock API for local mode
│   └── localStorageService.ts
├── stores/             # Zustand stores
├── types/              # TypeScript type definitions
├── schemas/            # Zod validation schemas
└── hooks/              # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## API Integration

The application is designed to work with a REST API that provides the following endpoints:

- `GET /roadmap/all` - Get all roadmaps
- `POST /roadmap/create` - Create a new roadmap
- `PUT /roadmap/update/:id` - Update a roadmap
- `DELETE /roadmap/delete/:id` - Delete a roadmap
- `GET /roadmap/:id/nodes` - Get nodes for a roadmap
- `POST /roadmap/:id/nodes` - Create a node
- `PUT /roadmap/:roadmapId/nodes/:nodeId` - Update a node
- `DELETE /roadmap/:roadmapId/nodes/:nodeId` - Delete a node

See the Swagger documentation for complete API specifications.

## License

This project is licensed under the MIT License.
