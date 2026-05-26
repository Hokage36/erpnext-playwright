import { expect, Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { BasePage } from '../base.page';

export class CustomerPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private customerDialog() {
    return this.page.locator('.modal.show[role="dialog"]').last();
  }

  async gotoList(): Promise<void> {
    await this.goto('/app/customer');
  }

  async openCreateCustomerDialog(): Promise<void> {
    const addCustomerButton = this.page.getByRole('button', { name: /Kh\u00e1ch H\u00e0ng/i }).first();

    await expect(addCustomerButton).toBeVisible({ timeout: 15000 });
    await expect(addCustomerButton).toBeEnabled();
    await addCustomerButton.click();
    await expect(this.customerDialog()).toBeVisible({ timeout: 15000 });
  }

  async fillCustomerDialog(customerName?: string): Promise<void> {
    const dialog = this.customerDialog();

    await expect(dialog).toBeVisible({ timeout: 15000 });

    if (customerName !== undefined) {
      await this.fillInput(dialog.getByRole('textbox').first(), customerName);
    }
  }

  async saveCustomerDialog(): Promise<void> {
    const saveButton = this.customerDialog().getByRole('button', { name: uiText.common.save }).last();

    await expect(saveButton).toBeVisible();
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
  }

  async expectCreateCustomerDialogVisible(): Promise<void> {
    await expect(this.customerDialog()).toBeVisible();
  }

  async createCustomer(customerName: string): Promise<void> {
    await this.openCreateCustomerDialog();
    await this.fillCustomerDialog(customerName);
    await this.saveCustomerDialog();
    await expect(this.customerDialog()).toBeHidden({ timeout: 15000 });
  }
}
