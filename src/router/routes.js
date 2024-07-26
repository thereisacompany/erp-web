import store from "@/state/store";

export default [{
    path: "/",
    name: "default",
    meta: {
        authRequired: true,
    },
    component: require("./views/home/home").default,
},
{ path: "/user/vendorlist", name: "vendorlist", meta: { authRequired: true, }, component: require("./views/user/vendorlist").default },
{ path: "/user/customerlist", name: "customerlist", meta: { authRequired: true, }, component: require("./views/user/customerlist").default },
{ path: "/user/driverlist", name: "driverlist", meta: { authRequired: true, }, component: require("./views/user/driverlist").default },
{ path: "/user/memberlist", name: "memberlist", meta: { authRequired: true, }, component: require("./views/user/memberlist").default },
{ path: "/user/accountlist", name: "accountlist", meta: { authRequired: true, }, component: require("./views/user/accountlist").default },
{ path: "/user/changepassword", name: "changepassword", meta: { authRequired: true, }, component: require("./views/user/changepassword").default },
{ path: "/stock/depotlist", name: "depotlist", meta: { authRequired: true, }, component: require("./views/stock/depotlist").default },

{ path: "/stock/vehiclelist", name: "vehiclelist", meta: { authRequired: true, }, component: require("./views/stock/vehiclelist").default },
{ path: "/stock/instocklist", name: "instocklist", meta: { authRequired: true, }, component: require("./views/stock/instocklist").default },
{ path: "/stock/outstocklist", name: "outstocklist", meta: { authRequired: true, }, component: require("./views/stock/outstocklist").default },
{ path: "/stock/returnstocklist", name: "returnstocklist", meta: { authRequired: true, }, component: require("./views/stock/returnstocklist").default },
{ path: "/stock/movestocklist", name: "movestocklist", meta: { authRequired: true, }, component: require("./views/stock/movestocklist").default },
{ path: "/report/in_out_stock_report", name: "in_out_stock_report", meta: { authRequired: true, }, component: require("./views/report/in_out_stock_report").default },
{ path: "/report/driver_stock_report", name: "driver_stock_report", meta: { authRequired: true, }, component: require("./views/report/driver_stock_report").default },
{ path: "/system/userlist", name: "userlist", meta: { authRequired: true, }, component: require("./views/system/userlist").default },
{ path: "/system/rolelist", name: "rolelist", meta: { authRequired: true, }, component: require("./views/system/rolelist").default },
{ path: "/system/role", name: "role", meta: { authRequired: true, }, component: require("./views/system/role").default },
{
    path: "/product/index",
    name: "Product",
    meta: {
        authRequired: true,
    },
    component: require("./views/product/product").default
},
{
    path: "/product/category",
    name: "ProductCategory",
    meta: {
        authRequired: true,
    },
    component: require("./views/product/category").default
},
{
    path: "/dashboard",
    name: "dashboard",
    meta: {
        authRequired: true,
    },
    component: () =>
        import("./views/dashboards/default"),
},

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

];