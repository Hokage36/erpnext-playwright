import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  openQuotationDraft,
  sellingInvalidValues,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_03_08-Khong cho luu bao gia khi so luong la ky tu khong phai so', async ({
  page,
  quotationPage,
}) => {
  test.setTimeout(120000);

  await openQuotationDraft({
    page,
    quotationPage,
  });

  await quotationPage.fillFirstItemQuantity(sellingInvalidValues.nonNumericQuantity);
  await quotationPage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, quotationPage, 'Quotation', sellingNewDocumentUrlPatterns.quotation);
});
