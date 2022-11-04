<template>
    <PageTitle title="Configs for Screeps Grafana" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PageTitle from '@/components/base/PageTitle.vue';

@Options({
  components: {
    PageTitle,
  },
})
export default class GrafanaConfigsView extends Vue {}
</script>
