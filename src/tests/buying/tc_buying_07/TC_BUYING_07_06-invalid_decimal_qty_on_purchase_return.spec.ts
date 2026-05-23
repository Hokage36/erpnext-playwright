import { test } from '../../../framework/fixtures/app.fixture';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  openPurchaseReturnDraftFromPurchaseReceipt,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_07_06-Khong cho tra hang khi so luong tra la so thap phan', async ({
  purchaseReturnPage,
  page,
  purchaseOrderPage,
  purchaseReceiptPage,
}) => {
  test.setTimeout(180000);

  await openPurchaseReturnDraftFromPurchaseReceipt({
    purchaseReturnPage,
    page,
    purchaseOrderPage,
    purchaseReceiptPage,
  });

  await purchaseReturnPage.saveUntilSaved(/\/app\/purchase-receipt\/(?!new-purchase-receipt-)/);
  await purchaseReturnPage.fillFirstItemQuantity(buyingInvalidValues.negativeReturnDecimalQuantity);
  await purchaseReturnPage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, purchaseReturnPage, 'Purchase Receipt', buyingNewDocumentUrlPatterns.purchaseReceipt);
});
