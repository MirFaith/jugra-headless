import { shoppegoClient } from '@api/shoppegoClient';
import type { ShoppegoPage, ShoppegoPageSummary } from '@models/shoppego';
import { assertPage, assertPageList } from '@utils/validators';

export class PageService {
  static async list(): Promise<ShoppegoPageSummary[]> {
    const pages = await shoppegoClient.getData<ShoppegoPageSummary[]>('/pages');
    assertPageList(pages);
    return pages;
  }

  static async getBySlug(slug: string): Promise<ShoppegoPage> {
    const page = await shoppegoClient.getData<ShoppegoPage>(`/pages/${encodeURIComponent(slug)}`);
    assertPage(page);
    return page;
  }
}
