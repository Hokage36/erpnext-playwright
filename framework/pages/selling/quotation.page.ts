import { Page } from '@playwright/test';

import { ErpDocumentPage } from '../erp-document.page';

type QuotationData = {
  customerName: string;
  itemCode: string;
  warehouseName: string;
  quantity: string;
};

export class QuotationPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewFromList(): Promise<void> {
    await this.gotoNewDocumentFromList('/app/quotation/new-quotation', '/app/quotation');
  }

  async createQuotation(data: QuotationData): Promise<void> {
    await this.gotoNewFromList();

    const customerInput = this.autocompleteField('party_name');
    if (await customerInput.isVisible().catch(() => false)) {
      await this.fillAutocomplete(customerInput, data.customerName);
    } else {
      await this.fillAutocomplete(this.page.getByRole('combobox').nth(3), data.customerName);
    }

    const hasSetWarehouse = await this.fillSetWarehouseIfVisible(data.warehouseName);

    await this.clickGridCell('.col.grid-static-col.col-xs-4.bold');
    await this.fillGridAutocompleteField('item_code', data.itemCode);

    const quantityInput = this.inputField('qty', 'last');
    await this.fillInput(quantityInput, data.quantity);
    await quantityInput.press('Tab');

    if (!hasSetWarehouse) {
      await this.fillRowWarehouse(data.warehouseName);
    }

    await this.saveAndSubmit();
  }
}
