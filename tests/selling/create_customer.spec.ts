import { buildUniqueCustomerName } from '../../framework/data/master-data';
import { test } from '../../framework/fixtures/app.fixture';

test('Tao khach hang moi', async ({ customerPage }) => {
  await customerPage.gotoList();
  await customerPage.createCustomer(buildUniqueCustomerName());
});
