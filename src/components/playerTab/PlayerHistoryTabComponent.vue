<template>
  <div>
    <TabAreaComponent title="Dernières parties jouées">
      <template v-slot:tab-area-content>
        <div><span class="bold">Test : </span><span></span></div>
      </template>
    </TabAreaComponent>
    <TabAreaComponent title="Derniers jeux joués">
      <template v-slot:tab-area-content>
        <div><span class="bold">Test : </span><span></span></div>
      </template>
    </TabAreaComponent>
    <TabAreaComponent title="Historique complet">
      <template v-slot:tab-area-content>
        <div><span class="bold">Test : </span><span></span></div>
      </template>
    </TabAreaComponent>
  </div>
</template>
<script>

import {mapGetters} from "vuex";
import TabAreaComponent from "@/components/TabAreaComponent.vue";

export default {
  name: 'PlayerHistoryTabComponent',
  components: {TabAreaComponent},
  props: ['playerId'],
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['isTestMode', "isLoading"]),
    ...mapGetters("auth", ["connectedUser"]),
  },
  methods: {

  },
  mounted() {
  }
}

</script>
<style scoped>

</style>