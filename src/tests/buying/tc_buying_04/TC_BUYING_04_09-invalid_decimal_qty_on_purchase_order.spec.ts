import { test } from '../../../framework/fixtures/app.fixture';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  openPurchaseOrderDraft,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_04_09-Khong cho luu don mua hang khi so luong la so thap phan', async ({
  page,
  purchaseOrderPage,
}) => {
  test.setTimeout(120000);

  await openPurchaseOrderDraft({
    purchaseOrderPage,
  });

  await purchaseOrderPage.fillFirstItemQuantity(buyingInvalidValues.decimalQuantity);
  await purchaseOrderPage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, purchaseOrderPage, 'Purchase Order', buyingNewDocumentUrlPatterns.purchaseOrder);
});
