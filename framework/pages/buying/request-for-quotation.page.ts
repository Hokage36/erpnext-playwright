import { Page } from '@playwright/test';

import { ErpDocumentPage } from '../erp-document.page';

type RequestForQuotationData = {
  supplierName: string;
  itemCode: string;
  warehouseName: string;
  quantity: string;
  stockUom: string;
};

export class RequestForQuotationPage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNewFromList(): Promise<void> {
    await this.gotoNewDocumentFromList(
      '/app/request-for-quotation/new-request-for-quotation',
      '/app/request-for-quotation'
    );
  }

  async createRequestForQuotation(data: RequestForQuotationData): Promise<void> {
    await this.gotoNewFromList();

    await this.clickGridCell('.col.grid-static-col.col-xs-3.error');
    await this.fillGridAutocompleteField('supplier', data.supplierName);

    await this.clickGridCell('.col.grid-static-col.col-xs-2.error');
    await this.fillGridAutocompleteField('item_code', data.itemCode);
    await this.fillGridInputField('qty', data.quantity);

    const uomInput = this.autocompleteField('uom', 'last');
    if (await uomInput.isVisible().catch(() => false)) {
      await this.fillAutocomplete(uomInput, data.stockUom);
    }

    await this.fillRowWarehouse(data.warehouseName);
    await this.saveUntilSaved(/\/app\/request-for-quotation\/(?!new-request-for-quotation-)/);
  }
}
