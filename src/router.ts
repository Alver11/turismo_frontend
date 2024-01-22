import { createMemoryHistory, createRouter as createClientRouter, createWebHistory } from 'vue-router'
import layoutAuth from '/@src/pages/auth.vue'
import layoutApp from '/@src/pages/app.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: layoutAuth,
    children: [
      {
        component: () => import('/@src/pages/auth/login.vue'),
        path: '',
        name: 'auth-login',
        props: true,
      },
    ],
  },

  {
    path: '/app',
    name: 'app',
    component: layoutApp,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        component: () => import('/@src/pages/app/index.vue'),
        path: '',
        name: 'home',
        props: true,
      },
      //--------- List Tour -------------------------------------------
      {
        component: () => import('/@src/pages/app/tourist.vue'),
        path: '/tourist',
        name: 'tourist',
        props: true,
      },
      //--------- Events ----------------------------------------------
      {
        component: () => import('/@src/pages/app/events.vue'),
        path: '/events',
        name: 'events',
        props: true,
      },

      //--------- Setting ---------------------------------------------

      //---------------------------- Categories -----------------------
      {
        component: () => import('/@src/pages/setting/categories.vue'),
        path: '/setting/categories',
        name: 'setting/categories',
        props: true,
      },
      {
        component: () => import('/@src/pages/setting/categories-new.vue'),
        path: '/setting/categories/create',
        name: 'setting/categories/create',
        props: true,
      },
      {
        component: () => import('/@src/pages/setting/categories-new.vue'),
        path: '/setting/categories/update/:id',
        name: 'setting/categories/update',
        props: true,
      },

      //---------------------------- Attributes -----------------------
      {
        component: () => import('/@src/pages/setting/attribute.vue'),
        path: '/setting/attributes',
        name: 'setting/attributes',
        props: true,
      },
      /*{
        component: () => import('/@src/pages/setting/attributes-new.vue'),
        path: '/setting/attributes/create',
        name: 'attributes-new',
        props: true,
      },
      {
        component: () => import('/@src/pages/setting/attributes-new.vue'),
        path: '/setting/attributes/update/:id',
        name: 'attributes/update',
        props: true,
      },*/

      //---------------------------- Rol and Permission ----------------
      {
        component: () => import('/@src/pages/setting/rol.vue'),
        path: '/setting/rol',
        name: 'setting/rol',
        props: true,
      },

      //---------------------------- Users -----------------------------
      {
        component: () => import('/@src/pages/setting/user/users.vue'),
        path: '/setting/users',
        name: 'setting/users',
        props: true,
      },
      {
        component: () => import('/@src/pages/setting/user/users-create.vue'),
        path: '/setting/users/create',
        name: 'setting/users/create',
        props: true,
      },
      {
        component: () => import('/@src/pages/setting/user/users-create.vue'),
        path: '/setting/users/update/:id',
        name: 'setting/users/update',
        props: true,
      },
    ],
  },

  {
    component: () => import('/@src/pages/[...all].vue'),
    name: 'all',
    path: '/:all(.*)',
    props: true,
  },
];

export function createRouter() {
  return createClientRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior: (to, from, savedPosition) => {
      // Scroll to heading on click
      if (to.hash) {
        if (to.hash === '#') {
          return {
            top: 0,
            behavior: 'smooth',
          }
        }

        const el = document.querySelector(to.hash)

        // vue-router does not incorporate scroll-margin-top on its own.
        if (el) {
          const top = parseFloat(getComputedStyle(el).scrollMarginTop)
          if (el instanceof HTMLElement) {
            el.focus()
          }

          return {
            el: to.hash,
            behavior: 'smooth',
            top,
          }
        }

        return {
          el: to.hash,
          behavior: 'smooth',
        }
      }

      // Scroll to top of window
      if (savedPosition) {
        return savedPosition
      } else if (to.path !== from.path) {
        return { top: 0 }
      }
    },
  })
}
