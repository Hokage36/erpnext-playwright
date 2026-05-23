import { masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';

test('TC_SELLING_03_01-Tao bao gia', async ({ quotationPage }) => {
  test.setTimeout(180000);

  await quotationPage.createQuotation({
    customerName: masterData.customerName,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
  });
});
