import { test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';
import {
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_03_02-Khong cho luu bao gia nha cung cap khi thieu nha cung cap', async ({ supplierQuotationPage, page }) => {
  test.setTimeout(120000);

  await supplierQuotationPage.fillSupplierQuotationForm({
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
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
