import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  openDeliveryNoteDraftFromSalesOrder,
  sellingInvalidValues,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_05_06-Khong cho luu phieu giao hang khi so luong la so thap phan', async ({
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

  await deliveryNotePage.fillFirstItemQuantity(sellingInvalidValues.decimalQuantity);
  await deliveryNotePage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, deliveryNotePage, 'Delivery Note', sellingNewDocumentUrlPatterns.deliveryNote);
});
