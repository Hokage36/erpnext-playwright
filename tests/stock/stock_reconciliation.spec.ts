import { masterData } from '../../framework/data/master-data';
import { uiText } from '../../framework/data/ui-text';
import { test } from '../../framework/fixtures/app.fixture';

test('Tao kiem ke chot kho', async ({ stockReconciliationPage }) => {
  await stockReconciliationPage.createStockReconciliation({
    purpose: uiText.stock.stockReconciliationPurpose,
    itemCode: masterData.itemCode,
    warehouseName: masterData.warehouseName,
    quantity: masterData.stockReconciliationQuantity,
    valuationRate: masterData.valuationRate,
  });
});
