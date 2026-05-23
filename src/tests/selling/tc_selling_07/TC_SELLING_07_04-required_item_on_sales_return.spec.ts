import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormSellingDocument,
  openSalesReturnDraftFromDeliveryNote,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_07_04-Khong cho tra hang khi thieu ma hang', async ({
  salesReturnPage,
  page,
  salesOrderPage,
  deliveryNotePage,
}) => {
  test.setTimeout(180000);

  await openSalesReturnDraftFromDeliveryNote({
    salesReturnPage,
    page,
    salesOrderPage,
    deliveryNotePage,
  });

  await salesReturnPage.saveUntilSaved(/\/app\/delivery-note\/(?!new-delivery-note-)/);
  await mutateCurrentFormSellingDocument(page, {
    firstItem: {
      itemCode: null,
    },
  });

  await salesReturnPage.attemptSaveAndSubmit();
  await expectDraftOrUnsavedDocument(page, salesReturnPage, 'Delivery Note', sellingNewDocumentUrlPatterns.deliveryNote);
});
