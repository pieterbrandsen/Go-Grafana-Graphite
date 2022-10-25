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
    components: {},
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
    path: '/grafana/support',
    name: 'grafana-support',
    components: {
      default: () => import('@/views/grafana/Support.vue'),
      Navbar,
    },
  },
  {
    path: '/github/link',
    name: 'github-link',
    components: {},
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
  {
    path: '/github/dashboards',
    name: 'github-dashboards',
    components: {},
    beforeEnter: (to, from, next) => {
      const githubUrl = 'https://github.com/pieterbrandsen';
      if (githubUrl) {
        window.location.href = githubUrl;
        next();
      } else {
        next({ name: 'Home' });
      }
    },
  },
  {
    path: '/github/dashboards',
    name: 'github-dashboards',
    components: {},
    beforeEnter: (to, from, next) => {
      const githubUrl = 'https://github.com/pieterbrandsen/Go-Grafana-Graphite/tree/master/exampleStats';
      if (githubUrl) {
        window.location.href = githubUrl;
        next();
      } else {
        next({ name: 'Home' });
      }
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
