import { masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';
import { tomorrowErpDate } from '../../../framework/utils/date';

test('TC_SELLING_04_06-Khong cho luu don ban hang khi thieu kho hang', async ({ page, salesOrderPage }) => {
  await salesOrderPage.fillSalesOrderForm({
    customerName: masterData.customerName,
    deliveryDate: tomorrowErpDate(),
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
  });

  await salesOrderPage.attemptSaveAndSubmit();

  await salesOrderPage.expectMessageDialog(/warehouse|kho|AKS001/i);
  await expectDraftOrUnsavedDocument(page, salesOrderPage, 'Sales Order', sellingNewDocumentUrlPatterns.salesOrder);
});
