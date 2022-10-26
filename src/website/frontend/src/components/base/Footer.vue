<template>
  <footer
    class="fixed bottom-0 left-0 z-20 p-4 w-full bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600"
  >
    <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400"
      >Any questions? Please contact me!
    </span>
    <ul class="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
    <li>Github: <Link to="/github/link" class="text-blue-600" target="_blank">PieterBrandsen</Link></li>
    <li>Email: pieterbrandsen2@gmail.com</li>
    <li>Discord: PANDA#7722</li>
    </ul>
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
export default class PageTitle extends Vue {
}

</script>
