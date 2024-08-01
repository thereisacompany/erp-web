export const menuItems = [
  {
    id: 0,
    key: 0,
    title: "全選",
    children: [{
      id: 10001,
      key: 10001,
      title: "首頁",
      icon: "bx-home-circle",
      link: "/",
    },
    {
      id: 11001,
      key: 11001,
      title: "人事管理",
      icon: "bxs-user-detail",
      children: [
        { id: 11004, key: 11004, title: "客戶管理", link: "/user/customerlist", parentId: 11001 },
        { id: 11006, key: 11006, title: "人事管理", link: "/user/driverlist", parentId: 11001 },
        { id: 11005, key: 11005, title: "車輛管理", link: "/stock/vehiclelist", parentId: 11001 },
      ]
    },
    {
      id: 11101,
      key: 11101,
      title: "商品管理",
      icon: "bx-box",
      children: [
        { id: 11102, key: 11102, title: "商品管理", link: "/product/index", parentId: 11101 },
        { id: 11103, key: 11103, title: "商品類別", link: "/product/category", parentId: 11101 },
      ]
    },
    {
      id: 12001,
      key: 12001,
      title: "倉庫管理",
      icon: "bx-store",
      children: [
        { id: 12002, key: 12002, title: "倉庫別管理", link: "/stock/depotlist", parentId: 12101 },
        { id: 12003, key: 12003, title: "進貨單", link: "/stock/instocklist", parentId: 12001 },
        { id: 12004, key: 12004, title: "配送單", link: "/stock/outstocklist", parentId: 12001 },
        { id: 12005, key: 12005, title: "移倉管理", link: "/stock/movestocklist", parentId: 12001 },
        { id: 12006, key: 12006, title: "退貨單", link: "/stock/returnstocklist", parentId: 12001 },
      ]
    },
    {
      id: 13001,
      key: 13001,
      title: "報表查詢",
      icon: "bxs-report",
      children: [
        { id: 13002, key: 13002, title: "進銷存統計", link: "/report/in_out_stock_report", parentId: 13001 },
        { id: 13003, key: 13003, title: "司機配送統計表", link: "/report/driver_stock_report", parentId: 13001 },
      ]
    },
    {
      id: 19001,
      key: 19001,
      title: "系統管理",
      icon: "bxs-user-rectangle",
      children: [
        { id: 19002, key: 19002, title: "角色管理", link: "/system/rolelist", parentId: 19001 },
        { id: 19003, key: 19003, title: "用戶管理", link: "/system/userlist", parentId: 19001 },
        { id: 19004, key: 19004, title: "角色管理-新", link: "/system/role", parentId: 19001 },
      ]
    },]
  }
];

// 過濾obj值為null的item
export function filterNullValues(obj) {
  if (obj === null || obj === undefined) {
    return {};
  }

  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== null) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}