import { test, expect } from '@playwright/test';

test('Tạo Hạng mục mới', async ({ page }) => {
  const itemCode = `MA-HANG-${Date.now()}`;
  const itemName = `Mat hang ${Date.now()}`;
  const itemGroup = 'Products';
  const stockUom = 'Nos';

  await page.goto('/app/item/new-item', {
    waitUntil: 'domcontentloaded',
  });

  const saveButton = page.getByRole('button', { name: 'Lưu' });
  await expect(saveButton).toBeVisible();

  const itemCodeInput = page.locator('[data-fieldname="item_code"] input').first();
  await expect(itemCodeInput).toBeVisible();
  await expect(itemCodeInput).toBeEditable();
  await itemCodeInput.fill(itemCode);

  const itemNameInput = page.locator('[data-fieldname="item_name"] input').first();
  await expect(itemNameInput).toBeVisible();
  await expect(itemNameInput).toBeEditable();
  await itemNameInput.fill(itemName);

  const itemGroupInput = page.locator('[data-fieldname="item_group"] .input-with-feedback').first();
  await expect(itemGroupInput).toBeVisible();
  await expect(itemGroupInput).toBeEditable();
  await itemGroupInput.fill(itemGroup);
  await itemGroupInput.press('Enter');

  const stockUomInput = page.locator('[data-fieldname="stock_uom"] .input-with-feedback').first();
  await expect(stockUomInput).toBeVisible();
  await expect(stockUomInput).toBeEditable();
  await stockUomInput.fill(stockUom);
  await stockUomInput.press('Enter');

  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  const missingFieldDialog = page.getByRole('dialog').filter({ hasText: /Thiếu trường|required/i });
  await expect(missingFieldDialog).toHaveCount(0);
});
