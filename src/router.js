import Vue from 'vue'
import Router from 'vue-router'
import db from './firebase/init'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('./views/Inventory.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/naming',
      name: 'naming',
      component: () => import('./views/Naming.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('./views/Notes.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('./components/Auth/Signup.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('./components/Auth/Login.vue')
    },
    {
      path: '/profile/:id',
      name: 'ViewProfile',
      component: () => import('./components/Profile/View.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/forgotpw/',
      name: 'ForgotPassword',
      component: () => import('./components/Auth/ForgotPassword.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  // check to see if route requires auth
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    // check auth state of user
    let user = db.app.auth().currentUser
    if (user) {
      // user signed in proceed to route
      next()
    } else {
      // no user signed in, redirect to login
      next({ name: 'Login' })
    }
  } else {
    next()
  }
})

export default router

