import { shoppegoClient } from '@api/shoppegoClient';
import type { ShoppegoStore } from '@models/shoppego';
import { assertStore } from '@utils/validators';

export class StoreService {
  static async getStore(): Promise<ShoppegoStore> {
    const store = await shoppegoClient.getData<ShoppegoStore>('/store');
    assertStore(store);
    return store;
  }
}
