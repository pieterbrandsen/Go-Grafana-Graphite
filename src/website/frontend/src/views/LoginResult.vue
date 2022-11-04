<template>
  <PageTitle title="Login result"/>
  <p>{{ message }}</p>
  <br/>
  <Link path="/" label="Return to home" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import store from '@/store';
import Link from '@/components/base/Link.vue';
import PageTitle from '@/components/base/PageTitle.vue';
import Cookies from 'js-cookie';

const message = Cookies.getJSON('message') as string;
store.dispatch('setUser');
Cookies.remove('message');

@Options({
  props: {
    message: String,
  },
  components: {
    Link,
    PageTitle,
  },
})

export default class LoginResult extends Vue {
  message = message;
}
</script>
