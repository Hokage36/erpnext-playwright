import { masterData } from '../../framework/data/master-data';
import { uiText } from '../../framework/data/ui-text';
import { test } from '../../framework/fixtures/app.fixture';
import {
  expectPurchaseOrderSubmitted,
  expectPurchaseReceiptSubmitted,
} from '../../framework/utils/erpnext-assertions';
import { tomorrowErpDate } from '../../framework/utils/date';

test('Nhan hang tu don mua hang va cap nhat ton kho', async ({ purchaseOrderPage, documentPage, page }) => {
  test.setTimeout(180000);

  await purchaseOrderPage.createPurchaseOrder({
    supplierName: masterData.supplierName,
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    scheduleDate: tomorrowErpDate(),
    stockUom: masterData.stockUom,
    warehouseName: masterData.warehouseName,
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
});
