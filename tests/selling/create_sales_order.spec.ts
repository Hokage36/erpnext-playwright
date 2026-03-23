import { masterData } from '../../framework/data/master-data';
import { test } from '../../framework/fixtures/app.fixture';
import { tomorrowErpDate } from '../../framework/utils/date';

test('Tao don dat hang', async ({ salesOrderPage }) => {
  test.setTimeout(120000);

  await salesOrderPage.createSalesOrder({
    customerName: masterData.customerName,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
    deliveryDate: tomorrowErpDate(),
  });
});
