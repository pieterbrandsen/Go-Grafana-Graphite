<template>
  <div class="flex min-h-screen max-w-screen">
    <Sidebar />
    <div class="w-full ">
      <Title />
      <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '@/components/HelloWorld.vue';
import Title from '@/components/base/Title.vue';
import Sidebar from '@/components/base/Sidebar.vue';

@Options({
  components: {
    HelloWorld,
    Title,
    Sidebar,
  },
})
export default class HomeView extends Vue {}
</script>
