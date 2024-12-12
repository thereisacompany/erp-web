// 商品管理 table
export const productsTableColumn = [
  { field: "supplier", title: "客戶名稱", width: "15%" },
  {
    field: "supplierall",
    title: "客戶全名",
    width: "15%",
  },
  {
    field: "taxid",
    title: "統一編號",
    width: "8%",
  },
  {
    field: "contacts",
    title: "聯絡人",
    width: "7%",
  },
  {
    field: "telephone",
    title: "手機號碼",
    width: "10%",
  },
  {
    field: "phoneNum",
    title: "聯絡電話",
    width: "12%",
  },
  {
    field: "email",
    title: "電子信箱",
    width: "12%",
  },
  {
    field: "enabled",
    title: "狀態",
    width: "8%",
  }
  , {
    field: "action",
    title: "操作",
    width: "8%",
  }
]

// 新增、編輯商品 modal form
export const productFormItem = [
  {
    field: 'supplier',
    key: 'supplier',
    label: '客戶名稱',
    required: true,
  },
  {
    field: 'supplierall',
    key: 'supplierall',
    label: '客戶全名',
    required: true,
  },
  {
    field: 'taxid',
    key: 'taxid',
    label: '統一編號',
    required: false,
  },
  {
    field: 'contacts',
    key: 'contacts',
    label: '聯絡人',
    required: false,
  },
  {
    field: 'telephone',
    key: 'telephone',
    label: '手機號碼',
    required: false,
  },
  {
    field: 'phoneNum',
    key: 'phoneNum',
    label: '聯絡電話',
    required: false,
  },
  {
    field: 'email',
    key: 'email',
    label: '電子信箱',
    required: false,
  },
  {
    field: 'address',
    key: 'address',
    label: '地址',
    required: false,
  },
  {
    field: 'enabled',
    key: 'enabled',
    label: '狀態',
    required: false,
  },
]