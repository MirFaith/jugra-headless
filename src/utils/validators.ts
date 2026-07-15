import type {
  ShoppegoCheckout,
  ShoppegoCollection,
  ShoppegoCollectionDetail,
  ShoppegoMenu,
  ShoppegoPage,
  ShoppegoPageSummary,
  ShoppegoProduct,
  ShoppegoStore
} from '@models/shoppego';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function hasArray(value: Record<string, unknown>, key: string): boolean {
  return Array.isArray(value[key]);
}

export function assertStore(value: unknown): asserts value is ShoppegoStore {
  if (!isRecord(value) || !isString(value.name) || !isRecord(value.currency)) {
    throw new Error('Invalid store response from Shoppego API.');
  }
}

export function assertProduct(value: unknown): asserts value is ShoppegoProduct {
  if (
    !isRecord(value) ||
    !isNumber(value.id) ||
    !isString(value.name) ||
    !isString(value.slug) ||
    !isNumber(value.price) ||
    typeof value.available !== 'boolean' ||
    !hasArray(value, 'options') ||
    !hasArray(value, 'variants')
  ) {
    throw new Error('Invalid product response from Shoppego API.');
  }
}

export function assertProductList(value: unknown): asserts value is ShoppegoProduct[] {
  if (!Array.isArray(value)) {
    throw new Error('Invalid product list response from Shoppego API.');
  }

  value.forEach(assertProduct);
}

export function assertCollection(value: unknown): asserts value is ShoppegoCollection {
  if (!isRecord(value) || !isNumber(value.id) || !isString(value.name) || !isString(value.slug)) {
    throw new Error('Invalid collection response from Shoppego API.');
  }
}

export function assertCollectionList(value: unknown): asserts value is ShoppegoCollection[] {
  if (!Array.isArray(value)) {
    throw new Error('Invalid collection list response from Shoppego API.');
  }

  value.forEach(assertCollection);
}

export function assertCollectionDetail(value: unknown): asserts value is ShoppegoCollectionDetail {
  assertCollection(value);

  if (!isRecord(value) || !hasArray(value, 'products')) {
    throw new Error('Invalid collection detail response from Shoppego API.');
  }
}

export function assertMenuList(value: unknown): asserts value is ShoppegoMenu[] {
  if (!Array.isArray(value)) {
    throw new Error('Invalid menu response from Shoppego API.');
  }
}

export function assertPageSummary(value: unknown): asserts value is ShoppegoPageSummary {
  if (!isRecord(value) || !isNumber(value.id) || !isString(value.title) || !isString(value.slug)) {
    throw new Error('Invalid page response from Shoppego API.');
  }
}

export function assertPageList(value: unknown): asserts value is ShoppegoPageSummary[] {
  if (!Array.isArray(value)) {
    throw new Error('Invalid page list response from Shoppego API.');
  }

  value.forEach(assertPageSummary);
}

export function assertPage(value: unknown): asserts value is ShoppegoPage {
  assertPageSummary(value);

  if (!isRecord(value) || !('body' in value)) {
    throw new Error('Invalid page detail response from Shoppego API.');
  }
}

export function assertCheckout(value: unknown): asserts value is ShoppegoCheckout {
  if (!isRecord(value) || !isString(value.checkout_url) || !isNumber(value.total)) {
    throw new Error('Invalid checkout response from Shoppego API.');
  }
}
