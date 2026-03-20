import { masterData } from '../../framework/data/master-data';
import { test } from '../../framework/fixtures/app.fixture';

test('Tao yeu cau bao gia', async ({ requestForQuotationPage }) => {
  test.setTimeout(120000);

  await requestForQuotationPage.createRequestForQuotation({
    supplierName: masterData.supplierName,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
    stockUom: masterData.stockUom,
  });
});
