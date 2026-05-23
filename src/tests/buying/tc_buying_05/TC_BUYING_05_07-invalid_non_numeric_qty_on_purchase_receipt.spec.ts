import { test } from '../../../framework/fixtures/app.fixture';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  openPurchaseReceiptDraftFromPurchaseOrder,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_05_07-Khong cho luu phieu nhan hang khi so luong la ky tu khong phai so', async ({
  purchaseReceiptPage,
  page,
  purchaseOrderPage,
}) => {
  test.setTimeout(180000);

  await openPurchaseReceiptDraftFromPurchaseOrder({
    purchaseReceiptPage,
    purchaseOrderPage,
  });

  await page.waitForURL(/\/app\/purchase-receipt\//, { timeout: 15000 });
  await purchaseReceiptPage.saveUntilSaved(/\/app\/purchase-receipt\/(?!new-purchase-receipt-)/);
  await purchaseReceiptPage.fillFirstItemQuantity(buyingInvalidValues.nonNumericQuantity);
  await purchaseReceiptPage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, purchaseReceiptPage, 'Purchase Receipt', buyingNewDocumentUrlPatterns.purchaseReceipt);
});
