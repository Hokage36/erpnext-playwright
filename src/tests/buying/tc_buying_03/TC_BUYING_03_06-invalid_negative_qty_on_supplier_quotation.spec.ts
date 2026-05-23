import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  mutateCurrentFormBuyingDocument,
  openSupplierQuotationDraft,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_03_06-Khong cho luu bao gia nha cung cap khi so luong am', async ({ supplierQuotationPage, page }) => {
  test.setTimeout(120000);

  await openSupplierQuotationDraft({
    supplierQuotationPage,
  });

  await mutateCurrentFormBuyingDocument(page, {
    firstItem: {
      qty: buyingInvalidValues.negativeQuantity,
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
