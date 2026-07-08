import { shoppegoClient } from '@api/shoppegoClient';
import type { ShoppegoMenu } from '@models/shoppego';
import { assertMenuList } from '@utils/validators';

export class MenuService {
  static async list(): Promise<ShoppegoMenu[]> {
    const menus = await shoppegoClient.getData<ShoppegoMenu[]>('/menus');
    assertMenuList(menus);
    return menus;
  }

  static async getByHandle(handle: string): Promise<ShoppegoMenu | null> {
    const menus = await this.list();
    return menus.find((menu) => menu.handle === handle) || null;
  }
}
