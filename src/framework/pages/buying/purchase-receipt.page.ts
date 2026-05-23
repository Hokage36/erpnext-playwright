import { Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { ErpDocumentPage } from '../erp-document.page';

export class PurchaseReceiptPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewFromList(): Promise<void> {
    await this.gotoNewDocumentFromList('/app/purchase-receipt/new-purchase-receipt', '/app/purchase-receipt');
  }

  async openFromPurchaseOrder(): Promise<void> {
    await this.openCreateMenuItem(uiText.createMenu.purchaseReceipt);
    await this.page.waitForURL(/\/app\/purchase-receipt\//, { timeout: 15000 });
  }
}
