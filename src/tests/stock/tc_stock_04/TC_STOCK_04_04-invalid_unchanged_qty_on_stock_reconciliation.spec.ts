import { expect, test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';
import { expectDraftOrUnsavedDocument, stockNewDocumentUrlPatterns } from '../../../framework/helpers/stock-test-helpers';

test('TC_STOCK_04_04-Khong cho luu kiem ke chot kho khi so luong thay doi bang so luong hien tai', async ({
  page,
  stockReconciliationPage,
}) => {
  test.setTimeout(180000);

  const { currentQuantity } = await stockReconciliationPage.prepareStockReconciliationDraft({
    purpose: masterData.stockReconciliationPurpose,
    itemCode: masterData.itemCode,
    quantity: masterData.stockReconciliationQuantity,
    valuationRate: masterData.valuationRate,
    warehouseName: masterData.warehouseName,
  });

  await stockReconciliationPage.fillFirstItemQuantity(currentQuantity);

  const submitted = await stockReconciliationPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await expectDraftOrUnsavedDocument(page, stockReconciliationPage, stockNewDocumentUrlPatterns.stockReconciliation);
});
