import { test } from '../../../framework/fixtures/app.fixture';
import { expectUnsavedNewDocument, stockNewDocumentUrlPatterns } from '../../../framework/helpers/stock-test-helpers';

test('TC_STOCK_02_02-Khong cho luu kho hang khi thieu ten kho', async ({ page, warehousePage }) => {
  await warehousePage.fillWarehouseForm();

  await warehousePage.save();

  await warehousePage.expectMissingFieldDialog();
  await expectUnsavedNewDocument(page, warehousePage, stockNewDocumentUrlPatterns.warehouse);
});
