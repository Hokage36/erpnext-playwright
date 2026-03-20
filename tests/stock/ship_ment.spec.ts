import { test, expect } from '@playwright/test';

test('Tạo Phiếu giao hàng', async ({ page }) => {
  const customerName = 'CongTyTnhhVivo';
  const itemCode = 'AKS001';
  const warehouseName = 'KhoHangPhiaDong01 - AD';

  await page.goto('/app/delivery-note/new-delivery-note', {
    waitUntil: 'domcontentloaded',
  });

  const saveButton = page.getByRole('button', { name: 'Lưu' });
  await expect(saveButton).toBeVisible();

  const customerInput = page.locator('[data-fieldname="customer"] .input-with-feedback').first();
  await expect(customerInput).toBeVisible();
  await expect(customerInput).toBeEditable();
  await customerInput.fill(customerName);
  await customerInput.press('Enter');

  const setWarehouseInput = page.locator('[data-fieldname="set_warehouse"] .input-with-feedback').first();
  await expect(setWarehouseInput).toBeVisible();
  await expect(setWarehouseInput).toBeEditable();
  await setWarehouseInput.fill(warehouseName);
  await setWarehouseInput.press('Enter');
  await page.keyboard.press('Escape');

  const itemGridCell = page.locator('.col.grid-static-col[data-fieldname="item_code"]:visible').last();
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

  const uomInput = page.getByRole('combobox', { name: 'Đơn vị đo lường' });
  await expect(uomInput).toBeVisible();
  await expect(uomInput).toBeEditable();
  await uomInput.fill('Nos');
  await uomInput.press('Enter');

  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  const missingFieldDialog = page.getByRole('dialog').filter({ hasText: /Thiếu trường|required/i });
  await expect(missingFieldDialog).toHaveCount(0);
});
