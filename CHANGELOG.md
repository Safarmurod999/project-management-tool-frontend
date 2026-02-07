# Changelog

Loyiha o'zgarishlari va versiyalari tarixi.

Barcha muhim o'zgarishlar ushbu faylda qayd etiladi.

Format [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) asosida,
Versiyalash [Semantic Versioning](https://semver.org/spec/v2.0.0.html) qoidalariga amal qiladi.

## [Unreleased]

## [0.0.1] - 2026-02-07

### Added

#### Project Setup
- ✅ Initial project setup with Vite + React + TypeScript
- ✅ Feature-Sliced Design (FSD) architecture implementation
- ✅ pnpm package manager configuration
- ✅ Environment variables configuration

#### Dependencies
- ✅ Mantine UI v8.3 - UI component library
- ✅ TanStack Query v5.90 - Server state management
- ✅ React Router v7.9 - Routing
- ✅ Zustand v5.0 - Client state management
- ✅ Zod v4.1 - Schema validation
- ✅ Axios v1.13 - HTTP client
- ✅ Biome v2.3 - Linting and formatting
- ✅ Husky v9.1 - Git hooks
- ✅ @dnd-kit - Drag and drop functionality
- ✅ i18next - Internationalization support
- ✅ framer-motion - Animations

#### FSD Structure
- ✅ App layer - Application initialization and providers
  - Providers (React Query, Mantine, Notifications)
  - Router configuration
- ✅ Pages layer - Login page
- ✅ Features layer - Authentication feature
  - Login form with validation
  - Login mutation hook
  - Zod schema validation
- ✅ Entities layer - User entity
  - User types and interfaces
  - Auth store (Zustand)
- ✅ Shared layer
  - Axios API client with interceptors
  - Auth API methods
  - Configuration and constants

#### Authentication
- ✅ Login functionality
- ✅ JWT token management (access + refresh tokens)
- ✅ Automatic token refresh on 401 errors
- ✅ Token storage in localStorage
- ✅ Protected routes setup

#### UI/UX
- ✅ Mantine UI integration
- ✅ Responsive login page
- ✅ Form validation with Zod
- ✅ Error notifications
- ✅ Loading states
- ✅ SCSS modules support
- ✅ PostCSS configuration

#### Developer Experience
- ✅ TypeScript path aliases (@/*)
- ✅ Biome linter configuration
- ✅ Git hooks setup (Husky)
- ✅ Standard Version for changelog
- ✅ Code generation templates (Hygen)

#### Documentation
- ✅ README.md - Main project documentation
- ✅ FSD_STRUCTURE.md - Architecture documentation
- ✅ CONTRIBUTING.md - Contribution guidelines
- ✅ API.md - API integration documentation
- ✅ CHANGELOG.md - Version history
- ✅ .env.example - Environment variables template

#### Scripts
- ✅ `pnpm dev` - Development server
- ✅ `pnpm build` - Development build
- ✅ `pnpm build:prod` - Production build
- ✅ `pnpm lint` - Code linting and formatting
- ✅ `pnpm check-types` - TypeScript type checking
- ✅ `pnpm preview` - Preview production build
- ✅ `pnpm generate` - Code generation
- ✅ `pnpm release` - Version release

### Configuration Files
- ✅ vite.config.ts - Vite configuration with path aliases
- ✅ tsconfig.json - TypeScript configuration
- ✅ tsconfig.app.json - App-specific TypeScript config
- ✅ postcss.config.cjs - PostCSS with Mantine preset
- ✅ package.json - Dependencies and scripts
- ✅ .gitignore - Git ignore rules

### Technical Details

**React 19 Features:**
- Strict Mode integration
- Modern React patterns
- Function components only

**TypeScript:**
- Strict mode enabled
- Path mapping configured
- Type safety enforced

**Mantine:**
- Core components
- Hooks
- Form management
- Notifications
- NProgress

**TanStack Query:**
- Query client setup
- Dev tools integration
- Auto-refetch disabled
- Retry logic configured

**Axios:**
- Base URL configuration
- Request/Response interceptors
- Automatic token injection
- Token refresh logic

---

## Version Guidelines

### Semantic Versioning (SemVer)

Format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (API changes, major refactor)
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Change Categories

- **Added**: Yangi features
- **Changed**: O'zgartirilgan functionality
- **Deprecated**: Tez orada o'chiriladigan features
- **Removed**: O'chirilgan features
- **Fixed**: Bug fixes
- **Security**: Security fixes

### Example Entry

```markdown
## [1.2.0] - 2026-03-01

### Added
- New dashboard page with analytics
- Project filtering functionality

### Changed
- Updated Mantine to v8.4
- Improved login form UX

### Fixed
- Fixed token refresh issue
- Resolved routing bug
```

---

**Convention:** [Keep a Changelog](https://keepachangelog.com/)

**Versioning:** [Semantic Versioning](https://semver.org/)

**Generator:** [Standard Version](https://github.com/conventional-changelog/standard-version)
