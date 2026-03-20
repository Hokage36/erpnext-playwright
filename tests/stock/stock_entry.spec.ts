import { test, expect } from '@playwright/test';

test('Tạo Chứng từ kho', async ({ page }) => {
  const stockEntryType = 'Material Receipt';
  const itemCode = 'AKS001';
  const warehouseName = 'KhoHangPhiaDong01 - AD';

  await page.goto('/app/stock-entry/new-stock-entry', {
    waitUntil: 'domcontentloaded',
  });

  const saveButton = page.getByRole('button', { name: 'Lưu' });
  await expect(saveButton).toBeVisible();

  const stockEntryTypeInput = page.locator('[data-fieldname="stock_entry_type"] .input-with-feedback').first();
  await expect(stockEntryTypeInput).toBeVisible();
  await expect(stockEntryTypeInput).toBeEditable();
  await stockEntryTypeInput.fill(stockEntryType);
  await page.getByRole('option', { name: stockEntryType }).click();

  const defaultWarehouseSection = page.getByText('Kho mặc định').first();
  await expect(defaultWarehouseSection).toBeVisible();
  await defaultWarehouseSection.click();

  const targetWarehouseInput = page.locator('[data-fieldname="to_warehouse"] .input-with-feedback:visible').first();
  await expect(targetWarehouseInput).toBeVisible();
  await expect(targetWarehouseInput).toBeEditable();
  await targetWarehouseInput.fill(warehouseName);
  await targetWarehouseInput.press('Enter');

  const itemGridCell = page.locator('.col.grid-static-col[data-fieldname="item_code"]').last();
  await expect(itemGridCell).toBeVisible();
  await itemGridCell.click();

  const itemCodeInput = page.getByRole('combobox', { name: 'Mã hàng' });
  await expect(itemCodeInput).toBeVisible();
  await expect(itemCodeInput).toBeEditable();
  await itemCodeInput.fill(itemCode);
  await itemCodeInput.press('Enter');

  const quantityInput = page.getByRole('textbox', { name: 'Số lượng' });
  await expect(quantityInput).toBeVisible();
  await expect(quantityInput).toBeEditable();
  await quantityInput.fill('1');

  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  const missingFieldDialog = page.getByRole('dialog').filter({ hasText: /Thiếu trường|required/i });
  await expect(missingFieldDialog).toHaveCount(0);
});
