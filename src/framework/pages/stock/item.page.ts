import { expect, Page } from '@playwright/test';

import { ErpDocumentPage } from '../erp-document.page';

type ItemData = {
  itemCode: string;
  itemName: string;
  itemGroup: string;
  stockUom: string;
};

export class ItemPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNew(): Promise<void> {
    await this.goto('/app/item/new-item');
  }

  async fillItemForm(data: Partial<ItemData>): Promise<void> {
    await this.gotoNew();

    if (data.itemCode !== undefined) {
      await this.fillInputField('item_code', data.itemCode);
      await this.inputField('item_code').press('Tab').catch(() => {});
      await this.page.waitForTimeout(300);
    }

    if (data.itemName !== undefined) {
      const itemNameInput = this.inputField('item_name');
      await expect(itemNameInput).toBeVisible();
      await expect(itemNameInput).toBeEditable();
      await itemNameInput.click();
      await itemNameInput.press('Control+A').catch(() => {});
      await this.fillInput(itemNameInput, data.itemName);
      await itemNameInput.press('Tab').catch(() => {});
    }

    const itemGroupInput = this.autocompleteField('item_group');
    if (data.itemGroup !== undefined) {
      await expect(itemGroupInput).toBeVisible();
      if ((await itemGroupInput.inputValue().catch(() => '')) !== data.itemGroup) {
        await this.fillAutocomplete(itemGroupInput, data.itemGroup);
      }
      await itemGroupInput.press('Tab').catch(() => {});
    }

    const stockUomInput = this.autocompleteField('stock_uom');
    if (data.stockUom !== undefined) {
      await expect(stockUomInput).toBeVisible();
      if ((await stockUomInput.inputValue().catch(() => '')) !== data.stockUom) {
        await this.fillAutocomplete(stockUomInput, data.stockUom);
      }
      await stockUomInput.press('Tab').catch(() => {});
    }
  }

  async createItem(data: ItemData): Promise<void> {
    await this.fillItemForm(data);
    await this.saveUntilSaved(/\/app\/item\/(?!new-item-)/);
    await this.dismissMessageDialogIfPresent();
    await this.assertNoMissingFieldDialog();
  }
}
