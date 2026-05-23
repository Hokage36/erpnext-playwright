import { masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_04_03-Khong cho luu don ban hang khi thieu ngay giao hang', async ({ page, salesOrderPage }) => {
  await salesOrderPage.fillSalesOrderForm({
    customerName: masterData.customerName,
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    warehouseName: masterData.warehouseName,
  });

  await salesOrderPage.attemptSaveAndSubmit();

  await salesOrderPage.expectMissingFieldDialog();
  await expectDraftOrUnsavedDocument(page, salesOrderPage, 'Sales Order', sellingNewDocumentUrlPatterns.salesOrder);
});
