import { expect, Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { ErpDocumentPage } from '../erp-document.page';

type PurchaseOrderData = {
  supplierName: string;
  transactionDate?: string;
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

  async fillPurchaseOrderForm(data: Partial<PurchaseOrderData>): Promise<void> {
    await this.gotoNewFromList();

    if (data.supplierName !== undefined) {
      await this.fillPurchaseOrderSupplier(data.supplierName);
    }

    await this.waitForFreezeToClear(15000);
    await this.dismissMaterialRequestDialogIfPresent();

    if (data.transactionDate !== undefined) {
      const transactionDateInputByField = this.page.locator('[data-fieldname="transaction_date"] input:visible').first();
      const transactionDateInput = (await transactionDateInputByField.isVisible().catch(() => false))
        ? transactionDateInputByField
        : this.page.getByRole('textbox').first();

      await this.fillDateInput(transactionDateInput, data.transactionDate);
    }

    if (data.scheduleDate !== undefined) {
      const scheduleDateInputByField = this.page.locator('[data-fieldname="schedule_date"] input:visible').first();
      const scheduleDateInput = (await scheduleDateInputByField.isVisible().catch(() => false))
        ? scheduleDateInputByField
        : this.page.getByRole('textbox').nth(1);

      await this.fillDateInput(scheduleDateInput, data.scheduleDate);
    }

    const shouldFillItemRow =
      data.itemCode !== undefined ||
      data.quantity !== undefined ||
      data.stockUom !== undefined ||
      data.warehouseName !== undefined ||
      data.rate !== undefined;

    if (!shouldFillItemRow) {
      return;
    }

    const itemGridCell = this.page.locator('.col.grid-static-col.col-xs-2.error').first();
    await expect(itemGridCell).toBeVisible();
    await itemGridCell.click();

    if (data.itemCode !== undefined) {
      const itemCodeInput = this.page.getByRole('combobox', { name: 'Mã hàng' });
      await expect(itemCodeInput).toBeVisible();
      await expect(itemCodeInput).toBeEditable();
      await itemCodeInput.fill(data.itemCode);
      await itemCodeInput.press('Enter');
    }

    if (data.quantity !== undefined) {
      const quantityInput = this.page.getByRole('textbox', { name: 'Số lượng' });
      await expect(quantityInput).toBeVisible();
      await expect(quantityInput).toBeEditable();
      await quantityInput.fill(data.quantity);
    }

    if (data.stockUom !== undefined) {
      const uomInput = this.page.getByRole('combobox', { name: 'Đơn vị đo lường' });
      await expect(uomInput).toBeVisible();
      await expect(uomInput).toBeEditable();
      await uomInput.fill(data.stockUom);
      await uomInput.press('Enter');
    }

    if (data.warehouseName !== undefined || data.rate !== undefined) {
      await this.openFirstGridRow();

      if (data.warehouseName !== undefined) {
        await this.fillOpenRowAutocompleteField('warehouse', data.warehouseName);
      }

      if (data.rate !== undefined) {
        await this.fillOpenRowInputField('rate', data.rate);
      }

      await this.closeOpenGridRow();
    }
  }

  async createPurchaseOrder(data: PurchaseOrderData): Promise<void> {
    await this.fillPurchaseOrderForm(data);
    await this.saveAndSubmit();
  }

  private async dismissMaterialRequestDialogIfPresent(): Promise<void> {
    const materialRequestDialog = this.page
      .getByRole('dialog')
      .filter({ hasText: uiText.dialogs.materialRequest });

    const isVisible = await materialRequestDialog
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false);

    if (!isVisible) {
      return;
    }

    const closeButton = materialRequestDialog.locator('.modal-header button:visible').last();

    await expect(closeButton).toBeVisible();
    await closeButton.click();
    await expect(materialRequestDialog).toBeHidden();
  }

  private async fillPurchaseOrderSupplier(supplierName: string): Promise<void> {
    const supplierAutocomplete = this.autocompleteField('supplier');

    if (await supplierAutocomplete.isVisible().catch(() => false)) {
      await this.fillAutocomplete(supplierAutocomplete, supplierName);
      await supplierAutocomplete.press('Tab').catch(() => {});

      const currentValue = await supplierAutocomplete.inputValue().catch(() => '');
      if (currentValue === supplierName) {
        return;
      }
    }

    const supplierCombobox = this.page.locator('[data-fieldname="supplier"] [role="combobox"]:visible').first();
    if (await supplierCombobox.isVisible().catch(() => false)) {
      await this.fillAutocomplete(supplierCombobox, supplierName);
      await supplierCombobox.press('Tab').catch(() => {});

      const currentValue = await supplierCombobox.inputValue().catch(() => '');
      if (currentValue === supplierName) {
        return;
      }
    }

    const supplierInput = this.inputField('supplier');
    if (await supplierInput.isVisible().catch(() => false)) {
      await this.fillInput(supplierInput, supplierName);
      await supplierInput.press('Enter').catch(() => {});
      await supplierInput.press('Tab').catch(() => {});
    }
  }
}
