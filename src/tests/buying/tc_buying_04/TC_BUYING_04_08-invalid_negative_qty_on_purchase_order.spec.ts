import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  mutateCurrentFormBuyingDocument,
  openPurchaseOrderDraft,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_04_08-Khong cho luu don mua hang khi so luong am', async ({ purchaseOrderPage, page }) => {
  await openPurchaseOrderDraft({
    purchaseOrderPage,
  });

  await mutateCurrentFormBuyingDocument(page, {
    firstItem: {
      qty: buyingInvalidValues.negativeQuantity,
    },
  });

  const submitted = await purchaseOrderPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await expectDraftOrUnsavedDocument(page, purchaseOrderPage, 'Purchase Order', buyingNewDocumentUrlPatterns.purchaseOrder);
});
