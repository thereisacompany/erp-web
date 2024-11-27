// 商品管理 table
export const productsTableColumn = [
  { field: "organName", title: "客戶名稱", width: "15%" },
  {
    field: "number",
    title: "客戶全名",
    width: "15%",
  },
  {
    field: "name",
    title: "統一編號",
    width: "10%",
  },
  {
    field: "standard",
    title: "聯絡人",
    width: "10%",
  },
  {
    field: "model",
    title: "手機號碼",
    width: "10%",
  },
  {
    field: "length",
    title: "聯絡電話",
    width: "10%",
  },
  {
    field: "width",
    title: "電子信箱",
    width: "10%",
  },
  {
    field: "enabled",
    title: "狀態",
    width: "5%",
  }
  , {
    field: "action",
    title: "操作",
    width: "10%",
  }
]

// 新增、編輯商品 modal form
export const productFormItem = [
  {
    field: 'organId',
    key: 'organId',
    label: '客戶',
    required: true,
  },
  {
    field: 'name',
    key: 'name',
    label: '品名',
    required: true,
  },
  {
    field: 'categoryId',
    key: 'categoryId',
    label: '類別',
    required: true,
  },
  {
    field: 'number',
    key: 'number',
    label: '品號',
    required: false,
  },
  {
    field: 'standard',
    key: 'standard',
    label: '規格',
    required: false,
  },
  {
    field: 'model',
    key: 'model',
    label: '型號',
    required: false,
  },
  {
    field: 'length',
    key: 'length',
    label: '長(cm)',
    required: false,
  },
  {
    field: 'width',
    key: 'width',
    label: '寬(cm)',
    required: false,
  },
  {
    field: 'high',
    key: 'high',
    label: '高(cm)',
    required: false,
  },
  {
    field: 'volume',
    key: 'volume',
    label: '材積',
    required: false,
  },
  {
    field: 'counter',
    key: 'counter',
    label: '儲位',
    required: false,
  },
  {
    field: 'enabled',
    key: 'enabled',
    label: '狀態',
    required: false,
  }
]