import { buildUniqueWarehouseName } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import { expectWarehouseCreated } from '../../../framework/utils/erpnext-assertions';

test('TC_STOCK_02_01-Tao kho hang moi', async ({ page, warehousePage }) => {
  const warehouseName = buildUniqueWarehouseName();

  await warehousePage.createWarehouse(warehouseName);

  await expectWarehouseCreated(page, {
    warehouseDocumentName: warehousePage.currentDocumentName(),
    warehouseName,
  });
});
