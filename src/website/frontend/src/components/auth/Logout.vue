<template>
    <p class="block py-2 text-sm text-indigo-100">Hello {{ username }}</p>
    <button @click="logout" class="block px-2 py-2 text-sm text-indigo-100 hover:bg-indigo-400 hover:text-indigo-100">Logout</button>
  </template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import store from '@/store';

function logout() : void {
  store.dispatch('logoutUser');
}

@Options({
  data() {
    return {
      username: store.state.username,
    };
  },
  methods: {
    logout,
  },
})
export default class Logout extends Vue {
    username: string | undefined;

    logout!: () => void;
}
</script>
