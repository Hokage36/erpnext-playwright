import { Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
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

  async gotoNewFromList(): Promise<void> {
    await this.gotoNewDocumentFromList('/app/delivery-note/new-delivery-note', '/app/delivery-note');
  }

  async openFromSalesOrder(): Promise<void> {
    await this.openCreateMenuItem(uiText.createMenu.deliveryNote);
    await this.page.waitForURL(/\/app\/delivery-note\//, { timeout: 15000 });
  }

  async createDeliveryNote(data: DeliveryNoteData): Promise<void> {
    await this.gotoNewFromList();
    await this.fillAutocompleteField('customer', data.customerName);

    await this.fillSetWarehouseIfVisible(data.warehouseName);
    await this.page.keyboard.press('Escape').catch(() => {});

    await this.clickGridCell('.col.grid-static-col[data-fieldname="item_code"]:visible', 'last');
    await this.fillGridAutocompleteField('item_code', data.itemCode);
    await this.fillGridInputField('qty', data.quantity);
    await this.fillGridAutocompleteField('uom', data.stockUom);
    await this.fillRowWarehouse(data.warehouseName);

    await this.saveUntilSaved(/\/app\/delivery-note\/(?!new-delivery-note-)/);
    await this.dismissMessageDialogIfPresent();
    await this.assertNoMissingFieldDialog();
  }
}
