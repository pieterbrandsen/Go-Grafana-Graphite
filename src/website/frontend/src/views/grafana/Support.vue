<template>
  <PageTitle title="Support for Screeps Grafana" />

  <h1 class="text-3xl">Configs</h1>
  <RouterLink class="text-blue-600" to="/grafana/configs">Setup your configs</RouterLink>
  <p>Configs are used to get your stats when active.</p>
  <p>There are 2 types of configs:</p>
  <ul class="list-disc list-inside">
    <li>MMO</li>
    <li>Private server</li>
  </ul>
  <br />
  <h2 class="text-2xl">MMO</h2>
  <p>MMO configs are used to get your stats from the MMO server.</p>
  <p>Example config setup:</p>
  <ul class="list-disc list-inside">
    <li>Config name: MyFirstConfig</li>
    <li>Shard: shard3</li>
    <li>Prefix (optional): v1.subPath.subSubPath</li>
    <li>Stats path (visible when segment isn't selected): stats</li>
    <li>Stats segment (visible when selected using segment): 0</li>
    <li>Token: this_is_a_screeps.com_token</li>
  </ul>
  <br />

  <h2 class="text-2xl">Private server</h2>
  <p>
    Private server configs are used to get your stats from an Private server. Usable when "Is
    private server" is selected
  </p>
  <p>Example config setup:</p>
  <ul class="list-disc list-inside">
    <li>Config name: MyFirstConfig</li>
    <li>Host (or domain): 12.34.56</li>
    <li>Port: 21025</li>
    <li>Interval (optional, default 1 minute): v1.subPath.subSubPath</li>
    <li>Username: PandaMaster</li>
    <li>Password: password123</li>
    <li>Prefix (optional): v1.subPath.subSubPath</li>
    <li>Stats path (visible when segment isn't selected): stats</li>
    <li>Stats segment (visible when selected using segment): 0</li>
    <li>Include server stats: Selected</li>
  </ul>
  <br />

  <h1 class="text-3xl">Dashboards</h1>
  <p>After you saved the config you can now use path: screeps.your_stats</p>
  <p>Example: screeps.stats.shard3.cpu</p>
  <p>
    There are pre-made admin utils, server stats and mmo ready dashboards + stats file located at
    <RouterLink class="text-blue-600" to="/github/dashboards">Github</RouterLink>
  </p>
  <br />
  <h2 class="text-2xl">Images of dashboards</h2>
  <img src="@/assets/AdminUtilsDashboard.png" alt="Image of admin utils dashboard"/>
  <br />

  <ContactInformation />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PageTitle from '@/components/base/PageTitle.vue';
import ContactInformation from '@/components/base/ContactInformation.vue';

@Options({
  components: {
    PageTitle,
    ContactInformation,
  },
})
export default class GrafanaSupportView extends Vue {}
</script>
