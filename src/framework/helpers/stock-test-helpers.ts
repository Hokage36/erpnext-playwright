import { DeliveryNotePage } from '../pages/selling/delivery-note.page';
import { masterData } from '../data/master-data';
import { StockEntryPage } from '../pages/stock/stock-entry.page';
import { StockReconciliationPage } from '../pages/stock/stock-reconciliation.page';

export { stockInvalidValues, stockNewDocumentUrlPatterns } from '../data/master-data';
export { expectDraftOrUnsavedDocument, expectUnsavedNewDocument } from './document-state-helpers';
export { mutateCurrentFormDocument as mutateCurrentFormStockDocument } from './document-state-helpers';

export async function openStockEntryDraft(options: {
  stockEntryPage: StockEntryPage;
}): Promise<void> {
  await options.stockEntryPage.createStockEntry({
    stockEntryType: masterData.stockEntryType,
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    warehouseName: masterData.warehouseName,
  });
}

export async function openStockReconciliationDraft(options: {
  stockReconciliationPage: StockReconciliationPage;
}): Promise<void> {
  await options.stockReconciliationPage.createStockReconciliation({
    purpose: masterData.stockReconciliationPurpose,
    itemCode: masterData.itemCode,
    quantity: masterData.stockReconciliationQuantity,
    valuationRate: masterData.valuationRate,
    warehouseName: masterData.warehouseName,
  });
}

export async function openDirectDeliveryNoteDraft(options: {
  deliveryNotePage: DeliveryNotePage;
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

  await options.deliveryNotePage.createDeliveryNote({
    customerName: masterData.customerName,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
    stockUom: masterData.stockUom,
  });
}
