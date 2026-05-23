import { Page } from '@playwright/test';

import { masterData } from '../data/master-data';
import { DeliveryNotePage } from '../pages/selling/delivery-note.page';
import { SalesInvoicePage } from '../pages/selling/sales-invoice.page';
import { QuotationPage } from '../pages/selling/quotation.page';
import { SalesOrderPage } from '../pages/selling/sales-order.page';
import { SalesReturnPage } from '../pages/selling/sales-return.page';
import { StockEntryPage } from '../pages/stock/stock-entry.page';
import { tomorrowErpDate } from '../utils/date';

export { sellingInvalidValues, sellingNewDocumentUrlPatterns } from '../data/master-data';
export { expectDraftOrUnsavedDocument, expectUnsavedNewDocument } from './document-state-helpers';
export { mutateCurrentFormDocument as mutateCurrentFormSellingDocument } from './document-state-helpers';

export async function openDeliveryNoteDraftFromSalesOrder(options: {
  deliveryNotePage: DeliveryNotePage;
  page: Page;
  salesOrderPage: SalesOrderPage;
  quantity?: string;
}): Promise<void> {
  await options.salesOrderPage.createSalesOrder({
    customerName: masterData.customerName,
    deliveryDate: tomorrowErpDate(),
    itemCode: masterData.itemCode,
    quantity: options.quantity ?? masterData.defaultQuantity,
    warehouseName: masterData.warehouseName,
  });

  await options.deliveryNotePage.openFromSalesOrder();
  await options.page.waitForURL(/\/app\/delivery-note\//, { timeout: 15000 });
  await options.deliveryNotePage.saveUntilSaved(/\/app\/delivery-note\/(?!new-delivery-note-)/);
}

export async function openQuotationDraft(options: {
  page: Page;
  quotationPage: QuotationPage;
}): Promise<void> {
  await options.quotationPage.fillQuotationForm({
    customerName: masterData.customerName,
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    warehouseName: masterData.warehouseName,
  });

  await options.page.waitForURL(/\/app\/quotation\//, { timeout: 15000 });
  await options.quotationPage.saveUntilSaved(/\/app\/quotation\/(?!new-quotation-)/);
}

export async function openSalesOrderDraft(options: {
  salesOrderPage: SalesOrderPage;
}): Promise<void> {
  await options.salesOrderPage.fillSalesOrderForm({
    customerName: masterData.customerName,
    deliveryDate: tomorrowErpDate(),
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    warehouseName: masterData.warehouseName,
  });

  await options.salesOrderPage.saveUntilSaved(/\/app\/sales-order\/(?!new-sales-order-)/);
}

export async function openSalesInvoiceDraftFromSalesOrder(options: {
  deliveryNotePage: DeliveryNotePage;
  page: Page;
  salesInvoicePage: SalesInvoicePage;
  salesOrderPage: SalesOrderPage;
  stockEntryPage: StockEntryPage;
}): Promise<void> {
  await options.stockEntryPage.createStockEntry({
    stockEntryType: masterData.stockEntryType,
    itemCode: masterData.itemCode,
    quantity: masterData.stockReconciliationQuantity,
    warehouseName: masterData.warehouseName,
  });
  await options.stockEntryPage.submit();
  await options.stockEntryPage.dismissMessageDialogIfPresent();

  await openDeliveryNoteDraftFromSalesOrder(options);
  await options.deliveryNotePage.submit();
  await options.deliveryNotePage.dismissMessageDialogIfPresent();
  await options.salesInvoicePage.openFromDeliveryNote();
  await options.page.waitForURL(/\/app\/sales-invoice\//, { timeout: 15000 });
  await options.salesInvoicePage.saveUntilSaved(/\/app\/sales-invoice\/(?!new-sales-invoice-)/);
}

export async function openSalesReturnDraftFromDeliveryNote(options: {
  deliveryNotePage: DeliveryNotePage;
  page: Page;
  salesOrderPage: SalesOrderPage;
  salesReturnPage: SalesReturnPage;
  quantity?: string;
}): Promise<{ originalDeliveryNoteName: string }> {
  await openDeliveryNoteDraftFromSalesOrder(options);
  await options.deliveryNotePage.submit();
  await options.deliveryNotePage.dismissMessageDialogIfPresent();
  await options.page.waitForFunction(() => {
    const appWindow = window as typeof window & {
      cur_frm?: {
        doc?: {
          docstatus?: number;
        };
      };
    };

    return appWindow.cur_frm?.doc?.docstatus === 1;
  });

  const originalDeliveryNoteName = options.deliveryNotePage.currentDocumentName();
  await options.salesReturnPage.openFromSubmittedDeliveryNote(originalDeliveryNoteName);

  return { originalDeliveryNoteName };
}
