import { expect, Page, test } from '@playwright/test';

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

async function fillRowWarehouse(page: Page, warehouseName: string): Promise<void> {
  const directWarehouseInput = page.locator('[data-fieldname="warehouse"] .input-with-feedback:visible').last();
  if (await directWarehouseInput.isVisible().catch(() => false)) {
    await directWarehouseInput.click();
    await directWarehouseInput.fill(warehouseName);
    await directWarehouseInput.press('Enter');
    return;
  }

  const openRowButton = page.locator('.btn-open-row:visible').first();
  await expect(openRowButton).toBeVisible();
  await openRowButton.click();

  const warehouseInput = page.locator('.grid-row-open [data-fieldname="warehouse"] .input-with-feedback:visible').first();
  await expect(warehouseInput).toBeVisible();
  await expect(warehouseInput).toBeEditable();
  await warehouseInput.click();
  await warehouseInput.fill(warehouseName);
  await warehouseInput.press('Enter');

  const collapseRowButton = page.locator('.btn.btn-secondary.btn-sm.pull-right:visible').first();
  await expect(collapseRowButton).toBeVisible();
  await collapseRowButton.click();
}

test('Tạo Báo giá của NCC', async ({ page }) => {
  test.setTimeout(120000);

  const supplierName = 'NhaCungCap1';
  const itemCode = 'AKS001';
  const warehouseName = 'KhoHangPhiaDong01 - AD';

  await page.goto('/app/home', {
    waitUntil: 'domcontentloaded',
  });

  const buyingLink = page.getByRole('link', { name: 'Mua hàng', exact: true });
  await expect(buyingLink).toBeVisible();
  await buyingLink.click();

  const supplierQuotationLink = page.locator('a[href="/app/supplier-quotation"]');
  await expect(supplierQuotationLink).toBeVisible();
  await supplierQuotationLink.click();

  const addSupplierQuotationButton = page.getByRole('button', { name: 'Thêm Báo giá của NCC' });
  await expect(addSupplierQuotationButton).toBeVisible();
  await expect(addSupplierQuotationButton).toBeEnabled();
  await addSupplierQuotationButton.click();

  const supplierInput = page.locator('[data-fieldname="supplier"] .input-with-feedback:visible').first();
  await expect(supplierInput).toBeVisible();
  await expect(supplierInput).toBeEditable();
  await supplierInput.click();
  await supplierInput.fill(supplierName);
  await supplierInput.press('Enter');

  const itemGridCell = page.locator('.col.grid-static-col.col-xs-2.error').first();
  await expect(itemGridCell).toBeVisible();
  await itemGridCell.click();

  const itemCodeInput = page.locator('[data-fieldname="item_code"] .input-with-feedback:visible').last();
  await expect(itemCodeInput).toBeVisible();
  await expect(itemCodeInput).toBeEditable();
  await itemCodeInput.fill(itemCode);
  await itemCodeInput.press('Enter');

  const quantityInput = page.locator('[data-fieldname="qty"] input:visible').last();
  if (await quantityInput.isVisible().catch(() => false)) {
    await expect(quantityInput).toBeEditable();
    await quantityInput.fill('1');
  }

  await fillRowWarehouse(page, warehouseName);
  await saveAndSubmit(page);
});
