import store from '@/state/store';

// 路由定義
const routes = [
	{
		path: '/',
		redirect: '/dashboard/analysis',
	},
	// 預設頁面
	{
		path: '/',
		name: 'home',
		meta: { authRequired: true },
		component: () => import('@/router/views/home/home.vue'),
	},
	// 首頁
	{
		path: '/dashboard/analysis',
		name: 'home',
		meta: { authRequired: true },
		component: () => import('@/router/views/home/home.vue'),
	},
	// 供應商管理
	// { path: "/user/vendorlist", name: "vendorlist", meta: { authRequired: true }, component: () => import('@/router/views/user/vendorlist') },

	// 人事管理
	{
		path: '/systemA',
		name: 'driverlist',
		meta: { authRequired: true },
		component: () => import('@/router/views/user/driverlist.vue'),
	},
	{
		path: '/system/customer',
		name: 'customerlist',
		meta: { authRequired: true },
		component: () => import('@/router/views/user/customerlist.vue'),
	},
	{
		path: '/system/member',
		name: 'driverlist',
		meta: { authRequired: true },
		component: () => import('@/router/views/user/driverlist.vue'),
	},

	// 車輛管理
	{
		path: '/system/vehicle',
		name: 'vehiclelist',
		meta: { authRequired: true },
		component: () => import('@/router/views/stock/vehiclelist.vue'),
	},

	// 修改密碼
	{
		path: '/user/changepassword',
		name: 'changepassword',
		meta: { authRequired: true },
		component: () => import('@/router/views/user/changepassword.vue'),
	},

	// 倉庫管理
	{
		path: '/depot',
		name: 'depotlist',
		meta: { authRequired: true },
		component: () => import('@/router/views/stock/depotlist.vue'),
	},
	{
		path: '/depot/depot',
		name: 'depotlist',
		meta: { authRequired: true },
		component: () => import('@/router/views/stock/depotlist.vue'),
	},
	{
		path: '/depot/stock_in',
		name: 'instocklist',
		meta: { authRequired: true },
		component: () => import('@/router/views/stock/instocklist.vue'),
	},
	{
		path: '/depot/stock_out',
		name: 'outstocklist',
		meta: { authRequired: true },
		component: () => import('@/router/views/stock/outstocklist.vue'),
	},
	{
		path: '/depot/stock_back',
		name: 'returnstocklist',
		meta: { authRequired: true },
		component: () => import('@/router/views/stock/returnstocklist.vue'),
	},
	{
		path: '/depot/move',
		name: 'movestocklist',
		meta: { authRequired: true },
		component: () => import('@/router/views/stock/movestocklist.vue'),
	},

	// 報表查詢
	{
		path: '/report',
		name: 'in_out_stock_report',
		meta: { authRequired: true },
		component: () => import('@/router/views/report/in_out_stock_report.vue'),
	},
	{
		path: '/report/in_out_stock',
		name: 'in_out_stock_report',
		meta: { authRequired: true },
		component: () => import('@/router/views/report/in_out_stock_report.vue'),
	},
	{
		path: '/report/driver_out',
		name: 'driver_stock_report',
		meta: { authRequired: true },
		component: () => import('@/router/views/report/driver_stock_report.vue'),
	},

	// 系統管理
	{
		path: '/system',
		name: 'userlist',
		meta: { authRequired: true },
		component: () => import('@/router/views/system/userlist.vue'),
	},
	{
		path: '/system/user',
		name: 'userlist',
		meta: { authRequired: true },
		component: () => import('@/router/views/system/userlist.vue'),
	},
	{
		path: '/system/role',
		name: 'role',
		meta: { authRequired: true },
		component: () => import('@/router/views/system/role.vue'),
	},

	// 商品管理
	{
		path: '/material',
		name: 'Product',
		meta: { authRequired: true },
		component: () => import('@/router/views/product/product.vue'),
	},
	{
		path: '/material/material',
		name: 'Product',
		meta: { authRequired: true },
		component: () => import('@/router/views/product/product.vue'),
	},
	{
		path: '/material/material_category',
		name: 'ProductCategory',
		meta: { authRequired: true },
		component: () => import('@/router/views/product/category.vue'),
	},

	// 預設dashboard
	{
		path: '/dashboard',
		name: 'dashboard',
		meta: { authRequired: true },
		component: () => import('@/router/views/dashboards/default.vue'),
	},

	// 登入
	{
		path: '/login',
		name: 'login',
		component: () => import('@/router/views/account/login.vue'),
		meta: {
			beforeResolve(routeTo, routeFrom, next) {
				if (store.getters['auth/loggedIn']) {
					next({ name: 'home' });
				} else {
					next();
				}
			},
		},
	},

	// 註冊
	{
		path: '/register',
		name: 'Register',
		component: () => import('@/router/views/account/register.vue'),
		meta: {
			beforeResolve(routeTo, routeFrom, next) {
				if (store.getters['auth/loggedIn']) {
					next({ name: 'home' });
				} else {
					next();
				}
			},
		},
	},

	// 忘記密碼
	{
		path: '/forgot-password',
		name: 'Forgot password',
		component: () => import('@/router/views/account/forgot-password.vue'),
		meta: {
			beforeResolve(routeTo, routeFrom, next) {
				if (store.getters['auth/loggedIn']) {
					next({ name: 'home' });
				} else {
					next();
				}
			},
		},
	},

	// 登出
	{
		path: '/logout',
		name: 'logout',
		component: () => import('@/router/views/account/logout.vue'),
		meta: {
			beforeResolve(routeTo, routeFrom, next) {
				store.dispatch('auth/logOut');
				next(routeFrom);
			}, authRequired: true
		},
	},

	// 404 頁面
	{
		path: '/404',
		name: '404',
		component: () => import('@/router/views/utility/404.vue'),
	},
	{
		path: '/dashboard/analysis',
		name: 'home',
		meta: { authRequired: true },
		component: () => import('@/router/views/home/home.vue'),
	},
];

export default routes;