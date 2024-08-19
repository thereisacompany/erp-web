import store from "@/state/store";

export default [
    // 首頁
    {
        path: "/dashboard/analysis",
        name: "home",
        meta: {
            authRequired: true,
        },
        component: require("./views/home/home").default,
    },
    // 供應商管理
    // { path: "/user/vendorlist", name: "vendorlist", meta: { authRequired: true, }, component: require("./views/user/vendorlist").default },
    // 人事管理
    { path: "/systemA", name: "driverlist", meta: { authRequired: true, }, component: require("./views/user/driverlist").default },
    // 客戶管理
    { path: "/system/customer", name: "customerlist", meta: { authRequired: true, }, component: require("./views/user/customerlist").default },
    // 人事管理
    { path: "/system/member", name: "driverlist", meta: { authRequired: true, }, component: require("./views/user/driverlist").default },
    // 車輛管理
    { path: "/system/vehicle", name: "vehiclelist", meta: { authRequired: true, }, component: require("./views/stock/vehiclelist").default },

    // 會員管理
    // { path: "/user/memberlist", name: "memberlist", meta: { authRequired: true, }, component: require("./views/user/memberlist").default },
    // 結算帳號管理
    // { path: "/user/accountlist", name: "accountlist", meta: { authRequired: true, }, component: require("./views/user/accountlist").default },
    // 修改密碼
    // { path: "/user/changepassword", name: "changepassword", meta: { authRequired: true, }, component: require("./views/user/changepassword").default },

    // ------倉庫管理-------
    { path: "/depot", name: "depotlist", meta: { authRequired: true, }, component: require("./views/stock/depotlist").default },
    // 倉庫別管理
    { path: "/depot/depot", name: "depotlist", meta: { authRequired: true, }, component: require("./views/stock/depotlist").default },
    // 進貨單
    { path: "/depot/stock_in", name: "instocklist", meta: { authRequired: true, }, component: require("./views/stock/instocklist").default },
    // 配送單列表
    { path: "/depot/stock_out", name: "outstocklist", meta: { authRequired: true, }, component: require("./views/stock/outstocklist").default },
    // 退貨單列表
    { path: "/depot/stock_back", name: "returnstocklist", meta: { authRequired: true, }, component: require("./views/stock/returnstocklist").default },
    // 移倉管理
    { path: "/depot/move", name: "movestocklist", meta: { authRequired: true, }, component: require("./views/stock/movestocklist").default },
    //---------------------

    // ------報表查詢------
    { path: "/report", name: "in_out_stock_report", meta: { authRequired: true, }, component: require("./views/report/in_out_stock_report").default },
    // 進銷存統計
    { path: "/report/in_out_stock", name: "in_out_stock_report", meta: { authRequired: true, }, component: require("./views/report/in_out_stock_report").default },
    // 司機配送統計表
    { path: "/report/driver_out", name: "driver_stock_report", meta: { authRequired: true, }, component: require("./views/report/driver_stock_report").default },
    //--------------------

    //-------系統管理-------
    { path: "/system", name: "userlist", meta: { authRequired: true, }, component: require("./views/system/userlist").default },
    // 用戶管理
    { path: "/system/user", name: "userlist", meta: { authRequired: true, }, component: require("./views/system/userlist").default },
    // { path: "/system/rolelist", name: "rolelist", meta: { authRequired: true, }, component: require("./views/system/rolelist").default },
    // 角色管理
    { path: "/system/role", name: "role", meta: { authRequired: true, }, component: require("./views/system/role").default },
    //--------------------

    // -------商品管理-------
    {
        path: "/material",
        name: "Product",
        meta: {
            authRequired: true,
        },
        component: require("./views/product/product").default
    },
    // 商品管理
    {
        path: "/material/material",
        name: "Product",
        meta: {
            authRequired: true,
        },
        component: require("./views/product/product").default
    },
    // 商品類別
    {
        path: "/material/material_category",
        name: "ProductCategory",
        meta: {
            authRequired: true,
        },
        component: require("./views/product/category").default
    },
    //--------------------

    // 預設dashboard
    {
        path: "/dashboard",
        name: "dashboard",
        meta: {
            authRequired: true,
        },
        component: () =>
            import("./views/dashboards/default"),
    },
    // 登入
    {
        path: "/login",
        name: "login",
        component: () =>
            import("./views/account/login"),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters["auth/loggedIn"]) {
                    // Redirect to the home page instead
                    next({ name: "default" });
                } else {
                    // Continue to the login page
                    next();
                }
            },
        },
    },
    // 註冊
    {
        path: "/register",
        name: "Register",
        component: () =>
            import("./views/account/register"),
        meta: {

            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters["auth/loggedIn"]) {
                    // Redirect to the home page instead
                    next({ name: "default" });
                } else {
                    // Continue to the login page
                    next();
                }
            },
        },
    },
    // 忘記密碼
    {
        path: "/forgot-password",
        name: "Forgot password",
        component: () =>
            import("./views/account/forgot-password"),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters["auth/loggedIn"]) {
                    // Redirect to the home page instead
                    next({ name: "default" });
                } else {
                    // Continue to the login page
                    next();
                }
            },
        },
    },
    // 登出
    {
        path: "/logout",
        name: "logout",
        component: () =>
            import("./views/account/logout"),
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
                    store.dispatch("auth/logOut");
                } else {
                    store.dispatch("authfack/logout");
                }
                const authRequiredOnPreviousRoute = routeFrom.matched.some((route) =>
                    route.push("/login")
                );
                // Navigate back to previous page, or home as a fallback
                next(
                    authRequiredOnPreviousRoute ? { name: "default" } : { ...routeFrom }
                );
            },
        },
    },
    // {
    //     path: "/dashboard/analysis",
    //     name: "default",
    //     meta: {
    //         authRequired: true,
    //     },
    //     component: require("./views/home/home").default,
    // },
    // Error
    {
        path: "/404",
        name: "404",
        component: require("./views/utility/404").default,
    },
    // Redirect any unmatched routes to the 404 page. This may
    // require some server configuration to work in production:
    // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
    // {
    //   path: "*",
    //   redirect: "404",
    // },
    // 首頁
    {
        path: "/",
        name: "default",
        meta: {
            authRequired: true,
        },
        component: require("./views/home/home").default,
    },
];