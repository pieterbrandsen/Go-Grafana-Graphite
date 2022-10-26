<template>
    <p class="block py-2 text-sm text-indigo-100">Hello {{ username }}</p>
    <Link path="/logout" label="Logout" />
  </template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Link from '@/components/base/Link.vue';
import store from '@/store';

@Options({
  data() {
    return {
      username: store.state.username,
    };
  },
  components: {
    Link,
  }
})
export default class Logout extends Vue {
    username!: string;
}
</script>
