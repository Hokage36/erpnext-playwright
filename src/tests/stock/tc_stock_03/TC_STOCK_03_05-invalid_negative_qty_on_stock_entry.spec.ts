import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormStockDocument,
  openStockEntryDraft,
  stockInvalidValues,
  stockNewDocumentUrlPatterns,
} from '../../../framework/helpers/stock-test-helpers';

test('TC_STOCK_03_05-Khong cho luu chung tu kho khi so luong am', async ({ page, stockEntryPage }) => {
  test.setTimeout(180000);

  await openStockEntryDraft({
    stockEntryPage,
  });

  await mutateCurrentFormStockDocument(page, {
    firstItem: {
      qty: stockInvalidValues.negativeQuantity,
    },
  });

  const submitted = await stockEntryPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await expectDraftOrUnsavedDocument(page, stockEntryPage, stockNewDocumentUrlPatterns.stockEntry);
});
