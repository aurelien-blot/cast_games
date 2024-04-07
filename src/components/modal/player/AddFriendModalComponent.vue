<template>
  <BasicModalComponent
      title="Ajouter un ami"
      :on-close="onClose">
    <template v-slot:body >
      <template v-if="addResponse!==null">
        <div class="alert alert-danger" v-if="addResponse.status!==true">
          <span >{{addResponse.message}}</span>
        </div>
        <div class="alert alert-success" v-else>
          <span >{{addResponse.message}}</span>
        </div>
      </template>
      <template v-if="addResponse===null || addResponse.status!==true">
        <div class="mb-3" v-if="playerSelected===null">
          <label for="playerName" class="form-label">Nom du joueur</label>
          <input class="form-control" list="players-list" id="optionListSelect" placeholder="Entre le pseudo de ton contact" v-model="playerName">
          <datalist id="players-list">
            <option v-for="player in optionList" :value="player.username" :key="player.id"></option>
          </datalist>
        </div>
        <div class="mb-3" v-if="playerSelected!==null">
          <div class="alert alert-info" role="alert">
            <span >{{playerSelected.username}}</span>
            <span class="fa-pull-right"><button type="button" class="btn btn-close btn-info" @click="clearSelectedPlayer()"></button></span>
          </div>
        </div>
      </template>
    </template>
    <template v-slot:footer>
      <button v-if="addResponse===null || addResponse.status!==true"
              type="button" class="btn btn-primary"
              :disabled="!canSubmit" @click="onSubmit()">Ajouter</button>
    </template>
  </BasicModalComponent>
</template>

<script >
import BasicModalComponent from "@/components/modal/BasicModalComponent.vue";
import LoadingComponent from "@/components/game/LoadingComponent.vue";
import {mapActions, mapGetters} from "vuex";
import ErrorService from "@/services/errorService.js";
import ContactApiService from "@/services/api/contactApiService.js";

export default {
  name: 'AddFriendModalComponent',
  components: {LoadingComponent, BasicModalComponent},
  props: {
    onClose: {
      type: Function,
      required: true
    },
  },
  data() {
    return {
      playerName : null,
      playerSelected : null,
      optionList: [],
      addResponse: null,
      searchTimeout: null,
    }
  },
  watch: {
    playerName(value, oldValue) {
      if(value !== oldValue && value!=null && value.length>3){
        this.searchPlayerDebounced();
      }
    },
  },
  computed: {
    canSubmit() {
      return this.playerSelected !=null;
    },
  },
  methods: {
    ...mapActions(['setLoading']),
    async searchPlayer(){
      await ContactApiService.searchNewContact(this.playerName).then((response) => {
        this.optionList = response;
        console.log(this.optionList)
        if(response.length===1){
          this.playerSelected = response[0];
        }
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
    },
    async onSubmit() {
      this.setLoading(true);
      this.addResponse = null;
      await ContactApiService.requestFriend(this.playerSelected.id).then((response) => {
        this.addResponse = response;
        this.setLoading(false);
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
    },
    searchPlayerDebounced() {
      this.optionList = [];
      this.playerSelected = null;
      clearTimeout(this.searchTimeout); // Annule le délai précédent
      this.searchTimeout = setTimeout(() => {
        this.searchPlayer();
      }, 500); // Attend 500ms après la dernière frappe de touche
    },
    clearSelectedPlayer(){
      this.playerSelected = null;
      this.optionList = [];
      this.playerName = null;
    }
  },
  mounted() {
  }
}

</script>

<style>

</style>