import { expect, Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { ErpDocumentPage } from '../erp-document.page';

type StockEntryData = {
  stockEntryType: string;
  itemCode: string;
  warehouseName: string;
  quantity: string;
};

export class StockEntryPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNew(): Promise<void> {
    await this.goto('/app/stock-entry/new-stock-entry');
  }

  async createStockEntry(data: StockEntryData): Promise<void> {
    await this.gotoNew();
    await this.fillAutocompleteField('stock_entry_type', data.stockEntryType);

    const stockEntryTypeOption = this.page.getByRole('option', { name: data.stockEntryType });
    await expect(stockEntryTypeOption).toBeVisible();
    await stockEntryTypeOption.click();

    const defaultWarehouseSection = this.page.getByText(uiText.dialogs.defaultWarehouse).first();
    await expect(defaultWarehouseSection).toBeVisible();
    await defaultWarehouseSection.click();

    await this.fillAutocompleteField('to_warehouse', data.warehouseName);
    await this.clickGridCell('.col.grid-static-col[data-fieldname="item_code"]', 'last');
    await this.fillGridAutocompleteField('item_code', data.itemCode);
    await this.waitForFreezeToClear(15000);

    const quantityInput = this.page.getByRole('textbox', { name: 'S\u1ed1 l\u01b0\u1ee3ng' }).last();
    await expect(quantityInput).toBeVisible();
    await expect(quantityInput).toBeEditable();
    await quantityInput.click();
    await quantityInput.press('ControlOrMeta+A');
    await quantityInput.fill(data.quantity);
    await quantityInput.press('Tab');

    await this.save();
    await this.assertNoMissingFieldDialog();
  }
}
