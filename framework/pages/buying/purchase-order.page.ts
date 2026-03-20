import { expect, Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { ErpDocumentPage } from '../erp-document.page';

type PurchaseOrderData = {
  supplierName: string;
  itemCode: string;
  warehouseName: string;
  quantity: string;
  stockUom: string;
  scheduleDate: string;
};

export class PurchaseOrderPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewFromList(): Promise<void> {
    await this.goto('/app/home');
    await this.openModule(uiText.modules.buying);
    await this.openSidebarLink('/app/purchase-order');

    const createButton = this.page.locator('.primary-action:visible').first();
    if (await createButton.isVisible().catch(() => false)) {
      await this.clickPrimaryAction();
      return;
    }

    await this.goto('/app/purchase-order/new-purchase-order');
    await expect(this.saveButton()).toBeVisible({ timeout: 15000 });
  }

  async createPurchaseOrder(data: PurchaseOrderData): Promise<void> {
    await this.gotoNewFromList();

    const supplierInput = this.autocompleteField('supplier');
    if (await supplierInput.isVisible().catch(() => false)) {
      await this.fillAutocomplete(supplierInput, data.supplierName);
      await supplierInput.press('Tab').catch(() => {});
    } else {
      const fallbackSupplierInput = this.page.getByRole('combobox').nth(2);
      await this.fillAutocomplete(fallbackSupplierInput, data.supplierName);
      await fallbackSupplierInput.press('Tab').catch(() => {});
    }

    await this.waitForFreezeToClear(15000);
    await this.dismissMaterialRequestDialogIfPresent();

    const scheduleDateInputByRole = this.page.getByRole('textbox').nth(1);
    const scheduleDateInput = (await scheduleDateInputByRole.isVisible().catch(() => false))
      ? scheduleDateInputByRole
      : this.page.locator('[data-fieldname="schedule_date"] input:visible').first();

    await this.fillDateInput(scheduleDateInput, data.scheduleDate);

    const itemGridCell = this.page.locator('.col.grid-static-col.col-xs-2.error').first();
    await expect(itemGridCell).toBeVisible();
    await itemGridCell.click();

    const itemCodeInput = this.page.getByRole('combobox', { name: 'M\u00e3 h\u00e0ng' });
    await expect(itemCodeInput).toBeVisible();
    await expect(itemCodeInput).toBeEditable();
    await itemCodeInput.fill(data.itemCode);
    await itemCodeInput.press('Enter');

    const quantityInput = this.page.getByRole('textbox', { name: 'S\u1ed1 l\u01b0\u1ee3ng' });
    await expect(quantityInput).toBeVisible();
    await expect(quantityInput).toBeEditable();
    await quantityInput.fill(data.quantity);

    const uomInput = this.page.getByRole('combobox', { name: '\u0110\u01a1n v\u1ecb \u0111o l\u01b0\u1eddng' });
    await expect(uomInput).toBeVisible();
    await expect(uomInput).toBeEditable();
    await uomInput.fill(data.stockUom);
    await uomInput.press('Enter');

    const openRowButton = this.page.locator('.btn-open-row > a').first();
    await expect(openRowButton).toBeVisible();
    await openRowButton.click();

    const openRow = this.page.locator('.grid-row-open').last();
    await expect(openRow).toBeVisible();

    const warehouseInput = openRow.locator('[data-fieldname="warehouse"] .input-with-feedback:visible').first();
    await expect(warehouseInput).toBeVisible();
    await expect(warehouseInput).toBeEditable();
    await this.fillAutocomplete(warehouseInput, data.warehouseName);

    const collapseRowButton = this.page.locator('.btn.btn-secondary.btn-sm.pull-right').first();
    await expect(collapseRowButton).toBeVisible();
    await collapseRowButton.click();

    await this.saveAndSubmit();
  }
}
