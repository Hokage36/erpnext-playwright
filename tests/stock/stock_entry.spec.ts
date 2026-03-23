import { masterData } from '../../framework/data/master-data';
import { test } from '../../framework/fixtures/app.fixture';
import { expectStockEntrySubmitted } from '../../framework/utils/erpnext-assertions';

test('Tao chung tu kho', async ({ stockEntryPage, page }) => {
  await stockEntryPage.createStockEntry({
    stockEntryType: masterData.stockEntryType,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.defaultQuantity,
  });

  await stockEntryPage.submit();

  const stockEntryName = stockEntryPage.currentDocumentName();
  await expectStockEntrySubmitted(page, {
    expectedQty: masterData.defaultQuantity,
    itemCode: masterData.itemCode,
    stockEntryName,
    stockEntryType: masterData.stockEntryType,
    warehouseName: masterData.warehouseName,
  });
});
