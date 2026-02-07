# Environment Configuration

Bu loyihada development va production uchun alohida environment sozlamalari mavjud.

## Environment Fayllar

### `.env.development`
Development mode'da ishlatiladi (`pnpm dev`).

```env
VITE_API_URL=http://localhost:3000
```

### `.env.production`
Production mode'da ishlatiladi (`pnpm build:prod`).

```env
VITE_API_URL=https://api.yourdomain.com
```

### `.env` (Optional)
Local development uchun custom sozlamalar (git-ga qo'shilmadi).

## Mode'larni ishlatish

### Development Mode
```bash
pnpm dev
```
- `.env.development` fayldan sozlamalar olinadi
- Local backend (`http://localhost:3000`) bilan ishlaydi
- Hot Module Replacement (HMR) enabled
- Source maps enabled

### Production Build (Development)
```bash
pnpm build
```
- `.env.development` fayldan sozlamalar olinadi
- Optimized build production-ready kodga o'xshash
- Build size minimal

### Production Build (Production)
```bash
pnpm build:prod
```
- `.env.production` fayldan sozlamalar olinadi
- Remote/live backend bilan ishlaydi
- Fully optimized va minified
- Source maps optional (o'chirilgan)

### Preview Production Build
```bash
pnpm preview
```
- Production buildni local'da test qilish
- Live API bilan ishlaydi (.env.production'dan)

## Environment Variables

### VITE_API_URL
Backend API'nin asosiy manzili.

**Development:**
```
http://localhost:3000
```

**Production:**
```
https://api.yourdomain.com
```

## Vite Environment Variables

Vite'da barcha environment variables `import.meta.env.*` orqali foydalanamiz:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

### Barcha mavjud variables:

```typescript
// Built-in
import.meta.env.MODE        // 'development' yoki 'production'
import.meta.env.DEV         // boolean: true if development
import.meta.env.PROD        // boolean: true if production
import.meta.env.SSR         // boolean: SSR-enabled

// Custom (bizning)
import.meta.env.VITE_API_URL // API base URL
```

## Custom Variables Qo'shish

Yangi environment variable qo'shish uchun:

1. `.env.development` va `.env.production`'ga qo'shing (VITE_ prefiksi bilan):
```env
VITE_FEATURE_FLAG=true
VITE_LOG_LEVEL=debug
```

2. Typescript type checking uchun `vite-env.d.ts` ga qo'shing:
```typescript
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_FEATURE_FLAG?: string;
  readonly VITE_LOG_LEVEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

3. Kodni'da ishlatish:
```typescript
const featureFlag = import.meta.env.VITE_FEATURE_FLAG === 'true';
const logLevel = import.meta.env.VITE_LOG_LEVEL || 'info';
```

## Git Configuration

Development va production uchun alohida `.env` fayllar lokali o'rnatish:

```bash
# Development
cp .env.development .env

# Production (deploy qilishdan oldin)
cp .env.production .env
```

`.env` fayli `.gitignore`'ga qo'shilgan, shuning uchun u git'ga qo'shilmaydi.

## Docker/Deployment

Deployment'da environment variables CLI orqali o'rnatish:

```bash
# Docker
docker run -e VITE_API_URL=https://api.yourdomain.com app

# Environment variable
VITE_API_URL=https://api.yourdomain.com pnpm build:prod

# .env file
echo "VITE_API_URL=https://api.yourdomain.com" > .env.production
```

## Troubleshooting

### "VITE_* is undefined" xatoligi

```typescript
// ❌ Noto'g'ri
if (import.meta.env.VITE_FEATURE_FLAG) { }

// ✅ To'g'ri
if (import.meta.env.VITE_FEATURE_FLAG === 'true') { }
```

### Environment variables o'zgarsa

Vite server'ni qayta ishga tushiring:
```bash
pnpm dev
```

### Production mode'da local API
`.env.production` ni o'zgartirib, local URL ni qo'ying:
```env
VITE_API_URL=http://localhost:3000
```

Keyin rebuild qiling:
```bash
pnpm build:prod
```

---

Qo'shimcha: [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
