import { masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import {
  mutateCurrentFormBuyingDocument,
  openPurchaseReturnDraftFromPurchaseReceipt,
} from '../../../framework/helpers/buying-test-helpers';
import { expectPurchaseReturnSubmitted } from '../../../framework/utils/erpnext-assertions';

test('TC_BUYING_07_02-Tra mot phan hang nha cung cap tu phieu nhan hang', async ({
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
    quantity: masterData.stockReconciliationQuantity,
  });

  await purchaseReturnPage.saveUntilSaved(/\/app\/purchase-receipt\/(?!new-purchase-receipt-)/);
  await mutateCurrentFormBuyingDocument(page, {
    firstItem: {
      qty: '-1',
    },
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
