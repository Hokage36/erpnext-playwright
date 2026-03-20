import { expect, Page, test } from '@playwright/test';

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

async function saveAndSubmit(page: Page): Promise<void> {
  const saveButton = page.getByRole('button', { name: 'Lưu' });
  const submitButton = page.getByRole('button', { name: 'Gửi' });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await page.locator('#freeze').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});

    const submitVisible = await submitButton.isVisible().catch(() => false);
    if (submitVisible) {
      break;
    }

    await submitButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    if (await submitButton.isVisible().catch(() => false)) {
      break;
    }
  }

  await expect(submitButton).toBeVisible({ timeout: 15000 });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();

  const confirmButton = page.getByRole('button', { name: 'Đồng ý' });
  await expect(confirmButton).toBeVisible();
  await expect(confirmButton).toBeEnabled();
  await confirmButton.click();

  await page.locator('#freeze').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});
}

async function openCreateMenuItem(page: Page, itemName: string): Promise<void> {
  const createButton = page.getByRole('button', { name: 'Tạo' });
  await expect(createButton).toBeVisible({ timeout: 15000 });
  await expect(createButton).toBeEnabled();
  await createButton.click();

  const menuItem = page.getByRole('link', { name: itemName, exact: true });
  await expect(menuItem).toBeVisible();
  await menuItem.click();
}

test('Selling-Stock-Accounting', async ({ page }) => {
  test.setTimeout(180000);

  const customerName = 'CongTyTnhhVivo';
  const itemCode = 'AKS001';
  const warehouseName = 'KhoHangPhiaDong01 - AD';
  const checkNumber = `CHK-${Date.now()}`;
  const deliveryDate = formatDate(new Date(Date.now() + 24 * 60 * 60 * 1000));

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

  const customerInput = page.locator('[data-fieldname="customer"] .input-with-feedback:visible').first();
  await expect(customerInput).toBeVisible();
  await expect(customerInput).toBeEditable();
  await customerInput.click();
  await customerInput.fill(customerName);
  await customerInput.press('Enter');

  const setWarehouseInput = page
    .locator('[data-fieldname="set_warehouse"] .input-with-feedback:visible')
    .first();
  await expect(setWarehouseInput).toBeVisible();
  await expect(setWarehouseInput).toBeEditable();
  await setWarehouseInput.click();
  await setWarehouseInput.fill(warehouseName);
  await setWarehouseInput.press('Enter');

  const itemGridCell = page.locator('.col.grid-static-col.col-xs-3.error').first();
  await expect(itemGridCell).toBeVisible();
  await itemGridCell.click();

  const itemCodeInput = page.locator('[data-fieldname="item_code"] .input-with-feedback:visible').last();
  await expect(itemCodeInput).toBeVisible();
  await expect(itemCodeInput).toBeEditable();
  await itemCodeInput.fill(itemCode);
  await itemCodeInput.press('Enter');

  const deliveryDateInput = page.locator('[data-fieldname="delivery_date"] input:visible').last();
  await expect(deliveryDateInput).toBeVisible();
  await expect(deliveryDateInput).toBeEditable();
  await deliveryDateInput.fill(deliveryDate);
  await deliveryDateInput.press('Enter');

  const quantityInput = page.locator('[data-fieldname="qty"] input:visible').last();
  await expect(quantityInput).toBeVisible();
  await expect(quantityInput).toBeEditable();
  await quantityInput.fill('1');
  await quantityInput.press('Tab');

  await page.locator('.datepicker').first().waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  await saveAndSubmit(page);

  await openCreateMenuItem(page, 'Phiếu giao hàng');
  await saveAndSubmit(page);

  await openCreateMenuItem(page, 'Hóa đơn bán hàng');
  await saveAndSubmit(page);

  await openCreateMenuItem(page, 'Thanh toán');

  const checkNumberInput = page.locator('[data-fieldname="reference_no"] input:visible').first();
  await expect(checkNumberInput).toBeVisible();
  await expect(checkNumberInput).toBeEditable();
  await checkNumberInput.fill(checkNumber);

  await saveAndSubmit(page);
});
