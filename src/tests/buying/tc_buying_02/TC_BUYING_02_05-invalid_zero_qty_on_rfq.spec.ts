import { test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectUnsavedNewDocument,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_02_05-Khong cho luu yeu cau bao gia khi so luong bang 0', async ({ requestForQuotationPage, page }) => {
  test.setTimeout(120000);

  await requestForQuotationPage.fillRequestForQuotationForm({
    itemCode: masterData.itemCode,
    quantity: buyingInvalidValues.zeroQuantity,
    stockUom: masterData.stockUom,
    supplierName: masterData.supplierName,
    warehouseName: masterData.warehouseName,
  });

  await requestForQuotationPage.save();

  await expectUnsavedNewDocument(page, requestForQuotationPage, buyingNewDocumentUrlPatterns.requestForQuotation);
});
