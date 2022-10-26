<template>
  <RouterLink to="/github/oauth" class="block px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-400 hover:text-indigo-100">Login with Github</RouterLink>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import Link from '../base/Link.vue';

@Options({
  components: {
    Link,
  },
})
export default class Login extends Vue {}
</script>
