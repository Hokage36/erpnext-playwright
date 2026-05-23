import { Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { ErpDocumentPage } from '../erp-document.page';

export class PurchaseInvoicePage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewFromList(): Promise<void> {
    await this.gotoNewDocumentFromList('/app/purchase-invoice/new-purchase-invoice', '/app/purchase-invoice');
  }

  async openFromPurchaseReceipt(): Promise<void> {
    await this.openCreateMenuItem(uiText.createMenu.purchaseInvoice);
    await this.page.waitForURL(/\/app\/purchase-invoice\//, { timeout: 15000 });
  }
}
