<template>
  <PageTitle :title="username ? 'Logout succesfully' : 'You are not logged in!' "/>
  <h3 v-if="username !== undefined" class="text-3xl">Re-login whenever you want!</h3>
  <br/>
  <Link path="/" label="Return to home" />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import store from '@/store';
import Link from '@/components/base/Link.vue';
import PageTitle from '@/components/base/PageTitle.vue';

const { username } = store.state;

store.dispatch('logoutUser');

@Options({
  components: {
    Link,
    PageTitle,
  },
  props: {
    username: String,
  },
})

export default class LogoutResult extends Vue {
  username = username;
}
</script>
