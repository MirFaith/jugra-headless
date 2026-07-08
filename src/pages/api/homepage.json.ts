import type { APIRoute } from 'astro';
import { CollectionService, ProductService } from '@services/index';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [productEnvelope, collections] = await Promise.all([
    ProductService.list(1),
    CollectionService.list()
  ]);

  return new Response(JSON.stringify({
    products: productEnvelope.data.slice(0, 6).map((product) => ({
      name: product.name,
      slug: product.slug,
      price: product.price,
      compare_at_price_min: product.compare_at_price_min,
      compare_at_price_max: product.compare_at_price_max,
      price_varies: product.price_varies,
      available: product.available,
      featured_image: product.featured_image
    })),
    collections: collections.slice(0, 3).map((collection) => ({
      name: collection.name,
      slug: collection.slug
    }))
  }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
};
