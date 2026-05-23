import { expect, Page } from '@playwright/test';

import { ErpDocumentPage } from '../erp-document.page';

type SupplierData = {
  country?: string;
  supplierGroup?: string;
  supplierName: string;
  supplierType?: string;
};

export class SupplierPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNew(): Promise<void> {
    await this.goto('/app/supplier/new-supplier');
    await expect(this.saveButton()).toBeVisible({ timeout: 15000 });
  }

  async fillSupplierForm(data: Partial<SupplierData>): Promise<void> {
    await this.gotoNew();

    if (data.supplierName !== undefined) {
      await this.fillInputField('supplier_name', data.supplierName);
    }

    if (data.supplierGroup !== undefined) {
      await this.fillOptionalAutocompleteField('supplier_group', data.supplierGroup);
    }

    if (data.supplierType !== undefined) {
      await this.fillOptionalSupplierType(data.supplierType);
    }

    if (data.country !== undefined) {
      await this.fillOptionalAutocompleteField('country', data.country);
    }
  }

  async createSupplier(data: SupplierData): Promise<string> {
    await this.fillSupplierForm(data);

    await this.saveUntilSaved(/\/app\/supplier\/(?!new-supplier)/);
    await this.assertNoMissingFieldDialog();

    return this.currentDocumentName();
  }

  private async fillOptionalAutocompleteField(fieldName: string, value: string): Promise<void> {
    const input = this.autocompleteField(fieldName);

    if (!(await input.isVisible().catch(() => false))) {
      return;
    }

    const currentValue = await input.inputValue().catch(() => '');
    if (currentValue === value) {
      return;
    }

    await this.fillAutocomplete(input, value);
    await input.press('Tab').catch(() => {});
  }

  private async fillOptionalSupplierType(value: string): Promise<void> {
    const select = this.selectField('supplier_type');

    if (await select.isVisible().catch(() => false)) {
      const currentValue = await select.inputValue().catch(() => '');
      if (currentValue) {
        return;
      }

      const translatedValue = value === 'Company' ? 'CĂ´ng ty' : value === 'Individual' ? 'CĂ¡ nhĂ¢n' : value;

      const availableOptions = await select.locator('option').allTextContents().catch(() => []);
      const selectedLabel = availableOptions.includes(value)
        ? value
        : availableOptions.includes(translatedValue)
          ? translatedValue
          : '';

      if (!selectedLabel) {
        return;
      }

      await select.selectOption({ label: selectedLabel });
      return;
    }

    const autocomplete = this.autocompleteField('supplier_type');

    if (await autocomplete.isVisible().catch(() => false)) {
      const currentValue = await autocomplete.inputValue().catch(() => '');
      if (currentValue) {
        return;
      }

      const translatedValue = value === 'Company' ? 'CĂ´ng ty' : value === 'Individual' ? 'CĂ¡ nhĂ¢n' : value;
      if (currentValue !== translatedValue) {
        await this.fillAutocomplete(autocomplete, translatedValue);
        await autocomplete.press('Tab').catch(() => {});
      }
      return;
    }

    const fallbackInput = this.inputField('supplier_type');

    if (!(await fallbackInput.isVisible().catch(() => false))) {
      return;
    }

    const currentValue = await fallbackInput.inputValue().catch(() => '');
    if (currentValue === value) {
      return;
    }

    const translatedValue = value === 'Company' ? 'CĂ´ng ty' : value === 'Individual' ? 'CĂ¡ nhĂ¢n' : value;
    await this.fillInput(fallbackInput, translatedValue);
    await fallbackInput.press('Tab').catch(() => {});
  }
}
