import { test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';
import {
  buyingNewDocumentUrlPatterns,
  expectUnsavedNewDocument,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_02_04-Khong cho luu yeu cau bao gia khi thieu kho hang', async ({ requestForQuotationPage, page }) => {
  test.setTimeout(120000);

  await requestForQuotationPage.fillRequestForQuotationForm({
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    stockUom: masterData.stockUom,
    supplierName: masterData.supplierName,
  });

  await requestForQuotationPage.save();

  await requestForQuotationPage.expectMessageDialog(/Warehouse is mandatory/i);
  await expectUnsavedNewDocument(page, requestForQuotationPage, buyingNewDocumentUrlPatterns.requestForQuotation);
});
