import { buildUniqueSupplierName, masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import { expectSupplierCreated } from '../../../framework/utils/erpnext-assertions';

test('TC_BUYING_01_01-Tao nha cung cap moi', async ({ supplierPage, page }) => {
  const supplierName = buildUniqueSupplierName();
  const supplierDocumentName = await supplierPage.createSupplier({
    country: masterData.country,
    supplierGroup: masterData.supplierGroup,
    supplierName,
    supplierType: masterData.supplierType,
  });

  await expectSupplierCreated(page, {
    country: masterData.country,
    supplierDocumentName,
    supplierName,
  });
});
