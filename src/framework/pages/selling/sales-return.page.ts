import { Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { ErpDocumentPage } from '../erp-document.page';

export class SalesReturnPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async openFromSubmittedDeliveryNote(deliveryNoteName: string): Promise<void> {
    await this.openCreateMenuItemByPattern(uiText.createMenuPattern.salesReturn);
    await this.waitForReturnDocumentAgainst(deliveryNoteName);
  }
}
