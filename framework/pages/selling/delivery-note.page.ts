import { Page } from '@playwright/test';

import { ErpDocumentPage } from '../erp-document.page';

type DeliveryNoteData = {
  customerName: string;
  itemCode: string;
  warehouseName: string;
  quantity: string;
  stockUom: string;
};

export class DeliveryNotePage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoNew(): Promise<void> {
    await this.goto('/app/delivery-note/new-delivery-note');
  }

  async createDeliveryNote(data: DeliveryNoteData): Promise<void> {
    await this.gotoNew();
    await this.fillAutocompleteField('customer', data.customerName);

    const setWarehouseInput = this.autocompleteField('set_warehouse');
    await this.fillAutocomplete(setWarehouseInput, data.warehouseName);
    await this.page.keyboard.press('Escape');

    await this.clickGridCell('.col.grid-static-col[data-fieldname="item_code"]:visible', 'last');
    await this.fillGridAutocompleteField('item_code', data.itemCode);
    await this.fillGridInputField('qty', data.quantity);
    await this.fillGridAutocompleteField('uom', data.stockUom);

    await this.save();
    await this.assertNoMissingFieldDialog();
  }
}
