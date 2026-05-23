import { masterData } from '../data/master-data';
import { QuotationPage } from '../pages/selling/quotation.page';
import { SalesOrderPage } from '../pages/selling/sales-order.page';
import { tomorrowErpDate } from '../utils/date';

export { sellingInvalidValues, sellingNewDocumentUrlPatterns } from '../data/master-data';
export { expectDraftOrUnsavedDocument, expectUnsavedNewDocument } from './document-state-helpers';

export async function openQuotationDraft(options: {
  quotationPage: QuotationPage;
}): Promise<void> {
  await options.quotationPage.fillQuotationForm({
    customerName: masterData.customerName,
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    warehouseName: masterData.warehouseName,
  });

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
