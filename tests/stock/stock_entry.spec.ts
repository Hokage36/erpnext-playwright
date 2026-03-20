import { masterData } from '../../framework/data/master-data';
import { test } from '../../framework/fixtures/app.fixture';

test('Tao chung tu kho', async ({ stockEntryPage }) => {
  await stockEntryPage.createStockEntry({
    stockEntryType: masterData.stockEntryType,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
  });
});
