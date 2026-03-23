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
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.clickGridCell('.col.grid-static-col[data-fieldname="item_code"]', 'last');
    await this.fillGridAutocompleteField('item_code', data.itemCode);
    await this.waitForFreezeToClear(15000);
    await this.fillInlineItemGridInputField('qty', data.quantity);
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.dismissMessageDialogIfPresent();

    await this.saveUntilSaved(/\/app\/stock-entry\/(?!new-stock-entry-)/);
    await this.dismissMessageDialogIfPresent();
    await this.assertNoMissingFieldDialog();
  }
}
