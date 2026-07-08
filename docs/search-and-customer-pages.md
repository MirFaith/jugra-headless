# Search and customer pages

## Search

The storefront now has a dedicated `/search` route. The search modal submits to:

```text
/search?q=keyword
```

`SearchService.searchAllProducts()` fetches every product page through `ProductService.listAll()` and filters the full catalog by:

- product name
- product slug
- product description

The Headless Storefront API documentation currently does not list a dedicated search endpoint. This means search is implemented in Astro using catalog data from the API. If Shoppego adds a search endpoint later, only `SearchService` should need to change.

## Cart and checkout routes

Menu links for `/cart` and `/checkout` now resolve to Astro pages:

- `/cart` opens the same cart drawer used by the header cart icon.
- `/checkout` reads the browser cart, creates a Shoppego checkout, and redirects to `checkout_url`.

Both routes use the same local cart and checkout service as product pages.

## Customer account routes

The documented Headless Storefront API does not expose customer account login, registration, or session endpoints. The headless storefront therefore provides account bridge pages:

- `/account`
- `/account/login`

Those pages link to the hosted Shoppego account URLs from the API store payload.

## CMS-style page routes

The live menus include page-style URLs such as `/pages` and `/pages/sales-page`. The documented Headless Storefront API does not expose CMS page body content, so the Astro app includes styled fallback pages in `src/data/staticPages.ts`.

When Shoppego exposes page content through the API, replace the static page data with a `PageService` that fetches live page content.
