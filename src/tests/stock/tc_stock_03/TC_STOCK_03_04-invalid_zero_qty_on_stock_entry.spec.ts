import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormStockDocument,
  openStockEntryDraft,
  stockInvalidValues,
  stockNewDocumentUrlPatterns,
} from '../../../framework/helpers/stock-test-helpers';

test('TC_STOCK_03_04-Khong cho luu chung tu kho khi so luong bang 0', async ({ page, stockEntryPage }) => {
  test.setTimeout(180000);

  await openStockEntryDraft({
    stockEntryPage,
  });

  await mutateCurrentFormStockDocument(page, {
    firstItem: {
      qty: stockInvalidValues.zeroQuantity,
    },
  });

  const submitted = await stockEntryPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await expectDraftOrUnsavedDocument(page, stockEntryPage, stockNewDocumentUrlPatterns.stockEntry);
});
