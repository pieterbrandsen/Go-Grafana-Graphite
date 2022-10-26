<template>
  <PageTitle title="Login result"/>
  <p>a {{ username }}</p>
  <p>b {{ message }}</p>
  <Link path="/home" label="Return to home" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import store from '@/store';
import GetGitHubOAuthPath from '@/oauth/GithubAuth';
import Link from '@/components/base/Link.vue';

@Options({
  props: {
    username: String,
    message: String,
  },
  components: {
    Link
  }
})

export default class LoginResult extends Vue {
  mounted() {
    const { query } = this.$route;
    const username = query.username as string;
    const email = query.email as string;
    const message = query.message as string;

    if (username && email) {
      store.dispatch('verifyUser', { username, email });
    }
  }
}
</script>
