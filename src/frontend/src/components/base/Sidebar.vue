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
      <h3 class="mx-6 mb-2 text-xs text-gray-400 uppercase tracking-widest">Secondary</h3>
    </div>
    <div class="mb-10 text-center">
      <h3 class="mx-6 mb-2 text-xs text-gray-400 uppercase tracking-widest">Tertiary</h3>
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
}

const navigation: Navigation = {
  main: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'About',
      href: '/about',
    },
    {
      label: 'Contact',
      href: '/',
    },
  ],
};

@Options({
  props: {
    msg: String,
  },
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
  msg!: string;

  ApplicationLogo!: typeof ApplicationLogo;

  navigation!: Navigation;
}
</script>
