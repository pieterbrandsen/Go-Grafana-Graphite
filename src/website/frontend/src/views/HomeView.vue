<template>
  <PageTitle title="Welcome to Screeps Grafana"/>
  <h1>On this site you can find the following information</h1>
  <ul class="list-disc list-inside">
    <li>
      Screeps Grafana hosted
    </li>
    <li>
      Useful links
    </li>
  </ul>
  <br/>

  <h2 class="text-2xl">Screeps Grafana hosted</h2>
  <p>
    I have hosted a Screeps Grafana instance for the community to use. It is available at <RouterLink class="text-blue-600" to="/grafana/link" target="_blank">Grafana</RouterLink>.
    To find support you can go to the <RouterLink class="text-blue-600" to="/grafana/support">Support page</RouterLink>.
  </p>
  <br/>
  <h2 class="text-2xl">Useful links</h2>
  <p>
    These are some useful links to make your Screeps experience better.
  </p>
  <br/>
  <ContactInformation/>
  <br/>
  <h4 class="text-1xl">
    <i>If you like this project please consider adding an star to the project over <a href="https://github.com/pieterbrandsen/Go-Grafana-Graphite" class="text-blue-600" target="_blank">here</a>!</i>
  </h4>

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
export default class HomeView extends Vue {}
</script>
