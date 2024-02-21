<template>
  <div class="row">
    <div v-if="isPlayerList" v-for="(player, index) in playerList" :key="index" class="col-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{player.name}}</h5>
          <div class="row">
            <div class="col-6">
              <div class="card-area">
                <div class="deck" @click="pickCard(player)">
                  <p class="deck-count">Reste : 22</p>
                </div>

              </div>
            </div>
            <div class="col-6" v-if="player.currentRound!=null && player.currentRound.pickedCard!=null">
              <div class="card-area">
                <CardComponent :label="player.currentRound.pickedCard.label"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script >
import CardComponent from "@/components/CardComponent.vue";

export default {
  name: 'CardAreaComponent',
  components: {CardComponent},
  props: {
    playerList: {
      type: Array,
      required: true
    },
    onPickCard: {
      type: Function,
      required: false
    }

  },
  data() {
    return {
    }
  },
  computed: {
    isPlayerList() {
      return this.playerList!=null && this.playerList.length > 0;
    }
  },
  methods: {
    pickCard(player) {
      this.onPickCard(player);
    }
  },
  mounted() {

  }
}

</script>

<style scoped>
.card-area {
  background-color: #f0f0f0;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  text-align: center;
  display: flex;
  justify-content: center;
}
.deck{
  background-color: black;
  padding: 10px;
  border-radius: 5px;
  height: 150px;
  width: 100px;
  border: 1px solid grey;
}

.deck:hover{
  cursor: pointer;
}

.deck-count{
  margin-top: 110px;
  color: white;
  font-size: 0.8rem;
  text-align: center;
}
</style>
