# 🚀 Деплой на хостинг

## Варіанти хостингу для Next.js:

### 1️⃣ **Vercel** (РЕКОМЕНДОВАНО - найпростіше)
Розробники Next.js, найкращій інтеграція, безкоштовний план.

**Кроки:**
1. Перейти на https://vercel.com
2. Sign Up → GitHub (підключити репо)
3. Import Project → выбрати `nagalka_next`
4. Deploy
5. Налаштувати домен в Vercel

### 2️⃣ **Railway** (Добре для стартапів)
https://railway.app

**Кроки:**
1. Увійти через GitHub
2. New Project → GitHub Repo
3. Auto-detect "Next.js"
4. Deploy
5. Добавити домен в Settings

### 3️⃣ **Netlify** (Для статичних сайтів)
https://netlify.com

**Вимагає:** Вивезти статичний build
```bash
npm run build
# Або в next.config.mjs додати: output: 'export'
```

### 4️⃣ **Собственный сервер (Linux VPS)**
Hetzner, Linode, DigitalOcean

---

## 📋 Підготовка до деплою:

### 1. Переконайтеся що build проходить:
```bash
npm run build
```

### 2. Перевірте що сайт працює:
```bash
npm run dev
# Відкрити http://localhost:3000
```

### 3. Оновіть next.config.mjs:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleapis.com',
      },
    ],
  },
  swcMinify: true,
  compress: true,
};

export default nextConfig;
```

### 4. Додайте .env.local (НЕ комітити!):
```
NEXT_PUBLIC_DOMAIN=nagalka-advokat.ua
NEXT_PUBLIC_API_URL=https://api.nagalka-advokat.ua
```

---

## 🌐 Налаштування домену:

### DNS записи (A record):
```
@ (або nagalka-advokat.ua) → IP адреса хостинга
www → CNAME → домен на хостингу
```

### SSL сертифікат:
- **Vercel/Railway/Netlify** → Автоматично (Let's Encrypt)
- **Власний сервер** → Certbot для Let's Encrypt

---

## 📊 Перевірка SEO перед деплоєм:

1. **Google Search Console:**
   - https://search.google.com/search-console
   - Додати сайт
   - Завантажити sitemap.xml
   - Перевірити robots.txt

2. **Lighthouse аудит:**
   ```bash
   # В Chrome DevTools: F12 → Lighthouse
   # Або в терміналі:
   npm install -g lighthouse
   lighthouse https://nagalka-advokat.ua --view
   ```

3. **Meta теги:**
   - ✅ OG tags (для соцмереж)
   - ✅ robots.txt
   - ✅ sitemap.xml
   - ✅ favicon.ico
   - ✅ structured data (schema.org)

---

## 🔒 Безпека перед продакшеном:

### .env.production
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.nagalka-advokat.ua
```

### Заборонити доступ до приватних файлів:
- Переконайтеся що `/api` routes не експортують секрети
- Приховати credentials в환境 variables

---

## ⚡ Оптимізація для продакшену:

### 1. Зменшити розмір бандлу:
```bash
npm run build
# Перевірити .next/static/chunks/
```

### 2. Оптимізувати зображення:
```bash
npm install next-image-export-optimizer
# Або використовувати <Image /> компонент з next/image
```

### 3. Кешування:
Додайте в next.config.mjs:
```javascript
headers: async () => {
  return [
    {
      source: '/assets/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
},
```

---

## 🎯 Рекомендований процес:

```
1. npm run build              # Перевірити build
2. npm run dev               # Перевірити локально
3. git push origin main      # Запушити на GitHub
4. Vercel auto-deploy        # Автоматично залітає
5. Перевірити на nagalka-advokat.ua
6. Google Search Console     # Індексація
7. Соціальні мережи          # Share посилання
```

---

## 📞 Потрібна допомога?

- Vercel Support: https://vercel.com/support
- Next.js Docs: https://nextjs.org/docs
- Google SEO: https://developers.google.com/search
