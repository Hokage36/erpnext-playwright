import { expect, Page } from '@playwright/test';

import { ErpDocumentPage } from '../erp-document.page';

type PurchaseOrderData = {
  supplierName: string;
  itemCode: string;
  warehouseName: string;
  quantity: string;
  rate?: string;
  stockUom: string;
  scheduleDate: string;
};

export class PurchaseOrderPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewFromList(): Promise<void> {
    await this.gotoNewDocumentFromList('/app/purchase-order/new-purchase-order', '/app/purchase-order');
  }

  async createPurchaseOrder(data: PurchaseOrderData): Promise<void> {
    await this.gotoNewFromList();

    // Field supplier tren ERPNext thay doi kha linh tinh theo layout, nen tach rieng mot helper fallback.
    await this.fillPurchaseOrderSupplier(data.supplierName);

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

    await this.openFirstGridRow();
    await this.fillOpenRowAutocompleteField('warehouse', data.warehouseName);

    if (data.rate) {
      await this.fillOpenRowInputField('rate', data.rate);
    }

    await this.closeOpenGridRow();

    await this.saveAndSubmit();
  }

  private async fillPurchaseOrderSupplier(supplierName: string): Promise<void> {
    const supplierAutocomplete = this.autocompleteField('supplier');

    // Uu tien autocomplete dung chuan fieldname.
    if (await supplierAutocomplete.isVisible().catch(() => false)) {
      await this.fillAutocomplete(supplierAutocomplete, supplierName);
      await supplierAutocomplete.press('Tab').catch(() => {});

      const currentValue = await supplierAutocomplete.inputValue().catch(() => '');
      if (currentValue === supplierName) {
        return;
      }
    }

    // Neu ERPNext render supplier bang role=combobox thi dung nhanh locator nay.
    const supplierCombobox = this.page.locator('[data-fieldname="supplier"] [role="combobox"]:visible').first();
    if (await supplierCombobox.isVisible().catch(() => false)) {
      await this.fillAutocomplete(supplierCombobox, supplierName);
      await supplierCombobox.press('Tab').catch(() => {});

      const currentValue = await supplierCombobox.inputValue().catch(() => '');
      if (currentValue === supplierName) {
        return;
      }
    }

    // Fallback cuoi cung la input thuong.
    const supplierInput = this.inputField('supplier');
    if (await supplierInput.isVisible().catch(() => false)) {
      await this.fillInput(supplierInput, supplierName);
      await supplierInput.press('Enter').catch(() => {});
      await supplierInput.press('Tab').catch(() => {});
    }
  }
}
