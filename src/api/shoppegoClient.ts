import type { ShoppegoApiEnvelope, ShoppegoErrorEnvelope } from '@models/shoppego';
import { getRequiredPublicEnv } from '@utils/env';

export class ShoppegoApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors?: Record<string, string[]>;
  readonly retryAfter?: number;

  constructor(message: string, init: {
    status: number;
    code?: string;
    fieldErrors?: Record<string, string[]>;
    retryAfter?: number;
  }) {
    super(message);
    this.name = 'ShoppegoApiError';
    this.status = init.status;
    this.code = init.code;
    this.fieldErrors = init.fieldErrors;
    this.retryAfter = init.retryAfter;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  cacheTtlMs?: number;
}

const defaultCacheTtlMs = import.meta.env.DEV ? 0 : 60_000;
const memoryCache = new Map<string, { expiresAt: number; value: unknown }>();
const minGetIntervalMs = Number(import.meta.env.SHOPPEGO_API_MIN_INTERVAL_MS || (import.meta.env.DEV ? 0 : 550));
let nextGetRequestAt = 0;

function getBaseUrl(): string {
  return getRequiredPublicEnv('PUBLIC_SHOPPEGO_API_BASE_URL').replace(/\/+$/, '');
}

function getToken(): string {
  return getRequiredPublicEnv('PUBLIC_SHOPPEGO_STOREFRONT_TOKEN');
}

function buildUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${getBaseUrl()}${cleanPath}`;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function toApiError(response: Response, payload: unknown): ShoppegoApiError {
  const retryAfterHeader = response.headers.get('Retry-After');
  const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : undefined;
  const envelope = payload && typeof payload === 'object' ? payload as Partial<ShoppegoErrorEnvelope> : {};
  const apiError = envelope.error;
  const message = apiError?.message || fallbackMessage(response.status, retryAfter);

  return new ShoppegoApiError(message, {
    status: response.status,
    code: apiError?.code,
    fieldErrors: apiError?.field_errors,
    retryAfter
  });
}

function fallbackMessage(status: number, retryAfter?: number): string {
  if (status === 401) return 'The storefront token is missing or invalid.';
  if (status === 403) return 'This store plan does not include the storefront API.';
  if (status === 404) return 'The requested storefront resource was not found.';
  if (status === 409) return 'Some cart items are out of stock.';
  if (status === 415) return 'The API request content type is not supported.';
  if (status === 422) return 'The API request could not be validated.';
  if (status === 429) return `Too many requests. Try again in ${retryAfter || 'a few'} seconds.`;
  return 'The storefront API request failed.';
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms));
}

async function throttleGetRequests(method: string) {
  if (method !== 'GET' || minGetIntervalMs <= 0) return;

  const now = Date.now();
  const waitMs = Math.max(0, nextGetRequestAt - now);
  nextGetRequestAt = Math.max(now, nextGetRequestAt) + minGetIntervalMs;

  if (waitMs > 0) {
    await sleep(waitMs);
  }
}

function shouldRetry(response: Response, attempt: number): boolean {
  return attempt < 3 && (response.status === 429 || response.status >= 500);
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method || 'GET';
  const cacheKey = method === 'GET' ? buildUrl(path) : '';
  const cacheTtlMs = options.cacheTtlMs ?? defaultCacheTtlMs;

  if (cacheKey && cacheTtlMs > 0) {
    const cached = memoryCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value as T;
    }
  }

  let response: Response | null = null;
  let payload: unknown = null;

  for (let attempt = 0; attempt <= 3; attempt += 1) {
    await throttleGetRequests(method);

    response = await fetch(buildUrl(path), {
      method,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        'X-Storefront-Token': getToken()
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    payload = await readJson(response);

    if (!shouldRetry(response, attempt)) {
      break;
    }

    const retryAfter = Number(response.headers.get('Retry-After') || 0);
    await sleep(Math.max(retryAfter * 1000, minGetIntervalMs || 1000));
  }

  if (!response) {
    throw new Error('The storefront API request could not be completed.');
  }

  if (!response.ok) {
    throw toApiError(response, payload);
  }

  if (cacheKey && cacheTtlMs > 0) {
    memoryCache.set(cacheKey, {
      expiresAt: Date.now() + cacheTtlMs,
      value: payload
    });
  }

  return payload as T;
}

async function getData<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const envelope = await request<ShoppegoApiEnvelope<T>>(path, options);
  return envelope.data;
}

async function getEnvelope<T>(path: string, options: RequestOptions = {}): Promise<ShoppegoApiEnvelope<T>> {
  return request<ShoppegoApiEnvelope<T>>(path, options);
}

async function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body,
    cacheTtlMs: 0
  });
}

export const shoppegoClient = {
  getData,
  getEnvelope,
  post,
  request
};
