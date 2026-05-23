import { Page } from '@playwright/test';

import { masterData } from '../data/master-data';
import { PurchaseInvoicePage } from '../pages/buying/purchase-invoice.page';
import { PurchaseOrderPage } from '../pages/buying/purchase-order.page';
import { PurchaseReceiptPage } from '../pages/buying/purchase-receipt.page';
import { PurchaseReturnPage } from '../pages/buying/purchase-return.page';
import { RequestForQuotationPage } from '../pages/buying/request-for-quotation.page';
import { SupplierQuotationPage } from '../pages/buying/supplier-quotation.page';
import { tomorrowErpDate } from '../utils/date';

export { buyingInvalidValues, buyingNewDocumentUrlPatterns } from '../data/master-data';
export { expectDraftOrUnsavedDocument, expectUnsavedNewDocument } from './document-state-helpers';
export { mutateCurrentFormDocument as mutateCurrentFormBuyingDocument } from './document-state-helpers';

export async function openPurchaseReceiptDraftFromPurchaseOrder(options: {
  purchaseOrderPage: PurchaseOrderPage;
  purchaseReceiptPage: PurchaseReceiptPage;
  quantity?: string;
}): Promise<void> {
  await options.purchaseOrderPage.createPurchaseOrder({
    supplierName: masterData.supplierName,
    itemCode: masterData.itemCode,
    quantity: options.quantity ?? masterData.defaultQuantity,
    scheduleDate: tomorrowErpDate(),
    stockUom: masterData.stockUom,
    warehouseName: masterData.warehouseName,
  });

  await options.purchaseReceiptPage.openFromPurchaseOrder();
}

export async function openRequestForQuotationDraft(options: {
  requestForQuotationPage: RequestForQuotationPage;
}): Promise<void> {
  await options.requestForQuotationPage.fillRequestForQuotationForm({
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    stockUom: masterData.stockUom,
    supplierName: masterData.supplierName,
    warehouseName: masterData.warehouseName,
  });

  await options.requestForQuotationPage.saveUntilSaved(/\/app\/request-for-quotation\/(?!new-request-for-quotation-)/);
}

export async function openSupplierQuotationDraft(options: {
  supplierQuotationPage: SupplierQuotationPage;
}): Promise<void> {
  await options.supplierQuotationPage.fillSupplierQuotationForm({
    supplierName: masterData.supplierName,
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    warehouseName: masterData.warehouseName,
  });

  await options.supplierQuotationPage.saveUntilSaved(/\/app\/supplier-quotation\/(?!new-supplier-quotation-)/);
}

export async function openPurchaseOrderDraft(options: {
  purchaseOrderPage: PurchaseOrderPage;
}): Promise<void> {
  await options.purchaseOrderPage.fillPurchaseOrderForm({
    supplierName: masterData.supplierName,
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    scheduleDate: tomorrowErpDate(),
    stockUom: masterData.stockUom,
    warehouseName: masterData.warehouseName,
  });

  await options.purchaseOrderPage.saveUntilSaved(/\/app\/purchase-order\/(?!new-purchase-order-)/);
}

export async function openPurchaseInvoiceDraftFromPurchaseOrder(options: {
  purchaseOrderPage: PurchaseOrderPage;
  purchaseReceiptPage: PurchaseReceiptPage;
  purchaseInvoicePage: PurchaseInvoicePage;
}): Promise<void> {
  await openPurchaseReceiptDraftFromPurchaseOrder(options);
  await options.purchaseReceiptPage.saveAndSubmit();
  await options.purchaseReceiptPage.dismissMessageDialogIfPresent();
  await options.purchaseInvoicePage.openFromPurchaseReceipt();
}

export async function openPurchaseReturnDraftFromPurchaseReceipt(options: {
  page: Page;
  purchaseOrderPage: PurchaseOrderPage;
  purchaseReceiptPage: PurchaseReceiptPage;
  purchaseReturnPage: PurchaseReturnPage;
  quantity?: string;
}): Promise<{ originalPurchaseReceiptName: string }> {
  await openPurchaseReceiptDraftFromPurchaseOrder(options);
  await options.page.waitForURL(/\/app\/purchase-receipt\//, { timeout: 15000 });
  await options.purchaseReceiptPage.saveAndSubmit();
  await options.purchaseReceiptPage.dismissMessageDialogIfPresent();
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

  const originalPurchaseReceiptName = options.purchaseReceiptPage.currentDocumentName();
  await options.purchaseReturnPage.openFromSubmittedPurchaseReceipt(originalPurchaseReceiptName);

  return { originalPurchaseReceiptName };
}
