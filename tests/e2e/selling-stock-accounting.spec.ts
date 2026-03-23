import { buildPaymentReferenceNo, masterData } from '../../framework/data/master-data';
import { uiText } from '../../framework/data/ui-text';
import { test } from '../../framework/fixtures/app.fixture';
import {
  expectDeliveryNoteSubmitted,
  expectSalesInvoiceSubmitted,
  expectSalesOrderSubmitted,
} from '../../framework/utils/erpnext-assertions';
import { tomorrowErpDate } from '../../framework/utils/date';

test('Selling-Stock-Accounting', async ({ salesOrderPage, documentPage, page }) => {
  test.setTimeout(180000);

  await salesOrderPage.createSalesOrder({
    customerName: masterData.customerName,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
    rate: masterData.itemRate,
    deliveryDate: tomorrowErpDate(),
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

  await documentPage.openCreateMenuItem(uiText.createMenu.salesInvoice);
  await documentPage.saveAndSubmit();

  const salesInvoiceName = documentPage.currentDocumentName();
  await expectSalesInvoiceSubmitted(page, {
    deliveryNoteName,
    itemCode: masterData.itemCode,
    salesInvoiceName,
    salesOrderName,
  });

  await documentPage.openCreateMenuItem(uiText.createMenu.payment);
  await documentPage.fillReferenceNumber(buildPaymentReferenceNo());
  await documentPage.saveAndSubmit();
});
