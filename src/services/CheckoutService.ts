import { shoppegoClient } from '@api/shoppegoClient';
import type { ShoppegoCheckout, ShoppegoCheckoutInput } from '@models/shoppego';
import { assertCheckout } from '@utils/validators';

export class CheckoutService {
  static async createCheckout(input: ShoppegoCheckoutInput): Promise<ShoppegoCheckout> {
    if (!input.lines.length) {
      throw new Error('Cannot create checkout with an empty cart.');
    }

    const checkout = await shoppegoClient.post<ShoppegoCheckout>('/checkout', input);
    assertCheckout(checkout);
    return checkout;
  }
}
