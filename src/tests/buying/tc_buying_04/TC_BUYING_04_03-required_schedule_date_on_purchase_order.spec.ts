import { test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';
import {
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_04_03-Khong cho luu don mua hang khi thieu ngay giao hang', async ({ purchaseOrderPage, page }) => {
  await purchaseOrderPage.fillPurchaseOrderForm({
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    stockUom: masterData.stockUom,
    supplierName: masterData.supplierName,
    warehouseName: masterData.warehouseName,
  });

  await purchaseOrderPage.attemptSaveAndSubmit();

  await purchaseOrderPage.expectMissingFieldDialog();
  await expectDraftOrUnsavedDocument(page, purchaseOrderPage, 'Purchase Order', buyingNewDocumentUrlPatterns.purchaseOrder);
});
