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

  async createSupplierQuotation(data: SupplierQuotationData): Promise<void> {
    await this.gotoNewFromList();

    const supplierAutocompleteInput = this.autocompleteField('supplier');
    if (await supplierAutocompleteInput.isVisible().catch(() => false)) {
      await this.fillAutocomplete(supplierAutocompleteInput, data.supplierName);
      await supplierAutocompleteInput.press('Tab').catch(() => {});
    } else {
      const fallbackSupplierInput = this.inputField('supplier');

      if (await fallbackSupplierInput.isVisible().catch(() => false)) {
        await this.fillInput(fallbackSupplierInput, data.supplierName);
        await fallbackSupplierInput.press('Enter');
        await fallbackSupplierInput.press('Tab').catch(() => {});
      } else {
        const comboboxSupplierInput = this.page.getByRole('combobox').nth(2);
        await this.fillAutocomplete(comboboxSupplierInput, data.supplierName);
        await comboboxSupplierInput.press('Tab').catch(() => {});
      }
    }

    await this.waitForFreezeToClear(15000);
    await this.clickGridCell('.col.grid-static-col.col-xs-2.error');
    await this.fillGridAutocompleteField('item_code', data.itemCode);

    const quantityInput = this.inputField('qty', 'last');
    if (await quantityInput.isVisible().catch(() => false)) {
      await this.fillInput(quantityInput, data.quantity);
    }

    await this.fillRowWarehouse(data.warehouseName);
    await this.saveAndSubmit();
  }
}
