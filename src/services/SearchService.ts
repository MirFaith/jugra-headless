import { ProductService } from './ProductService';

export class SearchService {
  static async searchProducts(query: string, page = 1) {
    const normalizedQuery = query.trim().toLowerCase();
    const envelope = await ProductService.list(page);

    if (!normalizedQuery) {
      return envelope;
    }

    return {
      ...envelope,
      data: envelope.data.filter((product) => {
        return [
          product.name,
          product.slug,
          product.description || ''
        ].some((field) => field.toLowerCase().includes(normalizedQuery));
      })
    };
  }

  static async searchAllProducts(query: string) {
    const normalizedQuery = query.trim().toLowerCase();
    const products = await ProductService.listAll();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => {
      return [
        product.name,
        product.slug,
        product.description || ''
      ].some((field) => field.toLowerCase().includes(normalizedQuery));
    });
  }
}
