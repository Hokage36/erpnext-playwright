import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  mutateCurrentFormBuyingDocument,
  openSupplierQuotationDraft,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_03_05-Khong cho luu bao gia nha cung cap khi so luong bang 0', async ({ supplierQuotationPage, page }) => {
  test.setTimeout(120000);

  await openSupplierQuotationDraft({
    supplierQuotationPage,
  });

  await mutateCurrentFormBuyingDocument(page, {
    firstItem: {
      qty: buyingInvalidValues.zeroQuantity,
    },
  });

  const submitted = await supplierQuotationPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await expectDraftOrUnsavedDocument(
    page,
    supplierQuotationPage,
    'Supplier Quotation',
    buyingNewDocumentUrlPatterns.supplierQuotation
  );
});
