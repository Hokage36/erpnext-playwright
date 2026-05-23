import { test } from '../../../framework/fixtures/app.fixture';
import {
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  mutateCurrentFormBuyingDocument,
  openPurchaseReceiptDraftFromPurchaseOrder,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_05_02-Khong cho submit phieu nhan hang khi thieu kho hang', async ({ purchaseReceiptPage, page, purchaseOrderPage }) => {
  test.setTimeout(180000);

  await openPurchaseReceiptDraftFromPurchaseOrder({
    purchaseReceiptPage,
    purchaseOrderPage,
  });

  await page.waitForURL(/\/app\/purchase-receipt\//, { timeout: 15000 });
  await purchaseReceiptPage.saveUntilSaved(/\/app\/purchase-receipt\/(?!new-purchase-receipt-)/);
  await mutateCurrentFormBuyingDocument(page, {
    firstItem: {
      warehouse: '',
    },
    setWarehouse: null,
  });

  await purchaseReceiptPage.attemptSaveAndSubmit();

  await purchaseReceiptPage.expectMessageDialog(/Warehouse is mandatory/i);
  await expectDraftOrUnsavedDocument(page, purchaseReceiptPage, 'Purchase Receipt', buyingNewDocumentUrlPatterns.purchaseReceipt);
});
