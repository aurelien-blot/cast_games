<template>
  <BasicViewComponent >
    <template v-slot:content>
      <h1>TEST</h1>
      <div class="row">
        <div class="col-12" v-if="gameContent!=null">
          <h1>{{gameContent.name}}</h1>
        </div>
      </div>
      <Game  v-if="!isLoading && gameContent!=null"
             :key="gameContent.id"
             :game-content="gameContent"
             :main-player="mainPlayer" />
    </template>
  </BasicViewComponent>
</template>

<script>
import Game from "@/views/Game.vue";

import { v4 as uuidv4 } from 'uuid';
import {mapGetters} from "vuex";
import BasicViewComponent from "@/components/BasicViewComponent.vue";
export default {
  name: 'Home',
  components: {
    BasicViewComponent,
    Game,
  },
  data() {
    return {
      mainPlayer :null,
      gameContent:null,
    }
  },
  computed: {
    ...mapGetters(['isTestMode', "isLoading"]),
  },
  methods: {
    loadPlayer(){
      this.mainPlayer = {name: "Robert", id: uuidv4()};
    },
    loadGame(game) {
      this.gameContent = game;
      this.setLoading(false);
    },
  },
  mounted() {
    this.loadPlayer();
  }
}

</script>