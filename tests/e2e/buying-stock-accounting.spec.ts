import { masterData } from '../../framework/data/master-data';
import { uiText } from '../../framework/data/ui-text';
import { test } from '../../framework/fixtures/app.fixture';
import {
  expectPurchaseInvoiceSubmitted,
  expectPurchaseOrderSubmitted,
  expectPurchaseReceiptSubmitted,
} from '../../framework/utils/erpnext-assertions';
import { tomorrowErpDate } from '../../framework/utils/date';

test('Buying-Stock-Accounting', async ({ purchaseOrderPage, documentPage, page }) => {
  await purchaseOrderPage.createPurchaseOrder({
    supplierName: masterData.supplierName,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
    rate: masterData.itemRate,
    stockUom: masterData.stockUom,
    scheduleDate: tomorrowErpDate(),
  });

  const purchaseOrderName = documentPage.currentDocumentName();
  await expectPurchaseOrderSubmitted(page, {
    purchaseOrderName,
    supplierName: masterData.supplierName,
  });

  await documentPage.openCreateMenuItem(uiText.createMenu.purchaseReceipt);
  await documentPage.saveAndSubmit();
  await documentPage.dismissMessageDialogIfPresent();

  const purchaseReceiptName = documentPage.currentDocumentName();
  await expectPurchaseReceiptSubmitted(page, {
    expectedQty: masterData.defaultQuantity,
    itemCode: masterData.itemCode,
    purchaseOrderName,
    purchaseReceiptName,
    warehouseName: masterData.warehouseName,
  });

  await documentPage.openCreateMenuItem(uiText.createMenu.purchaseInvoice);
  await documentPage.saveAndSubmit();

  const purchaseInvoiceName = documentPage.currentDocumentName();
  await expectPurchaseInvoiceSubmitted(page, {
    itemCode: masterData.itemCode,
    purchaseInvoiceName,
    purchaseOrderName,
    purchaseReceiptName,
  });
});
