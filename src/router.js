import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store';
import HomeComponent from '@/components/HomeComponent';
import AboutComponent from '@/components/AboutComponent';
import TermsComponent from '@/components/TermsComponent';
import LoginComoponent from '@/components/LoginComponent';
import SignupComponent from '@/components/SignUpComponent';
import FaceSelectedComponent from '@/components/face/SelectedComponent';
// admin - components
import AdminIndexComponent from '@/components/admin/AdminIndexComponent';
import AdminCategoryListComponent from '@/components/admin/category/ListComponent';
import AdminCategoryUpdateComponent from '@/components/admin/category/UpdateComponent';
// admin - provider
import AdminProviderListComponent from '@/components/admin/provider/ListComponent';
import AdminProviderUpdateComponent from '@/components/admin/provider/UpdateComponent';
import AdminProviderAccessComponent from '@/components/admin/provider/AccessComponent';
// admin - user
import AdminUserListComponent from '@/components/admin/user/ListComponent';

import UserRoutes from '@/routes/user';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeComponent
    },
    {
      path: '/provider/:slug',
      name: 'face-selected',
      component: FaceSelectedComponent,
      meta: {
        title: 'Provider',
        wide: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutComponent
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsComponent
    },
    {
      path: '/login',
      name: 'login',
      component: LoginComoponent,
      meta: {
        requiresAnon: true,
        wide: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupComponent,
      meta: {
        requiresAnon: true,
        wide: true
      }
    },
    // admin routes
    {
      path: '/admin',
      name: 'admin',
      component: AdminIndexComponent,
      meta: {
        requiresLogin: true,
        title: 'Admin'
      },
      children: [
        {
          path: 'category',
          name: 'admin.category.list',
          component: AdminCategoryListComponent,
          meta: {
            title: 'Category list'
          }
        },
        {
          path: 'category/update/:id?',
          name: 'admin.category.update',
          component: AdminCategoryUpdateComponent
        },
        {
          path: 'provider',
          name: 'admin.provider.list',
          component: AdminProviderListComponent,
          meta: {
            title: 'Provider list'
          }
        },
        {
          path: 'provider/update/:id?',
          name: 'admin.provider.update',
          component: AdminProviderUpdateComponent,
          meta: {
            title: 'Provider update'
          }
        },
        {
          path: 'provider/access/:slug',
          name: 'admin.provider.access',
          component: AdminProviderAccessComponent,
          meta: {
            title: 'Provider access'
          }
        },
        {
          path: 'user',
          name: 'admin.user.list',
          component: AdminUserListComponent,
          meta: {
            title: 'Users'
          }
        }
      ]
    },
    ...UserRoutes.routes
  ]
});

export default router;

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresLogin)) {
    if (store.getters['common/user/USER']) {
      next();
      return;
    }
    setTimeout(() => {
      if (!store.getters['common/user/USER']) {
        next('/login');
      } else {
        next();
      }
    }, 1000)
  } else if (to.matched.some(record => record.meta.requiresAnon) && store.getters['common/user/USER']) {
    next('/');
  } else {
    next();
  }
})