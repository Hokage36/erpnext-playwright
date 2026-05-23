import { test } from '../../../framework/fixtures/app.fixture';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  openRequestForQuotationDraft,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_02_07-Khong cho luu yeu cau bao gia khi so luong la so thap phan', async ({
  page,
  requestForQuotationPage,
}) => {
  test.setTimeout(120000);

  await openRequestForQuotationDraft({
    requestForQuotationPage,
  });

  await requestForQuotationPage.fillFirstItemQuantity(buyingInvalidValues.decimalQuantity);
  await requestForQuotationPage.save();

  await expectDraftOrUnsavedDocument(
    page,
    requestForQuotationPage,
    'Request for Quotation',
    buyingNewDocumentUrlPatterns.requestForQuotation
  );
});
