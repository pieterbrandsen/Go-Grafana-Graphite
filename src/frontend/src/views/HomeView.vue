<template>
  <PageTitle title="Welcome to Your Vue.js + TypeScript App"/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PageTitle from '@/components/base/PageTitle.vue';

@Options({
  components: {
    PageTitle,
  },
})
export default class HomeView extends Vue {}
</script>
