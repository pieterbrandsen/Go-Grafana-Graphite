<template>
  <div
    v-if="showing"
    style="background-color: rgba(0, 0, 0, 0.5)"
    class="backdrop overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
  >
    <div class="relative w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
      <button
        aria-label="close"
        class="absolute top-0 right-0 text-xl text-gray-500 my-2 mx-4"
        @click.prevent="close"
      >
        ×
      </button>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    showing: {
      required: true,
      type: Boolean,
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
})
export default class BaseModal extends Vue {
  showing!: boolean;

  close!: () => string;
}
</script>
