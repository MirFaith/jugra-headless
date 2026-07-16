function splitSetCookie(header) {
  if (!header) return [];
  return header.split(/,(?=\s*[^;,]+=)/g).map((value) => value.trim()).filter(Boolean);
}

function getResponseCookies(headers) {
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie();
  }

  return splitSetCookie(headers.get('set-cookie'));
}

function cookieHeaderFromSetCookies(setCookies) {
  return setCookies
    .map((cookie) => cookie.split(';')[0])
    .filter(Boolean)
    .join('; ');
}

function extractCsrfToken(html) {
  const match = html.match(/name=["']_token["'][^>]*value=["']([^"']+)["']/i);
  return match?.[1] || '';
}

function normalizeHostedUrl(value) {
  const url = new URL(value);
  if (!/^https:$/.test(url.protocol)) {
    throw new Error('Hosted product URL must use HTTPS.');
  }
  return url;
}

async function createBundleCheckout(request) {
  const contentType = request.headers.get('content-type') || '';
  const input = contentType.includes('application/json')
    ? await request.json()
    : Object.fromEntries(await request.formData());
  const productUrl = normalizeHostedUrl(input.product_url);
  const productId = Number(input.product_id);
  const parentQuantity = Math.max(1, Math.floor(Number(input.quantity || 1)));
  const bundleProducts = Array.isArray(input.bundle_products)
    ? input.bundle_products
    : Object.entries(input).reduce((items, [key, value]) => {
      const match = key.match(/^bundle_products\[(\d+)\]\[(product_id|variant_id|quantity)\]$/);
      if (!match) return items;
      const index = Number(match[1]);
      const field = match[2];
      items[index] ||= {};
      items[index][field] = value;
      return items;
    }, []);

  if (!productId || !bundleProducts.length) {
    return Response.json({ error: 'Missing bundle product data.' }, { status: 422 });
  }

  const productResponse = await fetch(productUrl.toString(), {
    headers: {
      Accept: 'text/html'
    }
  });
  const productHtml = await productResponse.text();
  const token = extractCsrfToken(productHtml);
  const cookies = cookieHeaderFromSetCookies(getResponseCookies(productResponse.headers));

  if (!token || !cookies) {
    return Response.json({ error: 'Unable to prepare hosted bundle checkout.' }, { status: 502 });
  }

  const body = new URLSearchParams();
  body.set('_token', token);
  body.set('product_id', String(productId));
  body.set('express', '1');

  bundleProducts.forEach((item, index) => {
    body.set(`bundle_products[${index}][product_id]`, String(Number(item.product_id || item.productId)));
    body.set(`bundle_products[${index}][variant_id]`, String(Number(item.variant_id || item.variantId)));
    body.set(
      `bundle_products[${index}][quantity]`,
      String(Math.max(1, Math.floor(Number(item.quantity || 1))) * parentQuantity)
    );
  });

  const addUrl = new URL('/cart/add/bundle', productUrl.origin);
  const addResponse = await fetch(addUrl.toString(), {
    method: 'POST',
    redirect: 'manual',
    headers: {
      Accept: 'text/html',
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies,
      Referer: productUrl.toString()
    },
    body
  });

  const location = addResponse.headers.get('location');
  if (!location || !/\/checkouts\//.test(location)) {
    return Response.json({ error: 'Shoppego did not return a bundle checkout URL.' }, { status: 502 });
  }

  return Response.redirect(location, 303);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/bundle-checkout' && request.method === 'POST') {
      try {
        return await createBundleCheckout(request);
      } catch (error) {
        return Response.json({
          error: error instanceof Error ? error.message : 'Bundle checkout failed.'
        }, { status: 500 });
      }
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  }
};
