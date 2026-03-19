import { test, expect } from '@playwright/test';

test('Tạo Báo giá', async ({ page }) => {
  const customerName = 'CongTyTnhhVivo';
  const itemCode = 'AKS001';
  const warehouseName = 'KhoHangPhiaDong01 - AD';

  await page.goto('/app/quotation/new-quotation', {
    waitUntil: 'domcontentloaded',
  });

  const saveButton = page.getByRole('button', { name: 'Lưu' });
  await expect(saveButton).toBeVisible();

  const customerInput = page.getByRole('combobox').nth(3);
  await expect(customerInput).toBeVisible();
  await customerInput.fill(customerName);
  await customerInput.press('Enter');
  await expect(customerInput).toHaveValue(new RegExp(customerName, 'i'));

  const itemGridCell = page.locator('.col.grid-static-col.col-xs-4.bold').first();
  await expect(itemGridCell).toBeVisible();
  await itemGridCell.click();

  const itemCodeInput = page.getByRole('combobox', { name: 'Mã hàng' });
  await expect(itemCodeInput).toBeVisible();
  await itemCodeInput.fill(itemCode);
  await itemCodeInput.press('Enter');
  await expect(itemCodeInput).toHaveValue(new RegExp(itemCode, 'i'));

  const openRowButton = page.locator('.btn-open-row > a').first();
  await expect(openRowButton).toBeVisible();
  await openRowButton.click();

  const openRow = page.locator('.grid-row-open').last();
  await expect(openRow).toBeVisible();

  const warehouseInput = openRow
    .locator('[data-fieldname="warehouse"] .input-with-feedback:visible')
    .first();

  await expect(warehouseInput).toBeVisible();
  await warehouseInput.fill(warehouseName);
  await warehouseInput.press('Enter');
  await expect(warehouseInput).toHaveValue(new RegExp('KhoHangPhiaDong01', 'i'));

  const collapseRowButton = page.locator('.btn.btn-secondary.btn-sm.pull-right').first();
  await expect(collapseRowButton).toBeVisible();
  await collapseRowButton.click();

  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  const missingFieldDialog = page.getByRole('dialog').filter({ hasText: /thiếu trường|required/i });
  await expect(missingFieldDialog).toHaveCount(0);

  await expect(page.getByText(/chưa lưu/i)).toHaveCount(0, { timeout: 15000 });

  const submitButton = page.getByRole('button', { name: 'Gửi' });
  await expect(submitButton).toBeVisible({ timeout: 15000 });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  const confirmButton = page.getByRole('button', { name: 'Đồng ý' });
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();
});
