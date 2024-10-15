import store from '@/state/store';
import Home from '@/router/views/home/home.vue'
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
		component: Home,
	},
	// 首頁
	{
		path: '/dashboard/analysis',
		name: 'home',
		meta: { authRequired: true },
		component: Home,
	},
	// 預設dashboard
	{
		path: '/dashboard',
		name: 'dashboard',
		meta: { authRequired: true },
		component: () => import('@/router/views/dashboards/default.vue'),
	},
	// 供應商管理
	// { path: "/user/vendorlist", name: "vendorlist", meta: { authRequired: true }, component: () => import('@/router/views/user/vendorlist') },
	// 公司資料管理
	{
		path: '/system',
		name: 'driverList',
		meta: { authRequired: true },
		children: [
			// 客戶管理
			{
				path: 'customer',
				name: 'customerList',
				meta: { authRequired: true },
				component: () => import('@/views/user/customerList.vue')
			},
			// 人事管理
			{
				path: 'member',
				name: 'driverList',
				meta: { authRequired: true },
				component: () => import('@/views/user/driverList.vue'),
			},
			// 車輛管理
			{
				path: 'vehicle',
				name: 'vehicleList',
				meta: { authRequired: true },
				component: () => import('@/views/stock/vehicleList.vue'),
			},
		]
	},
	// 商品管理
	{
		path: '/material',
		name: 'product',
		meta: { authRequired: true },
		children: [
			// 商品管理
			{
				path: 'material',
				name: 'customerList',
				meta: { authRequired: true },
				component: () => import('@/router/views/product/product.vue'),
			},
			// 商品類別
			{
				path: 'material_category',
				name: 'productCategory',
				meta: { authRequired: true },
				component: () => import('@/router/views/product/category.vue'),
			},
		]
	},
	// 倉庫管理
	{
		path: '/depot',
		name: 'depotList',
		meta: { authRequired: true },
		children: [
			// 倉庫別管理
			{
				path: 'depot',
				name: 'depot',
				meta: { authRequired: true },
				component: () => import('@/router/views/stock/depotlist.vue'),
			},
			// 進貨單
			{
				path: 'stock_in',
				name: 'inStockList',
				meta: { authRequired: true },
				component: () => import('@/router/views/stock/instocklist.vue'),
			},
			// 配送單
			{
				path: 'stock_out',
				name: 'outStockList',
				meta: { authRequired: true },
				component: () => import('@/router/views/stock/outstocklist.vue'),
			},
			// 移倉管理
			{
				path: 'move',
				name: 'move',
				meta: { authRequired: true },
				component: () => import('@/router/views/stock/movestocklist.vue'),
			},
			// 退貨單
			{
				path: 'stock_back',
				name: 'returnStockList',
				meta: { authRequired: true },
				component: () => import('@/router/views/stock/returnstocklist.vue'),
			},
		]
	},
	// 報表查詢
	{
		path: '/report',
		name: 'inOutStockReport',
		meta: { authRequired: true },
		children: [
			// 進銷存統計
			{
				path: 'in_out_stock',
				name: 'inOutStockReport',
				meta: { authRequired: true },
				component: () => import('@/router/views/report/in_out_stock_report.vue'),
			},
			// 司機配送統計表
			{
				path: 'driver_out',
				name: 'driverStockReport',
				meta: { authRequired: true },
				component: () => import('@/router/views/report/driver_stock_report.vue'),
			},
		]
	},
	// 系統管理
	{
		path: '/system',
		name: 'userList',
		meta: { authRequired: true },
		children: [
			// 用戶管理
			{
				path: 'user',
				name: 'userList',
				meta: { authRequired: true },
				component: () => import('@/router/views/system/userlist.vue'),
			},
			// 角色管理
			{
				path: 'role',
				name: 'role',
				meta: { authRequired: true },
				component: () => import('@/router/views/system/rolelist.vue'),
			},
		]
	},
	// 修改密碼
	{
		path: '/user/changepassword',
		name: 'changepassword',
		meta: { authRequired: true },
		component: () => import('@/router/views/user/changepassword.vue'),
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
];

export default routes;


