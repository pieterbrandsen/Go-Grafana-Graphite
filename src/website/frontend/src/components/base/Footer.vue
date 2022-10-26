<template>
  <footer class="p-4 bg-white sm:p-6 dark:bg-gray-900">
    <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    <div class="md:flex md:justify-between">
      <div>
          <span class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white"
            >Any questions? Please contact me!
          </span>
        </div>
      <div class="grid grid-cols-1 gap-8 sm:gap-6 sm:grid-cols-2">
        <div>
          <span class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white"
            >Discord: PANDA#3000
          </span>
        </div>
        <div>
          <span class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
            Github: <Link path="/github/link" label="PieterBrandsen" target="_blank">PieterBrandsen</Link>
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Link from './Link.vue';

@Options({
  components: {
    Link,
  },
})
export default class PageTitle extends Vue {}
</script>
