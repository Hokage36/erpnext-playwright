import { test } from '../../../framework/fixtures/app.fixture';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  mutateCurrentFormBuyingDocument,
  openPurchaseInvoiceDraftFromPurchaseOrder,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_06_03-Khong cho luu hoa don mua hang khi so luong bang 0', async ({
  purchaseInvoicePage,
  page,
  purchaseOrderPage,
  purchaseReceiptPage,
}) => {
  test.setTimeout(180000);

  await openPurchaseInvoiceDraftFromPurchaseOrder({
    purchaseInvoicePage,
    purchaseOrderPage,
    purchaseReceiptPage,
  });

  await page.waitForURL(/\/app\/purchase-invoice\//, { timeout: 15000 });
  await purchaseInvoicePage.saveUntilSaved(/\/app\/purchase-invoice\/(?!new-purchase-invoice-)/);
  await mutateCurrentFormBuyingDocument(page, {
    firstItem: {
      qty: buyingInvalidValues.zeroQuantity,
    },
  });
  await purchaseInvoicePage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, purchaseInvoicePage, 'Purchase Invoice', buyingNewDocumentUrlPatterns.purchaseInvoice);
});
