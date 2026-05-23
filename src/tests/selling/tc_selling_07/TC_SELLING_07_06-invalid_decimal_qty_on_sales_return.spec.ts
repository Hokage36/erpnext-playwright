import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  openSalesReturnDraftFromDeliveryNote,
  sellingInvalidValues,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_07_06-Khong cho tra hang khi so luong tra la so thap phan', async ({
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
  await salesReturnPage.fillFirstItemQuantity(sellingInvalidValues.negativeReturnDecimalQuantity);
  await salesReturnPage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, salesReturnPage, 'Delivery Note', sellingNewDocumentUrlPatterns.deliveryNote);
});
