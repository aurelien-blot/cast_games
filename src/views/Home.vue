<template>
  <loading-component :is-loading="isLoading"></loading-component>
  <div class="container">
    <header class="app-bar">
      <div class="row">
        <div class="col-6">
          <h1 class="app-title">Jeux</h1>
        </div>
        <div class="col-2 mt-2" v-for="(game, index) in gameList" :key="index">
          <span class="btn btn-secondary" @click="loadGame(game)">{{game.name}}</span>
        </div>
      </div>
    </header>
    <div class="row">
      <div class="col-12" v-if="gameContent!=null">
        <h1>{{gameContent.name}}</h1>
      </div>
    </div>
    <Game  v-if="!isLoading && gameContent!=null"
           :key="gameContent.id"
           :game-content="gameContent"
           :main-player="mainPlayer" />
  </div>
</template>

<script>
import Game from "@/views/Game.vue";
import gamesJson from '@/content/games.json';
import { v4 as uuidv4 } from 'uuid';
import LoadingComponent from "@/components/LoadingComponent.vue";
import {mapGetters} from "vuex";
export default {
  name: 'Home',
  components: {
    LoadingComponent,
    Game,
  },
  data() {
    return {
      gameList: [],
      mainPlayer :null,
      gameContent:null,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['isTestMode'])
  },
  methods: {
    loadGameListFromJson() {
      this.gameList = gamesJson;
    },
    loadGame(game) {
      this.gameContent = game;
      this.isLoading = false;
    },
    loadPlayer(){
      this.mainPlayer = {name: "Robert", id: uuidv4()};
    },
  },
  mounted() {
    this.loadGameListFromJson();
    this.loadPlayer();
    if(this.isTestMode){
      this.loadGame(this.gameList[1]);
    }
  }
}

</script>

<style>
.app-bar {
  background-color: #2c3e50;
  color: white;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
