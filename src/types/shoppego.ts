export interface ShoppegoCurrency {
  code: string;
  symbol: string;
  decimal_digits: number;
  thousand_separator: string;
  locale?: string;
}

export interface ShoppegoStore {
  name: string;
  description?: string | null;
  checkout_enabled?: boolean;
  checkout_minimum_purchase?: number;
  category_featured?: string | null;
  currency: ShoppegoCurrency;
  online_store_url: string;
}

export interface ShoppegoPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ShoppegoApiEnvelope<T> {
  data: T;
  meta?: ShoppegoPaginationMeta;
}

export interface ShoppegoFieldErrors {
  [field: string]: string[];
}

export interface ShoppegoErrorEnvelope {
  error: {
    code?: string;
    message: string;
    field_errors?: ShoppegoFieldErrors;
  };
}

export interface ShoppegoOptionValue {
  name: string;
  metadata: null | {
    type?: string;
    colors?: string[];
    [key: string]: unknown;
  };
}

export type ShoppegoOptionType =
  | 'radio'
  | 'select'
  | 'swatch'
  | 'date'
  | 'datetime'
  | 'input'
  | 'textarea'
  | string;

export interface ShoppegoProductOption {
  id: number;
  name: string;
  type: ShoppegoOptionType;
  required: boolean;
  values: ShoppegoOptionValue[];
}

export interface ShoppegoProductVariant {
  id: number;
  title: string;
  sku: string | null;
  price: number;
  compare_at_price: number | null;
  available: boolean;
  requires_shipping: boolean;
  manage_stock?: boolean;
  inventory_quantity?: number | null;
  fixed_quantity?: number | null;
  image?: string | null;
  options: Record<string, string>;
}

export interface ShoppegoProductReview {
  customer_name: string | null;
  variant: string | null;
  rating: number;
  description: string;
  created_at: string;
}

export interface ShoppegoWholesalePrice {
  minimum_quantity: number;
  maximum_quantity: number | null;
  unit_price: number;
  saving_per_unit: number;
}

export interface ShoppegoProductCollection {
  id: number;
  name: string;
  slug: string;
}

export interface ShoppegoBundleProduct {
  id: number;
  name: string;
  featured_image: string | null;
  images: string[];
  selected_or_first_available_variant: ShoppegoProductVariant | null;
  variants: ShoppegoProductVariant[];
}

export interface ShoppegoProduct {
  id: number;
  name: string;
  slug: string;
  url: string;
  description: string | null;
  price: number;
  compare_at_price_min: number | null;
  compare_at_price_max: number | null;
  price_varies: boolean;
  available: boolean;
  featured_image: string | null;
  images: string[];
  has_options: boolean;
  has_only_default_variant?: boolean;
  is_bundle?: boolean;
  metafields?: Record<string, unknown>;
  selected_or_first_available_variant?: ShoppegoProductVariant | null;
  options: ShoppegoProductOption[];
  variants: ShoppegoProductVariant[];
  collections?: ShoppegoProductCollection[];
  reviews?: ShoppegoProductReview[];
  wholesale_prices?: ShoppegoWholesalePrice[];
  bundle_products?: ShoppegoBundleProduct[];
  related?: ShoppegoProduct[] | null;
}

export interface ShoppegoCollection {
  id: number;
  name: string;
  slug: string;
  url: string;
}

export interface ShoppegoCollectionDetail extends ShoppegoCollection {
  description?: string | null;
  products: ShoppegoProduct[];
}

export type ShoppegoMenuLinkType =
  | 'home'
  | 'product'
  | 'products'
  | 'collection'
  | 'collections'
  | 'page'
  | 'pages'
  | 'external'
  | 'link'
  | string;

export interface ShoppegoMenuLink {
  title: string;
  url: string;
  type: ShoppegoMenuLinkType;
  handle: string | null;
  links: ShoppegoMenuLink[];
}

export interface ShoppegoMenu {
  title: string;
  handle: string;
  links: ShoppegoMenuLink[];
}

export interface ShoppegoPageSummary {
  id: number;
  title: string;
  slug: string;
  url: string;
}

export interface ShoppegoPage extends ShoppegoPageSummary {
  body: string | null;
  image: string | null;
  template: string | null;
  metafields: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ShoppegoCheckoutLineInput {
  variant_id: number;
  quantity: number;
}

export interface ShoppegoCheckoutInput {
  lines: ShoppegoCheckoutLineInput[];
  discount?: string;
  note?: string;
}

export interface ShoppegoCheckoutLine {
  variant_id: number;
  quantity: number;
  available: boolean;
  quantity_available?: number;
}

export interface ShoppegoCheckout {
  checkout_url: string;
  currency: string;
  subtotal: number;
  total: number;
  tax: number;
  lines: ShoppegoCheckoutLine[];
}

export interface ShoppegoRecentSale {
  customer: {
    name: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    country_code: string | null;
  };
  product: {
    name: string;
    url: string | null;
    featured_image: string | null;
  };
  total_order_price: string | null;
  created_at: string;
}
