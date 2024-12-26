import { createWebHistory, createRouter } from "vue-router";
import routes from './routes'

// 为每个路由添加 '/dev' 前缀
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes: routes,
  // Use the HTML5 history API (i.e. normal-looking routes)
  // instead of routes with hashes (e.g. example.com/#/about).
  // This may require some server configuration in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  // Simulate native-like scroll behavior when navigating to a new
  // route and using back/forward buttons.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

// 使用全局导航守卫来确保导航请求使用 '/dev' 前缀
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/forgot-password'];
  const authpage = !publicPages.includes(to.path);
  const loggeduser = localStorage.getItem('user');
  if (authpage && !loggeduser) {
    return next('/login');
  } else if (to.path == '/') {
    return next('/dashboard/analysis');
  }
  next();

})

export default router