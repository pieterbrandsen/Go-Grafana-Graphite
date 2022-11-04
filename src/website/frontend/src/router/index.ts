import GetGitHubOAuthPath from '@/oauth/GithubAuth';
import store from '@/store';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const Navbar = () => import('@/components/base/Navbar.vue');
const Footer = () => import('@/components/base/Footer.vue');

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    components: {
      default: () => import('@/views/HomeView.vue'),
      Navbar,
      Footer,
    },
  },
  {
    path: '/login',
    name: 'login-result',
    components: {
      default: () => import('@/views/LoginResult.vue'),
      Navbar,
      Footer,
    },
  },
  {
    path: '/logout',
    name: 'logout-result',
    components: {
      default: () => import('@/views/LogoutResult.vue'),
      Navbar,
      Footer,
    },
  },
  {
    path: '/grafana/link',
    name: 'grafana-link',
    components: {},
    beforeEnter: (to, from, next) => {
      const grafanaUrl = process.env.VUE_APP_GRAFANA_URL;
      window.location.href = grafanaUrl;
      next();
    },
  },
  {
    path: '/grafana/support',
    name: 'grafana-support',
    components: {
      default: () => import('@/views/grafana/Support.vue'),
      Navbar,
      Footer,
    },
  },
  {
    path: '/grafana/configs',
    name: 'grafana-configs',
    components: {
      default: () => import('@/views/grafana/Configs.vue'),
      Navbar,
      Footer,
    },
    beforeEnter: (to, from, next) => {
      const githubUserId = store.state.id;
      console.log('githubUserId', githubUserId);
      if (githubUserId === undefined) {
        next({ name: 'github-oauth' });
      } else {
        next();
      }
    },
  },
  {
    path: '/github/oauth',
    name: 'github-oauth',
    components: {},
    beforeEnter: (to, from, next) => {
      const githubOAuthPath = GetGitHubOAuthPath();
      window.location.href = githubOAuthPath;
      next();
    },
  },
  {
    path: '/github/link',
    name: 'github-link',
    components: {},
    beforeEnter: (to, from, next) => {
      const githubUrl = process.env.VUE_APP_GITHUB_URL;
      window.location.href = githubUrl;
      next();
    },
  },
  {
    path: '/github/dashboards',
    name: 'github-dashboards',
    components: {},
    beforeEnter: (to, from, next) => {
      const githubUrl = 'https://github.com/pieterbrandsen';
      window.location.href = githubUrl;
      next();
    },
  },
  {
    path: '/github/dashboards',
    name: 'github-dashboards',
    components: {},
    beforeEnter: (to, from, next) => {
      const githubUrl = 'https://github.com/pieterbrandsen/Go-Grafana-Graphite/tree/master/exampleStats';
      window.location.href = githubUrl;
      next();
    },
  },
  {
    path: '/support/server-stats',
    name: 'support-server-stats',
    components: {},
    beforeEnter: (to, from, next) => {
      const supportUrl = 'https://github.com/The-International-Screeps-Bot/screepsmod-server-stats';
      window.location.href = supportUrl;
      next();
    },
  },
  {
    path: '/support/performance-server',
    name: 'support-performance-server',
    components: {},
    beforeEnter: (to, from, next) => {
      const supportUrl = 'https://github.com/The-International-Screeps-Bot/Screeps-Performance-Server';
      window.location.href = supportUrl;
      next();
    },
  },
  {
    path: '/support/screeps-grafana',
    name: 'support-screeps-grafana',
    components: {},
    beforeEnter: (to, from, next) => {
      const supportUrl = 'https://github.com/The-International-Screeps-Bot/Screeps-Grafana';
      window.location.href = supportUrl;
      next();
    },
  },
  {
    path: '/support/the-international',
    name: 'support-the-international',
    components: {},
    beforeEnter: (to, from, next) => {
      const supportUrl = 'https://github.com/The-International-Screeps-Bot/The-International-Open-Source';
      window.location.href = supportUrl;
      next();
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
