import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const Navbar = () => import('@/components/base/Navbar.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    components: {
      default: () => import('@/views/HomeView.vue'),
      Navbar,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
