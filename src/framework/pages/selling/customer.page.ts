import { expect, Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { BasePage } from '../base.page';

export class CustomerPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoList(): Promise<void> {
    await this.goto('/app/customer');
  }

  async createCustomer(customerName: string): Promise<void> {
    const addCustomerButton = this.page.getByRole('button', { name: 'Thêm Khách Hàng' }).first();
    await expect(addCustomerButton).toBeVisible({ timeout: 15000 });
    await expect(addCustomerButton).toBeEnabled();
    await addCustomerButton.click();

    const dialog = this.page.locator('.modal.show[role="dialog"]').last();

    await expect(dialog).toBeVisible({ timeout: 15000 });
    await this.fillInput(dialog.getByRole('textbox').first(), customerName);

    const saveButton = dialog.getByRole('button', { name: uiText.common.save }).last();

    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    await expect(dialog).toBeHidden({ timeout: 15000 });
  }
}
