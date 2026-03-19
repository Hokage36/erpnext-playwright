import { test, expect } from '@playwright/test';

function formatDeliveryDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

test('Tạo Đơn đặt hàng', async ({ page }) => {
  const customerName = 'CongTyTnhhVivo';
  const itemCode = 'AKS001';
  const warehouseName = 'KhoHangPhiaDong01 - AD';
  const deliveryDate = formatDeliveryDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

  await page.goto('/app/home', {
    waitUntil: 'domcontentloaded',
  });

  const salesLink = page.getByRole('link', { name: 'Bán hàng', exact: true });
  await expect(salesLink).toBeVisible();
  await salesLink.click();

  const salesOrderLink = page.getByRole('link', { name: 'Đơn đặt hàng' }).nth(1);
  await expect(salesOrderLink).toBeVisible();
  await salesOrderLink.click();

  const addSalesOrderButton = page.getByRole('button', { name: 'Thêm Đơn đặt hàng' });
  await expect(addSalesOrderButton).toBeVisible();
  await expect(addSalesOrderButton).toBeEnabled();
  await addSalesOrderButton.click();

  const saveButton = page.getByRole('button', { name: 'Lưu' });
  await expect(saveButton).toBeVisible();

  const customerInput = page.getByRole('combobox').nth(2);
  await expect(customerInput).toBeVisible();
  await expect(customerInput).toBeEditable();
  await customerInput.click();
  await customerInput.fill(customerName);
  await customerInput.press('Enter');

  const itemGridCell = page.locator('.col.grid-static-col.col-xs-3.error').first();
  await expect(itemGridCell).toBeVisible();
  await itemGridCell.click();

  const itemCodeInput = page.getByRole('combobox', { name: 'Mã hàng' });
  await expect(itemCodeInput).toBeVisible();
  await expect(itemCodeInput).toBeEditable();
  await itemCodeInput.fill(itemCode);
  await itemCodeInput.press('Enter');

  const deliveryDateInput = page.getByRole('textbox', { name: 'Ngày giao hàng' });
  await expect(deliveryDateInput).toBeVisible();
  await expect(deliveryDateInput).toBeEditable();
  await deliveryDateInput.fill(deliveryDate);
  await deliveryDateInput.press('Enter');

  const openRowButton = page.locator('.data-row.row.editable-row > div:nth-child(8) > .btn-open-row').first();
  await expect(openRowButton).toBeVisible();
  await openRowButton.click();

  const warehouseInput = page
    .locator(
      'div:nth-child(11) > .section-body > div > form > div > .form-group > .control-input-wrapper > .control-input > .link-field > .awesomplete > .input-with-feedback'
    )
    .first();

  await expect(warehouseInput).toBeVisible();
  await expect(warehouseInput).toBeEditable();
  await warehouseInput.click();
  await warehouseInput.fill(warehouseName);
  await warehouseInput.press('Enter');

  const collapseRowButton = page.locator('.btn.btn-secondary.btn-sm.pull-right').first();
  await expect(collapseRowButton).toBeVisible();
  await collapseRowButton.click();

  await expect(saveButton).toBeVisible();
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
