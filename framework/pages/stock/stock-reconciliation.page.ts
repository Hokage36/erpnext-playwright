import { Page } from '@playwright/test';

import { ErpDocumentPage } from '../erp-document.page';

type StockReconciliationData = {
  purpose: string;
  itemCode: string;
  warehouseName: string;
  quantity: string;
  valuationRate: string;
};

export class StockReconciliationPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNew(): Promise<void> {
    await this.goto('/app/stock-reconciliation/new-stock-reconciliation');
  }

  async createStockReconciliation(data: StockReconciliationData): Promise<void> {
    await this.gotoNew();
    await this.selectFieldOption('purpose', data.purpose);
    await this.fillAutocompleteField('set_warehouse', data.warehouseName);
    await this.clickGridCell('.col.grid-static-col[data-fieldname="item_code"]', 'last');
    await this.fillGridAutocompleteField('item_code', data.itemCode);
    await this.fillGridInputField('qty', data.quantity);
    await this.fillGridInputField('valuation_rate', data.valuationRate);
    await this.save();
    await this.assertNoMissingFieldDialog();
  }
}
