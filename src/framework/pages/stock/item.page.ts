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

  async createItem(data: ItemData): Promise<void> {
    await this.gotoNew();
    await this.fillInputField('item_code', data.itemCode);
    await this.fillInputField('item_name', data.itemName);

    const itemGroupInput = this.autocompleteField('item_group');
    await expect(itemGroupInput).toBeVisible();
    if ((await itemGroupInput.inputValue().catch(() => '')) !== data.itemGroup) {
      await this.fillAutocomplete(itemGroupInput, data.itemGroup);
    }
    await itemGroupInput.press('Tab').catch(() => {});

    const stockUomInput = this.autocompleteField('stock_uom');
    await expect(stockUomInput).toBeVisible();
    if ((await stockUomInput.inputValue().catch(() => '')) !== data.stockUom) {
      await this.fillAutocomplete(stockUomInput, data.stockUom);
    }
    await stockUomInput.press('Tab').catch(() => {});

    await this.save();
    await this.assertNoMissingFieldDialog();
  }
}
