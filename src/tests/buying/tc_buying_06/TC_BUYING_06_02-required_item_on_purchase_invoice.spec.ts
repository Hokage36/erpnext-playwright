import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  mutateCurrentFormBuyingDocument,
  openPurchaseInvoiceDraftFromPurchaseOrder,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_06_02-Khong cho luu hoa don mua hang khi thieu ma hang', async ({
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
      itemCode: '',
    },
  });
  const submitted = await purchaseInvoicePage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await purchaseInvoicePage.expectMessageDialog(/incorrect value.*item must be equal|item must be equal to 'AKS001'|AKS001/i);
  await expectDraftOrUnsavedDocument(page, purchaseInvoicePage, 'Purchase Invoice', buyingNewDocumentUrlPatterns.purchaseInvoice);
});
