<template >
    <li :id="`dropDownNav${title}`" class="relative">
          <div>
            <!-- Dropdown toggle button -->
            <button
              @click="$emit('showClicked')"
              class="
                flex
                items-center
                text-indigo-100
                bg-indigo-600
                rounded-md
                focus:outline-none
              "
            >
              <span class="mr-4">{{ title }}</span>
              <svg
                class="w-5 h-5 text-indigo-100"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <!-- Dropdown menu -->
            <div
              v-show="show"
              class="
                py-2
                mt-2
                bg-indigo-500
                rounded-md
                shadow-xl
                lg:absolute lg:right-0
                w-44
              "
            >
            <a v-for="(link, index) in routes" :key="index" :href="link.href" :target="target" class="block px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-400 hover:text-indigo-100">{{ link.label }}</a>
            </div>
          </div>
        </li>
</template>

<script lang="ts">
import { NavigationItem } from '@/assets/types';
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    title: String,
    routes: Array as () => Array<NavigationItem>,
    show: Boolean,
    target: String,
  },
})
export default class PageTitle extends Vue {
    title!: string;

    routes!: Array<NavigationItem>;

    show!: boolean;

    target!: string;
}

</script>
