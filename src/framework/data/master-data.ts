export const masterData = {
  customerName: 'CongTyTnhhVivo',
  supplierName: 'MA Inc.',
  itemCode: 'AKS001',
  warehouseName: 'KhoHangPhiaDong01 - AD',
  itemGroup: 'Products',
  stockUom: 'Nos',
  itemRate: '100000',
  country: 'Vietnam',
  supplierGroup: 'All Supplier Groups',
  supplierType: 'Company',
  territoryName: 'All Territories',
  stockEntryType: 'Material Receipt',
  defaultQuantity: '1',
  stockReconciliationQuantity: '5',
  stockReconciliationPurpose: 'Kiểm kê, chốt kho',
  valuationRate: '100000',
  salesPartnerCommissionRate: '12',
} as const;

const commonQuantityInvalidValues = {
  decimalQuantity: '0,5',
  negativeQuantity: '-1',
  nonNumericQuantity: 'abc',
  zeroQuantity: '0',
} as const;

const commonNegativeRate = '-1000';
const commonNegativeReturnDecimalQuantity = '-0,5';

export const buyingInvalidValues = {
  ...commonQuantityInvalidValues,
  negativeReturnDecimalQuantity: commonNegativeReturnDecimalQuantity,
  negativeRate: commonNegativeRate,
} as const;

export const sellingInvalidValues = {
  ...commonQuantityInvalidValues,
  negativeCommissionRate: '-1',
  negativeReturnDecimalQuantity: commonNegativeReturnDecimalQuantity,
  negativeRate: commonNegativeRate,
} as const;

export const stockInvalidValues = {
  ...commonQuantityInvalidValues,
  negativeValuationRate: commonNegativeRate,
} as const;

export const buyingNewDocumentUrlPatterns = {
  purchaseInvoice: /\/app\/purchase-invoice\/new-purchase-invoice/,
  purchaseOrder: /\/app\/purchase-order\/new-purchase-order/,
  purchaseReceipt: /\/app\/purchase-receipt\/new-purchase-receipt/,
  requestForQuotation: /\/app\/request-for-quotation\/new-request-for-quotation/,
  supplier: /\/app\/supplier\/new-supplier/,
  supplierQuotation: /\/app\/supplier-quotation\/new-supplier-quotation/,
} as const;

export const sellingNewDocumentUrlPatterns = {
  deliveryNote: /\/app\/delivery-note\/new-delivery-note/,
  quotation: /\/app\/quotation\/new-quotation/,
  salesInvoice: /\/app\/sales-invoice\/new-sales-invoice/,
  salesOrder: /\/app\/sales-order\/new-sales-order/,
  salesPartner: /\/app\/sales-partner\/new-sales-partner/,
} as const;

export const stockNewDocumentUrlPatterns = {
  deliveryNote: /\/app\/delivery-note\/new-delivery-note/,
  item: /\/app\/item\/new-item/,
  stockEntry: /\/app\/stock-entry\/new-stock-entry/,
  stockReconciliation: /\/app\/stock-reconciliation\/new-stock-reconciliation/,
  warehouse: /\/app\/warehouse\/new-warehouse/,
} as const;

export function buildUniqueCustomerName(): string {
  return `Khach-Hang-${Date.now()}`;
}

export function buildUniqueSupplierName(): string {
  return `Nha-Cung-Cap-${Date.now()}`;
}

export function buildUniqueSalesPartnerName(): string {
  return `Dai-Ly-${Date.now()}`;
}

export function buildUniqueWarehouseName(): string {
  return `Kho-Hang-${Date.now()}`;
}

export function buildUniqueItem(): { itemCode: string; itemName: string } {
  const suffix = Date.now();

  return {
    itemCode: `MA-HANG-${suffix}`,
    itemName: `Mat hang ${suffix}`,
  };
}

export function buildPaymentReferenceNo(): string {
  return `CHK-${Date.now()}`;
}
