import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormStockDocument,
  openStockReconciliationDraft,
  stockNewDocumentUrlPatterns,
} from '../../../framework/helpers/stock-test-helpers';

test('TC_STOCK_04_03-Khong cho luu kiem ke chot kho khi thieu kho hang', async ({ page, stockReconciliationPage }) => {
  test.setTimeout(180000);

  await openStockReconciliationDraft({
    stockReconciliationPage,
  });

  await mutateCurrentFormStockDocument(page, {
    firstItem: {
      warehouse: '',
    },
    setWarehouse: null,
  });

  const submitted = await stockReconciliationPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await stockReconciliationPage.expectMessageDialog(/warehouse|kho/i);
  await expectDraftOrUnsavedDocument(page, stockReconciliationPage, stockNewDocumentUrlPatterns.stockReconciliation);
});
