import { shoppegoClient } from '@api/shoppegoClient';
import type { ShoppegoApiEnvelope, ShoppegoProduct } from '@models/shoppego';
import { assertProduct, assertProductList } from '@utils/validators';

export class ProductService {
  static async list(page = 1): Promise<ShoppegoApiEnvelope<ShoppegoProduct[]>> {
    const envelope = await shoppegoClient.getEnvelope<ShoppegoProduct[]>(`/products?page=${page}`);
    assertProductList(envelope.data);
    return envelope;
  }

  static async listAll(): Promise<ShoppegoProduct[]> {
    const firstPage = await this.list(1);
    const products = [...firstPage.data];
    const lastPage = firstPage.meta?.last_page || 1;

    if (lastPage <= 1) {
      return products;
    }

    const remainingPages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) => this.list(index + 2))
    );

    remainingPages.forEach((page) => {
      products.push(...page.data);
    });

    return products;
  }

  static async getBySlug(slug: string): Promise<ShoppegoProduct> {
    const product = await shoppegoClient.getData<ShoppegoProduct>(`/products/${encodeURIComponent(slug)}`);
    assertProduct(product);
    return product;
  }

  static findFirstAvailableVariant(product: ShoppegoProduct) {
    return product.variants.find((variant) => variant.available) || product.variants[0] || null;
  }
}
