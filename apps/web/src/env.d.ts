/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CONTACT_FROM_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
