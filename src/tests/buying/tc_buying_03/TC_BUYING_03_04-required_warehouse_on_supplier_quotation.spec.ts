import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  mutateCurrentFormBuyingDocument,
  openSupplierQuotationDraft,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_03_04-Khong cho luu bao gia nha cung cap khi thieu kho hang', async ({ supplierQuotationPage, page }) => {
  test.setTimeout(120000);

  await openSupplierQuotationDraft({
    supplierQuotationPage,
  });

  await mutateCurrentFormBuyingDocument(page, {
    firstItem: {
      warehouse: '',
    },
  });

  const submitted = await supplierQuotationPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await supplierQuotationPage.expectMessageDialog(/Warehouse is mandatory/i);
  await expectDraftOrUnsavedDocument(
    page,
    supplierQuotationPage,
    'Supplier Quotation',
    buyingNewDocumentUrlPatterns.supplierQuotation
  );
});
