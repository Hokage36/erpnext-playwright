import { buildUniqueItem, masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import { expectUnsavedNewDocument, stockNewDocumentUrlPatterns } from '../../../framework/helpers/stock-test-helpers';

test('TC_STOCK_01_03-Khong cho luu hang muc khi thieu nhom hang', async ({ itemPage, page }) => {
  const item = buildUniqueItem();

  await itemPage.fillItemForm({
    itemCode: item.itemCode,
    itemName: item.itemName,
    stockUom: masterData.stockUom,
  });

  await itemPage.save();

  await itemPage.expectMissingFieldDialog();
  await expectUnsavedNewDocument(page, itemPage, stockNewDocumentUrlPatterns.item);
});
