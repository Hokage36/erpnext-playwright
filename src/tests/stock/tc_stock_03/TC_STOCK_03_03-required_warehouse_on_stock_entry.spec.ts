import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormStockDocument,
  openStockEntryDraft,
  stockNewDocumentUrlPatterns,
} from '../../../framework/helpers/stock-test-helpers';

test('TC_STOCK_03_03-Khong cho luu chung tu kho khi thieu kho nhap', async ({ page, stockEntryPage }) => {
  test.setTimeout(180000);

  await openStockEntryDraft({
    stockEntryPage,
  });

  await mutateCurrentFormStockDocument(page, {
    firstItem: {
      targetWarehouse: '',
    },
    toWarehouse: null,
  });

  const submitted = await stockEntryPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await stockEntryPage.expectMessageDialog(/warehouse|kho/i);
  await expectDraftOrUnsavedDocument(page, stockEntryPage, stockNewDocumentUrlPatterns.stockEntry);
});
