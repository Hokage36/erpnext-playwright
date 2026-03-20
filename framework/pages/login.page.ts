import { expect, Page } from '@playwright/test';

import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.goto('/#login');

    await this.page.getByRole('textbox', { name: 'Email' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();

    await this.page.waitForLoadState('networkidle');
    await expect(this.page).not.toHaveURL(/#login/);
  }
}
