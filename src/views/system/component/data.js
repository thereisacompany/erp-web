// export const menuItems = [
//   {
//     key: 0,
//     key: 0,
//     title: "全選",
//     children: [{
//       key: 10001,
//       key: 10001,
//       title: "首頁",
//       icon: "bx-home-circle",
//       link: "/",
//     },
//     {
//       key: 11001,
//       key: 11001,
//       title: "人事管理",
//       icon: "bxs-user-detail",
//       children: [
//         { key: 11004, key: 11004, title: "客戶管理", link: "/user/customerlist", parentkey: 11001 },
//         { key: 11006, key: 11006, title: "人事管理", link: "/user/driverlist", parentkey: 11001 },
//         { key: 11005, key: 11005, title: "車輛管理", link: "/stock/vehiclelist", parentkey: 11001 },
//       ]
//     },
//     {
//       key: 11101,
//       key: 11101,
//       title: "商品管理",
//       icon: "bx-box",
//       children: [
//         { key: 11102, key: 11102, title: "商品管理", link: "/product/index", parentkey: 11101 },
//         { key: 11103, key: 11103, title: "商品類別", link: "/product/category", parentkey: 11101 },
//       ]
//     },
//     {
//       key: 12001,
//       key: 12001,
//       title: "倉庫管理",
//       icon: "bx-store",
//       children: [
//         { key: 12002, key: 12002, title: "倉庫別管理", link: "/stock/depotlist", parentkey: 12101 },
//         { key: 12003, key: 12003, title: "進貨單", link: "/stock/instocklist", parentkey: 12001 },
//         { key: 12004, key: 12004, title: "配送單", link: "/stock/outstocklist", parentkey: 12001 },
//         { key: 12005, key: 12005, title: "移倉管理", link: "/stock/movestocklist", parentkey: 12001 },
//         { key: 12006, key: 12006, title: "退貨單", link: "/stock/returnstocklist", parentkey: 12001 },
//       ]
//     },
//     {
//       key: 13001,
//       key: 13001,
//       title: "報表查詢",
//       icon: "bxs-report",
//       children: [
//         { key: 13002, key: 13002, title: "進銷存統計", link: "/report/in_out_stock_report", parentkey: 13001 },
//         { key: 13003, key: 13003, title: "司機配送統計表", link: "/report/driver_stock_report", parentkey: 13001 },
//       ]
//     },
//     {
//       key: 19001,
//       key: 19001,
//       title: "系統管理",
//       icon: "bxs-user-rectangle",
//       children: [
//         { key: 19002, key: 19002, title: "角色管理", link: "/system/rolelist", parentkey: 19001 },
//         { key: 19003, key: 19003, title: "用戶管理", link: "/system/userlist", parentkey: 19001 },
//         { key: 19004, key: 19004, title: "角色管理-新", link: "/system/role", parentkey: 19001 },
//       ]
//     },]
//   }
// ];



export const menuItems = [
  {
    component: null,
    icon: null,
    key: 0,
    text: "全選",
    children: [
      // {
      //   component: "/layouts/TabLayout",
      //   icon: "home",
      //   key: 0,
      //   text: "首页",
      //   url: "/dashboard/analysis"
      // },
      {
        component: null,
        children: [
          {
            component: null,
            icon: null,
            key: 263,
            text: "客戶管理",
            url: "/system/customer"
          },
          {
            component: null,
            icon: null,
            key: 264,
            text: "人事管理",
            url: "/system/member"
          },
          {
            component: null,
            icon: null,
            key: 265,
            text: "車輛管理",
            url: "/system/vehicle"
          }
        ],
        icon: null,
        key: 262,
        text: "人事管理",
        url: "/systemA"
      },
      {
        component: null,
        children: [
          {
            component: null,
            icon: null,
            key: 267,
            text: "商品管理",
            url: "/material/material"
          },
          {
            component: null,
            icon: null,
            key: 268,
            text: "商品類別",
            url: "/material/material_category"
          }
        ],
        icon: null,
        key: 266,
        text: "商品管理",
        url: "/material"
      },
      {
        component: null,
        children: [
          {
            component: null,
            icon: null,
            key: 270,
            text: "倉庫別管理",
            url: "/depot/depot"
          },
          {
            component: null,
            icon: null,
            key: 271,
            text: "進貨單",
            url: "/depot/stock_in"
          },
          {
            component: null,
            icon: null,
            key: 272,
            text: "配送單",
            url: "/depot/stock_out"
          },
          {
            component: null,
            icon: null,
            key: 273,
            text: "移倉管理",
            url: "/depot/move"
          },
          {
            component: null,
            icon: null,
            key: 274,
            text: "退貨單",
            url: "/depot/stock_back"
          }
        ],
        icon: null,
        key: 269,
        text: "倉庫管理",
        url: "/depot"
      },
      {
        component: null,
        children: [
          {
            component: null,
            icon: null,
            key: 276,
            text: "進銷存統計",
            url: "/\breport/in_out_stock"
          },
          {
            component: null,
            icon: null,
            key: 277,
            text: "司機配送統計表",
            url: "/report/driver_out"
          }
        ],
        icon: null,
        key: 275,
        text: "報表查詢",
        url: "/report"
      },
      {
        component: null,
        children: [
          {
            component: null,
            icon: null,
            key: 260,
            text: "角色管理",
            url: "/system/role"
          },
          {
            component: null,
            icon: null,
            key: 261,
            text: "用戶管理",
            url: "/system/user"
          }
        ],
        icon: null,
        key: 259,
        text: "系統管理",
        url: "/system"
      }]
  },
]