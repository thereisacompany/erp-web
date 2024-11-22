import store from '@/state/store';
import Home from '@/views/home/home.vue';
import CustomerList from '@/views/user/customerList.vue';
import DriverList from '@/views/user/driverList.vue';
import Vehicle from '@/views/stock/vehicleList.vue';
import ProductManagement from '@/views/product/productManagement.vue';
import ProductCategory from '@/views/product/productCategory.vue';
import DepotList from '@/views/stock/depotList.vue';
import InStockList from '@/views/stock/inStockList.vue';
import OutStockList from '@/views/stock/outStockList.vue';
import MoveStockList from '@/views/stock/moveStockList.vue';
import ReturnStockList from '@/views/stock/returnStockList.vue';
import InOutStockReport from '@/views/report/inOutStockReport.vue';
import DriverStockReport from '@/views/report/driverStockReport.vue';
import User from '@/views/system/user.vue';
import Role from '@/views/system/role.vue';
import ChangePassword from '@/views/user/changePassword.vue';
import Login from '@/views/account/login.vue';
import Logout from '@/views/account/logout.vue';
import ErrorPage from '@/views/utility/404.vue';

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
	// 供應商管理
	// { path: "/user/vendorlist", name: "vendorlist", meta: { authRequired: true }, component: () => import('@/views/user/vendorlist') },
	// 公司資料管理
	{
		path: '/system',
		name: 'driverList',
		meta: { authRequired: true },
		children: [
			// 客戶管理
			{
				path: 'customer',
				name: 'customer',
				meta: { authRequired: true },
				component: CustomerList
			},
			// 人事管理
			{
				path: 'member',
				name: 'driverList',
				meta: { authRequired: true },
				component: DriverList,
			},
			// 車輛管理
			{
				path: 'vehicle',
				name: 'vehicleList',
				meta: { authRequired: true },
				component: Vehicle,
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
				component: ProductManagement,
			},
			// 商品類別
			{
				path: 'material_category',
				name: 'productCategory',
				meta: { authRequired: true },
				component: ProductCategory,
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
				component: DepotList,
			},
			// 進貨單
			{
				path: 'stock_in',
				name: 'inStockList',
				meta: { authRequired: true },
				component: InStockList,
			},
			// 配送單
			{
				path: 'stock_out',
				name: 'outStockList',
				meta: { authRequired: true },
				component: OutStockList,
			},
			// 移倉管理
			{
				path: 'move',
				name: 'move',
				meta: { authRequired: true },
				component: MoveStockList,
			},
			// 退貨單
			{
				path: 'stock_back',
				name: 'returnStockList',
				meta: { authRequired: true },
				component: ReturnStockList,
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
				component: InOutStockReport,
			},
			// 司機配送統計表
			{
				path: 'driver_out',
				name: 'driverStockReport',
				meta: { authRequired: true },
				component: DriverStockReport,
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
				component: User,
			},
			// 角色管理
			{
				path: 'role',
				name: 'role',
				meta: { authRequired: true },
				component: Role,
			},
		]
	},
	// 修改密碼
	{
		path: '/user/changepassword',
		name: 'changePassword',
		meta: { authRequired: true },
		component: ChangePassword,
	},
	// 登入
	{
		path: '/login',
		name: 'login',
		component: Login,
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
		component: Logout,
		// meta: {
		// 	beforeResolve(routeTo, routeFrom, next) {
		// 		store.dispatch('auth/logOut');
		// 		next(routeFrom);
		// 	}, authRequired: true
		// },
	},
	// 404 頁面
	{
		path: '/404',
		name: '404',
		component: ErrorPage,
	},
];

export default routes;


