import { expect, test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';

test('TC_BUYING_01_02-Khong cho luu nha cung cap khi thieu ten nha cung cap', async ({ supplierPage, page }) => {
  await supplierPage.fillSupplierForm({
    country: masterData.country,
    supplierGroup: masterData.supplierGroup,
    supplierType: masterData.supplierType,
  });

  await supplierPage.save();

  await supplierPage.expectMissingFieldDialog();
  await expect(page).toHaveURL(/\/app\/supplier\/new-supplier/);
  expect(() => supplierPage.currentDocumentName()).toThrow();
});
