<template>
  a
  <!-- <a :href="getGitHubUrl(from)" class="block px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-400 hover:text-indigo-100">Github</a> -->
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    from: String,
  },
  data() {
    return {
      authenticate(provider:string) {
        this.$auth.authenticate(provider).then(() => {
        // Execute application logic after successful social authentication
        });
      },
    };
  },
})
export default class Login extends Vue {
  from!: string;

  // authenticate!: Function;
}
</script>
