/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SHOPPEGO_API_BASE_URL: string;
  readonly PUBLIC_SHOPPEGO_STOREFRONT_TOKEN: string;
  readonly PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
