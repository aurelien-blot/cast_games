<template>
  <add-friend-modal-component :on-close="hideAddFriendModal" v-if="showAddFriendModal"/>
  <div>
    <TabAreaComponent title="Demande(s) d'ami(s)" v-if="showFriendRequestArea===true">
      <template v-slot:tab-area-content>
        <div class="col-6 offset-3 mt-3">
          <table class="table table-striped">
            <tbody>
              <tr v-for="request in playerSocial.requestList">
                <td >{{request.playerUsername}}</td>
                <td><div class="btn btn-sm btn-primary fa-pull-right" @click="acceptFriendRequest(request.id)">Accepter</div></td>
                <td><div class="btn btn-sm btn-danger fa-pull-right" @click="rejectFriendRequest(request.id)">Refuser</div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </TabAreaComponent>
    <TabAreaComponent title="Amis">
      <template v-slot:tab-area-content>
        <div class="col-12 mt-3">
          <span class="bold">Ajouter un ami :</span>
          <button class="btn btn-sm btn-primary fa-pull-right" @click="openAddFriendModal">Ajouter</button>
        </div>
        <div class="col-6 offset-3 mt-3" v-if="this.playerSocial!=null">
          <table class="table table-striped">
            <tbody>
            <tr v-for="request in playerSocial.friendList">
              <td >{{request.contactUsername}}</td>
              <td >
                <div v-if="request.active===false"><span >En attente de confirmation</span></div>
                <span v-else><div class="btn btn-sm btn-danger fa-pull-right" @click="blockContact(request.id)">Bloquer</div></span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </template>
    </TabAreaComponent>
    <TabAreaComponent title="Contacts bloqués">
      <template v-slot:tab-area-content>
        <div><span class="bold">Test : </span><span></span></div>
        <div class="col-6 offset-3 mt-3" v-if="this.playerSocial!=null">
          <table class="table table-striped">
            <tbody>
            <tr v-for="request in playerSocial.blockedList">
              <td >{{request.contactUsername}}</td>
              <td >
                <div class="btn btn-sm btn-primary fa-pull-right" @click="unBlockContact(request.id)">Débloquer</div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </template>
    </TabAreaComponent>
  </div>
</template>
<script>

import {mapActions, mapGetters} from "vuex";
import TabAreaComponent from "@/components/TabAreaComponent.vue";
import ErrorService from "@/services/errorService.js";
import AddFriendModalComponent from "@/components/modal/player/AddFriendModalComponent.vue";
import PlayerApiService from "@/services/api/playerApiService.js";

export default {
  name: 'PlayerSocialTabComponent',
  components: {AddFriendModalComponent, TabAreaComponent},
  props: {
    playerId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      playerSocial: null,
      showAddFriendModal: false,
    }
  },
  computed: {
    ...mapGetters(['isTestMode',]),
    showFriendRequestArea() {
      return this.playerSocial!=null && this.playerSocial.requestList!=null && this.playerSocial.requestList.length>0;
    },
    showFriendArea() {
      return this.playerSocial!=null && this.playerSocial.requestList!=null && this.playerSocial.requestList.length>0;
    }
  },
  methods: {
    ...mapActions(['setLoading']),
    async loadPlayerSocial() {
      await this.setLoading(true);
      await PlayerApiService.getSocial(this.playerId).then((result) => {
        this.playerSocial = result;
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      await this.setLoading(false);
    },
    openAddFriendModal(){
      this.showAddFriendModal = true;
    },
    hideAddFriendModal(){
      this.showAddFriendModal = false;
    },
    acceptFriendRequest(requestId){
      console.log("Accept request : "+requestId);
    },
    rejectFriendRequest(requestId){
      console.log("Reject request : "+requestId);
    },
    blockContact(contactId){
      console.log("Block contact : "+contactId);
    },
    unBlockContact(contactId){
      console.log("Unblock contact : "+contactId);
    }

  },
  mounted() {
    this.loadPlayerSocial();
  }
}

</script>
<style scoped>

</style>