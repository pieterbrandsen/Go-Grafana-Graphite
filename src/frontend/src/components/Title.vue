<template>
    <div class="sticky top-0 z-50 h-32 bg-indigo-200">
        <h1>Title</h1>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    msg: String,
  },
})
export default class Title extends Vue {
  msg!: string;
}
</script>
