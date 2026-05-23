import { expect, test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';

test('TC_SELLING_03_03-Khong cho luu bao gia khi thieu ma hang', async ({ page, quotationPage }) => {
  await quotationPage.fillQuotationForm({
    customerName: masterData.customerName,
    quantity: masterData.defaultQuantity,
    warehouseName: masterData.warehouseName,
  });

  await quotationPage.save();

  await quotationPage.expectMissingFieldDialog();
  await expect(page).toHaveURL(/\/app\/quotation\/new-quotation/);
  expect(() => quotationPage.currentDocumentName()).toThrow();
});
