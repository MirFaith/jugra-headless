# Cart and checkout implementation

Shoppego Headless Storefront does not expose a long-lived server-side cart in the storefront API. The Jugra Astro storefront keeps the cart locally in the shopper browser and sends the final cart lines to Shoppego only when checkout starts.

## Browser cart

The local cart is stored in `localStorage` under `jugra-headless-cart`.

Each cart line stores the display data needed for the drawer:

- `variantId`
- `productId`
- `productSlug`
- `productName`
- `variantTitle`
- `image`
- `price`
- `compareAtPrice`
- `quantity`
- selected variant `options`

The implementation lives in:

- `src/services/CartService.ts` for pure cart operations.
- `src/stores/cartStore.ts` for browser persistence and cart update events.
- `src/components/layout/StorefrontShell.astro` for cart drawer rendering and checkout actions.

## Add to cart

Product pages render API product and variant data into the browser. When a shopper selects a variant and quantity, `ProductDetail.astro` calls:

```ts
cartStore.add({
  product,
  variant,
  quantity
});
```

The cart store writes the updated cart to `localStorage` and dispatches `jugra:cart-updated`. The shell listens for that event, re-renders the cart drawer, and updates the header cart count.

## Checkout

Checkout converts the local browser cart into the Shoppego checkout payload:

```json
{
  "lines": [
    {
      "variant_id": 123,
      "quantity": 2
    }
  ]
}
```

`CheckoutService.createCheckout()` posts that payload to:

```text
POST /checkout
```

If Shoppego accepts the cart, the API returns a `checkout_url`. The storefront redirects the shopper to that secure hosted checkout where shipping, discounts, tax, payment, and order creation are handled.

## Buy now

The Buy now button skips the local cart drawer and creates checkout with a single selected variant line:

```json
{
  "lines": [
    {
      "variant_id": 123,
      "quantity": 1
    }
  ]
}
```

This keeps Buy now fast while still using the same Headless API checkout endpoint.

## Important limitation

The documented checkout payload only includes `variant_id` and `quantity`. Product custom option fields are rendered and validated in the UI, but they are not sent to checkout until the API documents a supported custom option payload.
