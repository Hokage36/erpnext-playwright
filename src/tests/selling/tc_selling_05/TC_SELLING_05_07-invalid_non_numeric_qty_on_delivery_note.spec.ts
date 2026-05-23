import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  openDeliveryNoteDraftFromSalesOrder,
  sellingInvalidValues,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_05_07-Khong cho luu phieu giao hang khi so luong la ky tu khong phai so', async ({
  deliveryNotePage,
  page,
  salesOrderPage,
}) => {
  test.setTimeout(180000);

  await openDeliveryNoteDraftFromSalesOrder({
    deliveryNotePage,
    page,
    salesOrderPage,
  });

  await deliveryNotePage.fillFirstItemQuantity(sellingInvalidValues.nonNumericQuantity);
  await deliveryNotePage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, deliveryNotePage, 'Delivery Note', sellingNewDocumentUrlPatterns.deliveryNote);
});
