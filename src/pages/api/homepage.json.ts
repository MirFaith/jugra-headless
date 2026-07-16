import type { APIRoute } from 'astro';
import { CollectionService, ProductService, StoreService } from '@services/index';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [store, collections] = await Promise.all([
    StoreService.getStore(),
    CollectionService.list()
  ]);
  const featuredSlug = store.category_featured || '';
  const featuredCollection = featuredSlug
    ? await CollectionService.getBySlug(featuredSlug).catch(() => null)
    : null;
  const fallbackProducts = featuredCollection ? [] : (await ProductService.list(1)).data;
  const products = featuredCollection?.products || fallbackProducts;
  const heading = featuredCollection?.name || 'All Products';
  const actionUrl = featuredCollection ? `/categories/${encodeURIComponent(featuredCollection.slug)}` : '/products';
  const actionLabel = featuredCollection ? 'View Collection' : 'View All';

  return new Response(JSON.stringify({
    heading,
    action_url: actionUrl,
    action_label: actionLabel,
    products: products.slice(0, 6).map((product) => ({
      name: product.name,
      slug: product.slug,
      price: product.price,
      compare_at_price_min: product.compare_at_price_min,
      compare_at_price_max: product.compare_at_price_max,
      price_varies: product.price_varies,
      available: product.available,
      featured_image: product.featured_image
    })),
    collections: collections
      .filter((collection) => collection.slug !== featuredCollection?.slug)
      .slice(0, 3)
      .map((collection) => ({
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
