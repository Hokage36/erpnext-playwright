import { test } from '../../../framework/fixtures/app.fixture';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  openSupplierQuotationDraft,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_03_07-Khong cho luu bao gia nha cung cap khi so luong la so thap phan', async ({
  page,
  supplierQuotationPage,
}) => {
  test.setTimeout(120000);

  await openSupplierQuotationDraft({
    supplierQuotationPage,
  });

  await supplierQuotationPage.fillFirstItemQuantity(buyingInvalidValues.decimalQuantity);
  await supplierQuotationPage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(
    page,
    supplierQuotationPage,
    'Supplier Quotation',
    buyingNewDocumentUrlPatterns.supplierQuotation
  );
});
