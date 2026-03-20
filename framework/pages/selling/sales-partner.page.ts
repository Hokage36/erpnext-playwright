import { expect, Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { BasePage } from '../base.page';

type SalesPartnerData = {
  name: string;
  territory: string;
  commissionRate: string;
};

export class SalesPartnerPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoList(): Promise<void> {
    await this.goto('/app/home');
    await this.openModule(uiText.modules.sales);

    const salesPartnerLink = this.page.getByRole('link', {
      name: '\u0110\u1ea1i l\u00fd b\u00e1n h\u00e0ng',
      exact: true,
    });

    await expect(salesPartnerLink).toBeVisible();
    await salesPartnerLink.click();
  }

  async createSalesPartner(data: SalesPartnerData): Promise<void> {
    await this.clickPrimaryAction();

    const partnerNameInput = this.inputField('partner_name');
    await this.fillInput(partnerNameInput, data.name);

    const territoryInput = this.autocompleteField('territory');
    await this.fillAutocomplete(territoryInput, data.territory);

    const commissionRateInput = this.inputField('commission_rate');

    await this.fillInput(commissionRateInput, data.commissionRate);
    await commissionRateInput.press('Enter');

    const saveButton = this.page.getByRole('button', { name: uiText.common.save });

    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
  }
}
