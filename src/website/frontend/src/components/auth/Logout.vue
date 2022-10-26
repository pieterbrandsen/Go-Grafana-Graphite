<template>
    <p class="block py-2 text-sm text-indigo-100">Hello {{ username }}</p>
    <RouterLink to="/logout" class="block px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-400 hover:text-indigo-100">Logout</RouterLink>
  </template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import store from '@/store';

@Options({
  data() {
    return {
      username: store.state.username,
    };
  },
})
export default class Logout extends Vue {
    username!: string;
}
</script>
