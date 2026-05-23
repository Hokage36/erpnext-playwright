import { Page } from '@playwright/test';

export type FrappeFilterOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'like' | 'in';

export type FrappeFilterValue = string | number | boolean | null | Array<string | number | boolean>;

export type FrappeFilter = [string, FrappeFilterOperator, FrappeFilterValue];

type FrappeEnvelope<T> = {
  data: T;
};

type BrowserFetchSuccess = {
  ok: true;
  payload: unknown;
};

type BrowserFetchFailure = {
  ok: false;
  body: string;
  path: string;
  status: number;
  statusText: string;
};

type ResourceListOptions = {
  fields?: string[];
  filters?: FrappeFilter[];
  limit?: number;
  orderBy?: string;
};

async function fetchJson<T>(page: Page, path: string): Promise<T> {
  const result = (await page.evaluate(async (relativePath) => {
    const response = await fetch(relativePath, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
      method: 'GET',
    });

    const body = await response.text();

    if (!response.ok) {
      return {
        body,
        ok: false,
        path: relativePath,
        status: response.status,
        statusText: response.statusText,
      } satisfies BrowserFetchFailure;
    }

    try {
      return {
        ok: true,
        payload: JSON.parse(body),
      } satisfies BrowserFetchSuccess;
    } catch (error) {
      return {
        body,
        ok: false,
        path: relativePath,
        status: response.status,
        statusText: error instanceof Error ? error.message : 'Invalid JSON response',
      } satisfies BrowserFetchFailure;
    }
  }, path)) as BrowserFetchFailure | BrowserFetchSuccess;

  if (!result.ok) {
    throw new Error(
      `Frappe API request failed for ${result.path} with ${result.status} ${result.statusText}: ${result.body}`
    );
  }

  return result.payload as T;
}

function buildResourcePath(doctype: string, name?: string): string {
  const encodedDocType = encodeURIComponent(doctype);

  if (!name) {
    return `/api/resource/${encodedDocType}`;
  }

  return `/api/resource/${encodedDocType}/${encodeURIComponent(name)}`;
}

export async function getResource<T>(page: Page, doctype: string, name: string): Promise<T> {
  const response = await fetchJson<FrappeEnvelope<T>>(page, buildResourcePath(doctype, name));
  return response.data;
}

export async function listResources<T>(page: Page, doctype: string, options: ResourceListOptions = {}): Promise<T[]> {
  const params = new URLSearchParams();

  if (options.fields?.length) {
    params.set('fields', JSON.stringify(options.fields));
  }

  if (options.filters?.length) {
    params.set('filters', JSON.stringify(options.filters));
  }

  if (options.limit) {
    params.set('limit_page_length', String(options.limit));
  }

  if (options.orderBy) {
    params.set('order_by', options.orderBy);
  }

  const query = params.toString();
  const path = query ? `${buildResourcePath(doctype)}?${query}` : buildResourcePath(doctype);
  const response = await fetchJson<FrappeEnvelope<T[]>>(page, path);

  return response.data;
}

export async function waitForResource<T>(
  page: Page,
  doctype: string,
  name: string,
  timeoutMs = 30000,
  intervalMs = 1000
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      return await getResource<T>(page, doctype, name);
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(intervalMs);
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Timed out waiting for ${doctype} ${name}.`);
}

export async function waitForResources<T>(
  page: Page,
  doctype: string,
  options: ResourceListOptions,
  predicate: (items: T[]) => boolean,
  timeoutMs = 30000,
  intervalMs = 1000
): Promise<T[]> {
  const deadline = Date.now() + timeoutMs;
  let lastItems: T[] = [];
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      lastItems = await listResources<T>(page, doctype, options);

      if (predicate(lastItems)) {
        return lastItems;
      }
    } catch (error) {
      lastError = error;
    }

    await page.waitForTimeout(intervalMs);
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error(`Timed out waiting for ${doctype} resources that satisfy the requested condition.`);
}

export function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    let normalized = value.trim();

    if (normalized.includes(',') && normalized.includes('.')) {
      normalized = normalized.replace(/\./g, '').replace(',', '.');
    } else if (normalized.includes(',')) {
      normalized = normalized.replace(',', '.');
    }

    return normalized ? Number(normalized) : 0;
  }

  if (value === null || value === undefined) {
    return 0;
  }

  return Number(value);
}
