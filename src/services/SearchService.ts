import { ProductService } from './ProductService';

export class SearchService {
  static async searchProducts(query: string, page = 1) {
    return ProductService.search(query, page);
  }

  static async searchAllProducts(query: string) {
    const firstPage = await ProductService.search(query, 1);
    const products = [...firstPage.data];
    const lastPage = firstPage.meta?.last_page || 1;

    if (lastPage <= 1) {
      return products;
    }

    const remainingPages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) => ProductService.search(query, index + 2))
    );

    remainingPages.forEach((page) => {
      products.push(...page.data);
    });

    return products;
  }
}
