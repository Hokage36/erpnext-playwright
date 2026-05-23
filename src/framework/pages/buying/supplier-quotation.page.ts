import { Page } from '@playwright/test';

import { ErpDocumentPage } from '../erp-document.page';

type SupplierQuotationData = {
  supplierName: string;
  itemCode: string;
  warehouseName: string;
  quantity: string;
};

export class SupplierQuotationPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewFromList(): Promise<void> {
    await this.gotoNewDocumentFromList('/app/supplier-quotation/new-supplier-quotation', '/app/supplier-quotation');
  }

  async fillSupplierQuotationForm(data: Partial<SupplierQuotationData>): Promise<void> {
    await this.gotoNewFromList();

    if (data.supplierName !== undefined) {
      await this.fillSupplierQuotationSupplier(data.supplierName);
    }

    await this.waitForFreezeToClear(15000);

    const shouldFillItemRow =
      data.itemCode !== undefined || data.quantity !== undefined || data.warehouseName !== undefined;

    if (!shouldFillItemRow) {
      return;
    }

    await this.clickGridCell('.col.grid-static-col.col-xs-2.error');

    if (data.itemCode !== undefined) {
      await this.fillInlineItemGridAutocompleteField('item_code', data.itemCode);
    }

    if (data.quantity !== undefined) {
      const quantityInput = this.itemGrid().locator('[data-fieldname="qty"] input:visible').first();
      if (await quantityInput.isVisible().catch(() => false)) {
        await this.fillInput(quantityInput, data.quantity);
      }
    }

    if (data.warehouseName !== undefined) {
      const inlineWarehouseInput = this.itemGrid()
        .locator('[data-fieldname="warehouse"] .input-with-feedback:visible')
        .first();

      if (await inlineWarehouseInput.isVisible().catch(() => false)) {
        await this.fillAutocomplete(inlineWarehouseInput, data.warehouseName);
        await inlineWarehouseInput.press('Tab').catch(() => {});
      } else {
        await this.openFirstGridRow();
        await this.fillOpenRowAutocompleteField('warehouse', data.warehouseName);
        await this.closeOpenGridRow();
      }
    }
  }

  async hasInlineWarehouseField(): Promise<boolean> {
    const inlineWarehouseInput = this.itemGrid()
      .locator('[data-fieldname="warehouse"] .input-with-feedback:visible')
      .first();

    return inlineWarehouseInput.isVisible().catch(() => false);
  }

  async createSupplierQuotation(data: SupplierQuotationData): Promise<void> {
    await this.fillSupplierQuotationForm(data);
    await this.saveAndSubmit();
  }

  private async fillSupplierQuotationSupplier(supplierName: string): Promise<void> {
    const supplierAutocompleteInput = this.autocompleteField('supplier');
    if (await supplierAutocompleteInput.isVisible().catch(() => false)) {
      await this.fillAutocomplete(supplierAutocompleteInput, supplierName);
      await supplierAutocompleteInput.press('Tab').catch(() => {});
      return;
    }

    const fallbackSupplierInput = this.inputField('supplier');

    if (await fallbackSupplierInput.isVisible().catch(() => false)) {
      await this.fillInput(fallbackSupplierInput, supplierName);
      await fallbackSupplierInput.press('Enter');
      await fallbackSupplierInput.press('Tab').catch(() => {});
      return;
    }

    const comboboxSupplierInput = this.page.getByRole('combobox').nth(2);
    await this.fillAutocomplete(comboboxSupplierInput, supplierName);
    await comboboxSupplierInput.press('Tab').catch(() => {});
  }
}
