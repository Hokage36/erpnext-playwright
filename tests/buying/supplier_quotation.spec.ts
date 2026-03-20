import { masterData } from '../../framework/data/master-data';
import { test } from '../../framework/fixtures/app.fixture';

test('Tao bao gia cua NCC', async ({ supplierQuotationPage }) => {
  test.setTimeout(120000);

  await supplierQuotationPage.createSupplierQuotation({
    supplierName: masterData.supplierName,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
  });
});
