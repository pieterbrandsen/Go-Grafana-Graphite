<template>
  <PageTitle title="Logout succesfully"/>
  <h3 class="text-3xl">Relogin whenever you want!</h1>
  <Link path="/home" label="Return to home" />
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import store from '@/store';
import Link from '@/components/base/Link.vue';

@Options({
  components: {
    Link
  }
})

export default class LogoutResult extends Vue {
  mounted() {
    store.dispatch('logoutUser');
  }
}
</script>
