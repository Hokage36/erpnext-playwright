import { buildUniqueItem, masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import {
  buyingNewDocumentUrlPatterns,
  expectDraftOrUnsavedDocument,
  mutateCurrentFormBuyingDocument,
  openPurchaseReturnDraftFromPurchaseReceipt,
} from '../../../framework/helpers/buying-test-helpers';

test('TC_BUYING_07_03-Khong cho tra hang khi ma hang khong khop chung tu goc', async ({
  purchaseReturnPage,
  itemPage,
  page,
  purchaseOrderPage,
  purchaseReceiptPage,
}) => {
  test.setTimeout(180000);

  const wrongItem = buildUniqueItem();
  await itemPage.createItem({
    itemCode: wrongItem.itemCode,
    itemName: wrongItem.itemName,
    itemGroup: masterData.itemGroup,
    stockUom: masterData.stockUom,
  });

  await openPurchaseReturnDraftFromPurchaseReceipt({
    purchaseReturnPage,
    page,
    purchaseOrderPage,
    purchaseReceiptPage,
  });

  await purchaseReturnPage.saveUntilSaved(/\/app\/purchase-receipt\/(?!new-purchase-receipt-)/);
  await mutateCurrentFormBuyingDocument(page, {
    firstItem: {
      itemCode: wrongItem.itemCode,
    },
  });

  await purchaseReturnPage.attemptSaveAndSubmit();
  await expectDraftOrUnsavedDocument(page, purchaseReturnPage, 'Purchase Receipt', buyingNewDocumentUrlPatterns.purchaseReceipt);
});
