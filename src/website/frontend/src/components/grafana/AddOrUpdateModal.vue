<template>
  <form method="get" v-on:submit="submitConfig(config)">
    <h1 class="text-xl">{{ config.config_id ? "Update" : "Add" }} config</h1>
    <br />
    <div v-for="(field, index) in mainFields" :key="index">
      <div class="mb-6">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
          field.message
        }}</label>
        <input
          :type="field.type"
          v-model="config[field.name]"
          :class="field.class"
          :placeholder="field.placeholder"
          required
        />
      </div>
    </div>
    <div v-if="config.is_private_server">
      <h2 class="text-l">Private Server specific</h2>
      <br />
      <div v-for="(field, index) in privateFields" :key="index" class="mb-6">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
          field.message
        }}</label>
        <input
          :type="field.type"
          v-model="config[field.name]"
          :class="field.class"
          :placeholder="field.placeholder"
          required
        />
      </div>
    </div>
    <div v-else>
      <h2 class="text-l">MMO specific</h2>
      <br />
      <div v-for="(field, index) in mmoFields" :key="index" class="mb-6">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
          field.message
        }}</label>
        <input
          :type="field.type"
          v-model="config[field.name]"
          :class="field.class"
          :placeholder="field.placeholder"
          required
        />
      </div>
    </div>
    <button
      type="submit"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      Submit
    </button>
  </form>
</template>

<script lang="ts">
import { Config } from '@/assets/types';
import { Vue, Options } from 'vue-class-component';
import state from '@/store';
import axios from 'axios';

const githubUserId = state.state.id;

const classes: { [key: string]: string } = {
  text: 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
  checkbox:
    'w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800',
};

interface FormFields {
  name: keyof Config;
  message: string;
  type: string;
  placeholder?: string;
  class: string;
}

const mainFields: FormFields[] = [
  {
    name: 'config_name',
    message: 'Config name',
    type: 'text',
    class: classes.text,
    placeholder: '',
  },
  {
    name: 'prefix',
    message: 'Prefix',
    type: 'text',
    class: classes.text,
  },
  {
    name: 'username',
    message: 'Username',
    type: 'text',
    class: classes.text,
  },
  {
    name: 'is_stats_segment',
    message: 'Is stats segment',
    type: 'checkbox',
    class: classes.checkbox,
  },
  {
    name: 'stats_path',
    message: 'Stats path (fill in if is_stats_segment is NOT selected)',
    type: 'text',
    class: classes.text,
  },
  {
    name: 'stats_segment',
    message: 'Stats segment (fill in if is_stats_segment is selected)',
    type: 'text',
    class: classes.text,
  },
  {
    name: 'is_private_server',
    message: 'Is private server',
    type: 'checkbox',
    class: classes.checkbox,
  },
  {
    name: 'active',
    message: 'Active',
    type: 'checkbox',
    class: classes.checkbox,
  },
];
const mmoFields: FormFields[] = [
  {
    name: 'shard',
    class: classes.text,
    message: 'Shard',
    type: 'text',
  },
  {
    name: 'token',
    class: classes.text,
    message: 'Token',
    type: 'text',
  },
];
const privateFields: FormFields[] = [
  {
    name: 'interval',
    message: 'Interval in milliseconds',
    class: classes.text,
    type: 'number',
    placeholder: '1',
  },
  {
    name: 'host',
    message: 'Host',
    class: classes.text,
    type: 'text',
  },
  {
    name: 'port',
    message: 'Port',
    class: classes.text,
    type: 'text',
  },
  {
    name: 'private_server_password',
    class: classes.text,
    message: 'Private server user password',
    type: 'text',
  },
  {
    name: 'include_server_stats',
    message: 'Include server stats',
    type: 'checkbox',
    class: classes.checkbox,
  },
];

async function updateConfig(config: Config) {
  const response = await axios.post(`${process.env.VUE_APP_BACKEND_URL}/api/config/update`, {
    githubUser: githubUserId,
    config,
  });
  console.log('updateConfig response', response.data);
  return response.data;
}

async function addConfig(config: Config) {
  const response = await axios.post(`${process.env.VUE_APP_BACKEND_URL}/api/config/create`, {
    githubUser: githubUserId,
    config,
  });
  console.log('addConfig response', response.data);
  return response.data;
}

function submitConfig(config: Config) {
  if (config.config_id) updateConfig(config);
  else addConfig(config);
}

const emptyConfig: Partial<Config> = {
  config_name: '',
  interval: 15 * 1000,
  host: '',
  port: 21025,
  shard: '',
  prefix: '',
  stats_path: '',
  stats_segment: 98,
  token: '',
  username: '',
  private_server_password: '',
  is_private_server: false,
  is_stats_segment: false,
  include_server_stats: false,
  active: false,
};

@Options({
  props: {
    config: {
      type: Object,
      default: () => emptyConfig,
    },
  },
})
export default class GrafanaAddOrUpdateConfigModal extends Vue {
  config!: Config;

  mainFields = mainFields;

  mmoFields = mmoFields;

  privateFields = privateFields;

  submitConfig = submitConfig;
}
</script>
