<template>
  <LoadingComponent :is-loading="isLoading"></LoadingComponent>
  <SignInModalComponent v-if="showSignInModal"
      :on-close="hideSignInModal"/>
  <SignUpModalComponent  v-if="showSignUpModal"
                         :on-close="hideSignUpModal"/>
  <div class="container">
    <header class="app-bar">
      <div class="row">
        <div class="col-6">
          <h1 class="app-title">Jeux</h1>
        </div>
        <div class="col-2" v-if="isLoggedIn">
          <div class="btn btn-danger" @click="doLogOut()" ></div>
        </div>
        <div class="col-2" v-if="!isLoggedIn">
          <div class="btn btn-success" @click="signIn()" >S'inscrire</div>
        </div>
        <div class="col-3" v-if="!isLoggedIn">
          <div class="btn btn-success" @click="signUp()" >Se connecter</div>
        </div>
      </div>
      <div class="row">
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
import LoadingComponent from "@/components/game/LoadingComponent.vue";
import {mapActions, mapGetters} from "vuex";
import SignUpModalComponent from "@/components/modal/login/SignUpModalComponent.vue";
import SignInModalComponent from "@/components/modal/login/SignInModalComponent.vue";
import BasicModalComponent from "@/components/modal/BasicModalComponent.vue";
import WarningModalComponent from "@/components/modal/WarningModalComponent.vue";
export default {
  name: 'Home',
  components: {
    WarningModalComponent,
    BasicModalComponent,
    SignInModalComponent,
    SignUpModalComponent,
    LoadingComponent,
    Game,
  },
  data() {
    return {
      gameList: [],
      mainPlayer :null,
      gameContent:null,
      isLoading: false,
      showSignUpModal: false,
      showSignInModal: false,
    }
  },
  computed: {
    ...mapGetters(['isTestMode']),
    ...mapGetters("auth", ["isLoggedIn", "connectedUser" ]),
  },
  methods: {
    ...mapActions('auth', ['logout']),
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
    async doLogOut(){
      this.isLoading = true;
      await this.logout();
      this.isLoading = false;
    },
    signIn(){
      this.showSignInModal = true;
    },
    signUp(){
      this.showSignUpModal = true;
    },
    hideSignUpModal(){
      this.showSignUpModal = false;
    },
    hideSignInModal(isUserRegistered){
      this.showSignInModal = false;
      if(isUserRegistered){
        this.showSignUpModal = true;
      }
    }
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
