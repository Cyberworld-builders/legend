# Export to Prompt
The purpose of this document is to compress the entire app into a set of prompts that can be used by planning and coding agents to generate a similar codebase that has all of the same features and functionality in principle. 

We need to:
- Scan all of the files in the codebase.
- Identify all frameworks, libraries, and dependencies.
- Understand all build tooling scripts and configuration.
- Discover all components, pages, and routes.

## Scaffolding Prompt

This is a **Next.js 15.3.1** application built with **React 19** and **TypeScript 5**. Here's the comprehensive breakdown of frameworks, dependencies, and build tooling a coding agent needs to set up the basic scaffolding:

### Core Framework Stack
- **Next.js 15.3.1** - React framework with App Router architecture
- **React 19.0.0** - UI library with latest features
- **TypeScript 5** - Type-safe JavaScript development
- **Tailwind CSS 4** - Utility-first CSS framework with typography plugin

### UI Components & Icons
- **Lucide React 0.503.0** - Icon library
- **React Icons 5.5.0** - Additional icon set
- **React Markdown 10.1.0** - Markdown rendering with GitHub Flavored Markdown support (`remark-gfm 4.0.1`)
- **React Syntax Highlighter 15.6.1** - Code syntax highlighting

### Build Tools & Configuration

#### Next.js Configuration (`next.config.js`)
```javascript
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader', // Enables importing markdown files as raw text
    });
    return config;
  },
};
```

#### TypeScript Configuration (`tsconfig.json`)
- Target: ES2017
- Path mapping: `@/*` points to root directory
- Next.js plugin integration
- Strict mode enabled

#### CSS Processing Pipeline
- **PostCSS** with Autoprefixer and Tailwind CSS plugin
- **Tailwind CSS 4** configuration scanning `./app/**/*` and `./components/**/*`
- **@tailwindcss/typography** plugin for rich text styling

#### Code Quality & Linting
- **ESLint 9** with Next.js core web vitals and TypeScript extensions
- **Prettier** (implied by Next.js setup)

#### Development Dependencies
```json
{
  "@eslint/eslintrc": "^3",
  "@tailwindcss/postcss": "^4.1.4", 
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@types/react-syntax-highlighter": "^15.5.13",
  "autoprefixer": "^10.4.21",
  "eslint": "^9",
  "eslint-config-next": "15.3.1",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

### Application Architecture
- **App Router** structure (Next.js 13+ pattern)
- Routes: `/blog`
- Component architecture with TypeScript
- Server-side and client-side rendering capabilities

### Package Scripts
```json
{
  "dev": "next dev",       // Development server
  "build": "next build",   // Production build
  "start": "next start",   // Production server
  "lint": "next lint"      // Code linting
}
```

### Installation Steps for Coding Agent
1. Initialize Next.js 15.3.1 project with TypeScript
2. Install all production dependencies listed above
3. Install all development dependencies
4. Configure Tailwind CSS with typography plugin
5. Set up PostCSS configuration
6. Configure ESLint with Next.js rules

