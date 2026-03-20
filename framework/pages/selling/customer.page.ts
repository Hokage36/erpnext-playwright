import { expect, Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { BasePage } from '../base.page';

export class CustomerPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoList(): Promise<void> {
    await this.goto('/app/home');
    await this.openModule(uiText.modules.sales);
    await this.openSidebarLink('/app/customer');
  }

  async createCustomer(customerName: string): Promise<void> {
    await this.clickPrimaryAction();

    const dialog = this.page.getByRole('dialog');

    await expect(dialog).toBeVisible();
    await this.fillInput(dialog.getByRole('textbox').first(), customerName);

    const saveButton = this.page.getByRole('button', { name: uiText.common.save });

    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    await expect(dialog).toBeHidden();
  }
}
