import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  openSalesInvoiceDraftFromSalesOrder,
  sellingInvalidValues,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_06_06-Khong cho luu hoa don ban hang khi so luong la ky tu khong phai so', async ({
  salesInvoicePage,
  page,
  salesOrderPage,
  deliveryNotePage,
  stockEntryPage,
}) => {
  test.setTimeout(180000);

  await openSalesInvoiceDraftFromSalesOrder({
    salesInvoicePage,
    page,
    salesOrderPage,
    deliveryNotePage,
    stockEntryPage,
  });

  await salesInvoicePage.fillFirstItemQuantity(sellingInvalidValues.nonNumericQuantity);
  await salesInvoicePage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, salesInvoicePage, 'Sales Invoice', sellingNewDocumentUrlPatterns.salesInvoice);
});
