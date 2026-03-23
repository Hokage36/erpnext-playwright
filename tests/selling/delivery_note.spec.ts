import { masterData } from '../../framework/data/master-data';
import { uiText } from '../../framework/data/ui-text';
import { test } from '../../framework/fixtures/app.fixture';
import {
  expectDeliveryNoteSubmitted,
  expectSalesOrderSubmitted,
} from '../../framework/utils/erpnext-assertions';
import { tomorrowErpDate } from '../../framework/utils/date';

test('Giao hang tu don ban hang va cap nhat xuat kho', async ({ salesOrderPage, documentPage, page }) => {
  test.setTimeout(180000);

  await salesOrderPage.createSalesOrder({
    customerName: masterData.customerName,
    deliveryDate: tomorrowErpDate(),
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    warehouseName: masterData.warehouseName,
  });

  const salesOrderName = documentPage.currentDocumentName();
  await expectSalesOrderSubmitted(page, {
    customerName: masterData.customerName,
    salesOrderName,
  });

  await documentPage.openCreateMenuItem(uiText.createMenu.deliveryNote);
  await documentPage.saveAndSubmit();

  const deliveryNoteName = documentPage.currentDocumentName();
  await expectDeliveryNoteSubmitted(page, {
    deliveryNoteName,
    expectedQty: -Number(masterData.defaultQuantity),
    itemCode: masterData.itemCode,
    salesOrderName,
    warehouseName: masterData.warehouseName,
  });
});
