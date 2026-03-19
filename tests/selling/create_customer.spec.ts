import { test, expect } from '@playwright/test';

test('Tạo khách hàng mới', async ({ page }) => {
  const customerName = `Khach-Hang-${Date.now()}`;

  await page.goto('/app/home', {
    waitUntil: 'domcontentloaded',
  });

  const salesLink = page.getByRole('link', { name: 'Bán hàng', exact: true });
  await expect(salesLink).toBeVisible();
  await salesLink.click();

  const customerLink = page.locator('a[href="/app/customer"]');
  await expect(customerLink).toBeVisible();
  await customerLink.click();

  const addCustomerButton = page.getByRole('button', { name: 'Thêm Khách Hàng' });
  await expect(addCustomerButton).toBeVisible();
  await expect(addCustomerButton).toBeEnabled();
  await addCustomerButton.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  const customerNameInput = dialog.getByRole('textbox').first();
  await expect(customerNameInput).toBeVisible();
  await expect(customerNameInput).toBeEditable();
  await customerNameInput.fill(customerName);

  const saveButton = page.getByRole('button', { name: 'Lưu' });
  await expect(saveButton).toBeVisible();
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  await expect(dialog).toBeHidden();
});
