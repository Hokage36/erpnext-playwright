import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormSellingDocument,
  openSalesInvoiceDraftFromSalesOrder,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_06_02-Khong cho luu hoa don ban hang khi thieu ma hang', async ({
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
      itemCode: '',
    },
  });

  const submitted = await salesInvoicePage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await salesInvoicePage.expectMessageDialog(/incorrect value|item must be equal|AKS001/i);
  await expectDraftOrUnsavedDocument(page, salesInvoicePage, 'Sales Invoice', sellingNewDocumentUrlPatterns.salesInvoice);
});
