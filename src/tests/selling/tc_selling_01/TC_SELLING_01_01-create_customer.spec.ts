import { buildUniqueCustomerName } from '../../../framework/data/master-data';
import { test } from '../../../framework/fixtures/app.fixture';

test('TC_SELLING_01_01-Tao khach hang moi', async ({ customerPage }) => {
  await customerPage.gotoList();
  await customerPage.createCustomer(buildUniqueCustomerName());
});
