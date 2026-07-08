import { CartService } from '@services/CartService';
import type { AddToCartInput, CartState } from '@models/cart';

const storageKey = 'jugra-headless-cart';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function read(): CartState {
  if (!isBrowser()) return CartService.createEmptyCart();

  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) as CartState : CartService.createEmptyCart();
  } catch {
    return CartService.createEmptyCart();
  }
}

function write(cart: CartState): CartState {
  if (isBrowser()) {
    window.localStorage.setItem(storageKey, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('jugra:cart-updated', { detail: cart }));
  }

  return cart;
}

export const cartStore = {
  read,
  write,
  clear() {
    return write(CartService.createEmptyCart());
  },
  add(input: AddToCartInput) {
    return write(CartService.addLine(read(), input));
  },
  updateQuantity(variantId: number, quantity: number) {
    return write(CartService.updateQuantity(read(), variantId, quantity));
  },
  remove(variantId: number) {
    return write(CartService.removeLine(read(), variantId));
  }
};
