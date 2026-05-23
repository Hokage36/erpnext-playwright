import { masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_03_02-Khong cho luu bao gia khi thieu khach hang', async ({ page, quotationPage }) => {
  await quotationPage.fillQuotationForm({
    itemCode: masterData.itemCode,
    quantity: masterData.defaultQuantity,
    warehouseName: masterData.warehouseName,
  });

  await quotationPage.attemptSaveAndSubmit();

  await quotationPage.expectMissingFieldDialog();
  await expectDraftOrUnsavedDocument(page, quotationPage, 'Quotation', sellingNewDocumentUrlPatterns.quotation);
});
