<template >
            <RouterLink :key="key" :to="path" class="block px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-400 hover:text-indigo-100">{{ label }}</RouterLink>
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
