import { buildUniqueItem, masterData } from '../../framework/data/master-data';
import { test } from '../../framework/fixtures/app.fixture';

test('Tao hang muc moi', async ({ itemPage }) => {
  const item = buildUniqueItem();

  await itemPage.createItem({
    itemCode: item.itemCode,
    itemName: item.itemName,
    itemGroup: masterData.itemGroup,
    stockUom: masterData.stockUom,
  });
});
