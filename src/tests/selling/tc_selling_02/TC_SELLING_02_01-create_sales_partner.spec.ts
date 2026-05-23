import { buildUniqueSalesPartnerName, masterData } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';

test('TC_SELLING_02_01-Tao dai ly ban hang', async ({ salesPartnerPage }) => {
  await salesPartnerPage.gotoList();
  await salesPartnerPage.createSalesPartner({
    name: buildUniqueSalesPartnerName(),
    territory: masterData.territoryName,
    commissionRate: masterData.salesPartnerCommissionRate,
  });
});
