<template>
  <div class="row">
    <div class="col-12 text-center" v-if="activePlayer!=null">
      <h2>{{activePlayer.name}} est en train de jouer</h2>
    </div>
  </div>

  <template v-if="gameContent!=null && gameContent.id==2">
    <card-area-component v-if="currentActionType==='PLAY_CARD'"
                         :on-pick-card="pickCard"
                         :player-list="playerList"/>
    <div class="row mt-3" v-if="isGlobalCurrentRoundDone">
        <div class="col-6 text-center" v-for="(player, index) in playerList" :key="index">
          <button v-if="showEndGlobalRoundButton"
                  :disabled="player.currentRound!=null && player.currentRound.finished"
                  class="btn btn-danger btn-md ms-2" @click="endGlobalRound(player)">
            <span>Fin du tour</span>
          </button>
        </div>
    </div>
  </template>
  <template v-if="gameContent!=null && [1,3].includes(gameContent.id)">
    <dice-area-component v-if="actionIsRollDice"
                         :throwing-enabled="true"
                         :on-throw-dice-fct="throwAllDicesAndEndAction"
                         :dice-result-list="activeDiceResult"/>
    <dice-area-component v-if="actionIsCheckScoreCell"
                         :throwing-enabled="false"
                         :dice-result-list="activeDiceResult"/>
    <dice-area-component v-if="actionIsSelectDice"
                         :throwing-enabled="false"
                         :selectable-values="activePlayer.currentRound.currentAction.selectableDices"
                         :on-selected-dice="selectDice"
                         :dice-result-list="activeDiceResult"/>
    <div class="row mt-3 mb-3">
      <div class="col-6 offset-3 text-center" >
        <ScoreSheetComponent v-if="currentActionType==='CHECK_SCORE_CELL'"
                             :editable="!scoreCellChekDisabled"
                             :check-score-sheet-cell="checkScoreSheetCell"
                             :score-sheet-model="gameContent.individualScoreSheet"
                             :waiting-player-finish="!this.isCurrentRoundActionFinished"
                             :active-player="activePlayer"
                             :player-list="playerList"
                             custom-class="table-sm table-bordered table-striped"/>
      </div>
    </div>
  </template>

  <div class="row" v-if="isCurrentRoundActionInstruction">
    <div class="col-12 text-center" >
      <span>{{activePlayer.currentRound.currentAction.instruction}}</span>
    </div>
  </div>
  <div class="row mt-3" v-if="showScore">
    <div class="col-6 offset-3">
      <ScoreComponent
                      :player-list="playerList"
                      :objective="scoreLimit.value"
                      :active-player="activePlayer"/>
    </div>
  </div>
  <div class="row mt-3">
    <div class="col-12 text-center">
      <button
          v-if="showContinueRoundButton"
          class="btn btn-success btn-md"
          :disabled="false"
          @click="continueRound()">
        <span>Continuer</span>
      </button>
      <button v-if="showEndRoundButton"
              class="btn btn-danger btn-md ms-2" @click="endRound()">
        <span>Fin du tour</span>
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ScoreSheetComponent from "@/components/ScoreSheetComponent.vue";
import DiceAreaComponent from "@/components/DiceAreaComponent.vue";
import ScoreComponent from "@/components/ScoreComponent.vue";
import ScoreSheetMixin from "@/mixins/scoreSheetMixin.js";
import ScoreMixin from "@/mixins/scoreMixin.js";
import GameElementMixin from "@/mixins/gameElementMixin.js";
import PlayerMixin from "@/mixins/playerMixin.js";
import CardAreaComponent from "@/components/CardAreaComponent.vue";
import RoundMixin from "@/mixins/roundMixin.js";
import SimultaneousMixin from "@/mixins/simultaneousMixin.js";

export default {
  name: 'StartGame',
  components: {
    CardAreaComponent,
    ScoreComponent,
    DiceAreaComponent,
    ScoreSheetComponent
  },
  props: {
    gameContent: {
      type: Object,
      required: true
    },
    playerList: {
      type: Array,
      required: true
    },
    onEndGame: {
      type: Function,
      required: true
    },
    scoreLimit: {
      type: Object,
      required: false
    }
  },
  mixins: [PlayerMixin, GameElementMixin, ScoreSheetMixin, ScoreMixin, RoundMixin, SimultaneousMixin],
  data() {
    return {
      testScoreResult: false,
      scoreCellChekDisabled: true,
      gameElementList: [],
      activePlayer: null,
    }
  },
  computed: {
    ...mapGetters(['isTestMode']),
    scoreSheetCellChecked() {
      if(this.activePlayer!=null && this.activePlayer.scoreSheet!=null){
        for(let scoreCell in this.activePlayer.scoreSheet){
          if(this.activePlayer.scoreSheet[scoreCell].checked===true){
            return true
          }
        }
      }
      return false;
    },
    showScore() {
      return this.gameContent!=null && this.gameContent.showScore;
    },
    actionType(){
      return this.gameContent!=null ? this.gameContent.actionType : null;
    },
    isSimultaneousGame(){
      return this.actionType==='SIMULTANEOUS';
    },
    isRoundGame(){
      return this.actionType==='ROUND';
    },
    isCurrentRound(){
      return this.activePlayer!=null &&this.activePlayer.currentRound!=null;
    },
    isCurrentRoundAction(){
      return this.isCurrentRound && this.activePlayer.currentRound.currentAction!=null;
    },
    currentActionType() {
      if(this.isSimultaneousGame){
        return this.isGlobalCurrentRoundAction? this.globalCurrentRound.currentAction.type:null;
      }
      else if(this.isRoundGame){
        return this.isCurrentRoundAction ? this.activePlayer.currentRound.currentAction.type : null;
      }
      else{
        return null;
      }
    },
  },
  methods: {
    initGame() {
      this.initPlayers();
      if(this.isSimultaneousGame){
        this.initSimultaneousDatas();
      }
      this.initElements();
      this.activePlayer = this.playerList[0];
    },
    async start(){
      while (!this.isGameOver()) {
        if(this.actionType==='ROUND'){
          await this.playRound();
          this.defineNextPlayer();
        }
        else if(this.isSimultaneousGame){
          await this.playSimultaneous();
        }
      }
      this.onEndGame();
    },

    isGameOver() {
      if(this.gameContent.endMode==='ALL_VALUES_FILLED'){
        for(let i=0; i<this.playerList.length; i++){
          let player = this.playerList[i];
          for(let scoreCell in player.scoreSheet){
            let gameContentCell =this.gameContent.individualScoreSheet.find(cell => cell.key===scoreCell);
            if(gameContentCell!=null && gameContentCell.editable && this.playerList[i].scoreSheet[scoreCell].value===null){
              return false;
            }
          }
        }
        return true;
      }
      else if(this.gameContent.endMode==='SCORE_LIMIT_INSTANT'){
        return this.playerList.some(player => player.score>=this.scoreLimit.value);
      }
      return false;
    },
  },
  mounted() {
    this.initGame();
    this.start();
  }
}

</script>

