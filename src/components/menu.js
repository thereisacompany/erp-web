export const menuItems = [{
    id: 10001,
    label: "首頁",
    icon: "bx-home-circle",
    link: "/",
    key: "/dashboard/analysis"
},
{
    id: 11001,
    label: "公司資料管理",
    icon: "bxs-user-detail",
    key: "/systemA",
    subItems: [

        { id: 11004, label: "客戶管理", link: "/user/customerlist", parentId: 11001 },
        { id: 11006, label: "人事管理", link: "/user/driverlist", parentId: 11001 },
        { id: 11005, label: "車輛管理", link: "/stock/vehiclelist", parentId: 11001 },
    ]
},
{
    id: 11101,
    label: "商品管理",
    icon: "bx-box",
    key: "/material",
    subItems: [
        { id: 11102, label: "商品管理", link: "/product/index", parentId: 11101 },
        { id: 11103, label: "商品類別", link: "/product/category", parentId: 11101 },
    ]
},
{
    id: 12001,
    label: "倉庫管理",
    icon: "bx-store",
    key: "/depot",
    subItems: [
        { id: 12002, label: "倉庫別管理", link: "/stock/depotlist", parentId: 12101 },
        { id: 12003, label: "進貨單", link: "/stock/instocklist", parentId: 12001 },
        { id: 12004, label: "配送單", link: "/stock/outstocklist", parentId: 12001 },
        { id: 12005, label: "移倉管理", link: "/stock/movestocklist", parentId: 12001 },
        { id: 12006, label: "退貨單", link: "/stock/returnstocklist", parentId: 12001 },
    ]
},
{
    id: 13001,
    label: "報表查詢",
    icon: "bxs-report",
    key: "/report",
    subItems: [
        { id: 13002, label: "進銷存統計", link: "/report/in_out_stock_report", parentId: 13001 },
        { id: 13003, label: "司機配送統計表", link: "/report/driver_stock_report", parentId: 13001 },

    ]
},
{
    id: 19001,
    label: "系統管理",
    icon: "bxs-user-rectangle",
    key: "/system",
    subItems: [
        { id: 19002, label: "角色管理", link: "/system/rolelist", parentId: 19001 },
        { id: 19003, label: "用戶管理", link: "/system/userlist", parentId: 19001 },
        { id: 19004, label: "角色管理-新", link: "/system/role", parentId: 19001 },
    ]
},
];
//api
// [
//     {
//         "component": "/layouts/TabLayout",
//         "icon": "home",
//         "id": 0,
//         "text": "首页",
//         "url": "/dashboard/analysis"
//     },
//     {
//         "component": null,
//         "children": [
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 263,
//                 "text": "客戶管理",
//                 "url": "/system/customer"
//             },
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 264,
//                 "text": "人事管理",
//                 "url": "/system/member"
//             },
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 265,
//                 "text": "車輛管理",
//                 "url": "/system/vehicle"
//             }
//         ],
//         "icon": null,
//         "id": 262,
//         "text": "人事管理",
//         "url": "/systemA"
//     },
//     {
//         "component": null,
//         "children": [
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 267,
//                 "text": "商品管理",
//                 "url": "/material/material"
//             },
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 268,
//                 "text": "商品類別",
//                 "url": "/material/material_category"
//             }
//         ],
//         "icon": null,
//         "id": 266,
//         "text": "商品管理",
//         "url": "/material"
//     },
//     {
//         "component": null,
//         "children": [
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 270,
//                 "text": "倉庫別管理",
//                 "url": "/depot/depot"
//             },
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 271,
//                 "text": "進貨單",
//                 "url": "/depot/stock_in"
//             },
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 272,
//                 "text": "配送單",
//                 "url": "/depot/stock_out"
//             },
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 273,
//                 "text": "移倉管理",
//                 "url": "/depot/move"
//             },
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 274,
//                 "text": "退貨單",
//                 "url": "/depot/stock_back"
//             }
//         ],
//         "icon": null,
//         "id": 269,
//         "text": "倉庫管理",
//         "url": "/depot"
//     },
//     {
//         "component": null,
//         "children": [
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 276,
//                 "text": "進銷存統計",
//                 "url": "/\breport/in_out_stock"
//             },
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 277,
//                 "text": "司機配送統計表",
//                 "url": "/report/driver_out"
//             }
//         ],
//         "icon": null,
//         "id": 275,
//         "text": "報表查詢",
//         "url": "/report"
//     },
//     {
//         "component": null,
//         "children": [
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 260,
//                 "text": "角色管理",
//                 "url": "/system/role"
//             },
//             {
//                 "component": null,
//                 "icon": null,
//                 "id": 261,
//                 "text": "用戶管理",
//                 "url": "/system/user"
//             }
//         ],
//         "icon": null,
//         "id": 259,
//         "text": "系統管理",
//         "url": "/system"
//     }
// ]