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
  stockReconciliationPurpose: 'Ki\u1ec3m k\u00ea, ch\u1ed1t kho',
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

export const stockInvalidValues = {
  ...commonQuantityInvalidValues,
  negativeValuationRate: commonNegativeRate,
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
