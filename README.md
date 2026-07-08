# Jugra Headless Storefront

Jugra Headless Storefront is an Astro implementation of the Jugra/Shoppego theme that reads store, menu, collection, product, cart, and checkout data from the Shoppego Headless Storefront API.

The goal of this project is to keep the existing storefront styling and layout familiar while replacing theme-bound data access with a clean headless architecture.

## What The Headless API Does

The Shoppego Headless Storefront API exposes storefront data over HTTP so the frontend can be built outside the hosted Shoppego theme engine.

In this project it is used for:

- store profile and currency data
- navigation menus
- product lists and product detail pages
- collections/categories
- local cart line validation
- hosted checkout creation

The cart itself is stateless. The browser stores cart lines locally, then sends variant IDs and quantities to the API when the customer checks out. Shoppego creates the hosted checkout and returns a checkout URL.

## Requirements

- Node.js 20
- npm
- a Shoppego storefront API base URL
- a Shoppego publishable storefront token

## Environment

Create a local `.env` file using `.env.example` as the template:

```env
PUBLIC_SHOPPEGO_API_BASE_URL=https://your-store.shoppegram.dev/api/v1
PUBLIC_SHOPPEGO_STOREFRONT_TOKEN=replace_with_publishable_storefront_token
PUBLIC_SITE_URL=http://localhost:4321
```

`PUBLIC_SHOPPEGO_API_BASE_URL` points to the Shoppego API version for the store.

`PUBLIC_SHOPPEGO_STOREFRONT_TOKEN` is sent as `X-Storefront-Token` on API requests.

`PUBLIC_SITE_URL` is used by Astro for canonical production output. Set it to the Netlify URL or custom domain before deploying.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the static site:

```bash
npm run build
```

Preview the built site:

```bash
npm run preview
```

## Project Structure

```text
src/api/          Low-level Shoppego API client
src/services/     Storefront service layer
src/types/        API and cart TypeScript models
src/utils/        Formatting, route, env, and validation helpers
src/stores/       Browser cart state
src/components/   Theme-matched UI components
src/pages/        Astro routes
docs/             Implementation and release notes
```

UI components and pages should call services instead of calling `fetch()` directly. This keeps API behavior, errors, caching, and fallbacks in one place.

## Routes

- `/` - homepage
- `/products` - product listing
- `/products/[slug]` - product detail
- `/categories` - collection listing
- `/categories/[slug]` - collection detail
- `/search` - storefront search UI
- `/cart` - full cart page
- `/checkout` - checkout handoff page
- `/account` and `/account/login` - customer placeholder pages
- `/pages` and `/pages/[slug]` - static information pages
- `/404` - not found page

## Important API Notes

The documented collection detail endpoint can return an empty product list even when the hosted Shoppego category page already shows products. To preserve the storefront experience, `CollectionService` first reads the official Headless API collection response. If it has no products and includes a hosted category URL, the service reads product links from the hosted category HTML and hydrates those products through the Headless API.

That fallback affects category membership only. Product names, prices, variants, and checkout still come from the Headless API.

The documented API does not currently include full customer account endpoints or a dedicated search endpoint. The project keeps customer pages as theme-compatible placeholders and implements search over available product API data.

## Netlify

Use these Netlify settings:

- build command: `npm run build`
- publish directory: `dist`
- Node version: `20`

Add these environment variables in Netlify:

```env
PUBLIC_SHOPPEGO_API_BASE_URL=https://your-store.shoppegram.dev/api/v1
PUBLIC_SHOPPEGO_STOREFRONT_TOKEN=your_publishable_storefront_token
PUBLIC_SITE_URL=https://your-site.netlify.app
```

`netlify.toml` omits `PUBLIC_SHOPPEGO_API_BASE_URL` and `PUBLIC_SHOPPEGO_STOREFRONT_TOKEN` from Netlify secrets scanning because those public storefront values are bundled into browser checkout code by design. Keep private admin/API tokens out of this project.

More deployment details are in `docs/release.md`.
