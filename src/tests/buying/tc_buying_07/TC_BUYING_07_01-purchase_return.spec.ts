import { masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import { openPurchaseReturnDraftFromPurchaseReceipt } from '../../../framework/helpers/buying-test-helpers';
import { expectPurchaseReturnSubmitted } from '../../../framework/utils/erpnext-assertions';

test('TC_BUYING_07_01-Tra hang nha cung cap tu phieu nhan hang va giam ton kho', async ({
  purchaseReturnPage,
  page,
  purchaseOrderPage,
  purchaseReceiptPage,
}) => {
  test.setTimeout(180000);

  const { originalPurchaseReceiptName } = await openPurchaseReturnDraftFromPurchaseReceipt({
    purchaseReturnPage,
    page,
    purchaseOrderPage,
    purchaseReceiptPage,
  });

  await purchaseReturnPage.saveAndSubmit();
  await purchaseReturnPage.dismissMessageDialogIfPresent();

  const purchaseReturnName = purchaseReturnPage.currentDocumentName();
  await expectPurchaseReturnSubmitted(page, {
    expectedQty: masterData.defaultQuantity,
    itemCode: masterData.itemCode,
    originalPurchaseReceiptName,
    purchaseReturnName,
    warehouseName: masterData.warehouseName,
  });
});
