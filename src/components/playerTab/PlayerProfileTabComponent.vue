<template>
  <div>
    <template v-if="playerProfile==null">
      <div class="alert alert-info">Aucun profil de joueur trouvé.</div>
    </template>
    <template v-else-if="playerProfile.archived">
      <div class="alert alert-info">Ce compte a été supprimé, l'accès aux informations est donc impossible.</div>
    </template>
    <template v-else-if="!playerProfile.archived">
      <TabAreaComponent title="Informations générales">
        <template v-slot:tab-area-content>

          <div><span class="bold">Nom d'utilisateur : </span><span></span></div>
          <div><span class="bold">Inscrit depuis le : </span><span></span></div>
        </template>
      </TabAreaComponent>

      <TabAreaComponent title="Favoris">
        <template v-slot:tab-area-content>
          <div>test2</div>
        </template>
      </TabAreaComponent>
    </template>
  </div>
</template>
<script>

import {mapActions, mapGetters} from "vuex";
import PlayerApiService from "@/services/api/playerApiService.js";
import ErrorService from "@/services/errorService.js";
import TabAreaComponent from "@/components/TabAreaComponent.vue";
import player from "@/views/Player.vue";

export default {
  name: 'PlayerProfileTabComponent',
  components: {TabAreaComponent},
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