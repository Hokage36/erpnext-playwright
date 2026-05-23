import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  openSalesOrderDraft,
  sellingInvalidValues,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_04_10-Khong cho luu don ban hang khi so luong la ky tu khong phai so', async ({
  page,
  salesOrderPage,
}) => {
  test.setTimeout(120000);

  await openSalesOrderDraft({
    salesOrderPage,
  });

  await salesOrderPage.fillFirstItemQuantity(sellingInvalidValues.nonNumericQuantity);
  await salesOrderPage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, salesOrderPage, 'Sales Order', sellingNewDocumentUrlPatterns.salesOrder);
});
