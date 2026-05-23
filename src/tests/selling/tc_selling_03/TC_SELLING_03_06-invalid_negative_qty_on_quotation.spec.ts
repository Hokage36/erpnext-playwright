import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormSellingDocument,
  openQuotationDraft,
  sellingInvalidValues,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_03_06-Khong cho luu bao gia khi so luong am', async ({ page, quotationPage }) => {
  await openQuotationDraft({
    page,
    quotationPage,
  });

  await mutateCurrentFormSellingDocument(page, {
    firstItem: {
      qty: sellingInvalidValues.negativeQuantity,
    },
  });

  const submitted = await quotationPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await expectDraftOrUnsavedDocument(page, quotationPage, 'Quotation', sellingNewDocumentUrlPatterns.quotation);
});
