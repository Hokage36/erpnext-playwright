import { expect, Page } from '@playwright/test';

import { ErpDocumentPage } from '../pages/erp-document.page';

type CurrentFormState = {
  docstatus?: number;
  name?: string;
};

type CurrentFormItemMutation = {
  itemCode?: string | null;
  qty?: number | string | null;
  rate?: number | string | null;
  targetWarehouse?: string | null;
  valuationRate?: number | string | null;
  warehouse?: string | null;
};

export type CurrentFormDocumentMutation = {
  firstItem?: CurrentFormItemMutation;
  setWarehouse?: string | null;
  toWarehouse?: string | null;
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

export async function mutateCurrentFormDocument(
  page: Page,
  mutation: CurrentFormDocumentMutation
): Promise<void> {
  await page.evaluate(async (nextMutation) => {
    const appWindow = window as typeof window & {
      cur_frm?: {
        dirty: () => void;
        doc: {
          doctype: string;
          items?: Array<{
            doctype: string;
            name: string;
          }>;
          name: string;
        };
        refresh_field: (fieldname: string) => void;
      };
      frappe?: {
        model?: {
          set_value: (doctype: string, name: string, fieldname: string, value: unknown) => Promise<unknown> | unknown;
        };
      };
    };

    const form = appWindow.cur_frm;
    const setValue = appWindow.frappe?.model?.set_value;

    if (!form || !setValue) {
      throw new Error('ERPNext form context is not available for client-side document mutation.');
    }

    const fieldsToRefresh = new Set<string>(['items']);

    if (nextMutation.toWarehouse !== undefined) {
      await setValue(form.doc.doctype, form.doc.name, 'to_warehouse', nextMutation.toWarehouse);
      fieldsToRefresh.add('to_warehouse');
    }

    if (nextMutation.setWarehouse !== undefined) {
      await setValue(form.doc.doctype, form.doc.name, 'set_warehouse', nextMutation.setWarehouse);
      fieldsToRefresh.add('set_warehouse');
    }

    const firstItem = form.doc.items?.[0];
    if (firstItem && nextMutation.firstItem) {
      if (nextMutation.firstItem.itemCode !== undefined) {
        await setValue(firstItem.doctype, firstItem.name, 'item_code', nextMutation.firstItem.itemCode);
      }

      if (nextMutation.firstItem.qty !== undefined) {
        await setValue(firstItem.doctype, firstItem.name, 'qty', nextMutation.firstItem.qty);
      }

      if (nextMutation.firstItem.rate !== undefined) {
        await setValue(firstItem.doctype, firstItem.name, 'rate', nextMutation.firstItem.rate);
      }

      if (nextMutation.firstItem.warehouse !== undefined) {
        await setValue(firstItem.doctype, firstItem.name, 'warehouse', nextMutation.firstItem.warehouse);
      }

      if (nextMutation.firstItem.targetWarehouse !== undefined) {
        await setValue(firstItem.doctype, firstItem.name, 't_warehouse', nextMutation.firstItem.targetWarehouse);
      }

      if (nextMutation.firstItem.valuationRate !== undefined) {
        await setValue(firstItem.doctype, firstItem.name, 'valuation_rate', nextMutation.firstItem.valuationRate);
      }
    }

    for (const fieldname of fieldsToRefresh) {
      form.refresh_field(fieldname);
    }

    form.dirty();
  }, mutation);

  await page.waitForTimeout(500);
}
