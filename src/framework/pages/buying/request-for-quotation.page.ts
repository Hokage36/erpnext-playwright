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

  async fillRequestForQuotationForm(data: Partial<RequestForQuotationData>): Promise<void> {
    await this.gotoNewFromList();

    if (data.supplierName !== undefined) {
      await this.clickGridCell('.col.grid-static-col.col-xs-3.error');
      await this.fillGridAutocompleteField('supplier', data.supplierName);
    }

    const shouldFillItemRow =
      data.itemCode !== undefined ||
      data.quantity !== undefined ||
      data.stockUom !== undefined ||
      data.warehouseName !== undefined;

    if (!shouldFillItemRow) {
      return;
    }

    await this.clickGridCell('.col.grid-static-col.col-xs-2.error');
    await this.openFirstGridRow();

    if (data.itemCode !== undefined) {
      await this.fillOpenRowAutocompleteField('item_code', data.itemCode);
    }

    if (data.quantity !== undefined) {
      await this.fillOpenRowInputField('qty', data.quantity);
    }

    if (data.stockUom !== undefined) {
      await this.fillOpenRowAutocompleteField('uom', data.stockUom);
    }

    if (data.warehouseName !== undefined) {
      await this.fillOpenRowAutocompleteField('warehouse', data.warehouseName);
    }

    await this.closeOpenGridRow();
  }

  async createRequestForQuotation(data: RequestForQuotationData): Promise<void> {
    await this.fillRequestForQuotationForm(data);
    await this.saveUntilSaved(/\/app\/request-for-quotation\/(?!new-request-for-quotation-)/);
  }
}
