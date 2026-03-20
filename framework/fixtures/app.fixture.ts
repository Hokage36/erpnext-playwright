import { expect, test as base } from '@playwright/test';

import { PurchaseOrderPage } from '../pages/buying/purchase-order.page';
import { RequestForQuotationPage } from '../pages/buying/request-for-quotation.page';
import { SupplierQuotationPage } from '../pages/buying/supplier-quotation.page';
import { ErpDocumentPage } from '../pages/erp-document.page';
import { LoginPage } from '../pages/login.page';
import { CustomerPage } from '../pages/selling/customer.page';
import { DeliveryNotePage } from '../pages/selling/delivery-note.page';
import { QuotationPage } from '../pages/selling/quotation.page';
import { SalesOrderPage } from '../pages/selling/sales-order.page';
import { SalesPartnerPage } from '../pages/selling/sales-partner.page';
import { ItemPage } from '../pages/stock/item.page';
import { StockEntryPage } from '../pages/stock/stock-entry.page';
import { StockReconciliationPage } from '../pages/stock/stock-reconciliation.page';
import { WarehousePage } from '../pages/stock/warehouse.page';

type AppFixtures = {
  loginPage: LoginPage;
  customerPage: CustomerPage;
  salesPartnerPage: SalesPartnerPage;
  quotationPage: QuotationPage;
  salesOrderPage: SalesOrderPage;
  deliveryNotePage: DeliveryNotePage;
  requestForQuotationPage: RequestForQuotationPage;
  supplierQuotationPage: SupplierQuotationPage;
  purchaseOrderPage: PurchaseOrderPage;
  itemPage: ItemPage;
  warehousePage: WarehousePage;
  stockEntryPage: StockEntryPage;
  stockReconciliationPage: StockReconciliationPage;
  documentPage: ErpDocumentPage;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  customerPage: async ({ page }, use) => {
    await use(new CustomerPage(page));
  },
  salesPartnerPage: async ({ page }, use) => {
    await use(new SalesPartnerPage(page));
  },
  quotationPage: async ({ page }, use) => {
    await use(new QuotationPage(page));
  },
  salesOrderPage: async ({ page }, use) => {
    await use(new SalesOrderPage(page));
  },
  deliveryNotePage: async ({ page }, use) => {
    await use(new DeliveryNotePage(page));
  },
  requestForQuotationPage: async ({ page }, use) => {
    await use(new RequestForQuotationPage(page));
  },
  supplierQuotationPage: async ({ page }, use) => {
    await use(new SupplierQuotationPage(page));
  },
  purchaseOrderPage: async ({ page }, use) => {
    await use(new PurchaseOrderPage(page));
  },
  itemPage: async ({ page }, use) => {
    await use(new ItemPage(page));
  },
  warehousePage: async ({ page }, use) => {
    await use(new WarehousePage(page));
  },
  stockEntryPage: async ({ page }, use) => {
    await use(new StockEntryPage(page));
  },
  stockReconciliationPage: async ({ page }, use) => {
    await use(new StockReconciliationPage(page));
  },
  documentPage: async ({ page }, use) => {
    await use(new ErpDocumentPage(page));
  },
});

export { expect };
