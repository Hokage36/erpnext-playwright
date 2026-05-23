import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormStockDocument,
  openStockReconciliationDraft,
  stockNewDocumentUrlPatterns,
} from '../../../framework/helpers/stock-test-helpers';

test('TC_STOCK_04_02-Khong cho luu kiem ke chot kho khi thieu ma hang', async ({ page, stockReconciliationPage }) => {
  test.setTimeout(180000);

  await openStockReconciliationDraft({
    stockReconciliationPage,
  });

  await mutateCurrentFormStockDocument(page, {
    firstItem: {
      itemCode: '',
    },
  });

  const submitted = await stockReconciliationPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await stockReconciliationPage.expectMissingFieldDialog();
  await expectDraftOrUnsavedDocument(page, stockReconciliationPage, stockNewDocumentUrlPatterns.stockReconciliation);
});
