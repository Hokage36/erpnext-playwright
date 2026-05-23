import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  openSalesOrderDraft,
  sellingInvalidValues,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_04_09-Khong cho luu don ban hang khi so luong la so thap phan', async ({
  page,
  salesOrderPage,
}) => {
  test.setTimeout(120000);

  await openSalesOrderDraft({
    salesOrderPage,
  });

  await salesOrderPage.fillFirstItemQuantity(sellingInvalidValues.decimalQuantity);
  await salesOrderPage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, salesOrderPage, 'Sales Order', sellingNewDocumentUrlPatterns.salesOrder);
});
