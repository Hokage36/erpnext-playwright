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
  valuationRate: '100000',
  salesPartnerCommissionRate: '12',
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
