import type { RouteRecordRaw } from 'vue-router';

import AuthLayout from '../layouts/AuthLayout.vue';
import MainLayout from '../layouts/MainLayout.vue';

import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import HomePage from '../pages/HomePage.vue';
import AnimeDetailsPage from '../pages/anime/AnimeDetailsPage.vue';
import AnimeCreatePage from '../pages/anime/AnimeCreatePage.vue';
import AnimeEditPage from '../pages/anime/AnimeEditPage.vue';
import ErrorNotFound from '../pages/ErrorNotFound.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginPage,
        meta: { requiresGuest: true },
      },
    ],
  },
  {
    path: '/register',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'register',
        component: RegisterPage,
        meta: { requiresGuest: true },
      },
    ],
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomePage,
        meta: { requiresAuth: true },
      },
      {
        path: 'anime/create',
        name: 'anime-create',
        component: AnimeCreatePage,
        meta: { requiresAuth: true },
      },
      {
        path: 'anime/:id',
        name: 'anime-details',
        component: AnimeDetailsPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'anime/:id/edit',
        name: 'anime-edit',
        component: AnimeEditPage,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    component: ErrorNotFound,
  },
];

export default routes;
