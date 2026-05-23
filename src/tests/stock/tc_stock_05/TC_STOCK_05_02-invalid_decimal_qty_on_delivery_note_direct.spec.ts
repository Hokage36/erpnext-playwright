import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  openDirectDeliveryNoteDraft,
  stockInvalidValues,
  stockNewDocumentUrlPatterns,
} from '../../../framework/helpers/stock-test-helpers';

test('TC_STOCK_05_02-Khong cho luu phieu giao hang truc tiep khi so luong la so thap phan', async ({
  deliveryNotePage,
  page,
  stockEntryPage,
}) => {
  test.setTimeout(180000);

  await openDirectDeliveryNoteDraft({
    deliveryNotePage,
    stockEntryPage,
  });

  await deliveryNotePage.fillFirstItemQuantity(stockInvalidValues.decimalQuantity);
  await deliveryNotePage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, deliveryNotePage, stockNewDocumentUrlPatterns.deliveryNote);
});
