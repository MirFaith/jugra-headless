# Release And Deployment

This document is the release checklist for the Jugra Headless Storefront.

## Preflight

Before publishing, confirm:

- `.env` exists locally and contains the correct Shoppego API base URL and storefront token.
- `PUBLIC_SITE_URL` is set to the production URL for production builds.
- `npm run build` completes without type or rendering errors.
- `/categories/hot-items` renders the expected products after the collection fallback runs.
- checkout redirects to the hosted Shoppego checkout URL.
- product detail pages can add products and variants to cart.

## Netlify Setup

Create a Netlify site from the GitHub repository.

Use:

```text
Build command: npm run build
Publish directory: dist
Node version: 20
```

Configure environment variables:

```env
PUBLIC_SHOPPEGO_API_BASE_URL=https://your-store.shoppegram.dev/api/v1
PUBLIC_SHOPPEGO_STOREFRONT_TOKEN=your_publishable_storefront_token
PUBLIC_SITE_URL=https://your-site.netlify.app
```

The storefront token is publishable for browser storefront use, but it should still live in deployment settings instead of being hardcoded into source files.

`netlify.toml` sets `SECRETS_SCAN_OMIT_KEYS` for `PUBLIC_SHOPPEGO_API_BASE_URL` and `PUBLIC_SHOPPEGO_STOREFRONT_TOKEN`. These values are intentionally public storefront runtime settings and can appear in browser assets. Do not add private admin tokens to those public variables.

## Build Output

The project uses Astro static output. During the build, Astro fetches store data, menus, collections, and products from the Shoppego API and writes static HTML into `dist`.

Client-side JavaScript is still used for:

- cart drawer state
- cart page quantity updates
- checkout submission
- search modal behavior
- product variant and option selection

## Category Compatibility Fallback

Some legacy Shoppego hosted category pages can show products before the documented Headless API collection detail endpoint returns those memberships. The storefront handles that by:

1. fetching `/collections/{slug}` from the Headless API
2. returning those products when the API provides them
3. reading the hosted category URL only when the API product list is empty
4. extracting product slugs from hosted `/products/{slug}` links
5. hydrating each product through `/products/{slug}` from the Headless API

This keeps the local and Netlify storefront aligned with the live Shoppego theme without replacing product data or checkout behavior with scraped content.

## GitHub Release Checklist

Use this checklist before merging or tagging a release:

- Run `npm run build`.
- Open the local preview and verify homepage, products, categories, cart, checkout, and 404.
- Confirm `.env` is not committed.
- Commit source, docs, and config changes.
- Push to GitHub.
- Confirm Netlify deploy logs show `npm run build` success.
- Confirm production category pages show the same products as the hosted Shoppego theme.

## Rollback

If a deployment fails, use Netlify deploy rollback to restore the previous successful deploy. Because the app is static, rollback does not affect Shoppego product, order, customer, or checkout data.
