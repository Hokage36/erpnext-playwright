import { Page } from '@playwright/test';

import { toNumber } from '../../utils/frappe-api';
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

  async createStockReconciliation(data: StockReconciliationData): Promise<{ appliedQuantity: string }> {
    await this.gotoNew();
    await this.selectFieldOption('purpose', data.purpose);
    await this.fillAutocompleteField('set_warehouse', data.warehouseName);
    await this.clickGridCell('.col.grid-static-col[data-fieldname="item_code"]', 'last');
    await this.fillGridAutocompleteField('item_code', data.itemCode);
    await this.waitForFreezeToClear(15000);

    const currentQty = await this.readInlineItemGridInputValue('qty')
      .then((value) => toNumber(value))
      .catch(() => NaN);
    const requestedQty = toNumber(data.quantity);
    const appliedQuantity =
      Number.isFinite(currentQty) && currentQty === requestedQty ? String(requestedQty + 1) : data.quantity;

    await this.fillInlineItemGridInputField('qty', appliedQuantity, 'Enter');
    await this.fillInlineItemGridInputField('valuation_rate', data.valuationRate, 'Enter');
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.dismissMessageDialogIfPresent();

    await this.saveUntilSaved(/\/app\/stock-reconciliation\/(?!new-stock-reconciliation-)/);
    await this.dismissMessageDialogIfPresent();
    await this.assertNoMissingFieldDialog();

    return { appliedQuantity };
  }
}
