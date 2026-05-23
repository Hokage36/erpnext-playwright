import { masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectPurchaseInvoiceSubmitted,
  expectPurchaseOrderSubmitted,
  expectPurchaseReceiptSubmitted,
} from '../../../framework/utils/erpnext-assertions';
import { tomorrowErpDate } from '../../../framework/utils/date';

test('TS_E2E_01-Buying-Stock-Accounting', async ({
  purchaseOrderPage,
  purchaseInvoicePage,
  page,
  purchaseReceiptPage,
}) => {
  await purchaseOrderPage.createPurchaseOrder({
    supplierName: masterData.supplierName,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
    rate: masterData.itemRate,
    stockUom: masterData.stockUom,
    scheduleDate: tomorrowErpDate(),
  });

  const purchaseOrderName = purchaseOrderPage.currentDocumentName();
  await expectPurchaseOrderSubmitted(page, {
    purchaseOrderName,
    supplierName: masterData.supplierName,
  });

  await purchaseReceiptPage.openFromPurchaseOrder();
  await purchaseReceiptPage.saveAndSubmit();
  await purchaseReceiptPage.dismissMessageDialogIfPresent();

  const purchaseReceiptName = purchaseReceiptPage.currentDocumentName();
  await expectPurchaseReceiptSubmitted(page, {
    expectedQty: masterData.defaultQuantity,
    itemCode: masterData.itemCode,
    purchaseOrderName,
    purchaseReceiptName,
    warehouseName: masterData.warehouseName,
  });

  await purchaseInvoicePage.openFromPurchaseReceipt();
  await purchaseInvoicePage.saveAndSubmit();

  const purchaseInvoiceName = purchaseInvoicePage.currentDocumentName();
  await expectPurchaseInvoiceSubmitted(page, {
    itemCode: masterData.itemCode,
    purchaseInvoiceName,
    purchaseOrderName,
    purchaseReceiptName,
  });
});
