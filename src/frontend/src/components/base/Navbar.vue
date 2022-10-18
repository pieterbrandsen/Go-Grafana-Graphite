<template>
<div>
    <nav
      class="px-6 py-8 bg-indigo-600 md:flex md:justify-between md:items-center"
    >
      <div class="flex items-center justify-between">
        <router-link
          to="/"
          class="
            text-xl
            font-bold
            text-gray-100
            md:text-2xl
            hover:text-indigo-400
          "
          >
          <ApplicationLogo class="max-h-24" />
        </router-link>
        <!-- Mobile menu button -->
        <div @click="toggleMobileNav" class="flex md:hidden">
          <button
            type="button"
            class="
              text-gray-100
              hover:text-gray-400
              focus:outline-none focus:text-gray-400
            "
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path
                fill-rule="evenodd"
                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
      <ul
        :class="showMobileMenu ? 'flex' : 'hidden'"
        class="
          flex-col
          mt-8
          space-y-4
          md:flex md:space-y-0 md:flex-row md:items-center md:space-x-10 md:mt-0
        "
      >
        <NavDropdown title="Main" :routes="navigation.main" :show="dropdowns.main" @showClicked="dropdowns.main = !dropdowns.main" target="_self"/>
        <NavDropdown title="Support" :routes="navigation.support" :show="dropdowns.support" @showClicked="dropdowns.support = !dropdowns.support" target="_blank"/>
        <NavDropdown title="Grafana" :routes="navigation.grafana" :show="dropdowns.grafana" @showClicked="dropdowns.grafana = !dropdowns.grafana" target="_self"/>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ApplicationLogo from '@/components/base/ApplicationLogo.vue';
import NavDropdown from '@/components/base/NavDropdown.vue';
import { ref } from 'vue';
import { StringMap, NavigationItem } from '@/assets/types';

const navigation: StringMap<Array<NavigationItem>> = {
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
  account: [],
};

const showMobileMenu = ref(false);
const dropdowns = {
  main: ref(false),
  support: ref(false),
  grafana: ref(false),
};
function toggleMobileNav() { showMobileMenu.value = !showMobileMenu.value; }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
document.onclick = function onClick(event: any) {
  const { id } = event.target;
  if (id !== 'dropDownNavMain') dropdowns.main.value = false;
  if (id !== 'dropDownNavSupport') dropdowns.support.value = false;
  if (id !== 'dropDownNavGrafana') dropdowns.grafana.value = false;
};

@Options({
  components: {
    ApplicationLogo,
    NavDropdown,
  },
  data() {
    return {
      navigation,
      showMobileMenu,
      dropdowns,
      toggleMobileNav,
    };
  },
})
export default class Navbar extends Vue {
  ApplicationLogo!: typeof ApplicationLogo;

  NavDropdown!: typeof NavDropdown;

  navigation!: StringMap<NavigationItem[]>;

  showMobileMenu!: boolean;

  dropdowns!: StringMap<boolean>;

  toggleMobileNav!: () => void;
}
</script>
