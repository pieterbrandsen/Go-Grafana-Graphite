import getGitHubUrl from '@/oauth/GithubAuth';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import store from '@/store/index';

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
    beforeEnter: async (to, from, next) => {
      if (!from.name) {
        const { query } = to;
        let path = query.from as string;
        if (!path || path === 'undefined' || path.startsWith('/login')) path = '/';
        store.dispatch('verifyUser', { username: query.username, email: query.email });
        next({ path });
      } else {
        const githubUrl = getGitHubUrl(from.path);
        window.location.href = githubUrl;
        next();
      }
    },
  },
  {
    path: '/grafana/link',
    name: 'grafana-link',
    components: {
    },
    beforeEnter: (to, from, next) => {
      const grafanaUrl = process.env.VUE_APP_GRAFANA_URL;
      window.location.href = grafanaUrl;
      next();
    },
  },
  {
    path: '/github/link',
    name: 'github-link',
    components: {
    },
    beforeEnter: (to, from, next) => {
      const githubUrl = process.env.VUE_APP_GITHUB_URL;
      window.location.href = githubUrl;
      next();
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
