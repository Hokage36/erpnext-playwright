import { buildUniqueSalesPartnerName, masterData } from '../../../framework/data/master-data';
import { test, expect } from '../../../framework/fixtures/app.fixture';
import { sellingInvalidValues, sellingNewDocumentUrlPatterns } from '../../../framework/helpers/selling-test-helpers';

test('TC_SELLING_02_04-Khong cho luu dai ly ban hang khi ty le hoa hong am', async ({ page, salesPartnerPage }) => {
  await salesPartnerPage.fillSalesPartnerForm({
    commissionRate: sellingInvalidValues.negativeCommissionRate,
    name: buildUniqueSalesPartnerName(),
    territory: masterData.territoryName,
  });
  await salesPartnerPage.saveSalesPartner();

  await expect(page).toHaveURL(sellingNewDocumentUrlPatterns.salesPartner);
});
