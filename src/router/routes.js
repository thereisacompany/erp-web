import store from '@/state/store';
import Home from '@/views//home/home.vue';
import CustomerManagement from '../views/companyInfo/CustomerManagement.vue';
import HRManagement from '@/views/companyInfo/HRManagement.vue';
import CarManagement from '@/views/companyInfo/CarManagement.vue';
import ProductManagement from '@/views/product/productManagement.vue';
import Category from '@/views/product/category.vue';
import DepotList from '@/views/stock/depotList.vue';
import InStockList from '@/views/stock/inStockList.vue';
import OutStockList from '@/views/stock/outStockList.vue';
import MoveStockList from '@/views/stock/moveStockList.vue';
import ReturnStockList from '@/views/stock/returnStockList.vue';
import InOutStockReport from '@/views/report/inOutStockReport.vue';
import DriverStockReport from '@/views/report/driverStockReport.vue';
import User from '@/views/system/User.vue';
import Role from '@/views/system/Role.vue';
import ChangePassword from '@/views/user/changePassword.vue';
import Login from '@/views/account/login.vue';
import Logout from '@/views/account/logout.vue';
import ErrorPage from '@/views/utility/404.vue';
import Layout from '../layouts/index.vue';

const routes = [
	// 預設頁面
	{
		path: '/',
		redirect: '/dashboard/analysis', // 修改 redirect 指向 /dashboard
		meta: { authRequired: true },
	},
	// 首頁 (修改為 /dashboard 的子路由)
	{
		path: '/dashboard',
		component: Layout,
		meta: { authRequired: true },
		children: [
			{
				path: 'analysis',
				name: 'home',
				label: '首頁',
				component: Home,
				meta: { authRequired: true, keepAlive: true },
			}
		]
	},
	// 公司資料管理
	{
		path: '/system',
		component: Layout,
		name: 'system',
		label: '公司資料管理',
		meta: { authRequired: true },
		children: [
			{
				path: 'customer',
				name: 'CustomerManagement',
				label: '客戶管理',
				component: CustomerManagement,
				meta: { keepAlive: true }
			},
			{
				path: 'member',
				name: 'HRManagement',
				label: '人事管理',
				component: HRManagement,
				meta: { keepAlive: true }
			},
			{
				path: 'vehicle',
				name: 'CarManagement',
				label: '車輛管理',
				component: CarManagement,
				meta: { keepAlive: true }
			},
		],
	},
	// 商品管理
	{
		path: '/material',
		name: 'material',
		label: '商品管理',
		component: Layout,
		meta: { authRequired: true },
		children: [
			{
				path: 'material',
				name: 'ProductManagement',
				label: '商品管理',
				component: ProductManagement,
				meta: { keepAlive: true }
			},
			{
				path: 'material_category',
				name: 'Category',
				label: '商品類別',
				component: Category,
				meta: { keepAlive: true }
			},
		],
	},
	// 倉庫管理
	{
		path: '/depot',
		name: 'depot',
		component: Layout,
		meta: { authRequired: true },
		children: [
			{
				path: 'list',
				name: 'DepotList',
				label: '倉庫別管理',
				component: DepotList,
				meta: { keepAlive: true }
			},
			{
				path: 'stock_in',
				name: 'InStockList',
				label: '進貨單',
				component: InStockList,
				meta: { keepAlive: true }
			},
			{
				path: 'stock_out',
				name: 'OutStockList',
				label: '配送單',
				component: OutStockList,
				meta: { keepAlive: true }
			},
			{
				path: 'move',
				name: 'MoveStockList',
				label: '移倉管理',
				component: MoveStockList,
				meta: { keepAlive: true }
			},
			{
				path: 'stock_back',
				name: 'ReturnStockList',
				label: '退貨單',
				component: ReturnStockList,
				meta: { keepAlive: true }
			},
		],
	},
	// 報表查詢
	{
		path: '/report',
		name: 'report',
		label: '報表查詢',
		component: Layout,
		meta: { authRequired: true },
		children: [
			{
				path: 'in_out_stock',
				name: 'InOutStockReport',
				label: '進銷存統計',
				component: InOutStockReport,
				meta: { keepAlive: true }
			},
			{
				path: 'driver_out',
				name: 'DriverStockReport',
				label: '司機配送統計表',
				component: DriverStockReport,
				meta: { keepAlive: true }
			},
		],
	},
	// 系統管理
	{
		path: '/system',
		name: 'systemManagement',
		label: '系統管理',
		component: Layout,
		meta: { authRequired: true },
		children: [
			{
				path: 'user',
				name: 'User',
				label: '用戶管理',
				component: User,
				meta: { keepAlive: true }
			},
			{
				path: 'role',
				name: 'Role',
				label: '角色管理',
				component: Role,
				meta: { keepAlive: true }
			},
		],
	},
	// 修改密碼
	{
		path: '/user/changepassword',
		name: 'ChangePassword',
		label: '修改密碼',
		component: ChangePassword,
		meta: { authRequired: true, keepAlive: true }
	},
	// 登入
	{
		path: '/login',
		name: 'login',
		component: Login,
		meta: {
			beforeResolve(routeTo, routeFrom, next) {
				if (store.getters['auth/loggedIn']) next({ name: 'home' });
				else next();
			},
		},
	},
	// 登出
	{ path: '/logout', name: 'logout', component: Logout },
	// 404 頁面
	{ path: '/404', name: '404', component: ErrorPage },
	// 匹配所有未知路徑的 404
	{ path: '/:pathMatch(.*)*', redirect: '/404' },
];

export default routes;
