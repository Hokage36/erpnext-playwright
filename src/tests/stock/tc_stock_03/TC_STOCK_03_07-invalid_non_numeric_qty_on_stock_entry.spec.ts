import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  openStockEntryDraft,
  stockInvalidValues,
  stockNewDocumentUrlPatterns,
} from '../../../framework/helpers/stock-test-helpers';

test('TC_STOCK_03_07-Khong cho luu chung tu kho khi so luong la ky tu khong phai so', async ({
  page,
  stockEntryPage,
}) => {
  test.setTimeout(180000);

  await openStockEntryDraft({
    stockEntryPage,
  });

  await stockEntryPage.fillFirstItemQuantity(stockInvalidValues.nonNumericQuantity);
  const submitted = await stockEntryPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await expectDraftOrUnsavedDocument(page, stockEntryPage, stockNewDocumentUrlPatterns.stockEntry);
});
