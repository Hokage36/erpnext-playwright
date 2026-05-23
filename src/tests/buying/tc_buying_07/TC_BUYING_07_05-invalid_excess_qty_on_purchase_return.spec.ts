import { test } from '../../../framework/fixtures/app.fixture';
import {
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  mutateCurrentFormBuyingDocument,
  openPurchaseReturnDraftFromPurchaseReceipt,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_07_05-Khong cho tra hang khi so luong tra vuot so luong da nhan', async ({
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
  await mutateCurrentFormBuyingDocument(page, {
    firstItem: {
      qty: '-2',
    },
  });

  await purchaseReturnPage.attemptSaveAndSubmit();
  await expectDraftOrUnsavedDocument(page, purchaseReturnPage, 'Purchase Receipt', buyingNewDocumentUrlPatterns.purchaseReceipt);
});
