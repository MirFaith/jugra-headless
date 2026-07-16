import type { ShoppegoProduct, ShoppegoProductVariant } from './shoppego';

export interface CartLineOption {
  name: string;
  value: string;
}

export interface CartLine {
  type?: 'product' | 'bundle';
  variantId: number;
  productId: number;
  productUrl?: string;
  productSlug: string;
  productName: string;
  variantTitle: string;
  image: string | null;
  price: number;
  compareAtPrice: number | null;
  quantity: number;
  options: CartLineOption[];
  bundleProducts?: CartBundleProduct[];
}

export interface CartBundleProduct {
  productId: number;
  variantId: number;
  quantity: number;
}

export interface CartState {
  lines: CartLine[];
  updatedAt: string;
}

export interface AddToCartInput {
  product: ShoppegoProduct;
  variant: ShoppegoProductVariant;
  quantity: number;
}

export interface AddBundleToCartInput {
  product: ShoppegoProduct;
  quantity: number;
  bundleProducts: CartBundleProduct[];
}
