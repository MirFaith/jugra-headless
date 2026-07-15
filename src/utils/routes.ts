import type { ShoppegoMenuLink, ShoppegoProduct, ShoppegoCollection } from '@models/shoppego';

export function productPath(productOrSlug: ShoppegoProduct | string): string {
  const slug = typeof productOrSlug === 'string' ? productOrSlug : productOrSlug.slug;
  return `/products/${encodeURIComponent(slug)}`;
}

export function collectionPath(collectionOrSlug: ShoppegoCollection | string): string {
  const slug = typeof collectionOrSlug === 'string' ? collectionOrSlug : collectionOrSlug.slug;
  return `/categories/${encodeURIComponent(slug)}`;
}

export function pagePath(slug: string): string {
  return `/pages/${encodeURIComponent(slug)}`;
}

export function normalizeMenuUrl(link: ShoppegoMenuLink): string {
  if (!link.url) return '#';
  if (link.type === 'collection' && link.handle) return collectionPath(link.handle);
  if (link.type === 'product' && link.handle) return productPath(link.handle);
  if (link.type === 'page' && link.handle) return pagePath(link.handle);
  if (link.url.startsWith('/')) return link.url;

  try {
    return new URL(link.url).pathname || '/';
  } catch {
    return link.url;
  }
}
