<template>
  <h1 class="text-5xl">Loading your info...</h1>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import store from '@/store';
import GetGitHubOAuthPath from '@/oauth/GithubAuth';

export default class GithubOAuthResult extends Vue {
  async mounted() {
    const { query } = this.$route;
    const username = query.username as string;
    const email = query.email as string;

    if (username && email) {
      store.dispatch('verifyUser', { username, email });
      this.$router.push({ name: 'home' });
    } else {
      const githubOAuthPath = GetGitHubOAuthPath();
      window.location.href = githubOAuthPath;
    }
  }
}
</script>
