import { shoppegoClient } from '@api/shoppegoClient';
import type { ShoppegoCollection, ShoppegoCollectionDetail } from '@models/shoppego';
import { assertCollectionDetail, assertCollectionList } from '@utils/validators';
import { ProductService } from './ProductService';

export class CollectionService {
  static async list(): Promise<ShoppegoCollection[]> {
    const collections = await shoppegoClient.getData<ShoppegoCollection[]>('/collections');
    assertCollectionList(collections);
    return collections;
  }

  static async getBySlug(slug: string): Promise<ShoppegoCollectionDetail> {
    const collection = await shoppegoClient.getData<ShoppegoCollectionDetail>(`/collections/${encodeURIComponent(slug)}`);
    assertCollectionDetail(collection);
    return this.withHostedProductFallback(collection);
  }

  private static async withHostedProductFallback(collection: ShoppegoCollectionDetail): Promise<ShoppegoCollectionDetail> {
    if (collection.products.length > 0 || !collection.url) {
      return collection;
    }

    const productSlugs = await this.getHostedCategoryProductSlugs(collection.url);

    if (productSlugs.length === 0) {
      return collection;
    }

    const products = await Promise.all(
      productSlugs.map((slug) => ProductService.getBySlug(slug).catch(() => null))
    );

    return {
      ...collection,
      products: products.filter((product) => product !== null)
    };
  }

  private static async getHostedCategoryProductSlugs(url: string): Promise<string[]> {
    try {
      const response = await fetch(url, {
        headers: { Accept: 'text/html' }
      });

      if (!response.ok) {
        return [];
      }

      const html = await response.text();
      const matches = html.matchAll(/href=["'][^"']*\/products\/([^"'/?#]+)[^"']*["']/g);
      const slugs = Array.from(matches, (match) => decodeURIComponent(match[1]));

      return [...new Set(slugs)];
    } catch {
      return [];
    }
  }
}
