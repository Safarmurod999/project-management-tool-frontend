# 📐 Feature-Sliced Design (FSD) Structure

Loyiha strukturasi va arxitektura hujjati.

## 📋 Mundarija

- [FSD Nima?](#fsd-nima)
- [Loyiha Strukturasi](#loyiha-strukturasi)
- [Layerlar](#layerlar)
- [Slices va Segments](#slices-va-segments)
- [Public API](#public-api)
- [Import Qoidalari](#import-qoidalari)
- [Misol: Login Feature](#misol-login-feature)

## FSD Nima?

**Feature-Sliced Design** - bu frontend loyihalarni tashkil etish uchun arxitektura metodologiyasi.

### Asosiy Tamoyillar

1. **Layerlar bo'yicha ajratish** - Kod layer'larga bo'linadi
2. **Bir yo'nalishli bog'lanish** - Yuqori layer faqat pastga bog'lanadi
3. **Public API** - Har bir modul o'z API'sini export qiladi
4. **Low coupling** - Modullar bir-biriga kam bog'langan

### Afzalliklar

- ✅ **Scalability** - Loyiha katta bo'lsa ham tushunish oson
- ✅ **Maintainability** - Kodni saqlash va yangilash oson
- ✅ **Reusability** - Kod qayta ishlatish imkoniyati
- ✅ **Team collaboration** - Jamoa parallel ishlashi mumkin

## Loyiha Strukturasi

```
src/
├── app/                          # 🔴 Application layer
│   ├── index.tsx                # Root component
│   ├── providers/
│   │   └── index.tsx            # Providers (React Query, Mantine, etc.)
│   └── router/
│       └── index.tsx            # Routing configuration
│
├── pages/                        # 🟢 Pages layer
│   └── login/
│       ├── ui/
│       │   ├── login-page.tsx
│       │   └── login-page.module.scss
│       └── index.ts             # Public API
│
├── features/                     # 🔵 Features layer
│   └── auth/
│       ├── model/
│       │   ├── schema.ts        # Zod validation schemas
│       │   └── use-login.ts     # Business logic hooks
│       ├── ui/
│       │   └── login-form.tsx   # Feature UI components
│       └── index.ts             # Public API
│
├── entities/                     # 🟡 Entities layer
│   └── user/
│       ├── model/
│       │   ├── types.ts         # Type definitions
│       │   └── store.ts         # Zustand store
│       └── index.ts             # Public API
│
└── shared/                       # ⚪ Shared layer
    ├── api/
    │   ├── client.ts            # Axios configuration
    │   ├── auth.ts              # Auth API methods
    │   └── index.ts             # Public API
    ├── config/
    │   ├── constants.ts         # Application constants
    │   └── index.ts             # Public API
    └── ui/                       # (future) Shared UI components
        └── button/
            ├── button.tsx
            └── index.ts
```

## Layerlar

FSD 5 ta asosiy layerdan iborat:

### Layer Ierarxiyasi

```
┌─────────────────────────────────┐
│         app (highest)           │  Application initialization
├─────────────────────────────────┤
│            pages                │  Routes and pages
├─────────────────────────────────┤
│          features               │  User interactions
├─────────────────────────────────┤
│          entities               │  Business entities
├─────────────────────────────────┤
│       shared (lowest)           │  Reusable infrastructure
└─────────────────────────────────┘
```

### 🔴 App Layer

**Maqsad:** Application-level konfiguratsiya va initialization.

**Nima joylashadi:**
- Providers (React Query, Mantine, i18n)
- Global routing
- Global styles
- Store initialization (agar kerak bo'lsa)

**Misol:**
```typescript
// app/providers/index.tsx
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <Notifications />
        {children}
      </MantineProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
```

**Import mumkin:**
- External libraries
- `pages/*`
- `shared/*`

**Import mumkin emas:**
- Hech narsa (eng yuqori layer)

### 🟢 Pages Layer

**Maqsad:** Application routes va to'liq sahifalar.

**Nima joylashadi:**
- Route components
- Page-level layouts
- Features va entities komponentlarini birlashtirish

**Misol:**
```typescript
// pages/login/ui/login-page.tsx
export function LoginPage() {
  return (
    <div className={styles.root}>
      <Container size={420}>
        <Paper withBorder shadow="md" p={30}>
          <Title>Tizimga kirish</Title>
          <LoginForm />  {/* Feature */}
        </Paper>
      </Container>
    </div>
  );
}
```

**Import mumkin:**
- `features/*`
- `entities/*`
- `shared/*`

**Import mumkin emas:**
- `app/*`
- Boshqa `pages/*`

### 🔵 Features Layer

**Maqsad:** User interactions va business features.

**Nima joylashadi:**
- Forms va validations
- Business logic
- User actions (login, create project, etc.)
- API mutations

**Misol:**
```typescript
// features/auth/model/use-login.ts
export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (data: LoginResponse) => {
      localStorage.setItem('access_token', data.access_token);
    },
  });
};

// features/auth/ui/login-form.tsx
export function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const form = useForm<LoginFormData>({
    initialValues: { email: '', password: '' },
    validate: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={form.onSubmit(login)}>
      <TextInput label="Email" {...form.getInputProps('email')} />
      <PasswordInput label="Parol" {...form.getInputProps('password')} />
      <Button type="submit" loading={isPending}>Kirish</Button>
    </form>
  );
}
```

**Import mumkin:**
- `entities/*`
- `shared/*`

**Import mumkin emas:**
- `app/*`
- `pages/*`
- Boshqa `features/*`

### 🟡 Entities Layer

**Maqsad:** Business entities va ularning state'i.

**Nima joylashadi:**
- Business entities (User, Project, Task)
- Entity types va interfaces
- Entity stores (Zustand, Redux)
- Entity selectors

**Misol:**
```typescript
// entities/user/model/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// entities/user/model/store.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, isAuthenticated: false });
  },
}));
```

**Import mumkin:**
- `shared/*`

**Import mumkin emas:**
- `app/*`
- `pages/*`
- `features/*`
- Boshqa `entities/*`

### ⚪ Shared Layer

**Maqsad:** Qayta ishlatiladigan kod va infrastructure.

**Nima joylashadi:**
- UI components (Button, Input, Modal)
- API client va configurations
- Utility functions
- Constants
- Hooks
- Types

**Misol:**
```typescript
// shared/api/client.ts
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// shared/config/constants.ts
export const ROUTES = {
  LOGIN: '/login',
  HOME: '/',
  DASHBOARD: '/dashboard',
} as const;
```

**Import mumkin:**
- External libraries faqat

**Import mumkin emas:**
- Boshqa barcha layerlar

## Slices va Segments

### Slice (Bo'lak)

Har bir layer slice'larga bo'linadi:

```
features/
├── auth/           # Slice
├── project-list/   # Slice
└── task-board/     # Slice
```

### Segment (Segment)

Har bir slice segment'larga bo'linadi:

```
features/auth/
├── model/          # Segment - Business logic
├── ui/             # Segment - UI components
├── api/            # Segment - API methods (optional)
├── lib/            # Segment - Helper functions (optional)
└── index.ts        # Public API
```

**Standard segment'lar:**
- `ui/` - UI components
- `model/` - Business logic, types, stores
- `api/` - API integration (optional)
- `lib/` - Helper functions (optional)
- `config/` - Local configuration (optional)

## Public API

Har bir slice o'z public API'sini `index.ts` orqali export qilishi kerak.

### ✅ To'g'ri

```typescript
// features/auth/index.ts
export { LoginForm } from './ui/login-form';
export { useLogin } from './model/use-login';
export { loginSchema } from './model/schema';
export type { LoginFormData } from './model/schema';

// pages/login/ui/login-page.tsx
import { LoginForm } from '@/features/auth';  // ✅
```

### ❌ Noto'g'ri

```typescript
// pages/login/ui/login-page.tsx
import { LoginForm } from '@/features/auth/ui/login-form';  // ❌ Direct import
```

## Import Qoidalari

### Layer Import Qoidalari

```
app       → pages, shared
pages     → features, entities, shared
features  → entities, shared
entities  → shared
shared    → external libraries only
```

### Import Namunasi

```typescript
// ✅ TO'G'RI
import { useState } from 'react';                    // External
import { Button } from '@mantine/core';              // External
import { LoginForm } from '@/features/auth';         // Lower layer
import { useAuthStore } from '@/entities/user';      // Lower layer
import { apiClient } from '@/shared/api';            // Lower layer
import styles from './styles.module.scss';           // Local

// ❌ NOTO'G'RI
import { HomePage } from '@/pages/home';             // Same/higher layer
import { CreateProject } from '@/features/projects'; // Same layer (from features)
```

## Misol: Login Feature

### Struktura

```
features/auth/
├── model/
│   ├── schema.ts           # Zod validation schemas
│   └── use-login.ts        # Login mutation hook
├── ui/
│   └── login-form.tsx      # Login form component
└── index.ts                # Public API
```

### Implementation

```typescript
// features/auth/model/schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email notog\'ri formatda'),
  password: z.string().min(6, 'Parol kamida 6 ta belgi'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

```typescript
// features/auth/model/use-login.ts
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api';
import type { LoginFormData } from './schema';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
    },
  });
};
```

```typescript
// features/auth/ui/login-form.tsx
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { loginSchema, type LoginFormData } from '../model/schema';
import { useLogin } from '../model/use-login';

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  
  const form = useForm<LoginFormData>({
    initialValues: { email: '', password: '' },
    validate: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={form.onSubmit((values) => login(values))}>
      <Stack gap="md">
        <TextInput label="Email" {...form.getInputProps('email')} />
        <PasswordInput label="Parol" {...form.getInputProps('password')} />
        <Button type="submit" loading={isPending}>Kirish</Button>
      </Stack>
    </form>
  );
}
```

```typescript
// features/auth/index.ts (Public API)
export { LoginForm } from './ui/login-form';
export { useLogin } from './model/use-login';
export { loginSchema } from './model/schema';
export type { LoginFormData } from './model/schema';
```

## Yangi Feature Qo'shish

### 1. Feature Yaratish

```bash
mkdir -p src/features/project-list/{model,ui}
touch src/features/project-list/index.ts
```

### 2. Model Yaratish

```typescript
// features/project-list/model/use-projects.ts
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/shared/api';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });
};
```

### 3. UI Yaratish

```typescript
// features/project-list/ui/project-list.tsx
import { Stack, Loader } from '@mantine/core';
import { useProjects } from '../model/use-projects';

export function ProjectList() {
  const { data, isLoading } = useProjects();

  if (isLoading) return <Loader />;

  return (
    <Stack>
      {data?.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </Stack>
  );
}
```

### 4. Public API

```typescript
// features/project-list/index.ts
export { ProjectList } from './ui/project-list';
export { useProjects } from './model/use-projects';
```

### 5. Sahifada Ishlatish

```typescript
// pages/projects/ui/projects-page.tsx
import { ProjectList } from '@/features/project-list';

export function ProjectsPage() {
  return (
    <Container>
      <h1>Projects</h1>
      <ProjectList />
    </Container>
  );
}
```

## Foydali Havolalar

- [Feature-Sliced Design Documentation](https://feature-sliced.design/)
- [FSD Examples](https://github.com/feature-sliced/examples)
- [FSD Discussion](https://github.com/feature-sliced/documentation/discussions)

---

**Eslatma:** FSD - bu metodologiya, qattiq qoida emas. Loyiha ehtiyojlariga qarab moslashtirish mumkin.
