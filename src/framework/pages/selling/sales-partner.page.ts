import { expect, Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { BasePage } from '../base.page';

type SalesPartnerData = {
  commissionRate: string;
  name: string;
  territory: string;
};

export class SalesPartnerPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoList(): Promise<void> {
    await this.goto('/app/sales-partner');

    const createButton = this.page.locator('.primary-action:visible').first();
    await expect(createButton).toBeVisible({ timeout: 15000 });
  }

  async gotoNew(): Promise<void> {
    await this.gotoList();
    await this.clickPrimaryAction();
  }

  async fillSalesPartnerForm(data: Partial<SalesPartnerData>): Promise<void> {
    await this.gotoNew();

    if (data.name !== undefined) {
      await this.fillInput(this.inputField('partner_name'), data.name);
    }

    if (data.territory !== undefined) {
      await this.fillAutocomplete(this.autocompleteField('territory'), data.territory);
    }

    if (data.commissionRate !== undefined) {
      const commissionRateInput = this.inputField('commission_rate');

      await this.fillInput(commissionRateInput, data.commissionRate);
      await commissionRateInput.press('Enter').catch(() => {});
    }
  }

  async saveSalesPartner(): Promise<void> {
    const saveButton = this.page.getByRole('button', { name: uiText.common.save });

    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
  }

  async createSalesPartner(data: SalesPartnerData): Promise<void> {
    await this.fillSalesPartnerForm(data);
    await this.saveSalesPartner();
  }
}
