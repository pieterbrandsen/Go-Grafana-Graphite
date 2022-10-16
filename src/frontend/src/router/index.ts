import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// import Title from '@/components/base/Title.vue';
// import Sidebar from '@/components/base/Sidebar.vue';

const Header = () => import('@/components/base/Header.vue');
const Sidebar = () => import('@/components/base/Sidebar.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    components: {
      default: () => import('@/views/HomeView.vue'),
      Header,
      Sidebar,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
