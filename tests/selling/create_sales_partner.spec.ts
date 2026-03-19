import { test, expect } from '@playwright/test';

test('Tạo Đại lý bán hàng', async ({ page }) => {
  const salesPartnerName = `Dai-Ly-${Date.now()}`;

  await page.goto('/app/home', {
    waitUntil: 'domcontentloaded',
  });

  await page.getByRole('link', { name: 'Bán hàng', exact: true }).click();
  await page.getByRole('link', { name: 'Đại lý bán hàng', exact: true }).click();
  await page.getByRole('button', { name: 'Thêm Đại lý bán hàng' }).click();
  await page.locator('form').filter({ hasText: '__newname Tên đại lý' }).getByRole('textbox').fill(salesPartnerName);
  await page.getByRole('combobox').nth(2).click();
  await page.getByRole('combobox').nth(2).fill('Vietnam');
  await page.getByRole('combobox').nth(2).press('Enter');
  await page.locator('form').filter({ hasText: 'Tỷ lệ hoa hồng 0,000' }).getByRole('textbox').click();
  await page.locator('form').filter({ hasText: 'Tỷ lệ hoa hồng 0,000' }).getByRole('textbox').fill('12');
  await page.locator('form').filter({ hasText: 'Tỷ lệ hoa hồng 0,000' }).getByRole('textbox').press('Enter');
  await page.getByRole('button', { name: 'Lưu' }).click();
});
