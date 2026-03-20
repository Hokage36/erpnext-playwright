import { masterData } from '../../framework/data/master-data';
import { test } from '../../framework/fixtures/app.fixture';
import { tomorrowErpDate } from '../../framework/utils/date';

test('Tao don mua hang', async ({ purchaseOrderPage }) => {
  await purchaseOrderPage.createPurchaseOrder({
    supplierName: masterData.supplierName,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
    stockUom: masterData.stockUom,
    scheduleDate: tomorrowErpDate(),
  });
});
