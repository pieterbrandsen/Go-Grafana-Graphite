<template>
<h1 class="text-5xl">{{ title }}</h1>
  <br/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    title: String,
  },
})
export default class PageTitle extends Vue {
    title!: string;
}

</script>
