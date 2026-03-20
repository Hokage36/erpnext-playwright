import { test, expect } from '@playwright/test';

test('Tạo Kho hàng mới', async ({ page }) => {
  const warehouseName = `Kho-Hang-${Date.now()}`;

  await page.goto('/app/home', {
    waitUntil: 'domcontentloaded',
  });

  const stockLink = page.getByRole('link', { name: 'Kho', exact: true });
  await expect(stockLink).toBeVisible();
  await stockLink.click();

  const warehouseLink = page.locator('a[href="/app/warehouse"]');
  await expect(warehouseLink).toBeVisible();
  await warehouseLink.click();

  const addWarehouseButton = page.getByRole('button', { name: 'Thêm Kho hàng' });
  await expect(addWarehouseButton).toBeVisible();
  await expect(addWarehouseButton).toBeEnabled();
  await addWarehouseButton.click();

  const saveButton = page.getByRole('button', { name: 'Lưu' });
  await expect(saveButton).toBeVisible();

  const warehouseNameInput = page.locator('[data-fieldname="warehouse_name"] input').first();
  await expect(warehouseNameInput).toBeVisible();
  await expect(warehouseNameInput).toBeEditable();
  await warehouseNameInput.fill(warehouseName);

  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  const missingFieldDialog = page.getByRole('dialog').filter({ hasText: /Thiếu trường|required/i });
  await expect(missingFieldDialog).toHaveCount(0);
});
