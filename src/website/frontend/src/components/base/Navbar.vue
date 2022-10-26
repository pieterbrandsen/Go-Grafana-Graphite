<template>
<div>
    <nav
      class="px-6 py-8 bg-indigo-600 md:flex md:justify-between md:items-center"
    >
      <div class="flex items-center justify-between">
        <RouterLink class="block px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-400 hover:text-indigo-100" to="/" label="">
          <ApplicationLogo class="max-h-24" />
        </RouterLink>
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
        <Login v-if="username === undefined"/>
        <Logout v-else />
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ApplicationLogo from '@/components/base/ApplicationLogo.vue';
import NavDropdown from '@/components/base/NavDropdown.vue';
import Login from '@/components/auth/Login.vue';
import Logout from '@/components/auth/Logout.vue';
import { ref } from 'vue';
import { StringMap, NavigationItem } from '@/assets/types';
import store from '@/store';

const navigation: StringMap<Array<NavigationItem>> = {
  main: [
    {
      label: 'Home',
      path: '/',
    },
    // {
    //   label: 'Support',
    //   path: '/support',
    // },
  ],
  support: [
    {
      label: 'Server stats',
      path: '/support/server-stats',
    },
    {
      label: 'Performance server',
      path: '/support/performance-server',
    },
    {
      label: 'Simple grafana runner',
      path: '/support/screeps-grafana',
    },
    {
      label: 'The International',
      path: '/support/the-international',
    },
  ],
  grafana: [
    {
      label: 'Grafana',
      path: '/grafana/link',
    },
    {
      label: 'Configs',
      path: '/grafana/configs',
    },
    {
      label: 'Support',
      path: '/grafana/support',
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dropdown = event.path.find((path: any) => path.id && path.id.includes('dropDownNav'));
  const isLink = event.path[0].tagName === 'A' && dropdown !== undefined;
  if (isLink || dropdown) {
    const { id } = dropdown;
    if (isLink || id !== 'dropDownNavMain') dropdowns.main.value = false;
    if (isLink || id !== 'dropDownNavSupport') dropdowns.support.value = false;
    if (isLink || id !== 'dropDownNavGrafana') dropdowns.grafana.value = false;
  }
};

@Options({
  components: {
    ApplicationLogo,
    NavDropdown,
    Login,
    Logout,
  },
  data() {
    return {
      navigation,
      showMobileMenu,
      dropdowns,
      toggleMobileNav,
    };
  },
  computed: {
    username() {
      return store.state.username;
    },
  },
})
export default class Navbar extends Vue {
  ApplicationLogo!: typeof ApplicationLogo;

  NavDropdown!: typeof NavDropdown;

  Login!: typeof Login;

  Logout!: typeof Logout;

  navigation!: StringMap<NavigationItem[]>;

  showMobileMenu!: boolean;

  dropdowns!: StringMap<boolean>;

  toggleMobileNav!: () => void;

  username!: string;
}
</script>
