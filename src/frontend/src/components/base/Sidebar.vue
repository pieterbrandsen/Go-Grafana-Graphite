<template>
  <div class="h-screen sticky top-0 w-64 bg-gray-50 border-r border-gray-200">
    <div class="py-4 px-6">
      <a href="/">
        <ApplicationLogo class="w-full" />
        <p style="display: none">Homepage</p>
      </a>
    </div>

    <div class="mb-10 text-center">
      <h3 class="mx-6 mb-2 text-xs text-gray-400 uppercase tracking-widest">Main</h3>
      <a
        v-for="(item, index) in navigation.main"
        :key="index"
        :href="item.href"
        class="flex items-center px-6 py-2.5 text-gray-500 hover:text-orange-600"
      >
        {{ item.label }}
      </a>
    </div>
    <div class="mb-10 text-center">
      <h3 class="mx-6 mb-2 text-xs text-gray-400 uppercase tracking-widest">Support</h3>
      <a
        v-for="(item, index) in navigation.support"
        :key="index"
        :href="item.href" target="_blank"
        class="flex items-center px-6 py-2.5 text-gray-500 hover:text-orange-600"
      >
        {{ item.label }}
      </a>
    </div>
    <div class="mb-10 text-center">
      <h3 class="mx-6 mb-2 text-xs text-gray-400 uppercase tracking-widest">Grafana</h3>
      <a
        v-for="(item, index) in navigation.grafana"
        :key="index"
        :href="item.href"
        class="flex items-center px-6 py-2.5 text-gray-500 hover:text-orange-600"
      >
        {{ item.label }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ApplicationLogo from '@/components/base/ApplicationLogo.vue';

interface NavigationItem {
  label: string;
  href: string;
}

interface Navigation {
  main: NavigationItem[];
  support: NavigationItem[];
  grafana: NavigationItem[];
}

const navigation: Navigation = {
  main: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Support',
      href: '/support',
    },
  ],
  support: [
    {
      label: 'Server stats',
      href: 'https://github.com/The-International-Screeps-Bot/screepsmod-server-stats',
    },
    {
      label: 'Performance server',
      href: 'https://github.com/The-International-Screeps-Bot/Screeps-Performance-Server',
    },
    {
      label: 'Simple grafana runner',
      href: 'https://github.com/The-International-Screeps-Bot/Screeps-Grafana',
    },
    {
      label: 'The International',
      href: 'https://github.com/The-International-Screeps-Bot/The-International-Open-Source',
    },
  ],
  grafana: [
    {
      label: 'Grafana',
      href: 'http://localhost:3000',
    },
    {
      label: 'Configs',
      href: '/configs',
    },
    {
      label: 'Support',
      href: '/support',
    },
  ],
};

@Options({
  components: {
    ApplicationLogo,
  },
  data() {
    return {
      navigation,
    };
  },
})
export default class Sidebar extends Vue {
  ApplicationLogo!: typeof ApplicationLogo;

  navigation!: Navigation;
}
</script>
