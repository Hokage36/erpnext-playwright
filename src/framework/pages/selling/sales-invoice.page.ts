import { Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { ErpDocumentPage } from '../erp-document.page';

export class SalesInvoicePage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewFromList(): Promise<void> {
    await this.gotoNewDocumentFromList('/app/sales-invoice/new-sales-invoice', '/app/sales-invoice');
  }

  async openFromDeliveryNote(): Promise<void> {
    await this.openCreateMenuItem(uiText.createMenu.salesInvoice);
    await this.page.waitForURL(/\/app\/sales-invoice\//, { timeout: 15000 });
  }
}
