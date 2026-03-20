import { expect, Page, test } from '@playwright/test';

async function saveDocument(page: Page, savedUrlPattern: RegExp): Promise<void> {
  const saveButton = page.getByRole('button', { name: 'Lưu' });
  const unsavedBadge = page.getByText(/Chưa lưu/i).first();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    await page.locator('#freeze').waitFor({ state: 'hidden', timeout: 60000 }).catch(() => {});

    const isSavedUrl = savedUrlPattern.test(page.url());
    const hasUnsavedBadge = await unsavedBadge.isVisible().catch(() => false);
    if (isSavedUrl && !hasUnsavedBadge) {
      return;
    }
  }

  await expect(page).toHaveURL(savedUrlPattern, { timeout: 15000 });
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

test('Tạo Yêu cầu báo giá', async ({ page }) => {
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

  const requestForQuotationLink = page.locator('a[href="/app/request-for-quotation"]');
  await expect(requestForQuotationLink).toBeVisible();
  await requestForQuotationLink.click();

  const addRequestForQuotationButton = page.getByRole('button', { name: 'Thêm Yêu cầu báo giá' });
  await expect(addRequestForQuotationButton).toBeVisible();
  await expect(addRequestForQuotationButton).toBeEnabled();
  await addRequestForQuotationButton.click();

  const supplierGridCell = page.locator('.col.grid-static-col.col-xs-3.error').first();
  await expect(supplierGridCell).toBeVisible();
  await supplierGridCell.click();

  const supplierInput = page.locator('[data-fieldname="supplier"] .input-with-feedback:visible').last();
  await expect(supplierInput).toBeVisible();
  await expect(supplierInput).toBeEditable();
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
  await expect(quantityInput).toBeVisible();
  await expect(quantityInput).toBeEditable();
  await quantityInput.fill('1');

  const uomInput = page.locator('[data-fieldname="uom"] .input-with-feedback:visible').last();
  if (await uomInput.isVisible().catch(() => false)) {
    await expect(uomInput).toBeEditable();
    await uomInput.fill('Nos');
    await uomInput.press('Enter');
  }

  await fillRowWarehouse(page, warehouseName);
  await saveDocument(page, /\/app\/request-for-quotation\/(?!new-request-for-quotation-)/);
});
