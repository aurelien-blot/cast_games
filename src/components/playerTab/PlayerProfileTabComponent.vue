<template>
  <div>
    <h1>PlayerProfileTabComponent</h1>
  </div>
</template>
<script>

import {mapActions, mapGetters} from "vuex";
import PlayerApiService from "@/services/api/playerApiService.js";
import ErrorService from "@/services/errorService.js";

export default {
  name: 'PlayerProfileTabComponent',
  props:{
    playerId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      playerProfile: null,
    }
  },
  computed: {
    ...mapGetters(['isTestMode', "isLoading"]),
    ...mapGetters("auth", ["connectedUser"]),
  },
  methods: {
    ...mapActions(["setLoading"]),
    async loadPlayerProfile() {
      await this.setLoading(true);
      await PlayerApiService.getProfile(this.playerId).then((result) => {
        this.playerProfile =result;
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      await this.setLoading(false);
    }
  },
  mounted() {
    this.loadPlayerProfile();
  }
}

</script>
<style scoped>

</style>