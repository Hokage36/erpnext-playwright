import { masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  sellingInvalidValues,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';
import { tomorrowErpDate } from '../../../framework/utils/date';

test('TC_SELLING_04_08-Khong cho luu don ban hang khi so luong am', async ({ page, salesOrderPage }) => {
  await salesOrderPage.fillSalesOrderForm({
    customerName: masterData.customerName,
    deliveryDate: tomorrowErpDate(),
    itemCode: masterData.itemCode,
    quantity: sellingInvalidValues.negativeQuantity,
    warehouseName: masterData.warehouseName,
  });

  await salesOrderPage.attemptSaveAndSubmit();

  await expectDraftOrUnsavedDocument(page, salesOrderPage, 'Sales Order', sellingNewDocumentUrlPatterns.salesOrder);
});
