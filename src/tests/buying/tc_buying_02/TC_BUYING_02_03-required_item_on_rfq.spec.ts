import { expect, test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';

test('TC_BUYING_02_03-Khong cho luu yeu cau bao gia khi thieu ma hang', async ({ requestForQuotationPage, page }) => {
  test.setTimeout(120000);

  await requestForQuotationPage.fillRequestForQuotationForm({
    quantity: masterData.defaultQuantity,
    stockUom: masterData.stockUom,
    supplierName: masterData.supplierName,
    warehouseName: masterData.warehouseName,
  });

  await requestForQuotationPage.save();

  await requestForQuotationPage.expectMissingFieldDialog();
  await expect(page).toHaveURL(/\/app\/request-for-quotation\/new-request-for-quotation/);
  expect(() => requestForQuotationPage.currentDocumentName()).toThrow();
});
