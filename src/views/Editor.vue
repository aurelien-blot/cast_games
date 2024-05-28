<template>
  <BasicViewComponent >
    <template v-slot:content>
      <h1>Éditeur</h1>
      <div class="row">
      </div>
    </template>
  </BasicViewComponent>
</template>

<script>
import Game from "@/views/Game.vue";

import { v4 as uuidv4 } from 'uuid';
import {mapActions, mapGetters} from "vuex";
import BasicViewComponent from "@/components/BasicViewComponent.vue";
import PlayerApiService from "@/services/api/playerApiService.js";
import ErrorService from "@/services/errorService.js";
import GameElementApiService from "@/services/api/game/gameElementApiService.js";
export default {
  name: 'Editor',
  components: {
    BasicViewComponent,
  },
  data() {
    return {
      gameComponents :[]
    }
  },
  computed: {
    ...mapGetters(['isTestMode', "isLoading"]),
  },
  methods: {
    ...mapActions(["setLoading"]),
    async getAllGameElements() {
      await this.setLoading(true);
      await GameElementApiService.selectAll().then((result) => {
        this.gameComponents =result;
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      await this.setLoading(false);
    },
  },
  mounted() {
    this.getAllGameElements();
  }
}

</script>