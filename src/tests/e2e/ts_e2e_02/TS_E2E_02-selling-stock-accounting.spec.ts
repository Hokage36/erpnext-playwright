import { buildPaymentReferenceNo, masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDeliveryNoteSubmitted,
  expectSalesInvoiceSubmitted,
  expectSalesOrderSubmitted,
} from '../../../framework/utils/erpnext-assertions';
import { tomorrowErpDate } from '../../../framework/utils/date';

test('TS_E2E_02-Selling-Stock-Accounting', async ({
  deliveryNotePage,
  page,
  paymentEntryPage,
  salesInvoicePage,
  salesOrderPage,
}) => {
  test.setTimeout(180000);

  await salesOrderPage.createSalesOrder({
    customerName: masterData.customerName,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
    rate: masterData.itemRate,
    deliveryDate: tomorrowErpDate(),
  });

  const salesOrderName = salesOrderPage.currentDocumentName();
  await expectSalesOrderSubmitted(page, {
    customerName: masterData.customerName,
    salesOrderName,
  });

  await deliveryNotePage.openFromSalesOrder();
  await deliveryNotePage.saveAndSubmit();

  const deliveryNoteName = deliveryNotePage.currentDocumentName();
  await expectDeliveryNoteSubmitted(page, {
    deliveryNoteName,
    expectedQty: -Number(masterData.defaultQuantity),
    itemCode: masterData.itemCode,
    salesOrderName,
    warehouseName: masterData.warehouseName,
  });

  await deliveryNotePage.dismissMessageDialogIfPresent();
  await salesInvoicePage.openFromDeliveryNote();
  await salesInvoicePage.saveAndSubmit();

  const salesInvoiceName = salesInvoicePage.currentDocumentName();
  await expectSalesInvoiceSubmitted(page, {
    deliveryNoteName,
    itemCode: masterData.itemCode,
    salesInvoiceName,
    salesOrderName,
  });

  await paymentEntryPage.openFromSalesInvoice();
  await paymentEntryPage.fillReferenceNumber(buildPaymentReferenceNo());
  await paymentEntryPage.saveAndSubmit();
});
