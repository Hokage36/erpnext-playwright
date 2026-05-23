import { Page } from '@playwright/test';

import { uiText } from '../../data/ui-text';
import { ErpDocumentPage } from '../erp-document.page';

export class WarehousePage extends ErpDocumentPage {
  constructor(page: Page) {
    super(page);
  }

  async gotoList(): Promise<void> {
    await this.goto('/app/home');
    await this.openModule(uiText.modules.stock);
    await this.openSidebarLink('/app/warehouse');
  }

  async gotoNew(): Promise<void> {
    await this.gotoList();
    await this.clickPrimaryAction();
  }

  async fillWarehouseForm(warehouseName?: string): Promise<void> {
    await this.gotoNew();

    if (warehouseName !== undefined) {
      await this.fillInputField('warehouse_name', warehouseName);
      await this.inputField('warehouse_name').press('Tab').catch(() => {});
    }
  }

  async createWarehouse(warehouseName: string): Promise<void> {
    await this.fillWarehouseForm(warehouseName);
    await this.saveUntilSaved(/\/app\/warehouse\/(?!new-warehouse-)/);
    await this.dismissMessageDialogIfPresent();
    await this.assertNoMissingFieldDialog();
  }
}
