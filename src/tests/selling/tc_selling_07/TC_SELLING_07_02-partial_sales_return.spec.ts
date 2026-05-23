import { masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import {
  mutateCurrentFormSellingDocument,
  openSalesReturnDraftFromDeliveryNote,
} from '../../../framework/helpers/selling-test-helpers';
import { expectSalesReturnSubmitted } from '../../../framework/utils/erpnext-assertions';

test('TC_SELLING_07_02-Khach tra mot phan hang tu phieu giao hang', async ({
  salesReturnPage,
  page,
  salesOrderPage,
  deliveryNotePage,
}) => {
  test.setTimeout(180000);

  const { originalDeliveryNoteName } = await openSalesReturnDraftFromDeliveryNote({
    salesReturnPage,
    page,
    salesOrderPage,
    deliveryNotePage,
    quantity: masterData.stockReconciliationQuantity,
  });

  await salesReturnPage.saveUntilSaved(/\/app\/delivery-note\/(?!new-delivery-note-)/);
  await mutateCurrentFormSellingDocument(page, {
    firstItem: {
      qty: '-1',
    },
  });

  await salesReturnPage.saveAndSubmit();
  await salesReturnPage.dismissMessageDialogIfPresent();

  const deliveryReturnName = salesReturnPage.currentDocumentName();
  await expectSalesReturnSubmitted(page, {
    deliveryReturnName,
    expectedQty: masterData.defaultQuantity,
    itemCode: masterData.itemCode,
    originalDeliveryNoteName,
    warehouseName: masterData.warehouseName,
  });
});
