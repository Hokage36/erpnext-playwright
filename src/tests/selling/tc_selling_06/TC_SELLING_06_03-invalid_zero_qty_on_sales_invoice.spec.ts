import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormSellingDocument,
  openSalesInvoiceDraftFromSalesOrder,
  sellingInvalidValues,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_06_03-Khong cho luu hoa don ban hang khi so luong bang 0', async ({
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

  await mutateCurrentFormSellingDocument(page, {
    firstItem: {
      qty: sellingInvalidValues.zeroQuantity,
    },
  });

  const submitted = await salesInvoicePage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await expectDraftOrUnsavedDocument(page, salesInvoicePage, 'Sales Invoice', sellingNewDocumentUrlPatterns.salesInvoice);
});
