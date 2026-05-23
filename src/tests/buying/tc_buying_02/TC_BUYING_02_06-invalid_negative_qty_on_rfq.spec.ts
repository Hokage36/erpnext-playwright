import { test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_02_06-Khong cho luu yeu cau bao gia khi so luong am', async ({ requestForQuotationPage, page }) => {
  test.setTimeout(120000);

  await requestForQuotationPage.fillRequestForQuotationForm({
    itemCode: masterData.itemCode,
    quantity: buyingInvalidValues.negativeQuantity,
    stockUom: masterData.stockUom,
    supplierName: masterData.supplierName,
    warehouseName: masterData.warehouseName,
  });

  await requestForQuotationPage.save();

  await expectDraftOrUnsavedDocument(
    page,
    requestForQuotationPage,
    'Request for Quotation',
    buyingNewDocumentUrlPatterns.requestForQuotation
  );
});
