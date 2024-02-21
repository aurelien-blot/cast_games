<template>
  <div class="row">
    <div class="col-2">
      <span>Liste des joueurs</span>
    </div>
    <div class="col-2 offset-5">
      <input class="input-group-sm" placeholder="Nom du joueur" v-model="newPlayerName"/>
    </div>
    <div class="col-2 offset-1">
      <button class="btn btn-secondary btn-sm" @click="addPlayer(newPlayerName)" :disabled="!canAddPlayer">Ajouter un joueur</button>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <div class="row mb-1" v-for="(player, index) in playerList" :key="index">
        <div class="col-2">
          <span>{{player.name}}</span>
        </div>
        <div class="col-2 offset-2">
          <button class="btn btn-danger btn-sm" @click="removePlayer(index)">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
  <div class="row mt-4" v-if="scoreLimit!=null">
    <div class="col-2">
      <span>Limite de score</span>
    </div>
    <div class="col-2 offset-1">
      <input class="input-group-sm" type="number"
             placeholder="Limite de score" v-model="scoreLimit.value"
             :disabled="!scoreLimit.editable"
             :min="scoreLimit.min" :max="scoreLimit.max"
      />
    </div>
  </div>
  <div class="row mt-4">
    <div class="col-12 text-center">
      <button class="btn btn-success btn-md" @click="startGame()" :disabled="!canStartGame">Commencer</button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {v4 as uuidv4} from "uuid";

export default {
  name: 'PrepareGame',
  components: {
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
    minPlayer: {
      type: Number,
      required: false
    },
    maxPlayer: {
      type: Number,
      required: false
    },
    onStartGame: {
      type: Function,
      required: true
    },
    scoreLimit: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      newPlayerName: null,
    }
  },
  computed: {
    ...mapGetters(['isTestMode']),
    canAddPlayer() {
      return this.maxPlayer==null || this.playerList.length < this.maxPlayer;
    },
    isEnoughPlayer() {
      return this.minPlayer == null || this.playerList.length >= this.minPlayer;
    },
    isCorrectScoreLimit() {
      return this.scoreLimit == null ||
          ((this.scoreLimit.min ==null || this.scoreLimit.value >= this.scoreLimit.min) && (this.scoreLimit.max == null || this.scoreLimit.value <= this.scoreLimit.max));
    },
    canStartGame() {
      return this.isEnoughPlayer && this.isCorrectScoreLimit;
    }
  },
  methods: {

    insertPlayers() {
      if (this.isTestMode) {
        if (this.gameContent.playerData.max == null || this.gameContent.playerData.max >= 2) {
          this.addPlayer('Jules');
        }
        if (this.gameContent.playerData.max == null || this.gameContent.playerData.max > 2) {
          this.addPlayer('Marcelle');
        }
      }
    },
    addPlayer(name) {
      if(name === null || name === '' || name === undefined) return;
      this.playerList.push({name: name, score: 0, id :uuidv4()});
      this.newPlayerName = null;
    },
    removePlayer(index) {
      this.playerList.splice(index, 1);
    },
    startGame() {
      this.onStartGame();
    }

  },
  mounted() {
    this.insertPlayers();
  }
}

</script>
