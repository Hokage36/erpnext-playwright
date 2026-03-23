import { masterData } from '../../framework/data/master-data';
import { uiText } from '../../framework/data/ui-text';
import { test } from '../../framework/fixtures/app.fixture';
import { expectStockReconciliationSubmitted } from '../../framework/utils/erpnext-assertions';

test('Tao kiem ke chot kho', async ({ stockReconciliationPage, page }) => {
  const { appliedQuantity } = await stockReconciliationPage.createStockReconciliation({
    purpose: uiText.stock.stockReconciliationPurpose,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.stockReconciliationQuantity,
    valuationRate: masterData.valuationRate,
  });

  await stockReconciliationPage.submit();

  const stockReconciliationName = stockReconciliationPage.currentDocumentName();
  await expectStockReconciliationSubmitted(page, {
    appliedQuantity,
    itemCode: masterData.itemCode,
    stockReconciliationName,
    valuationRate: masterData.valuationRate,
    warehouseName: masterData.warehouseName,
  });
});
