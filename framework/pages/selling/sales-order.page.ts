import { expect, Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { ErpDocumentPage } from '../erp-document.page';

type SalesOrderData = {
  customerName: string;
  itemCode: string;
  warehouseName: string;
  quantity: string;
  deliveryDate: string;
};

export class SalesOrderPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewFromList(): Promise<void> {
    await this.goto('/app/home');
    await this.openModule(uiText.modules.sales);

    const salesOrderLinkByHref = this.page.locator('a[href="/app/sales-order"]').first();
    if (await salesOrderLinkByHref.isVisible().catch(() => false)) {
      await salesOrderLinkByHref.click();
    } else {
      const salesOrderLinkByName = this.page
        .getByRole('link', { name: '\u0110\u01a1n \u0111\u1eb7t h\u00e0ng' })
        .nth(1);

      await salesOrderLinkByName.click();
    }

    const createButton = this.page.locator('.primary-action:visible').first();
    if (await createButton.isVisible().catch(() => false)) {
      await this.clickPrimaryAction();
      return;
    }

    await this.goto('/app/sales-order/new-sales-order');
    await expect(this.saveButton()).toBeVisible({ timeout: 15000 });
  }

  async createSalesOrder(data: SalesOrderData): Promise<void> {
    await this.gotoNewFromList();
    await this.fillAutocompleteField('customer', data.customerName);

    const deliveryDateInput = this.page.getByRole('textbox').nth(1);
    await expect(deliveryDateInput).toBeVisible();
    await expect(deliveryDateInput).toBeEditable();
    await this.fillDateInput(deliveryDateInput, data.deliveryDate);

    await this.fillSetWarehouseIfVisible(data.warehouseName);

    const itemGridCell = this.page.locator('.col.grid-static-col.col-xs-3.error').first();
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
