import { expect, Page } from '@playwright/test';

import { ErpDocumentPage } from '../pages/erp-document.page';

type CurrentFormState = {
  docstatus?: number;
  name?: string;
};

async function getCurrentFormState(page: Page): Promise<CurrentFormState | null> {
  return page
    .evaluate(() => {
      const appWindow = window as typeof window & {
        cur_frm?: {
          doc?: CurrentFormState;
        };
      };

      const document = appWindow.cur_frm?.doc;
      if (!document) {
        return null;
      }

      return {
        docstatus: document.docstatus,
        name: document.name,
      };
    })
    .catch(() => null);
}

export async function expectUnsavedNewDocument(
  page: Page,
  formPage: ErpDocumentPage,
  urlPattern: RegExp
): Promise<void> {
  await expect(page).toHaveURL(urlPattern);
  expect(() => formPage.currentDocumentName()).toThrow();
}

export async function expectDraftOrUnsavedDocument(
  page: Page,
  formPage: ErpDocumentPage,
  doctypeOrUrlPattern: string | RegExp,
  maybeUrlPattern?: RegExp
): Promise<void> {
  const urlPattern = doctypeOrUrlPattern instanceof RegExp ? doctypeOrUrlPattern : maybeUrlPattern;

  if (!urlPattern) {
    throw new Error('A URL pattern is required to validate the current document state.');
  }

  const formState = await getCurrentFormState(page);

  if (formState?.name && !String(formState.name).startsWith('new-')) {
    expect(formState.docstatus ?? 0).toBe(0);
    return;
  }

  await expectUnsavedNewDocument(page, formPage, urlPattern);
}
