import { createWebHistory, createRouter } from "vue-router";

import store from '@/state/store'
import routes from './routes'

// 為每個路由添加 '/dev' 前綴
const prefixedRoutes = routes.map(route => {
    return {
        ...route,
        path: `/dev${route.path}`
    }
})

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: prefixedRoutes,
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

// 使用全局導航守衛來確保導航請求使用 '/dev' 前綴
router.beforeEach((to, from, next) => {
    if (!to.path.startsWith('/dev')) {
        next(`/dev${to.fullPath}`)
    } else {
        next()
    }
})

// Before each route evaluates...
// 使用全局導航守衛來確保導航請求使用 '/dev' 前綴
router.beforeEach((routeTo, routeFrom, next) => {
    // 確保所有路徑都使用 '/dev' 前綴
    if (!routeTo.path.startsWith('/dev')) {
        return next(`/dev${routeTo.fullPath}`)
    }

    console.log("routeTo=", routeTo)
    console.log("process.env.VUE_APP_DEFAULT_AUTH=", process.env.VUE_APP_DEFAULT_AUTH)

    if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
        // Check if auth is required on this route (including nested routes).
        const authRequired = routeTo.matched.some((route) => route.meta.authRequired)

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
        const publicPages = ['/dev/login', '/dev/register', '/dev/forgot-password', '/dev/car/login', '/dev/car/home', '/dev/car/profile'];
        const authpage = !publicPages.includes(routeTo.path);
        const loggeduser = localStorage.getItem('user');
        console.log("authpage, loggeduser=", authpage, loggeduser)
        if (authpage && !loggeduser) {
            if (routeTo.path.startsWith('/dev/car')) {
                return next('/dev/car/login');
            } else {
                return next('/dev/login');
            }
        }

        next();
    }

    // eslint-disable-next-line no-inner-declarations
    function redirectToLogin() {
        // Pass the original route to the login component
        next({ name: 'login', query: { redirectFrom: routeTo.fullPath } })
    }
})

export default router