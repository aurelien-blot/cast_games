<template>
  <div class="row">
    <div class="col-12 text-center"><h1>Fin du jeu</h1></div>
    <div class="col-6 offset-3 text-center">
      <ScoreSheetComponent :editable="false"
                           :score-sheet-model="gameContent.individualScoreSheet"
                           :player-list="playerList"
                           custom-class="table-sm table-bordered table-striped"/>
    </div>
    <div class="col-3" v-if="classement.length>0">
      <div>Classement :</div>
      <div v-for="(player, index) in classement" :key="index">
        <div :class="index===0?'winner':''">{{index+1}}. {{player.name}} : {{player.scoreSheet.GLOBAL_TOTAL_FINAL.value}}</div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-12 text-center">
      <button class="btn btn-success btn-md" @click="exitGame()">Quitter</button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ScoreSheetComponent from "@/components/ScoreSheetComponent.vue";
export default {
  name: 'EndGame',
  components: {
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
    onExitGame: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      newPlayerName: null,
      classement: []
    }
  },
  computed: {
    ...mapGetters(['isTestMode']),

  },
  methods: {
    countTotalScore() {
      this.playerList.forEach(player => {
        let total1 = this.calculateTotal1(player.scoreSheet);
        let total1Bonus = this.calculateTotal1Bonus(total1);
        let total2 = this.calculateTotal2(player.scoreSheet);
        let finalTotal = this.calculateFinalTotal(total1, total1Bonus, total2);
        player.scoreSheet = Object.assign(player.scoreSheet, {
          GLOBAL_TOTAL_1: {value: total1},
          TOTAL_BONUS: {value: total1Bonus},
          GLOBAL_TOTAL_2: {value: total2},
          GLOBAL_TOTAL_FINAL: {value: finalTotal}
        });
      });
      this.classement = [];
      this.classement.push(...this.playerList);
      this.classement.sort((a, b) => b.scoreSheet.GLOBAL_TOTAL_FINAL.value - a.scoreSheet.GLOBAL_TOTAL_FINAL.value);
    },
    calculateTotal1(scoreSheet) {
      let total = 0;
      for(let score in scoreSheet){
        if(["TOTAL_1", "TOTAL_2","TOTAL_3", "TOTAL_4","TOTAL_5", "TOTAL_6"].includes(score) && scoreSheet[score].value!=null){
          total += scoreSheet[score].value;
        }
      }
      return total;
    },
    calculateTotal1Bonus(total1) {
      return total1 >= 63 ? 35 : 0;
    },
    calculateTotal2(scoreSheet) {
      let total = 0;
      for(let score in scoreSheet){
        if(["BRELAN", "CARRE","FULL", "SMALL_STRAIGHT","LARGE_STRAIGHT", "YAMS","CHANCE"].includes(score) && scoreSheet[score].value!=null){
          total += scoreSheet[score].value;
        }
      }
      return total;
    },
    calculateFinalTotal(total1, total1Bonus, total2) {
      return total1 + total1Bonus + total2;
    },
    exitGame() {
      this.onExitGame();
    },

  },
  mounted() {
    this.countTotalScore();
  }
}
</script>
<style scoped>
  .winner{
    color: green;
    font-weight: bold;
  }
</style>