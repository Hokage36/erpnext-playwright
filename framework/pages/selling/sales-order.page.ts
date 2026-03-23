import { expect, Page } from '@playwright/test';

import { ErpDocumentPage } from '../erp-document.page';

type SalesOrderData = {
  customerName: string;
  itemCode: string;
  warehouseName: string;
  quantity: string;
  rate?: string;
  deliveryDate: string;
};

export class SalesOrderPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewFromList(): Promise<void> {
    await this.gotoNewDocumentFromList('/app/sales-order/new-sales-order', '/app/sales-order');
  }

  async createSalesOrder(data: SalesOrderData): Promise<void> {
    await this.gotoNewFromList();

    // Customer cung co the thay doi kieu render, nen xu ly rieng giong Purchase Order.
    await this.fillSalesOrderCustomer(data.customerName);

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

    await this.openFirstGridRow();
    await this.fillOpenRowAutocompleteField('warehouse', data.warehouseName);

    if (data.rate) {
      await this.fillOpenRowInputField('rate', data.rate);
    }

    await this.closeOpenGridRow();

    await this.saveAndSubmit();
  }

  private async fillSalesOrderCustomer(customerName: string): Promise<void> {
    const customerAutocomplete = this.autocompleteField('customer');

    // Truong hop dep nhat: ERPNext render dung autocomplete cua field customer.
    if (await customerAutocomplete.isVisible().catch(() => false)) {
      await this.fillAutocomplete(customerAutocomplete, customerName);
      await customerAutocomplete.press('Tab').catch(() => {});
      return;
    }

    // Fallback ve input thuong neu giao dien hien khac di.
    const customerInput = this.inputField('customer');
    await this.fillInput(customerInput, customerName);
    await customerInput.press('Enter').catch(() => {});
    await customerInput.press('Tab').catch(() => {});
  }
}
