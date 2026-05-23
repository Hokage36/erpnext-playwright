import { expect, Locator, Page } from '@playwright/test';

import { uiText } from '../data/ui-text';

export type LocatorPosition = 'first' | 'last';

export class BasePage {
  constructor(protected readonly page: Page) {}

  protected async goto(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  protected async openModule(moduleName: string): Promise<void> {
    const moduleLink = this.page.getByRole('link', { name: moduleName, exact: true });

    await expect(moduleLink).toBeVisible();
    await moduleLink.click();
  }

  protected async openSidebarLink(href: string): Promise<void> {
    const link = this.page.locator(`a[href="${href}"]`).first();

    await expect(link).toBeVisible();
    await link.click();
  }

  protected async clickPrimaryAction(): Promise<void> {
    const button = this.page.locator('.primary-action:visible').first();

    await expect(button).toBeVisible({ timeout: 15000 });
    await expect(button).toBeEnabled();
    await button.click();
  }

  protected autocompleteField(fieldName: string, position: LocatorPosition = 'first'): Locator {
    const locator = this.page.locator(`[data-fieldname="${fieldName}"] .input-with-feedback:visible`);

    return position === 'first' ? locator.first() : locator.last();
  }

  protected inputField(fieldName: string, position: LocatorPosition = 'first'): Locator {
    const locator = this.page.locator(`[data-fieldname="${fieldName}"] input:visible`);

    return position === 'first' ? locator.first() : locator.last();
  }

  protected selectField(fieldName: string, position: LocatorPosition = 'first'): Locator {
    const locator = this.page.locator(`[data-fieldname="${fieldName}"] select:visible`);

    return position === 'first' ? locator.first() : locator.last();
  }

  protected async fillAutocomplete(locator: Locator, value: string): Promise<void> {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEditable();
    await locator.click();
    await locator.fill(value);
    await locator.press('Enter');
  }

  protected async fillInput(locator: Locator, value: string): Promise<void> {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEditable();
    await locator.fill(value);
  }

  protected async fillDateInput(locator: Locator, value: string, attempts = 3): Promise<void> {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      await expect(locator).toBeVisible({ timeout: 15000 });
      await expect(locator).toBeEditable({ timeout: 15000 });
      await locator.fill(value);
      await locator.press('Tab');
      await this.waitForDatepickerToClose();

      const currentValue = await locator.inputValue().catch(() => '');
      if (currentValue === value) {
        return;
      }

      await locator.click({ timeout: 2000 }).catch(() => {});
      await this.page.waitForTimeout(250);
    }

    await locator.evaluate((element, nextValue) => {
      const input = element as HTMLInputElement;
      input.value = nextValue;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.blur();
    }, value);

    await expect(locator).toHaveValue(value, { timeout: 5000 });
  }

  protected async waitForFreezeToClear(timeout = 60000): Promise<void> {
    await this.page.locator('#freeze').waitFor({ state: 'hidden', timeout }).catch(() => {});
  }

  protected async waitForDatepickerToClose(timeout = 5000): Promise<void> {
    await this.page.locator('.datepicker').first().waitFor({ state: 'hidden', timeout }).catch(() => {});
  }

  async assertNoMissingFieldDialog(): Promise<void> {
    const missingFieldDialog = this.page
      .getByRole('dialog')
      .filter({ hasText: uiText.common.missingFieldPattern });

    await expect(missingFieldDialog).toHaveCount(0);
  }
}
