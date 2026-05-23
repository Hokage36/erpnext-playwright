import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormSellingDocument,
  openDeliveryNoteDraftFromSalesOrder,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_05_02-Khong cho luu phieu giao hang khi thieu kho hang', async ({ deliveryNotePage, page, salesOrderPage }) => {
  test.setTimeout(180000);

  await openDeliveryNoteDraftFromSalesOrder({
    deliveryNotePage,
    page,
    salesOrderPage,
  });

  await mutateCurrentFormSellingDocument(page, {
    firstItem: {
      warehouse: '',
    },
    setWarehouse: null,
  });

  await deliveryNotePage.attemptSaveAndSubmit();

  await deliveryNotePage.expectMessageDialog(/warehouse|kho|AKS001/i);
  await expectDraftOrUnsavedDocument(page, deliveryNotePage, 'Delivery Note', sellingNewDocumentUrlPatterns.deliveryNote);
});
