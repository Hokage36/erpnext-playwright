import { Page } from '@playwright/test';

import { ErpDocumentPage } from '../erp-document.page';

type SalesOrderData = {
  customerName: string;
  transactionDate?: string;
  deliveryDate: string;
  itemCode: string;
  quantity: string;
  rate?: string;
  warehouseName: string;
};

export class SalesOrderPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewFromList(): Promise<void> {
    await this.gotoNewDocumentFromList('/app/sales-order/new-sales-order', '/app/sales-order');
  }

  async fillSalesOrderForm(data: Partial<SalesOrderData>): Promise<void> {
    await this.gotoNewFromList();

    if (data.customerName !== undefined) {
      await this.fillSalesOrderCustomer(data.customerName);
    }

    if (data.transactionDate !== undefined) {
      const transactionDateInputByField = this.page.locator('[data-fieldname="transaction_date"] input:visible').first();
      const transactionDateInput = (await transactionDateInputByField.isVisible().catch(() => false))
        ? transactionDateInputByField
        : this.page.getByRole('textbox').first();

      await this.fillDateInput(transactionDateInput, data.transactionDate);
    }

    if (data.deliveryDate !== undefined) {
      const deliveryDateInputByField = this.page.locator('[data-fieldname="delivery_date"] input:visible').first();
      const deliveryDateInput = (await deliveryDateInputByField.isVisible().catch(() => false))
        ? deliveryDateInputByField
        : this.page.getByRole('textbox').nth(1);

      await this.fillDateInput(deliveryDateInput, data.deliveryDate);
    }

    const shouldFillItemRow =
      data.itemCode !== undefined ||
      data.quantity !== undefined ||
      data.warehouseName !== undefined ||
      data.rate !== undefined;

    if (!shouldFillItemRow) {
      return;
    }

    await this.mutateFirstSalesOrderItem({
      deliveryDate: data.deliveryDate,
      itemCode: data.itemCode,
      qty: data.quantity,
      rate: data.rate,
      warehouse: data.warehouseName,
    });
  }

  async createSalesOrder(data: SalesOrderData): Promise<void> {
    await this.fillSalesOrderForm(data);
    await this.saveAndSubmit();
  }

  private async fillSalesOrderCustomer(customerName: string): Promise<void> {
    const customerAutocomplete = this.autocompleteField('customer');

    if (await customerAutocomplete.isVisible().catch(() => false)) {
      await this.fillAutocomplete(customerAutocomplete, customerName);
      await customerAutocomplete.press('Tab').catch(() => {});
      return;
    }

    const customerInput = this.inputField('customer');
    if (await customerInput.isVisible().catch(() => false)) {
      await this.fillInput(customerInput, customerName);
      await customerInput.press('Enter').catch(() => {});
      await customerInput.press('Tab').catch(() => {});
      return;
    }

    const fallbackCustomerInput = this.page.locator('[data-fieldname="customer"] [role="combobox"]:visible').first();
    await this.fillAutocomplete(fallbackCustomerInput, customerName);
    await fallbackCustomerInput.press('Tab').catch(() => {});
  }

  private async mutateFirstSalesOrderItem(data: {
    deliveryDate?: string;
    itemCode?: string;
    qty?: string;
    rate?: string;
    warehouse?: string;
  }): Promise<void> {
    await this.page.evaluate(async (nextItem) => {
      const appWindow = window as typeof window & {
        cur_frm?: {
          add_child?: (fieldname: string) => {
            doctype: string;
            name: string;
          };
          dirty: () => void;
          doc: {
            items?: Array<{
              doctype: string;
              name: string;
            }>;
          };
          refresh_field: (fieldname: string) => void;
        };
        frappe?: {
          model?: {
            set_value: (doctype: string, name: string, fieldname: string, value: unknown) => Promise<unknown> | unknown;
          };
        };
      };

      const form = appWindow.cur_frm;
      const setValue = appWindow.frappe?.model?.set_value;

      if (!form || !setValue) {
        throw new Error('ERPNext form context is not available for Sales Order mutation.');
      }

      if (!form.doc.items?.length) {
        form.add_child?.('items');
        form.refresh_field('items');
      }

      const firstItem = form.doc.items?.[0];
      if (!firstItem) {
        throw new Error('Unable to create the first Sales Order item row.');
      }

      if (nextItem.itemCode !== undefined) {
        await setValue(firstItem.doctype, firstItem.name, 'item_code', nextItem.itemCode);
      }

      if (nextItem.deliveryDate !== undefined) {
        const [day, month, year] = nextItem.deliveryDate.split('-');
        const normalizedDeliveryDate =
          day && month && year ? `${year}-${month}-${day}` : nextItem.deliveryDate;

        await setValue(firstItem.doctype, firstItem.name, 'delivery_date', normalizedDeliveryDate);
      }

      if (nextItem.qty !== undefined) {
        await setValue(firstItem.doctype, firstItem.name, 'qty', nextItem.qty);
      }

      if (nextItem.warehouse !== undefined) {
        await setValue(firstItem.doctype, firstItem.name, 'warehouse', nextItem.warehouse);
      }

      if (nextItem.rate !== undefined) {
        await setValue(firstItem.doctype, firstItem.name, 'rate', nextItem.rate);
      }

      form.refresh_field('items');
      form.dirty();
    }, data);

    await this.page.waitForTimeout(500);
  }
}
