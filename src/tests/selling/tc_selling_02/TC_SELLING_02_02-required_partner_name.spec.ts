import { masterData } from '../../../framework/data/master-data';
import { test, expect } from '../../../framework/fixtures/app.fixture';
import { sellingNewDocumentUrlPatterns } from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_02_02-Khong cho luu dai ly ban hang khi thieu ten dai ly', async ({ page, salesPartnerPage }) => {
  await salesPartnerPage.fillSalesPartnerForm({
    commissionRate: masterData.salesPartnerCommissionRate,
    territory: masterData.territoryName,
  });
  await salesPartnerPage.saveSalesPartner();

  await salesPartnerPage.expectMissingFieldDialog();
  await expect(page).toHaveURL(sellingNewDocumentUrlPatterns.salesPartner);
});
