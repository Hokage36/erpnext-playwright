import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  mutateCurrentFormBuyingDocument,
  openPurchaseOrderDraft,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_04_07-Khong cho luu don mua hang khi so luong bang 0', async ({ purchaseOrderPage, page }) => {
  await openPurchaseOrderDraft({
    purchaseOrderPage,
  });

  await mutateCurrentFormBuyingDocument(page, {
    firstItem: {
      qty: buyingInvalidValues.zeroQuantity,
    },
  });

  const submitted = await purchaseOrderPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await expectDraftOrUnsavedDocument(page, purchaseOrderPage, 'Purchase Order', buyingNewDocumentUrlPatterns.purchaseOrder);
});
