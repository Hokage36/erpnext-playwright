import { test } from '../../../framework/fixtures/app.fixture';
import {
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  mutateCurrentFormBuyingDocument,
  openPurchaseReceiptDraftFromPurchaseOrder,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_05_03-Khong cho luu phieu nhan hang khi thieu ma hang', async ({ purchaseReceiptPage, page, purchaseOrderPage }) => {
  test.setTimeout(180000);

  await openPurchaseReceiptDraftFromPurchaseOrder({
    purchaseReceiptPage,
    purchaseOrderPage,
  });

  await page.waitForURL(/\/app\/purchase-receipt\//, { timeout: 15000 });
  await purchaseReceiptPage.saveUntilSaved(/\/app\/purchase-receipt\/(?!new-purchase-receipt-)/);
  await mutateCurrentFormBuyingDocument(page, {
    firstItem: {
      itemCode: '',
    },
  });
  await purchaseReceiptPage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, purchaseReceiptPage, 'Purchase Receipt', buyingNewDocumentUrlPatterns.purchaseReceipt);
});
