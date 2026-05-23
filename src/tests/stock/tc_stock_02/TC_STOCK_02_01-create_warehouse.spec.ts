import { buildUniqueWarehouseName } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';

test('TC_STOCK_02_01-Tao kho hang moi', async ({ warehousePage }) => {
  await warehousePage.createWarehouse(buildUniqueWarehouseName());
});
