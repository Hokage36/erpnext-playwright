import { masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';

test('TC_STOCK_05_01-Tao phieu giao hang', async ({ deliveryNotePage }) => {
  await deliveryNotePage.createDeliveryNote({
    customerName: masterData.customerName,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
    stockUom: masterData.stockUom,
  });
});
