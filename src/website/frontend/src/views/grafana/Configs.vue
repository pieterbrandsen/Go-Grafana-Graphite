<template>
  <PageTitle title="Configs for Screeps Grafana" />
  <BaseModal :showing="addModalShowing" @close="addModalShowing = false">
    <AddOrUpdateModal />
  </BaseModal>
  <button class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button"  @click="addModalShowing = true">
  Add
</button>
  <table v-if="configs.length > 0" class="table-fixed">
    <thead>
      <tr>
        <th>Song</th>
        <th>Artist</th>
        <th>Year</th>
      </tr>
    </thead>
    <tbody v-for="(config, index) in configs" :key="index">
      <tr>
        <td>{{ config.config_name }}</td>
        <td>{{ config.port }}</td>
        <td>{{ config.active }}</td>
      </tr>
    </tbody>
  </table>
  <div v-else class="h-full">
    <h1 class="text-2xl font-bold">No configs found</h1>
    <p class="text-gray-500">Please create a config first</p>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PageTitle from '@/components/base/PageTitle.vue';
import axios from 'axios';
import state from '@/store';
import { Config } from '@/assets/types';
import BaseModal from '@/components/base/Modal.vue';
import AddOrUpdateModal from '@/components/grafana/AddOrUpdateModal.vue';

const githubUserId = state.state.id;

@Options({
  components: {
    PageTitle,
    BaseModal,
    AddOrUpdateModal,
  },
  computed: {
    async configs() {
      const response = await axios.get(
        `${process.env.VUE_APP_BACKEND_URL}/api/config/getAll?githubUserId=${githubUserId}`,
      );
      return response.data;
    },
  },
})
export default class GrafanaConfigsView extends Vue {
  configs!: Config[];

  addModalShowing = false;
}
</script>
