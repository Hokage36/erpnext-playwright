import { test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';
import {
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_03_03-Khong cho luu bao gia nha cung cap khi thieu ma hang', async ({ supplierQuotationPage, page }) => {
  test.setTimeout(120000);

  await supplierQuotationPage.fillSupplierQuotationForm({
    quantity: masterData.defaultQuantity,
    supplierName: masterData.supplierName,
    warehouseName: masterData.warehouseName,
  });

  await supplierQuotationPage.attemptSaveAndSubmit();

  await supplierQuotationPage.expectMissingFieldDialog();
  await expectDraftOrUnsavedDocument(
    page,
    supplierQuotationPage,
    'Supplier Quotation',
    buyingNewDocumentUrlPatterns.supplierQuotation
  );
});
