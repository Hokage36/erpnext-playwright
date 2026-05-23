import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormSellingDocument,
  openDeliveryNoteDraftFromSalesOrder,
  sellingInvalidValues,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_05_05-Khong cho luu phieu giao hang khi so luong am', async ({ deliveryNotePage, page, salesOrderPage }) => {
  test.setTimeout(180000);

  await openDeliveryNoteDraftFromSalesOrder({
    deliveryNotePage,
    page,
    salesOrderPage,
  });

  await mutateCurrentFormSellingDocument(page, {
    firstItem: {
      qty: sellingInvalidValues.negativeQuantity,
    },
  });

  await deliveryNotePage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, deliveryNotePage, 'Delivery Note', sellingNewDocumentUrlPatterns.deliveryNote);
});
