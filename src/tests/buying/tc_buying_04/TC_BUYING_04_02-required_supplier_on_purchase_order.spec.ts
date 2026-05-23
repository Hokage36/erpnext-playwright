import { test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';
import { tomorrowErpDate } from '../../../framework/utils/date';
import {
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_04_02-Khong cho luu don mua hang khi thieu nha cung cap', async ({ purchaseOrderPage, page }) => {
  await purchaseOrderPage.fillPurchaseOrderForm({
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    scheduleDate: tomorrowErpDate(),
    stockUom: masterData.stockUom,
    warehouseName: masterData.warehouseName,
  });

  await purchaseOrderPage.attemptSaveAndSubmit();

  await purchaseOrderPage.expectMissingFieldDialog();
  await expectDraftOrUnsavedDocument(page, purchaseOrderPage, 'Purchase Order', buyingNewDocumentUrlPatterns.purchaseOrder);
});
