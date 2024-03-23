<template>
  <header class="app-bar">
    <div class="row">
      <div class="col-6">
        <h1 class="app-title">Jeux</h1>
      </div>
      <template v-if="isLoggedIn">
        <div class="col-2 offset-2">
          <div class="btn btn-success" @click="goToMyAccount()">Mon compte</div>
        </div>
        <div class="col-2" >
          <div class="btn btn-danger" @click="logout()" ><font-awesome-icon icon="fa-solid fa-right-from-bracket" /></div>
        </div>
      </template>
      <template v-if="!isLoggedIn">
        <div class="col-2 offset-2">
          <div class="btn btn-success" @click="signIn()" >S'inscrire</div>
        </div>
        <div class="col-2">
          <div class="btn btn-success" @click="signUp()" >Se connecter</div>
        </div>
      </template>
    </div>
    <div class="row">
      <div class="col-2 mt-2" v-for="(game, index) in gameList" :key="index">
        <span class="btn btn-secondary" @click="goToGame(game)">{{game.name}}</span>
      </div>
    </div>
  </header>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  name: 'AppBarComponent',
  props: {
    gameList: {
      type: Array,
      required: true
    },
    signIn : {
      type: Function,
      required: true
    },
    signUp : {
      type: Function,
      required: true
    },
    logout : {
      type: Function,
      required: true
    }
  },
  computed: {
    ...mapGetters("auth", ["isLoggedIn", "connectedUser" ]),
  },
  methods: {
    goToMyAccount() {
      this.$router.push({name: 'Player', params: {playerId: this.connectedUser.playerId}});
    },
    goToGame(game) {
      this.$router.push({name: 'Game', params: {gameId: game.id}});
    }

  }
}

</script>

<style scoped>

</style>