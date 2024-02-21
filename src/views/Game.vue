<template>
  <div class="game-area">
      <PrepareGame v-if="gameLifeCycle==='INIT'"
          :game-content="gameContent"
          :player-list="playerList"
          :on-start-game="startGame"
          :score-limit="scoreLimit"
          :min-player="gameContent.playerData.min"
          :max-player="gameContent.playerData.max" />

      <StartGame v-if="gameLifeCycle==='START'"
                 :game-content="gameContent"
                 :player-list="playerList"
                 :score-limit="scoreLimit"
                 :on-end-game="endGame"
      />

    <EndGame v-if="gameLifeCycle==='END'"
               :game-content="gameContent"
               :player-list="playerList"
                :on-exit-game="initGame"/>
  </div>
</template>

<script>
import PrepareGame from "@/views/gameLifeCycles/PrepareGame.vue";
import StartGame from "@/views/gameLifeCycles/StartGame.vue";
import {mapGetters} from "vuex";
import EndGame from "@/views/gameLifeCycles/EndGame.vue";
import {v4 as uuidv4} from "uuid";

export default {
  name: 'Game',
  components: {
    EndGame,
    StartGame,
    PrepareGame,
  },
  props: {
    mainPlayer : {
      type: Object,
      required: true
    },
    gameContent: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      playerList: [],
      gameLifeCycle: null,
      scoreLimit: null,
    }
  },
  computed: {
    ...mapGetters(['isTestMode'])
  },
  methods: {
    startGame() {
      this.gameLifeCycle = 'START';
    },
    endGame() {
      this.gameLifeCycle = 'END';
    },
    initGame() {
      this.playerList.push({name: this.mainPlayer.name, score: 0, id: this.mainPlayer.id});
      this.gameLifeCycle = 'INIT';
      this.extractScoreLimit();
    },
    extractScoreLimit() {
      if(this.gameContent != null && this.gameContent.endMode === "SCORE_LIMIT_INSTANT"){
        this.scoreLimit = Object.assign({},this.gameContent.scoreLimit);
      }
    },
  },
  mounted() {
    this.initGame();
    if(this.isTestMode) {
      this.playerList.push({name: "José", score: 0, id: uuidv4()});
      this.startGame();
    }
  }
}

</script>

<style scoped>
.game-area {
  margin-top: 20px;
  padding: 8px;
  background-color: #f3f3f3;
}
</style>
