# apps/web — Astro public site

El sitio público de la fotografía y video de Patricio Betancourt.

## Estructura

```
src/
├── components/    # React islands + Astro components
├── i18n/          # Translations
├── layouts/       # Base layout
├── pages/         # Route-based pages (ES + EN)
├── styles/        # CSS design tokens
└── env.d.ts       # TypeScript declarations
public/            # Static assets (robots.txt, favicon, pagefind)
```

## Desarrollo

```bash
pnpm dev          # Inicia el servidor de desarrollo
pnpm build        # Construye el sitio estático
pnpm preview      # Previsualiza la build
```

## i18n

- ES es el idioma principal (sin prefijo).
- EN tiene prefijo `/en/`.
- Si una traducción EN falta, la página EN no se genera.
- Los textos están en `src/i18n/translations.ts`.

## SEO

- Sitemaps generados dinámicamente: pages, images, videos.
- RSS feed en `/rss.xml` y `/en/rss.xml`.
- Robots.txt en `/public/robots.txt`.
- hreflang en todas las páginas.
- JSON-LD en todas las páginas.

## Pagefind

Después de construir, ejecutar:

```bash
npx pagefind --source dist/ --output-path public/pagefind
```

Esto genera los archivos de búsqueda en `public/pagefind/`.
