<template>
  <RouterLink :key="key" :to="path" class="underline text-blue-600 hover:text-blue-800">{{
    label
  }}</RouterLink>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    path: String,
    label: String,
    key: String,
  },
})
export default class Link extends Vue {
  path!: string;

  label!: string;

  key!: string;
}
</script>
