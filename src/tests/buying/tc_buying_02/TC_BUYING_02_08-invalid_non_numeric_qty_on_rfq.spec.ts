import { test } from '../../../framework/fixtures/app.fixture';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  openRequestForQuotationDraft,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_02_08-Khong cho luu yeu cau bao gia khi so luong la ky tu khong phai so', async ({
  page,
  requestForQuotationPage,
}) => {
  test.setTimeout(120000);

  await openRequestForQuotationDraft({
    requestForQuotationPage,
  });

  await requestForQuotationPage.fillFirstItemQuantity(buyingInvalidValues.nonNumericQuantity);
  await requestForQuotationPage.save();

  await expectDraftOrUnsavedDocument(
    page,
    requestForQuotationPage,
    'Request for Quotation',
    buyingNewDocumentUrlPatterns.requestForQuotation
  );
});
