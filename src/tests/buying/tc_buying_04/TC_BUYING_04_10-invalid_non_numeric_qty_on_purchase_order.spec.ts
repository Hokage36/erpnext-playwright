import { test } from '../../../framework/fixtures/app.fixture';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  openPurchaseOrderDraft,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_04_10-Khong cho luu don mua hang khi so luong la ky tu khong phai so', async ({
  page,
  purchaseOrderPage,
}) => {
  test.setTimeout(120000);

  await openPurchaseOrderDraft({
    purchaseOrderPage,
  });

  await purchaseOrderPage.fillFirstItemQuantity(buyingInvalidValues.nonNumericQuantity);
  await purchaseOrderPage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, purchaseOrderPage, 'Purchase Order', buyingNewDocumentUrlPatterns.purchaseOrder);
});
