# 🤝 Contributing Guide

Loyihaga hissa qo'shish uchun yo'riqnoma.

## 📋 Mundarija

- [Development Setup](#development-setup)
- [Git Workflow](#git-workflow)
- [Kod Standartlari](#kod-standartlari)
- [Pull Request Jarayoni](#pull-request-jarayoni)
- [Yangi Feature Qo'shish](#yangi-feature-qoshish)

## Development Setup

### 1. Repository'ni Clone qilish

```bash
git clone <repository-url>
cd project-management-tool-frontend
```

### 2. Dependencies O'rnatish

```bash
pnpm install
```

### 3. Environment Sozlash

```bash
cp .env.example .env
```

### 4. Development Server

```bash
pnpm dev
```

## Git Workflow

### Branch Naming Convention

```
feature/    # Yangi funksiyalar
bugfix/     # Bug tuzatishlar
hotfix/     # Production bug tuzatishlar
refactor/   # Kod refactoring
docs/       # Documentation o'zgarishlar
```

**Misol:**
```bash
git checkout -b feature/add-project-list
git checkout -b bugfix/fix-login-validation
```

### Commit Messages

Commit message'lar quyidagi formatda bo'lishi kerak:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - Yangi feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting, missing semi colons, etc
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

**Misol:**
```bash
git commit -m "feat(auth): add password reset functionality"
git commit -m "fix(login): resolve validation error message"
git commit -m "docs(readme): update installation instructions"
```

### Pre-commit Hooks

Husky va lint-staged automatic ravishda commit qilishdan oldin kodni tekshiradi:

```bash
# Automatic ishga tushadi
git commit -m "feat: add new feature"

# Quyidagi tekshiruvlar bajariladi:
# 1. Biome linting
# 2. TypeScript type checking
# 3. Code formatting
```

## Kod Standartlari

### FSD Arxitekturasi

Har doim Feature-Sliced Design qoidalariga rioya qiling:

```
✅ TO'G'RI
src/
├── features/auth/
│   ├── model/
│   ├── ui/
│   └── index.ts

❌ NOTO'G'RI
src/
├── features/auth/
│   └── login-form.tsx  # to'g'ridan-to'g'ri komponent
```

### Public API Pattern

Har bir module `index.ts` orqali export qilishi kerak:

```typescript
// ✅ TO'G'RI
// src/features/auth/index.ts
export { LoginForm } from './ui/login-form';
export { useLogin } from './model/use-login';

// ❌ NOTO'G'RI - public API mavjud emas
// Fayllar to'g'ridan-to'g'ri export qilinmaydi
```

### Import Qoidalari

```typescript
// ✅ TO'G'RI - FSD layer tartibida
import { useState } from 'react';
import { LoginForm } from '@/features/auth';
import { useAuthStore } from '@/entities/user';
import { apiClient } from '@/shared/api';

// ❌ NOTO'G'RI - aralashgan tartib
import { LoginForm } from '@/features/auth';
import { useState } from 'react';
import styles from './styles.module.scss';
import { apiClient } from '@/shared/api';
```

### TypeScript Qoidalari

```typescript
// ✅ TO'G'RI - explicit types
interface UserProps {
  name: string;
  age: number;
}

const user: UserProps = { name: 'John', age: 30 };

// ❌ NOTO'G'RI - any type
const user: any = { name: 'John', age: 30 };
```

### Component Structure

```typescript
// ✅ TO'G'RI
import type { FC } from 'react';
import styles from './component.module.scss';

interface ComponentProps {
  title: string;
  onClose: () => void;
}

export const Component: FC<ComponentProps> = ({ title, onClose }) => {
  // Hooks
  const [state, setState] = useState();
  
  // Event handlers
  const handleClick = () => {
    // logic
  };
  
  // Render
  return (
    <div className={styles.root}>
      <h1>{title}</h1>
    </div>
  );
};
```

## Pull Request Jarayoni

### 1. Branch Yaratish

```bash
git checkout -b feature/your-feature-name
```

### 2. O'zgarishlar Kiritish

```bash
# Kod yozish
# ...

# Tekshirish
pnpm lint
pnpm check-types

# Commit
git add .
git commit -m "feat: add new feature"
```

### 3. Push va PR

```bash
git push origin feature/your-feature-name
```

GitHub'da Pull Request oching:

**PR Template:**
```markdown
## O'zgarishlar

- Qanday o'zgarishlar kiritildi
- Qaysi muammo hal qilindi

## Testing

- [ ] Kod local da test qilindi
- [ ] TypeScript xatoliklari yo'q
- [ ] Linting xatoliklari yo'q

## Screenshots (agar UI o'zgarsa)

[Screenshot qo'shing]

## Qo'shimcha Ma'lumot

[Kerak bo'lsa qo'shimcha ma'lumot]
```

### 4. Code Review

- Kamida 1 ta reviewer talab qilinadi
- Barcha commentlarni hal qiling
- CI/CD tekshiruvlari muvaffaqiyatli bo'lishi kerak

### 5. Merge

- Squash and merge tavsiya etiladi
- Branch merge'dan keyin o'chiriladi

## Yangi Feature Qo'shish

### 1. Feature Planning

Yangi feature qo'shishdan oldin:
- GitHub Issue yarating
- Technical design document tuzing
- Team bilan muhokama qiling

### 2. FSD Layer tanlash

```
app/        → Application-level sozlamalar
pages/      → Sahifalar
features/   → User interactions
entities/   → Business objects
shared/     → Reusable code
```

### 3. Kod Yozish

**Misol: Yangi "Project List" feature**

```bash
# Feature strukturasini yaratish
mkdir -p src/features/project-list/{model,ui}
touch src/features/project-list/index.ts
```

```typescript
// src/features/project-list/model/use-projects.ts
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getAll,
  });
};

// src/features/project-list/ui/project-list.tsx
export function ProjectList() {
  const { data, isLoading } = useProjects();
  
  if (isLoading) return <Loader />;
  
  return (
    <Stack>
      {data?.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </Stack>
  );
}

// src/features/project-list/index.ts
export { ProjectList } from './ui/project-list';
export { useProjects } from './model/use-projects';
```

### 4. Testing

```typescript
// Kelajakda: tests qo'shiladi
// src/features/project-list/__tests__/project-list.test.tsx
```

### 5. Documentation

- README.md yangilang (agar kerak bo'lsa)
- JSDoc commentlar qo'shing
- Storybook story yarating (agar UI component bo'lsa)

## Code Review Checklist

Reviewer uchun:

- [ ] Kod FSD qoidalariga mos keladimi?
- [ ] TypeScript types to'g'rimi?
- [ ] Component props va state optimal tashkil etilganmi?
- [ ] Performance optimizatsiya (useMemo, useCallback) kerakmi?
- [ ] Error handling mavjudmi?
- [ ] Loading states mavjudmi?
- [ ] Accessibility (a11y) requirements bajariladimi?
- [ ] Responsive design to'g'rimi?
- [ ] Tests yozilganmi (kelajakda)?

## Muammolarni Hal Qilish

### TypeScript Errors

```bash
# Type checking
pnpm check-types

# Build qilib ko'rish
pnpm build
```

### Linting Errors

```bash
# Auto-fix
pnpm lint

# Faqat tekshirish
pnpm biome check src
```

### Git Conflicts

```bash
# Main bilan sync
git checkout main
git pull
git checkout feature/your-branch
git rebase main

# Conflictlarni hal qiling
# ...

git rebase --continue
```

## Savol-Javoblar

**Q: Qaysi package manager ishlatish kerak?**
A: Faqat `pnpm`. npm yoki yarn ishlatish mumkin emas.

**Q: FSD layerini qanday tanlash kerak?**
A: Feature user bilan interact qilsa → `features`, data model bo'lsa → `entities`, umumiy kod bo'lsa → `shared`

**Q: Component stillarini qanday yozish kerak?**
A: SCSS modules ishlatamiz (`.module.scss`). Global stillar `app` layerida.

## Foydali Havolalar

- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Mantine Components](https://mantine.dev/)

---

Agar savollaringiz bo'lsa, issue oching yoki team bilan bog'laning!
