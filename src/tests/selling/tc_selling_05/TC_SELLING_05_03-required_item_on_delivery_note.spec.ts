import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormSellingDocument,
  openDeliveryNoteDraftFromSalesOrder,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_05_03-Khong cho luu phieu giao hang khi thieu ma hang', async ({ deliveryNotePage, page, salesOrderPage }) => {
  test.setTimeout(180000);

  await openDeliveryNoteDraftFromSalesOrder({
    deliveryNotePage,
    page,
    salesOrderPage,
  });

  await mutateCurrentFormSellingDocument(page, {
    firstItem: {
      itemCode: '',
    },
  });

  await deliveryNotePage.attemptSaveAndSubmit();

  await deliveryNotePage.expectMissingFieldDialog();
  await expectDraftOrUnsavedDocument(page, deliveryNotePage, 'Delivery Note', sellingNewDocumentUrlPatterns.deliveryNote);
});
