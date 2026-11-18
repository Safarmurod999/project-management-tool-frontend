# 🚀 Project Management Tool - Frontend

Modern loyiha boshqaruv vositasi uchun frontend ilovasi. **Feature-Sliced Design (FSD)** arxitekturasi va zamonaviy texnologiyalar bilan qurilgan.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646cff.svg)](https://vitejs.dev/)
[![Mantine](https://img.shields.io/badge/Mantine-8.3-339af0.svg)](https://mantine.dev/)

## 📋 Mundarija

- [Xususiyatlar](#-xususiyatlar)
- [Texnologiyalar](#-texnologiyalar)
- [Loyiha Strukturasi](#-loyiha-strukturasi)
- [O'rnatish](#-ornatish)
- [Ishga Tushirish](#-ishga-tushirish)
- [Scriptlar](#-scriptlar)
- [Environment O'zgaruvchilar](#-environment-ozgaruvchilar)
- [FSD Arxitekturasi](#-fsd-arxitekturasi)
- [Kod Yozish Qoidalari](#-kod-yozish-qoidalari)
- [API Integratsiyasi](#-api-integratsiyasi)

## ✨ Xususiyatlar

- ✅ **Authentication** - Login/Logout with JWT tokens
- ✅ **Modern UI** - Mantine UI komponentlar kutubxonasi
- ✅ **Type Safety** - TypeScript bilan to'liq tip xavfsizligi
- ✅ **State Management** - TanStack Query (server) va Zustand (client)
- ✅ **Form Validation** - Zod schema validatsiyasi
- ✅ **Routing** - React Router v7
- ✅ **Code Quality** - Biome linter va formatter
- ✅ **FSD Architecture** - Feature-Sliced Design metodologiyasi
- ✅ **Kanban Boardlar** - Ustunlar, vazifalar va drag-and-drop (`@dnd-kit`)
- ✅ **Dinamik Statuslar** - Loyiha statuslari, ustunga biriktirish va tartiblash
- ✅ **Workflow** - Statuslar orasidagi o'tish qoidalari; kanban va vazifa oynasi faqat ruxsat etilgan o'tishlarni taklif qiladi
- ✅ **Real-time** - Socket.IO orqali status, workflow va board o'zgarishlari
- ✅ **Ruxsatlar** - Backend rol/permission qoidalariga mos UI (`entities/user/model/access.ts`)

## 🛠 Texnologiyalar

### Core
- **React 19.2** - UI Library
- **TypeScript 5.9** - Type-safe JavaScript
- **Vite 7.2** - Build tool va dev server

### UI & Styling
- **Mantine 8.3** - React komponentlar kutubxonasi
- **SCSS/Sass** - CSS preprocessor
- **PostCSS** - CSS transformatsiya
- **Lucide React** - Icon library

### State Management
- **TanStack Query 5.90** - Server state boshqaruvi
- **Zustand 5.0** - Client state boshqaruvi
- **React Router 7.9** - Routing va navigation

### Forms & Validation
- **Mantine Form** - Form state boshqaruvi
- **Zod 4.1** - Schema validation
- **mantine-form-zod-resolver** - Mantine va Zod integratsiyasi

### HTTP & API
- **Axios 1.13** - HTTP client
- **axios-auth-refresh 3.3** - Token refresh logikasi
- **socket.io-client 4.8** - Real-time hodisalar (`shared/api/socket.ts`)

### Developer Experience
- **Biome 2.3** - Linting va formatting
- **Husky 9.1** - Git hooks
- **lint-staged 16.2** - Staged fayllarni linting
- **Standard Version 9.5** - Versiyalash va changelog

### Qo'shimcha
- **@dnd-kit** - Drag and drop funksionallik
- **i18next** - Internationalization
- **dayjs** - Sana bilan ishlash
- **framer-motion** - Animatsiyalar

## 📁 Loyiha Strukturasi

```
project-management-tool-frontend/
├── public/                 # Static fayllar
├── src/
│   ├── app/               # 🔴 App Layer - Applicationni ishga tushirish
│   │   ├── index.tsx      # Main App component
│   │   ├── providers/     # React Query, Mantine providers
│   │   └── router/        # Routing konfiguratsiyasi
│   │
│   ├── pages/             # 🟢 Pages Layer - Sahifalar
│   │   └── login/
│   │       ├── ui/        # Page komponentlari
│   │       └── index.ts   # Public API
│   │
│   ├── features/          # 🔵 Features Layer - Biznes logika
│   │   └── auth/
│   │       ├── model/     # Business logic, schemas, hooks
│   │       ├── ui/        # Feature UI komponentlar
│   │       └── index.ts   # Public API
│   │
│   ├── entities/          # 🟡 Entities Layer - Biznes ob'ektlari
│   │   └── user/
│   │       ├── model/     # Types, stores, business logic
│   │       └── index.ts   # Public API
│   │
│   └── shared/            # ⚪ Shared Layer - Umumiy kod
│       ├── api/           # API client, interceptors
│       ├── config/        # Konstantalar, sozlamalar
│       └── ui/            # Umumiy UI komponentlar
│
├── .env.example           # Environment variables namunasi
├── package.json           # Dependencies va scriptlar
├── vite.config.ts         # Vite konfiguratsiyasi
├── tsconfig.json          # TypeScript konfiguratsiyasi
└── README.md             # Ushbu fayl

```

## 🔧 O'rnatish

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (tavsiya etiladi)

pnpm o'rnatish:
```bash
npm install -g pnpm
```

### Dependencies O'rnatish

```bash
# Clone repository
git clone <repository-url>
cd project-management-tool-frontend

# Install dependencies (pnpm bilan)
pnpm install
```

> ⚠️ **Muhim:** Ushbu loyiha faqat `pnpm` bilan ishlaydi. npm yoki yarn ishlatishga urinish xatolikka olib keladi (`preinstall` script orqali cheklangan).

## 🚀 Ishga Tushirish

### 1. Environment Sozlash

```bash
# .env.example dan .env yaratish
cp .env.example .env
```

`.env` faylini tahrirlang va kerakli o'zgaruvchilarni kiriting:

```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Development Server

```bash
pnpm dev
```

Brauzerda ochish: [http://localhost:5173](http://localhost:5173)

### 3. Production Build

```bash
# Development build
pnpm build

# Production build
pnpm build:prod
```

### 4. Preview Production Build

```bash
pnpm preview
```

## 📜 Scriptlar

| Script | Tavsif |
|--------|--------|
| `pnpm dev` | Development server ishga tushirish |
| `pnpm build` | Development uchun build |
| `pnpm build:prod` | Production uchun build |
| `pnpm preview` | Production buildni preview qilish |
| `pnpm lint` | Kodni Biome bilan lint va format qilish |
| `pnpm check-types` | TypeScript type checking |
| `pnpm generate` | Hygen bilan kod generatsiya |
| `pnpm release` | Versiya yaratish va changelog |

## 🌍 Environment O'zgaruvchilar

| O'zgaruvchi | Tavsif | Default | Majburiy |
|------------|--------|---------|----------|
| `VITE_API_URL` | Backend API URL manzili | `http://localhost:3000/api` | ✅ Ha |

## 🏗 FSD Arxitekturasi

Bu loyiha **Feature-Sliced Design** metodologiyasi bilan qurilgan.

### Layerlar Ierarxiyasi

```
app → pages → features → entities → shared
```

**Import qoidalari:**
- ✅ Yuqori layer pastdagi layerdan import qilishi mumkin
- ❌ Pastdagi layer yuqoridagi layerdan import qila olmaydi
- ❌ Bir xil layerdagi modullar bir-biridan import qila olmaydi

### Layer Tushuntirishlari

#### 🔴 App Layer
Application-level konfiguratsiya va sozlamalar.

**Mas'uliyat:**
- Providers (React Query, Mantine, i18n)
- Router konfiguratsiyasi
- Global stillar
- Application boshlash

**Misol:**
```typescript
// src/app/providers/index.tsx
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications />
        {children}
      </MantineProvider>
    </QueryClientProvider>
  );
}
```

#### 🟢 Pages Layer
To'liq sahifalar va routing.

**Mas'uliyat:**
- Sahifa komponentlarini yig'ish
- Features va entities'larni birlashtirish
- Sahifa-level layout

**Misol:**
```typescript
// src/pages/login/ui/login-page.tsx
export function LoginPage() {
  return (
    <Container>
      <LoginForm /> {/* Feature */}
    </Container>
  );
}
```

#### 🔵 Features Layer
Foydalanuvchi interaksiyalari va biznes logika.

**Mas'uliyat:**
- Formalar va validatsiya
- Business logika
- API mutations
- User actions

**Misol:**
```typescript
// src/features/auth/model/use-login.ts
export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
  });
};
```

#### 🟡 Entities Layer
Biznes ob'ektlari va ularning holati.

**Mas'uliyat:**
- Types va interfaces
- State stores (Zustand)
- Entity-level business logic

**Misol:**
```typescript
// src/entities/user/model/store.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

#### ⚪ Shared Layer
Qayta ishlatiladigan kod va utilities.

**Mas'uliyat:**
- UI komponentlar
- API client
- Utility functions
- Constants va config

**Misol:**
```typescript
// src/shared/api/client.ts
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});
```

## 📝 Kod Yozish Qoidalari

### Import Tartib

```typescript
// 1. External libraries
import { useState } from 'react';
import { useForm } from '@mantine/form';

// 2. Internal layers (FSD tartibida)
import { LoginForm } from '@/features/auth';
import { useAuthStore } from '@/entities/user';
import { apiClient } from '@/shared/api';

// 3. Relative imports
import { LoginSchema } from './schema';
import styles from './login.module.scss';
```

### Public API Pattern

Har bir slice (folder) o'zining `index.ts` orqali public API'sini export qiladi:

```typescript
// ❌ Noto'g'ri - ichki implementatsiyaga direct import
import { LoginForm } from '@/features/auth/ui/login-form';

// ✅ To'g'ri - public API orqali
import { LoginForm } from '@/features/auth';
```

### Naming Conventions

- **Components:** PascalCase (`LoginForm.tsx`)
- **Hooks:** camelCase, `use` prefix (`useLogin.ts`)
- **Types:** PascalCase (`UserType`, `LoginFormData`)
- **Constants:** UPPER_SNAKE_CASE (`API_URL`, `ROUTES`)
- **Files:** kebab-case (`login-form.tsx`, `use-login.ts`)

### TypeScript

```typescript
// ✅ To'g'ri - explicit types
interface LoginFormProps {
  onSuccess: () => void;
}

// ✅ To'g'ri - type inference for simple cases
const userName = 'John'; // string type inferred

// ❌ Noto'g'ri - any type
const data: any = fetchData();
```

## 🔌 API Integratsiyasi

### Axios Client

Axios client automatic token management bilan:

```typescript
// Token automatic qo'shiladi
const response = await apiClient.get('/users');

// Refresh token logic
// 401 xatolikda automatic refresh token bilan yangi token oladi
```

### API Endpoints Yaratish

```typescript
// src/shared/api/projects.ts
export const projectsApi = {
  getAll: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },
  
  create: async (data: CreateProjectDto) => {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },
};
```

### React Query bilan Ishlatish

```typescript
// GET request
const { data, isLoading } = useQuery({
  queryKey: ['projects'],
  queryFn: projectsApi.getAll,
});

// POST request
const { mutate } = useMutation({
  mutationFn: projectsApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  },
});
```

## 🎨 UI Komponentlar

### Mantine Komponentlar

```typescript
import { Button, TextInput, Modal } from '@mantine/core';

function MyComponent() {
  return (
    <form>
      <TextInput label="Email" required />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Custom Styles

```scss
// component.module.scss
.container {
  padding: var(--mantine-spacing-md);
  background: var(--mantine-color-gray-0);
  
  &:hover {
    background: var(--mantine-color-gray-1);
  }
}
```

## 🧪 Testing (Kelajakda)

```bash
# Tests run qilish
pnpm test

# Coverage
pnpm test:coverage
```

## 📚 Qo'shimcha Resurslar

- [Feature-Sliced Design](https://feature-sliced.design/) - Arxitektura haqida
- [Mantine Documentation](https://mantine.dev/) - UI komponentlar
- [TanStack Query](https://tanstack.com/query) - Server state
- [React Router](https://reactrouter.com/) - Routing
- [Zustand](https://github.com/pmndrs/zustand) - State management

## 📄 Litsenziya

Ushbu loyiha private va faqat ichki foydalanish uchun mo'ljallangan.

## 👨‍💻 Muallif

**Safarmurod**

---

⭐ Agar sizga bu loyiha yoqsa, star bosishni unutmang!
