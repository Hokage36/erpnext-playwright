import { test } from '../../../framework/fixtures/app.fixture';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  openPurchaseInvoiceDraftFromPurchaseOrder,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_06_06-Khong cho luu hoa don mua hang khi so luong la ky tu khong phai so', async ({
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
  await purchaseInvoicePage.fillFirstItemQuantity(buyingInvalidValues.nonNumericQuantity);
  await purchaseInvoicePage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, purchaseInvoicePage, 'Purchase Invoice', buyingNewDocumentUrlPatterns.purchaseInvoice);
});
