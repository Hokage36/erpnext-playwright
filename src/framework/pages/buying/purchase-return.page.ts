import { Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { ErpDocumentPage } from '../erp-document.page';

export class PurchaseReturnPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async openFromSubmittedPurchaseReceipt(purchaseReceiptName: string): Promise<void> {
    await this.openCreateMenuItemByPattern(uiText.createMenuPattern.purchaseReturn);
    await this.waitForReturnDocumentAgainst(purchaseReceiptName);
  }
}
