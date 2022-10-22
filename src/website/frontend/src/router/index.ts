import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

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
  {
    path: '/login',
    name: 'github-oauth-result',
    components: {
      default: () => import('@/views/GithubOAuthResult.vue'),
      Navbar,
    },
  },
  {
    path: '/grafana/link',
    name: 'grafana-link',
    components: {
    },
    beforeEnter: (to, from, next) => {
      const grafanaUrl = process.env.VUE_APP_GRAFANA_URL;
      if (grafanaUrl) {
        window.location.href = grafanaUrl;
        next();
      } else {
        next({ name: 'Home' });
      }
    },
  },
  {
    path: '/github/link',
    name: 'github-link',
    components: {
    },
    beforeEnter: (to, from, next) => {
      const githubUrl = process.env.VUE_APP_GITHUB_URL;
      if (githubUrl) {
        window.location.href = githubUrl;
        next();
      } else {
        next({ name: 'Home' });
      }
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
