import { buildUniqueItem, masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormSellingDocument,
  openSalesReturnDraftFromDeliveryNote,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_07_03-Khong cho tra hang khi ma hang khong khop chung tu goc', async ({
  salesReturnPage,
  itemPage,
  page,
  salesOrderPage,
  deliveryNotePage,
}) => {
  test.setTimeout(180000);

  const wrongItem = buildUniqueItem();
  await itemPage.createItem({
    itemCode: wrongItem.itemCode,
    itemName: wrongItem.itemName,
    itemGroup: masterData.itemGroup,
    stockUom: masterData.stockUom,
  });

  await openSalesReturnDraftFromDeliveryNote({
    salesReturnPage,
    page,
    salesOrderPage,
    deliveryNotePage,
  });

  await salesReturnPage.saveUntilSaved(/\/app\/delivery-note\/(?!new-delivery-note-)/);
  await mutateCurrentFormSellingDocument(page, {
    firstItem: {
      itemCode: wrongItem.itemCode,
    },
  });

  await salesReturnPage.attemptSaveAndSubmit();
  await expectDraftOrUnsavedDocument(page, salesReturnPage, 'Delivery Note', sellingNewDocumentUrlPatterns.deliveryNote);
});
