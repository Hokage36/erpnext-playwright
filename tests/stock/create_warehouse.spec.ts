import { buildUniqueWarehouseName } from '../../framework/data/master-data';
import { test } from '../../framework/fixtures/app.fixture';

test('Tao kho hang moi', async ({ warehousePage }) => {
  await warehousePage.createWarehouse(buildUniqueWarehouseName());
});
