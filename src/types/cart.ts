import type { ShoppegoProduct, ShoppegoProductVariant } from './shoppego';

export interface CartLineOption {
  name: string;
  value: string;
}

export interface CartLine {
  variantId: number;
  productId: number;
  productSlug: string;
  productName: string;
  variantTitle: string;
  image: string | null;
  price: number;
  compareAtPrice: number | null;
  quantity: number;
  options: CartLineOption[];
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
