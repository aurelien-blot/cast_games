<template>
  <div>
    <TabAreaComponent title="Statistiques générales">
      <template v-slot:tab-area-content>
        <div><span class="bold">Test : </span><span></span></div>
      </template>
    </TabAreaComponent>
    <TabAreaComponent title="Statistiques par jeu">
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
  name: 'PlayerStatsTabComponent',
  components: {TabAreaComponent},
  props: ['playerId'],
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['isTestMode']),
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