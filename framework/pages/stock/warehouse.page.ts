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

  async createWarehouse(warehouseName: string): Promise<void> {
    await this.gotoList();
    await this.clickPrimaryAction();
    await this.fillInputField('warehouse_name', warehouseName);
    await this.save();
    await this.assertNoMissingFieldDialog();
  }
}
