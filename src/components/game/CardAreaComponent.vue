<template>
  <div class="row">
    <div v-if="isPlayerList" v-for="(player, index) in playerList" :key="index" class="col-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{{player.name}}</h5>
          <div class="row">
            <div class="col-6">
              <div class="card-area">
                <div class="row">
                  <div class="col-6">
                    <div class="deck discard-deck" v-if="discardDeckList[index].length>0" >
                      <div class="icon-container">
                        <font-awesome-icon icon="fa-solid fa-cross" class="fa-3x" />
                      </div>
                      <p class="discard-deck-count deck-count">{{discardDeckList[index].length}} cartes</p>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="deck main-deck" @click="pickCard(player)">
                      <p class="main-deck-count deck-count">{{deckList[index].length}} cartes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6" v-if="player.currentRound!=null">
              <div class="card-area" v-if="player.currentRound.draw">
                <div class="deck main-deck" ></div>
              </div>
              <div class="card-area" v-else-if="player.currentRound.pickedCard!=null">
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
import CardComponent from "@/components/game/CardComponent.vue";

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
    },
    deckKey: {
      type: String,
      required: true
    },

  },
  data() {
    return {

    }
  },
  computed: {
    isPlayerList() {
      return this.playerList!=null && this.playerList.length > 0;
    },
    deckList() {
      let deckList = [];
      if(this.playerList!=null && this.playerList.length>=0){
        this.playerList.forEach(player => {
          let element = player.elementList.find(element => element.key === this.deckKey);
          if(element!=null){
            deckList.push(element.value);
          }
          else{
            deckList.push([]);
          }
        });
      }
      return deckList;
    },
    discardDeckList() {
      let deckList = [];
      if(this.playerList!=null && this.playerList.length>=0){
        this.playerList.forEach(player => {
          let element = player.discardElementList.find(element => element.key === this.deckKey);
          if(element && element.value){
            deckList.push(element.value);
          }
          else{
            deckList.push([]);
          }
        });
      }
      return deckList;
    },
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
  padding: 40px 10px 10px 10px;
  border-radius: 5px;
  height: 150px;
  width: 100px;
  border: 1px solid grey;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.main-deck{
  background-color: black;
}
.discard-deck{
  background-color: cornsilk;
}

.main-deck:hover{
  cursor: pointer;
}

.deck-count{
  margin-top: auto;
  font-size: 0.8rem;
  text-align: center;
}
.discard-deck-count{
  color: black;
}
.main-deck-count{
  color: white;
}
.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
}

</style>
