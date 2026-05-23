export const uiText = {
  common: {
    save: 'Lưu',
    submit: 'Gửi',
    confirm: 'Đồng ý',
    create: 'Tạo',
    unsavedLabelPattern: /Chưa lưu/i,
    missingFieldPattern: /Thiếu trường|required|khuyết bắt buộc|giá trị còn thiếu/i,
  },
  modules: {
    sales: 'Bán hàng',
    buying: 'Mua hàng',
    stock: 'Kho',
  },
  dialogs: {
    materialRequest: 'Chọn Yêu cầu nguyên liệu',
    defaultWarehouse: 'Kho mặc định',
  },
  createMenu: {
    deliveryNote: 'Phiếu giao hàng',
    salesInvoice: 'Hóa đơn bán hàng',
    payment: 'Thanh toán',
    purchaseReceipt: 'Biên lai nhận hàng',
    purchaseInvoice: 'Hóa đơn mua hàng',
  },
  createMenuPattern: {
    salesReturn: /sales return|sales.*return|bán.*(quay lại|trở lại)|quay lại bán|trở lại bán|return|trả hàng/i,
  },
  stock: {
    stockReconciliationPurpose: 'Kiểm kê, chốt kho',
  },
} as const;
