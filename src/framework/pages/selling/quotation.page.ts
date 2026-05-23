import { Page } from '@playwright/test';

import { ErpDocumentPage } from '../erp-document.page';

type QuotationData = {
  customerName: string;
  itemCode: string;
  quantity: string;
  warehouseName: string;
};

export class QuotationPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewFromList(): Promise<void> {
    await this.gotoNewDocumentFromList('/app/quotation/new-quotation', '/app/quotation');
  }

  async fillQuotationForm(data: Partial<QuotationData>): Promise<void> {
    await this.gotoNewFromList();

    if (data.customerName !== undefined) {
      await this.fillQuotationCustomer(data.customerName);
    }

    const shouldFillItemRow =
      data.itemCode !== undefined || data.quantity !== undefined || data.warehouseName !== undefined;

    if (!shouldFillItemRow) {
      return;
    }

    const hasSetWarehouse = data.warehouseName ? await this.fillSetWarehouseIfVisible(data.warehouseName) : false;

    await this.clickGridCell('.col.grid-static-col[data-fieldname="item_code"]:visible', 'last');

    if (data.itemCode !== undefined) {
      await this.fillInlineItemGridAutocompleteField('item_code', data.itemCode);
    }

    if (data.quantity !== undefined) {
      await this.fillInlineItemGridInputField('qty', data.quantity);
    }

    if (!hasSetWarehouse && data.warehouseName !== undefined) {
      await this.fillRowWarehouse(data.warehouseName);
    }
  }

  async createQuotation(data: QuotationData): Promise<void> {
    await this.fillQuotationForm(data);
    await this.saveAndSubmit();
  }

  private async fillQuotationCustomer(customerName: string): Promise<void> {
    const customerAutocomplete = this.autocompleteField('party_name');

    if (await customerAutocomplete.isVisible().catch(() => false)) {
      await this.fillAutocomplete(customerAutocomplete, customerName);
      await customerAutocomplete.press('Tab').catch(() => {});
      return;
    }

    const customerInput = this.inputField('party_name');
    if (await customerInput.isVisible().catch(() => false)) {
      await this.fillInput(customerInput, customerName);
      await customerInput.press('Enter').catch(() => {});
      await customerInput.press('Tab').catch(() => {});
      return;
    }

    const fallbackCustomerInput = this.page.locator('[data-fieldname="party_name"] [role="combobox"]:visible').first();
    await this.fillAutocomplete(fallbackCustomerInput, customerName);
    await fallbackCustomerInput.press('Tab').catch(() => {});
  }
}
