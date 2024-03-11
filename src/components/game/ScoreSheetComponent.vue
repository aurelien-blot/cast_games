<template>
  <table class="table score-sheet" :class="customClass">
    <tbody>
    <tr>
      <th>Joueurs</th>
      <td v-for="(player, index) in playerList" :key="index">{{player.name}}</td>
    </tr>
    <tr v-for="(cell,index) in scoreSheetModel" :key="index">
      <th>{{cell.label}}</th>
      <td v-for="(player, index) in playerList" :key="index">
        <span v-if="player.scoreSheet[cell.key].value!=null">{{player.scoreSheet[cell.key].value}}</span>
        <span v-else-if="editable && player.id===activePlayer.id && cell.editable===true && (waitingPlayerFinish!=null && waitingPlayerFinish)">
          <input v-if="cell.type==='CHECKBOX'" type="checkbox" v-model="activePlayer.scoreSheet[cell.key].checked" @change="onCheckScoreSheetCell(cell.key)" >
        </span>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script >
export default {
  name: 'ScoreSheetComponent',
  props: {
    editable: {
      type: Boolean,
      required: true
    },
    playerList: {
      type: Array,
      required: true
    },
    activePlayer: {
      type: Object,
      required: false
    },
    waitingPlayerFinish: {
      type: Boolean,
      required: false
    },
    scoreSheetModel: {
      type: Array,
      required: true
    },
    checkScoreSheetCell: {
      type: Function,
      required: false
    },
    customClass: {
      type: String,
      required: false
    }
  },
  methods: {
    onCheckScoreSheetCell(cellKey) {
      this.checkScoreSheetCell(cellKey);
    }
  }
}

</script>

<style scoped>
.score-sheet {
  font-size: small;
}
</style>