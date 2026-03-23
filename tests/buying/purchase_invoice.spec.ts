import { masterData } from '../../framework/data/master-data';
import { uiText } from '../../framework/data/ui-text';
import { test } from '../../framework/fixtures/app.fixture';
import {
  expectPurchaseInvoiceSubmitted,
} from '../../framework/utils/erpnext-assertions';
import { tomorrowErpDate } from '../../framework/utils/date';

test('Lap hoa don mua hang va sinh but toan tu dong', async ({ purchaseOrderPage, documentPage, page }) => {
  test.setTimeout(180000);

  await purchaseOrderPage.createPurchaseOrder({
    supplierName: masterData.supplierName,
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    rate: masterData.itemRate,
    scheduleDate: tomorrowErpDate(),
    stockUom: masterData.stockUom,
    warehouseName: masterData.warehouseName,
  });

  const purchaseOrderName = documentPage.currentDocumentName();

  await documentPage.openCreateMenuItem(uiText.createMenu.purchaseReceipt);
  await documentPage.saveAndSubmit();
  await documentPage.dismissMessageDialogIfPresent();

  const purchaseReceiptName = documentPage.currentDocumentName();

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
