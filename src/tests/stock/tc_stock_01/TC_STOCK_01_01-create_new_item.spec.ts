import { buildUniqueItem, masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import { expectItemCreated } from '../../../framework/utils/erpnext-assertions';

test('TC_STOCK_01_01-Tao hang muc moi', async ({ itemPage, page }) => {
  const item = buildUniqueItem();

  await itemPage.createItem({
    itemCode: item.itemCode,
    itemName: item.itemName,
    itemGroup: masterData.itemGroup,
    stockUom: masterData.stockUom,
  });

  await expectItemCreated(page, {
    itemCode: item.itemCode,
    itemGroup: masterData.itemGroup,
    itemName: item.itemName,
    stockUom: masterData.stockUom,
  });
});
