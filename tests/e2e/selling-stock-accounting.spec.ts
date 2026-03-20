import { buildPaymentReferenceNo, masterData } from '../../framework/data/master-data';
import { uiText } from '../../framework/data/ui-text';
import { test } from '../../framework/fixtures/app.fixture';
import { tomorrowErpDate } from '../../framework/utils/date';

test('Selling-Stock-Accounting', async ({ salesOrderPage, documentPage }) => {
  test.setTimeout(180000);

  await salesOrderPage.createSalesOrder({
    customerName: masterData.customerName,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
    deliveryDate: tomorrowErpDate(),
  });

  await documentPage.openCreateMenuItem(uiText.createMenu.deliveryNote);
  await documentPage.saveAndSubmit();

  await documentPage.openCreateMenuItem(uiText.createMenu.salesInvoice);
  await documentPage.saveAndSubmit();

  await documentPage.openCreateMenuItem(uiText.createMenu.payment);
  await documentPage.fillReferenceNumber(buildPaymentReferenceNo());
  await documentPage.saveAndSubmit();
});
