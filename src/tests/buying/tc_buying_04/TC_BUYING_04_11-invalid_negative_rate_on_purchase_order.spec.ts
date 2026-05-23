import { test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';
import { tomorrowErpDate } from '../../../framework/utils/date';
import {
  buyingInvalidValues,
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_04_11-Khong cho luu don mua hang khi don gia am', async ({ purchaseOrderPage, page }) => {
  await purchaseOrderPage.fillPurchaseOrderForm({
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    rate: buyingInvalidValues.negativeRate,
    scheduleDate: tomorrowErpDate(),
    stockUom: masterData.stockUom,
    supplierName: masterData.supplierName,
    warehouseName: masterData.warehouseName,
  });

  await purchaseOrderPage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, purchaseOrderPage, 'Purchase Order', buyingNewDocumentUrlPatterns.purchaseOrder);
});
