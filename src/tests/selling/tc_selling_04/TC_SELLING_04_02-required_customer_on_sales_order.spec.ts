import { masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';
import { tomorrowErpDate } from '../../../framework/utils/date';

test('TC_SELLING_04_02-Khong cho luu don ban hang khi thieu khach hang', async ({ page, salesOrderPage }) => {
  await salesOrderPage.fillSalesOrderForm({
    deliveryDate: tomorrowErpDate(),
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    warehouseName: masterData.warehouseName,
  });

  await salesOrderPage.attemptSaveAndSubmit();

  await salesOrderPage.expectMissingFieldDialog();
  await expectDraftOrUnsavedDocument(page, salesOrderPage, 'Sales Order', sellingNewDocumentUrlPatterns.salesOrder);
});
