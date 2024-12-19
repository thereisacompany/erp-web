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

// 人事管理 table
export const HRTableColumn = [
  { field: "type", title: "類別", width: "8%" },
  {
    field: "supplier",
    title: "姓名",
    width: "10%",
  },
  {
    field: "loginName",
    title: "登入帳號",
    width: "15%",
  },
  {
    field: "telephone",
    title: "手機號碼",
    width: "15%",
  },
  {
    field: "contacts",
    title: "緊急聯繫人",
    width: "10%",
  },
  {
    field: "emergencyPhone",
    title: "緊急聯繫人電話",
    width: "15%",
  },
  {
    field: "licensePlate",
    title: "車牌號碼",
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
    width: "5%",
  }
]

// 新增、編輯人事 modal form
export const memberFormItem = [
  {
    field: 'type',
    key: 'type',
    label: '人事類別',
    required: true,
    span: 6,
    showDataPicker: false
  },
  {
    field: 'supplier',
    key: 'supplier',
    label: '姓名',
    required: true,
    span: 6,
    showDataPicker: false
  },
  // 只有司機跟冷氣師傅才有帳號密碼欄位
  {
    field: 'loginName',
    key: 'loginName',
    label: '登入帳號',
    required: false,
    span: 6,
    showDataPicker: false
  },
  {
    field: 'loginPassword',
    key: 'loginPassword',
    label: '登入密碼',
    required: false,
    span: 6,
    showDataPicker: false
  },
  //-------
  {
    field: 'telephone',
    key: 'telephone',
    label: '手機號碼',
    required: false,
    span: 6,
    showDataPicker: false
  },
  {
    field: 'phoneNum',
    key: 'phoneNum',
    label: '聯絡電話',
    required: false,
    span: 6,
    showDataPicker: false
  },
  {
    field: 'idNumber',
    key: 'idNumber',
    label: '身分證字號',
    required: false,
    span: 6,
    showDataPicker: false
  },
  {
    field: 'birthday',
    key: 'birthday',
    label: '出生年月日',
    required: false,
    span: 6,
    showDataPicker: true
  },
  {
    field: 'licensePlate',
    key: 'licensePlate',
    label: '車牌號碼',
    required: false,
    span: 6,
    showDataPicker: false
  },
  {
    field: 'email',
    key: 'email',
    label: '電子信箱',
    required: false,
    span: 6,
    showDataPicker: false
  },
  {
    field: 'address',
    key: 'address',
    label: '地址',
    required: false,
    span: 12,
    showDataPicker: false
  },
  {
    field: 'contacts',
    key: 'contacts',
    label: '緊急聯絡人',
    required: false,
    span: 6,
    showDataPicker: false
  },
  {
    field: 'emergencyPhone',
    key: 'emergencyPhone',
    label: '緊急聯絡人電話',
    required: false,
    span: 6,
    showDataPicker: false
  },
  {
    field: 'onboarding',
    key: 'onboarding',
    label: '入職日',
    required: false,
    span: 6,
    showDataPicker: true
  },
  {
    field: 'resign',
    key: 'resign',
    label: '離職日',
    required: false,
    span: 6,
    showDataPicker: true
  },
  {
    field: 'groupInsuranceStart',
    key: 'groupInsuranceStart',
    label: '團保加保日',
    required: false,
    span: 6,
    showDataPicker: true
  },
  {
    field: 'groupInsuranceEnd',
    key: 'groupInsuranceEnd',
    label: '團保退保日',
    required: false,
    span: 6,
    showDataPicker: true
  },
  {
    field: 'laborHealthInsuranceStart',
    key: 'laborHealthInsuranceStart',
    label: '勞健保加保日',
    required: false,
    span: 6,
    showDataPicker: true
  },
  {
    field: 'laborHealthInsuranceEnd',
    key: 'laborHealthInsuranceEnd',
    label: '勞健保退保日',
    required: false,
    span: 6,
    showDataPicker: true
  },
  {
    field: 'enabled',
    key: 'enabled',
    label: '狀態',
    required: false,
    span: 24,
    showDataPicker: false
  },
  {
    field: 'file',
    key: 'file',
    label: '駕照上傳',
    required: false,
    span: 24,
    showDataPicker: false
  },
]

export const typeOptions = (haveAll) => {
  let array = [
    { type: "全部類別", value: "1" },
    { type: "家電-司機", value: "家電-司機" },
    { type: "家電-助手", value: "家電-助手" },
    { type: "冷氣-師傅", value: "冷氣-師傅" },
    { type: "冷氣-助手", value: "冷氣-助手" },
    { type: "行政", value: "行政" },
  ]
  if (!haveAll) {
    array.shift()
  }
  return array
}