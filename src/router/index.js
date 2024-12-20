import { createWebHistory, createRouter } from "vue-router";
import store from '@/state/store'
import routes from './routes'

// 为每个路由添加 '/dev' 前缀
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes: routes,
  // Use the HTML5 history API (i.e. normal-looking routes)
  // instead of routes with hashes (e.g. example.com/#/about).
  // This may require some server configuration in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  mode: 'history',
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
  // 确保所有路径都使用 '/dev' 前缀
  // if (import.meta.env.VITE_APP_ENV === "development") {
  //     if (!to.path.startsWith('/dev')) {
  //         return next(`/dev${to.fullPath}`)
  //     }
  // }


  // console.log("routeTo=", to)
  // console.log("import.meta.env.VITE_APP_DEFAULT_AUTH=", import.meta.env.VITE_APP_DEFAULT_AUTH)

  if (import.meta.env.VITE_APP_DEFAULT_AUTH === "firebase") {
    // Check if auth is required on this route (including nested routes).
    const authRequired = to.matched.some((route) => route.meta.authRequired)

    // If auth isn't required for the route, just continue.
    if (!authRequired) return next()

    // If auth is required and the user is logged in...
    if (store.getters['auth/loggedIn']) {
      // Validate the local user token...
      return store.dispatch('auth/validate').then((validUser) => {
        // Then continue if the token still represents a valid user,
        // otherwise redirect to login.
        validUser ? next() : redirectToLogin()
      })
    }

    // If auth is required and the user is NOT currently logged in,
    // redirect to login.
    return redirectToLogin()
  } else {

    const publicPages = ['/login', '/register', '/forgot-password'];
    const authpage = !publicPages.includes(to.path);
    const loggeduser = localStorage.getItem('user');
    // console.log("authpage, loggeduser=", authpage, loggeduser)
    // console.log('to.path', to.path)
    if (authpage && !loggeduser) {
      return next('/login');
    } else if (to.path == '/') {
      return next('/dashboard/analysis');
    }

    next();
  }

  // eslint-disable-next-line no-inner-declarations
  function redirectToLogin() {
    // Pass the original route to the login component
    next({ name: 'login', query: { redirectFrom: to.fullPath } })
  }

})

export default router