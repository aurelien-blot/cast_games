<template>

  <table class="table score-sheet table-bordered" :class="customClass">
    <tbody>
    <tr>
      <th>Joueurs</th>
      <td v-for="(player, index) in playerList" :key="index" class="text-center">{{player.name}}</td>
    </tr>
    <tr >
      <th>Score total<span v-if="objective!=null" class="fa-pull-right">/ {{objective}}</span></th>
      <td v-for="(player, index) in playerList" :key="index" class="text-center">
        <span >{{player.score}}</span>
      </td>
    </tr>
    <tr >
      <th>Score de la manche</th>
      <td v-for="(player, index) in playerList" :key="index" class="text-center">
        <span v-if="showRoundScore && player.id === activePlayer.id">{{player.currentRound.score}}</span>
      </td>
    </tr>
    <tr >
      <th>Score sélectionné</th>
      <td v-for="(player, index) in playerList" :key="index" class="text-center">
        <span v-if="showRoundActionScore && player.id === activePlayer.id">{{activePlayer.currentRound.currentAction.score}}</span>
      </td>
    </tr>
    </tbody>
  </table>

</template>

<script >
export default {
  name: 'ScoreComponent',
  props: {
    playerList: {
      type: Array,
      required: true
    },
    activePlayer: {
      type: Object,
      required: false
    },
    customClass: {
      type: String,
      required: false
    },
    objective: {
      type: Number,
      required: false
    }

  },
  computed: {
    showRoundScore(){
      return this.activePlayer!=null && this.activePlayer.currentRound!=null;
    },
    showRoundActionScore(){
      return this.showRoundScore && this.activePlayer.currentRound.currentAction!=null;
    }
  },
  methods: {

  }
}

</script>

<style scoped>
.score-sheet {
  font-size: small;
}
</style>