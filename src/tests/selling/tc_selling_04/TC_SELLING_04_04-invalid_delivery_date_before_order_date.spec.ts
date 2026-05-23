import { expect, test } from '../../../framework/fixtures/app.fixture';
import { masterData } from '../../../framework/data/master-data';
import {
  expectDraftOrUnsavedDocument,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';
import { tomorrowErpDate, yesterdayErpDate } from '../../../framework/utils/date';

test('TC_SELLING_04_04-Khong cho luu don ban hang khi ngay giao hang truoc ngay dat hang', async ({
  page,
  salesOrderPage,
}) => {
  await salesOrderPage.fillSalesOrderForm({
    customerName: masterData.customerName,
    transactionDate: tomorrowErpDate(),
    deliveryDate: yesterdayErpDate(),
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    warehouseName: masterData.warehouseName,
  });

  const submitted = await salesOrderPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await expectDraftOrUnsavedDocument(page, salesOrderPage, 'Sales Order', sellingNewDocumentUrlPatterns.salesOrder);
});
