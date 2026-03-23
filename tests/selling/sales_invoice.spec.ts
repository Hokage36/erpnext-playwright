import { masterData } from '../../framework/data/master-data';
import { uiText } from '../../framework/data/ui-text';
import { test } from '../../framework/fixtures/app.fixture';
import {
  expectSalesInvoiceSubmitted,
} from '../../framework/utils/erpnext-assertions';
import { tomorrowErpDate } from '../../framework/utils/date';

test('Lap hoa don ban hang va sinh but toan tu dong', async ({ salesOrderPage, documentPage, page }) => {
  test.setTimeout(180000);

  await salesOrderPage.createSalesOrder({
    customerName: masterData.customerName,
    deliveryDate: tomorrowErpDate(),
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    rate: masterData.itemRate,
    warehouseName: masterData.warehouseName,
  });

  const salesOrderName = documentPage.currentDocumentName();

  await documentPage.openCreateMenuItem(uiText.createMenu.deliveryNote);
  await documentPage.saveAndSubmit();

  const deliveryNoteName = documentPage.currentDocumentName();

  await documentPage.openCreateMenuItem(uiText.createMenu.salesInvoice);
  await documentPage.saveAndSubmit();

  const salesInvoiceName = documentPage.currentDocumentName();
  await expectSalesInvoiceSubmitted(page, {
    deliveryNoteName,
    itemCode: masterData.itemCode,
    salesInvoiceName,
    salesOrderName,
  });
});
