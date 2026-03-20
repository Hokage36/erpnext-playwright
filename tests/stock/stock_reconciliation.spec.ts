import { test, expect } from '@playwright/test';

test('Tạo Kiểm kê, chốt kho', async ({ page }) => {
  const itemCode = 'AKS001';
  const warehouseName = 'KhoHangPhiaDong01 - AD';

  await page.goto('/app/stock-reconciliation/new-stock-reconciliation', {
    waitUntil: 'domcontentloaded',
  });

  const saveButton = page.getByRole('button', { name: 'Lưu' });
  await expect(saveButton).toBeVisible();

  const purposeSelect = page.locator('[data-fieldname="purpose"] select').first();
  await expect(purposeSelect).toBeVisible();
  await purposeSelect.selectOption({ label: 'Kiểm kê, chốt kho' });

  const setWarehouseInput = page.locator('[data-fieldname="set_warehouse"] .input-with-feedback').first();
  await expect(setWarehouseInput).toBeVisible();
  await expect(setWarehouseInput).toBeEditable();
  await setWarehouseInput.fill(warehouseName);
  await setWarehouseInput.press('Enter');

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
  await quantityInput.fill('5');

  const valuationRateInput = page.getByRole('textbox', { name: 'Định giá' });
  await expect(valuationRateInput).toBeVisible();
  await expect(valuationRateInput).toBeEditable();
  await valuationRateInput.fill('100000');

  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  const missingFieldDialog = page.getByRole('dialog').filter({ hasText: /Thiếu trường|required/i });
  await expect(missingFieldDialog).toHaveCount(0);
});
