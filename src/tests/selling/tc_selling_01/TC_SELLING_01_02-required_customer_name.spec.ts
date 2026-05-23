import { test } from '../../../framework/fixtures/app.fixture';

test('TC_SELLING_01_02-Khong cho tao khach hang khi thieu ten khach hang', async ({ customerPage }) => {
  await customerPage.gotoList();
  await customerPage.openCreateCustomerDialog();
  await customerPage.saveCustomerDialog();

  await customerPage.expectMissingFieldDialog();
  await customerPage.expectCreateCustomerDialogVisible();
});
