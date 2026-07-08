# API Layer

The Astro storefront never calls `fetch()` directly from UI components or pages.
All Shoppego Headless Storefront API calls flow through:

```text
Astro page/component
  -> service class
    -> shoppegoClient
      -> Shoppego Headless Storefront API
```

## Environment

Required public environment variables:

```env
PUBLIC_SHOPPEGO_API_BASE_URL=https://your-store.shoppegram.dev/api/v1
PUBLIC_SHOPPEGO_STOREFRONT_TOKEN=...
PUBLIC_SITE_URL=https://your-site.netlify.app
```

The storefront token is publishable according to the Headless API docs, but it should still be configured through environment variables instead of hardcoded in source files.

## Client

`src/api/shoppegoClient.ts` handles:

- base URL normalization
- `X-Storefront-Token` header
- JSON request/response parsing
- API error normalization
- `Retry-After` support for rate limits
- small in-memory cache for GET reads

## Services

- `StoreService`: store name, currency, online store URL
- `ProductService`: product listing, product detail, first available variant
- `CollectionService`: collection listing, collection detail, and hosted-category membership fallback
- `MenuService`: navigation menus
- `SearchService`: product search over catalog response until a dedicated API endpoint exists
- `CartService`: pure cart state calculations
- `CheckoutService`: hosted checkout creation

## Cart Model

The Headless Storefront API is stateless for carts. The browser owns cart state, then checkout sends the full line list:

```json
{
  "lines": [
    { "variant_id": 456, "quantity": 2 }
  ]
}
```

Shoppego recomputes prices server-side and returns a `checkout_url`.

## Collection Fallback

The documented collection detail endpoint can return an empty product list while the hosted Shoppego category page already shows products. When that happens, `CollectionService` uses the hosted category URL from the API response to read product slugs from `/products/{slug}` links, then hydrates those products through the official product detail endpoint.

This fallback is only for category membership compatibility. Product data and checkout still come from the Headless Storefront API.

## Search

The current Headless Storefront API documentation does not list a dedicated search endpoint. `SearchService` therefore searches over the current paginated product response. This preserves the Jugra search UX for the visible catalog page, but global full-catalog search should be upgraded if Shoppego exposes an official search endpoint.
