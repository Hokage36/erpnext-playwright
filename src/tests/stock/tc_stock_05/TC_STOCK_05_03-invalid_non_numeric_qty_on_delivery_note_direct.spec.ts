import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  openDirectDeliveryNoteDraft,
  stockInvalidValues,
  stockNewDocumentUrlPatterns,
} from '../../../framework/helpers/stock-test-helpers';

test('TC_STOCK_05_03-Khong cho luu phieu giao hang truc tiep khi so luong la ky tu khong phai so', async ({
  deliveryNotePage,
  page,
  stockEntryPage,
}) => {
  test.setTimeout(180000);

  await openDirectDeliveryNoteDraft({
    deliveryNotePage,
    stockEntryPage,
  });

  await deliveryNotePage.fillFirstItemQuantity(stockInvalidValues.nonNumericQuantity);
  await deliveryNotePage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, deliveryNotePage, stockNewDocumentUrlPatterns.deliveryNote);
});
