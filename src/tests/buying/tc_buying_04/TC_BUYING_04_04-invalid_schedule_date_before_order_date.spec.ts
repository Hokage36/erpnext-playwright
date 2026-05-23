import { expect, test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';
import { tomorrowErpDate, yesterdayErpDate } from '../../../framework/utils/date';
import {
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_04_04-Khong cho luu don mua hang khi ngay giao hang truoc ngay dat hang', async ({
  purchaseOrderPage,
  page,
}) => {
  await purchaseOrderPage.fillPurchaseOrderForm({
    supplierName: masterData.supplierName,
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    transactionDate: tomorrowErpDate(),
    scheduleDate: yesterdayErpDate(),
    stockUom: masterData.stockUom,
    warehouseName: masterData.warehouseName,
  });

  const submitted = await purchaseOrderPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await expectDraftOrUnsavedDocument(page, purchaseOrderPage, 'Purchase Order', buyingNewDocumentUrlPatterns.purchaseOrder);
});
