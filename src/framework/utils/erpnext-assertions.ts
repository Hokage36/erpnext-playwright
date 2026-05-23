import { expect, Page } from '@playwright/test';

import { toNumber, waitForResource, waitForResources } from './frappe-api';

type SubmittedDocument = {
  docstatus: number;
  name: string;
};

type StockLedgerEntry = {
  actual_qty?: number | string;
};

type GeneralLedgerEntry = {
  credit?: number | string;
  debit?: number | string;
};

type SupplierDocument = {
  country?: string;
  supplier_name?: string;
};

type BuyingLineItem = {
  against_purchase_order?: string;
  item_code?: string;
  purchase_order?: string;
  purchase_receipt?: string;
  qty?: number | string;
  warehouse?: string;
};

type SubmittedBuyingDocument = SubmittedDocument & {
  items: BuyingLineItem[];
  supplier?: string;
};

type BuyingInvoiceLineItem = {
  item_code?: string;
  purchase_order?: string;
  purchase_receipt?: string;
};

type SubmittedBuyingInvoice = SubmittedDocument & {
  items: BuyingInvoiceLineItem[];
};

type SellingLineItem = {
  against_sales_order?: string;
  delivery_note?: string;
  item_code?: string;
  sales_order?: string;
  qty?: number | string;
  warehouse?: string;
};

type SubmittedSellingDocument = SubmittedDocument & {
  customer?: string;
  items: SellingLineItem[];
};

type SellingInvoiceLineItem = {
  delivery_note?: string;
  item_code?: string;
  sales_order?: string;
};

type SubmittedSellingInvoice = SubmittedDocument & {
  items: SellingInvoiceLineItem[];
};

type StockEntryLineItem = {
  item_code?: string;
  qty?: number | string;
  t_warehouse?: string;
};

type SubmittedStockEntry = SubmittedDocument & {
  items: StockEntryLineItem[];
  stock_entry_type?: string;
};

type StockReconciliationLineItem = {
  item_code?: string;
  qty?: number | string;
  valuation_rate?: number | string;
  warehouse?: string;
};

type SubmittedStockReconciliation = SubmittedDocument & {
  items: StockReconciliationLineItem[];
};

type StockLedgerBalanceEntry = StockLedgerEntry & {
  qty_after_transaction?: number | string;
};

// ERPNext tra ve kha nhieu gia tri so duoi dang string, nen helper nay gom logic ep kieu ve mot cho.
function sumNumericField<T>(items: T[], selector: (item: T) => unknown): number {
  return items.reduce((sum, item) => sum + toNumber(selector(item)), 0);
}

// Day la buoc chung de dam bao document da duoc submit truoc khi di vao assert nghiep vu cu the.
export async function waitForSubmittedDocument<T extends SubmittedDocument>(
  page: Page,
  doctype: string,
  name: string
): Promise<T> {
  const document = await waitForResource<T>(page, doctype, name);

  expect(document.docstatus).toBe(1);
  return document;
}

export async function expectVoucherStockLedgerTotalQty(
  page: Page,
  options: {
    fields?: string[];
    itemCode: string;
    expectedQty: number;
    voucherNo: string;
    voucherType: string;
    warehouse: string;
  }
): Promise<StockLedgerEntry[]> {
  const entries = await waitForVoucherStockLedgerEntries(page, options);

  expect(sumNumericField(entries, (entry) => entry.actual_qty)).toBe(options.expectedQty);
  return entries;
}

export async function waitForVoucherStockLedgerEntries<T extends StockLedgerEntry>(
  page: Page,
  options: {
    fields?: string[];
    itemCode: string;
    voucherNo: string;
    voucherType: string;
    warehouse: string;
  }
): Promise<T[]> {
  // Stock Ledger duoc dung de xac nhan bien dong ton kho sau moi nghiep vu nhap/xuat/chot kho.
  return waitForResources<T>(
    page,
    'Stock Ledger Entry',
    {
      fields: options.fields ?? ['name', 'actual_qty'],
      filters: [
        ['voucher_no', '=', options.voucherNo],
        ['voucher_type', '=', options.voucherType],
        ['item_code', '=', options.itemCode],
        ['warehouse', '=', options.warehouse],
      ],
      limit: 20,
    },
    (items) => items.length > 0
  );
}

export async function expectBalancedVoucherGeneralLedger(
  page: Page,
  options: {
    voucherNo: string;
    voucherType: string;
  }
): Promise<GeneralLedgerEntry[]> {
  // GL Entry duoc dung de xac nhan he thong da sinh but toan va but toan can bang.
  const entries = await waitForResources<GeneralLedgerEntry>(
    page,
    'GL Entry',
    {
      fields: ['name', 'credit', 'debit'],
      filters: [
        ['voucher_no', '=', options.voucherNo],
        ['voucher_type', '=', options.voucherType],
      ],
      limit: 20,
    },
    (items) => items.length > 0
  );

  const totalDebit = sumNumericField(entries, (entry) => entry.debit);
  const totalCredit = sumNumericField(entries, (entry) => entry.credit);

  expect(entries.length).toBeGreaterThan(0);
  expect(totalDebit).toBeGreaterThan(0);
  expect(totalCredit).toBeGreaterThan(0);
  expect(Math.abs(totalDebit - totalCredit)).toBeLessThanOrEqual(0.01);

  return entries;
}

// Buying
export async function expectSupplierCreated(
  page: Page,
  options: {
    country: string;
    supplierDocumentName: string;
    supplierName: string;
  }
): Promise<void> {
  const supplier = await waitForResource<SupplierDocument>(page, 'Supplier', options.supplierDocumentName);

  expect(supplier.supplier_name).toBe(options.supplierName);
  expect(supplier.country).toBe(options.country);
}

export async function expectPurchaseOrderSubmitted(
  page: Page,
  options: {
    purchaseOrderName: string;
    supplierName: string;
  }
): Promise<void> {
  // Purchase Order chi can xac nhan document submit thanh cong va gan dung supplier.
  const purchaseOrder = await waitForSubmittedDocument<SubmittedBuyingDocument>(
    page,
    'Purchase Order',
    options.purchaseOrderName
  );

  expect(purchaseOrder.supplier).toBe(options.supplierName);
}

export async function expectPurchaseReceiptSubmitted(
  page: Page,
  options: {
    expectedQty: number | string;
    itemCode: string;
    purchaseOrderName: string;
    purchaseReceiptName: string;
    warehouseName: string;
  }
): Promise<void> {
  // Purchase Receipt phai lien ket nguoc ve PO va cap nhat ton kho dung so luong.
  const purchaseReceipt = await waitForSubmittedDocument<SubmittedBuyingDocument>(
    page,
    'Purchase Receipt',
    options.purchaseReceiptName
  );

  expect(
    purchaseReceipt.items.some(
      (item) =>
        item.item_code === options.itemCode &&
        item.warehouse === options.warehouseName &&
        [item.purchase_order, item.against_purchase_order].includes(options.purchaseOrderName)
    )
  ).toBeTruthy();

  await expectVoucherStockLedgerTotalQty(page, {
    expectedQty: toNumber(options.expectedQty),
    itemCode: options.itemCode,
    voucherNo: options.purchaseReceiptName,
    voucherType: 'Purchase Receipt',
    warehouse: options.warehouseName,
  });
}

export async function expectPurchaseInvoiceSubmitted(
  page: Page,
  options: {
    itemCode: string;
    purchaseInvoiceName: string;
    purchaseOrderName: string;
    purchaseReceiptName: string;
  }
): Promise<void> {
  // Purchase Invoice phai lien ket duoc voi PO/PR va sinh but toan ke toan.
  const purchaseInvoice = await waitForSubmittedDocument<SubmittedBuyingInvoice>(
    page,
    'Purchase Invoice',
    options.purchaseInvoiceName
  );

  expect(
    purchaseInvoice.items.some(
      (item) =>
        item.item_code === options.itemCode &&
        (item.purchase_order === options.purchaseOrderName || item.purchase_receipt === options.purchaseReceiptName)
    )
  ).toBeTruthy();

  await expectBalancedVoucherGeneralLedger(page, {
    voucherNo: options.purchaseInvoiceName,
    voucherType: 'Purchase Invoice',
  });
}

// Selling
export async function expectSalesOrderSubmitted(
  page: Page,
  options: {
    customerName: string;
    salesOrderName: string;
  }
): Promise<void> {
  const salesOrder = await waitForSubmittedDocument<SubmittedSellingDocument>(page, 'Sales Order', options.salesOrderName);

  expect(salesOrder.customer).toBe(options.customerName);
}

export async function expectDeliveryNoteSubmitted(
  page: Page,
  options: {
    deliveryNoteName: string;
    expectedQty: number | string;
    itemCode: string;
    salesOrderName: string;
    warehouseName: string;
  }
): Promise<void> {
  // Delivery Note phai tao tu SO va lam giam ton kho.
  const deliveryNote = await waitForSubmittedDocument<SubmittedSellingDocument>(page, 'Delivery Note', options.deliveryNoteName);

  expect(
    deliveryNote.items.some(
      (item) =>
        item.item_code === options.itemCode &&
        item.warehouse === options.warehouseName &&
        [item.sales_order, item.against_sales_order].includes(options.salesOrderName)
    )
  ).toBeTruthy();

  await expectVoucherStockLedgerTotalQty(page, {
    expectedQty: toNumber(options.expectedQty),
    itemCode: options.itemCode,
    voucherNo: options.deliveryNoteName,
    voucherType: 'Delivery Note',
    warehouse: options.warehouseName,
  });
}

export async function expectSalesInvoiceSubmitted(
  page: Page,
  options: {
    deliveryNoteName: string;
    itemCode: string;
    salesInvoiceName: string;
    salesOrderName: string;
  }
): Promise<void> {
  // Sales Invoice phai lien thong voi SO/DN va sinh but toan ben ke toan.
  const salesInvoice = await waitForSubmittedDocument<SubmittedSellingInvoice>(
    page,
    'Sales Invoice',
    options.salesInvoiceName
  );

  expect(
    salesInvoice.items.some(
      (item) =>
        item.item_code === options.itemCode &&
        (item.delivery_note === options.deliveryNoteName || item.sales_order === options.salesOrderName)
    )
  ).toBeTruthy();

  await expectBalancedVoucherGeneralLedger(page, {
    voucherNo: options.salesInvoiceName,
    voucherType: 'Sales Invoice',
  });
}

// Stock
export async function expectStockEntrySubmitted(
  page: Page,
  options: {
    expectedQty: number | string;
    itemCode: string;
    stockEntryName: string;
    stockEntryType: string;
    warehouseName: string;
  }
): Promise<void> {
  const stockEntry = await waitForSubmittedDocument<SubmittedStockEntry>(page, 'Stock Entry', options.stockEntryName);

  expect(stockEntry.stock_entry_type).toBe(options.stockEntryType);
  expect(
    stockEntry.items.some(
      (item) =>
        item.item_code === options.itemCode &&
        item.t_warehouse === options.warehouseName &&
        toNumber(item.qty) === toNumber(options.expectedQty)
    )
  ).toBeTruthy();

  await expectVoucherStockLedgerTotalQty(page, {
    expectedQty: toNumber(options.expectedQty),
    itemCode: options.itemCode,
    voucherNo: options.stockEntryName,
    voucherType: 'Stock Entry',
    warehouse: options.warehouseName,
  });

  const stockLedgerEntries = await waitForVoucherStockLedgerEntries<StockLedgerBalanceEntry>(page, {
    fields: ['name', 'actual_qty', 'qty_after_transaction'],
    itemCode: options.itemCode,
    voucherNo: options.stockEntryName,
    voucherType: 'Stock Entry',
    warehouse: options.warehouseName,
  });

  expect(
    stockLedgerEntries.some(
      (entry) => toNumber(entry.qty_after_transaction) >= toNumber(options.expectedQty)
    )
  ).toBeTruthy();
}

export async function expectStockReconciliationSubmitted(
  page: Page,
  options: {
    appliedQuantity: number | string;
    itemCode: string;
    stockReconciliationName: string;
    valuationRate: number | string;
    warehouseName: string;
  }
): Promise<void> {
  // Stock Reconciliation phai luu duoc so luong chot kho va gia tri danh gia moi.
  const stockReconciliation = await waitForSubmittedDocument<SubmittedStockReconciliation>(
    page,
    'Stock Reconciliation',
    options.stockReconciliationName
  );

  expect(
    stockReconciliation.items.some(
      (item) =>
        item.item_code === options.itemCode &&
        item.warehouse === options.warehouseName &&
        toNumber(item.qty) === toNumber(options.appliedQuantity) &&
        toNumber(item.valuation_rate) === toNumber(options.valuationRate)
    )
  ).toBeTruthy();

  const stockLedgerEntries = await waitForVoucherStockLedgerEntries<StockLedgerBalanceEntry>(page, {
    fields: ['name', 'actual_qty', 'qty_after_transaction'],
    itemCode: options.itemCode,
    voucherNo: options.stockReconciliationName,
    voucherType: 'Stock Reconciliation',
    warehouse: options.warehouseName,
  });

  expect(
    stockLedgerEntries.some(
      (entry) => toNumber(entry.qty_after_transaction) === toNumber(options.appliedQuantity)
    )
  ).toBeTruthy();
}
