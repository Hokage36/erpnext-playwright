import { expect, test } from '../../../framework/fixtures/app.fixture';
import {
  expectDraftOrUnsavedDocument,
  mutateCurrentFormSellingDocument,
  openQuotationDraft,
  sellingNewDocumentUrlPatterns,
} from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_03_04-Khong cho luu bao gia khi thieu kho hang', async ({ page, quotationPage }) => {
  test.fail(true, 'Warehouse is optional on Quotation in the current ERPNext configuration.');

  await openQuotationDraft({
    page,
    quotationPage,
  });

  await mutateCurrentFormSellingDocument(page, {
    firstItem: {
      warehouse: '',
    },
    setWarehouse: null,
  });

  const submitted = await quotationPage.attemptSaveAndSubmit();

  expect(submitted).toBeFalsy();
  await expectDraftOrUnsavedDocument(page, quotationPage, 'Quotation', sellingNewDocumentUrlPatterns.quotation);
});
