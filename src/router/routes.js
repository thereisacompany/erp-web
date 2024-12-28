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
				component: Home,
				meta: { label: '首頁', authRequired: true, keepAlive: true },
			}
		]
	},
	// 公司資料管理
	{
		path: '/system',
		component: Layout,
		name: 'system',
		meta: { label: '公司資料管理', authRequired: true },
		children: [
			{
				path: 'customer',
				name: 'CustomerManagement',
				component: CustomerManagement,
				meta: { label: '客戶管理', keepAlive: true }
			},
			{
				path: 'member',
				name: 'HRManagement',
				component: HRManagement,
				meta: { label: '人事管理', keepAlive: true }
			},
			{
				path: 'vehicle',
				name: 'CarManagement',
				component: CarManagement,
				meta: { label: '車輛管理', keepAlive: true }
			},
		],
	},
	// 商品管理
	{
		path: '/material',
		name: 'material',
		component: Layout,
		meta: { label: '商品管理', authRequired: true },
		children: [
			{
				path: 'material',
				name: 'ProductManagement',
				component: ProductManagement,
				meta: { label: '商品管理', keepAlive: true }
			},
			{
				path: 'material_category',
				name: 'Category',
				component: Category,
				meta: { label: '商品類別', keepAlive: true }
			},
		],
	},
	// 倉庫管理
	{
		path: '/depot',
		name: 'depot',
		component: Layout,
		meta: { label: '倉庫管理', authRequired: true },
		children: [
			{
				path: 'list',
				name: 'DepotList',
				component: DepotList,
				meta: { label: '倉庫別管理', keepAlive: true }
			},
			{
				path: 'stock_in',
				name: 'InStockList',
				component: InStockList,
				meta: { label: '進貨單', keepAlive: true }
			},
			{
				path: 'stock_out',
				name: 'OutStockList',
				component: OutStockList,
				meta: { label: '配送單', keepAlive: true }
			},
			{
				path: 'move',
				name: 'MoveStockList',
				component: MoveStockList,
				meta: { label: '移倉管理', keepAlive: true }
			},
			{
				path: 'stock_back',
				name: 'ReturnStockList',
				component: ReturnStockList,
				meta: { label: '退貨單', keepAlive: true }
			},
		],
	},
	// 報表查詢
	{
		path: '/report',
		name: 'report',
		component: Layout,
		meta: { label: '報表查詢', authRequired: true },
		children: [
			{
				path: 'in_out_stock',
				name: 'InOutStockReport',
				component: InOutStockReport,
				meta: { label: '進銷存統計', keepAlive: true }
			},
			{
				path: 'driver_out',
				name: 'DriverStockReport',
				component: DriverStockReport,
				meta: { label: '司機配送統計表', keepAlive: true }
			},
		],
	},
	// 系統管理
	{
		path: '/system',
		name: 'systemManagement',
		component: Layout,
		meta: { label: '系統管理', authRequired: true },
		children: [
			{
				path: 'user',
				name: 'User',
				component: User,
				meta: { label: '用戶管理', keepAlive: true }
			},
			{
				path: 'role',
				name: 'Role',
				component: Role,
				meta: { label: '角色管理', keepAlive: true }
			},
		],
	},
	// 修改密碼
	{
		path: '/user',
		name: 'UserSetting',
		component: Layout,
		meta: { label: '修改密碼', authRequired: true, keepAlive: true },
		children: [
			{
				path: 'changepassword',
				name: 'ChangePassword',
				component: ChangePassword,
				meta: { label: '修改密碼', keepAlive: true }
			},]
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
