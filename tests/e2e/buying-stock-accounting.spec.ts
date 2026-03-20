import { masterData } from '../../framework/data/master-data';
import { uiText } from '../../framework/data/ui-text';
import { test } from '../../framework/fixtures/app.fixture';
import { tomorrowErpDate } from '../../framework/utils/date';

test('Buying-Stock-Accounting', async ({ purchaseOrderPage, documentPage }) => {
  await purchaseOrderPage.createPurchaseOrder({
    supplierName: masterData.supplierName,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
    stockUom: masterData.stockUom,
    scheduleDate: tomorrowErpDate(),
  });

  await documentPage.openCreateMenuItem(uiText.createMenu.purchaseReceipt);
  await documentPage.saveAndSubmit();
  await documentPage.dismissMessageDialogIfPresent();

  await documentPage.openCreateMenuItem(uiText.createMenu.purchaseInvoice);
  await documentPage.saveAndSubmit();
});
