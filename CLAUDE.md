# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project called "horizon-studio" that uses modern web development tools and practices. The project is configured with:

- **React 18** with TypeScript for the UI layer
- **Vite** for development and build tooling
- **Biome** for linting and formatting (replaces ESLint/Prettier)
- **Jest** with React Testing Library for testing
- **pnpm** as the package manager (version 8.0.0+)
- **Emotion** for CSS-in-JS styling
- **Tanstack Query** for data fetching
- **Zustand** for state management
- **React Flow** for node-based UIs
- **Framer Motion** for animations
- **Zod** for schema validation

## Common Commands

### Development

- `pnpm dev` - Start development server
- `pnpm preview` - Preview production build

### Building

- `pnpm build` - Build for production (runs TypeScript compilation + Vite build)

### Code Quality

- `pnpm check` - Run Biome checks (lint + format)
- `pnpm format` - Format code with Biome
- `pnpm lint` - Lint code with Biome

### Testing

- `pnpm test` - Run tests (Jest with jsdom)
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage
- `pnpm test:ci` - Run tests in CI mode

## Code Style

The project uses Biome for code formatting and linting with these key settings:

- 2 spaces for indentation
- Single quotes for strings
- Semicolons always
- Line width of 100 characters
- Strict rules: no unused variables, no explicit any, no non-null assertions

## Test Configuration

Tests use Jest with jsdom environment and React Testing Library. The configuration includes:

- Path mapping for `@/` imports pointing to `src/`
- Setup file at `jest.setup.js`
- TypeScript support via ts-jest

## Package Management

This project requires:

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher

Always use `pnpm` instead of npm or yarn for consistency.
