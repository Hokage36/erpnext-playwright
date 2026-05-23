import { masterData } from '../data/master-data';
import { StockEntryPage } from '../pages/stock/stock-entry.page';
import { StockReconciliationPage } from '../pages/stock/stock-reconciliation.page';

export { stockInvalidValues, stockNewDocumentUrlPatterns } from '../data/master-data';
export { expectDraftOrUnsavedDocument, expectUnsavedNewDocument } from './document-state-helpers';

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
