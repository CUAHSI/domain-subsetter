import { createRouter, createWebHashHistory } from 'vue-router'
import HelpView from '../views/HelpView.vue'
import MapView from '../views/MapView.vue'
import ApiView from '../views/ApiView.vue'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'
import { useAlertStore } from '../stores/alerts'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
      meta: {
        showMap: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/api',
      name: 'api',
      component: ApiView
    },
    {
      path: '/help',
      name: 'help',
      component: HelpView
    },
    {
      path: '/submissions',
      name: 'submissions',
      component: () => import('../views/SubmissionsView.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/auth-redirect',
      name: 'auth-redirect',
      component: () => import('../views/AuthRedirectView.vue'),
      meta: {
        hideNavigation: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const alertStore = useAlertStore()

  if (!authStore.isLoggedIn && to.meta.requiresAuth) {
    // prevent redirect
    next(from.path)
    alertStore.displayAlert({
      title: 'Not logged in',
      text: `You must be logged in to access the ${to.name} page`,
      type: 'error',
      closable: true,
      duration: 3
    })
  } else {
    next()
  }
})

// router.beforeEach(async (to) => {
//   // redirect to login page if not logged in and trying to access a restricted page
//   const publicPages = ['/'];
//   const authRequired = !publicPages.includes(to.path);
//   const auth = useAuthStore();

//   if (authRequired && !auth.user) {
//       auth.returnUrl = to.fullPath;
//       return '/';
//   }
// });

export default router
