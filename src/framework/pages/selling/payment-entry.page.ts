import { Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { ErpDocumentPage } from '../erp-document.page';

export class PaymentEntryPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewFromList(): Promise<void> {
    await this.gotoNewDocumentFromList('/app/payment-entry/new-payment-entry', '/app/payment-entry');
  }

  async openFromSalesInvoice(): Promise<void> {
    await this.openCreateMenuItem(uiText.createMenu.payment);
    await this.page.waitForURL(/\/app\/payment-entry\//, { timeout: 15000 });
  }

  async fillReferenceNumber(value: string): Promise<void> {
    await this.fillInputField('reference_no', value);
  }
}
