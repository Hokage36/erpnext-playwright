import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  openQuotationDraft,
  sellingInvalidValues,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_03_07-Khong cho luu bao gia khi so luong la so thap phan 0,5', async ({
  page,
  quotationPage,
}) => {
  test.setTimeout(120000);

  await openQuotationDraft({
    page,
    quotationPage,
  });

  await quotationPage.fillFirstItemQuantity(sellingInvalidValues.decimalQuantity);
  await quotationPage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, quotationPage, 'Quotation', sellingNewDocumentUrlPatterns.quotation);
});
