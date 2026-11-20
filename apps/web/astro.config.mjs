// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://photo.patriciobet.dev",
  siteLevelLocales: ["es", "en"],
  i18nDomains: {
    es: "https://photo.patriciobet.dev",
    en: "https://photo.patriciobet.dev/en",
  },
  trailingSlash: "ignore",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    react({
      refresh: true,
    }),
    mdx(),
    // Sitemap is generated manually via API routes
    // sitemap({
    //   i18n: {
    //     defaultLocale: "es",
    //     locales: {
    //       es: null,
    //       en: "en",
    //     },
    //   },
    // }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
  image: {
    domains: ["r2.patriciobet.dev"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "r2.patriciobet.dev",
        pathname: "/**",
      },
    ],
  },
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        target: "es2022",
      },
    },
    build: {
      rollupOptions: {
        external: ["astro"],
      },
    },
  },
});
