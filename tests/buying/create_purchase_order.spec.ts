import { test, expect } from '@playwright/test';

function formatScheduleDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

test('Tạo Đơn mua hàng', async ({ page }) => {
  const supplierName = 'NhaCungCap1';
  const itemCode = 'AKS001';
  const warehouseName = 'KhoHangPhiaDong01 - AD';
  const scheduleDate = formatScheduleDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

  await page.goto('/app/home', {
    waitUntil: 'domcontentloaded',
  });

  const buyingLink = page.getByRole('link', { name: 'Mua hàng', exact: true });
  await expect(buyingLink).toBeVisible();
  await buyingLink.click();

  const purchaseOrderLink = page.locator('a[href="/app/purchase-order"]');
  await expect(purchaseOrderLink).toBeVisible();
  await purchaseOrderLink.click();

  const addPurchaseOrderButton = page.getByRole('button', { name: 'Thêm Mua hàng' });
  await expect(addPurchaseOrderButton).toBeVisible();
  await expect(addPurchaseOrderButton).toBeEnabled();
  await addPurchaseOrderButton.click();

  const saveButton = page.getByRole('button', { name: 'Lưu' });
  await expect(saveButton).toBeVisible();

  const supplierInput = page.getByRole('combobox').nth(2);
  await expect(supplierInput).toBeVisible();
  await expect(supplierInput).toBeEditable();
  await supplierInput.click();
  await supplierInput.fill(supplierName);
  await supplierInput.press('Enter');

  const materialRequestDialog = page.getByRole('dialog').filter({ hasText: 'Chọn Yêu cầu nguyên liệu' });
  const materialRequestDialogVisible = await materialRequestDialog
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (materialRequestDialogVisible) {
    const closeMaterialRequestDialogButton = materialRequestDialog
      .locator('.modal-header button:visible')
      .last();

    await expect(closeMaterialRequestDialogButton).toBeVisible();
    await closeMaterialRequestDialogButton.click();
    await expect(materialRequestDialog).toBeHidden();
  }

  const scheduleDateInput = page.getByRole('textbox').nth(1);
  await expect(scheduleDateInput).toBeVisible();
  await expect(scheduleDateInput).toBeEditable();
  await scheduleDateInput.fill(scheduleDate);
  await scheduleDateInput.press('Tab');

  const itemGridCell = page.locator('.col.grid-static-col.col-xs-2.error').first();
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

  const openRowButton = page.locator('.btn-open-row > a').first();
  await expect(openRowButton).toBeVisible();
  await openRowButton.click();

  const openRow = page.locator('.grid-row-open').last();
  await expect(openRow).toBeVisible();

  const warehouseInput = openRow
    .locator('[data-fieldname="warehouse"] .input-with-feedback:visible')
    .first();

  await expect(warehouseInput).toBeVisible();
  await expect(warehouseInput).toBeEditable();
  await warehouseInput.click();
  await warehouseInput.fill(warehouseName);
  await warehouseInput.press('Enter');

  const collapseRowButton = page.locator('.btn.btn-secondary.btn-sm.pull-right').first();
  await expect(collapseRowButton).toBeVisible();
  await collapseRowButton.click();

  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  const submitButton = page.getByRole('button', { name: 'Gửi' });
  await expect(submitButton).toBeVisible({ timeout: 15000 });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  const confirmButton = page.getByRole('button', { name: 'Đồng ý' });
  await expect(confirmButton).toBeVisible();
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();
});
