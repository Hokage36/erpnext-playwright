import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormStockDocument,
  openStockReconciliationDraft,
  stockInvalidValues,
  stockNewDocumentUrlPatterns,
} from '../../../framework/helpers/stock-test-helpers';

test('TC_STOCK_04_05-Khong cho luu kiem ke chot kho khi so luong am', async ({ page, stockReconciliationPage }) => {
  test.setTimeout(180000);

  await openStockReconciliationDraft({
    stockReconciliationPage,
  });

  await mutateCurrentFormStockDocument(page, {
    firstItem: {
      qty: stockInvalidValues.negativeQuantity,
    },
  });

  const submitted = await stockReconciliationPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await expectDraftOrUnsavedDocument(page, stockReconciliationPage, stockNewDocumentUrlPatterns.stockReconciliation);
});
