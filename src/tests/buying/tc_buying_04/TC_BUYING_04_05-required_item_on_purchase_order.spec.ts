import { test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';
import { tomorrowErpDate } from '../../../framework/utils/date';
import {
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_04_05-Khong cho luu don mua hang khi thieu ma hang', async ({ purchaseOrderPage, page }) => {
  await purchaseOrderPage.fillPurchaseOrderForm({
    quantity: masterData.defaultQuantity,
    scheduleDate: tomorrowErpDate(),
    stockUom: masterData.stockUom,
    supplierName: masterData.supplierName,
    warehouseName: masterData.warehouseName,
  });

  await purchaseOrderPage.attemptSaveAndSubmit();

  await purchaseOrderPage.expectMissingFieldDialog();
  await expectDraftOrUnsavedDocument(page, purchaseOrderPage, 'Purchase Order', buyingNewDocumentUrlPatterns.purchaseOrder);
});
