import { buildUniqueSalesPartnerName, masterData } from '../../../framework/data/master-data';
import { test, expect } from '../../../framework/fixtures/app.fixture';
import { sellingNewDocumentUrlPatterns } from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_02_03-Khong cho luu dai ly ban hang khi thieu khu vuc', async ({ page, salesPartnerPage }) => {
  await salesPartnerPage.fillSalesPartnerForm({
    commissionRate: masterData.salesPartnerCommissionRate,
    name: buildUniqueSalesPartnerName(),
  });
  await salesPartnerPage.saveSalesPartner();

  await salesPartnerPage.expectMissingFieldDialog();
  await expect(page).toHaveURL(sellingNewDocumentUrlPatterns.salesPartner);
});
