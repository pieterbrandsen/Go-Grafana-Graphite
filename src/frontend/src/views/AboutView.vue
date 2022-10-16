<template>
  <div class="flex min-h-screen max-w-screen">
    <Sidebar />
    <div class="w-full">
      <Title />
      <div class="about">
        <h1>This is an about page</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Title from '@/components/base/Title.vue';
import Sidebar from '@/components/base/Sidebar.vue';

@Options({
  components: {
    Title,
    Sidebar,
  },
})
export default class AboutView extends Vue {}
</script>
