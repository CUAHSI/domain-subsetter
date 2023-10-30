import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import HelpView from '../views/HelpView.vue'
import MapView from '../views/MapView.vue'
import ApiView from '../views/ApiView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'map',
      component: MapView
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
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/WireView.vue')
    },
    {
      path: '/auth-redirect',
      name: 'auth-redirect',
      component: () => import('../components/AuthRedirect.vue'),
      meta: {
        hideNavigation: true
      }
    }
  ]
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
