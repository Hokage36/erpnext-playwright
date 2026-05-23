import { masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import { openSalesReturnDraftFromDeliveryNote } from '../../../framework/helpers/selling-test-helpers';
import { expectSalesReturnSubmitted } from '../../../framework/utils/erpnext-assertions';

test('TC_SELLING_07_01-Khach tra hang tu phieu giao hang va nhap lai ton kho', async ({
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
