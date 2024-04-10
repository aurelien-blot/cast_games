<template>
  <add-friend-modal-component v-if="showAddFriendModal "
                              :on-close="hideAddFriendModal"
                              @update:isFriendAdded="value => isFriendAdded = value"/>
  <delete-modal-component  v-if="showDeleteContactModal"
                           :on-delete="deleteContact"
                           :title="'Suppression de contact'"
                           :on-close="hideDeleteContactModal">
    <template v-slot:modalContent>
      <span>Êtes-vous sûr de vouloir supprimer le contact {{contactToDelete.contactUsername}} ?</span>
    </template>
  </delete-modal-component>
  <div>
    <TabAreaComponent title="Demande(s) d'ami(s)" >
      <template v-slot:tab-area-content>
        <alert-message-component :alert="addFriendResponse"  @update:close="addFriendResponse = null"/>
        <alert-message-component :alert="rejectFriendResponse" @update:close="rejectFriendResponse = null"/>
        <template v-if="this.playerSocial==null ||  this.playerSocial.requestList ==null || this.playerSocial.requestList.length===0">
          <div class="col-12 mt-3">
            <span >Aucune demande d'ami</span>
          </div>
        </template>
        <template v-else>
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
      </template>
    </TabAreaComponent>
    <TabAreaComponent title="Amis">
      <template v-slot:tab-area-content>
        <alert-message-component :alert="blockContactResponse" @update:close="blockContactResponse = null"/>
        <alert-message-component :alert="deleteFriendResponse" @update:close="deleteFriendResponse = null"/>
        <div class="col-12 mt-3">
          <span class="bold">Ajouter un ami :</span>
          <button class="btn btn-sm btn-primary fa-pull-right" @click="openAddFriendModal">Ajouter</button>
        </div>
        <template v-if="this.playerSocial==null ||  this.playerSocial.friendList ==null || this.playerSocial.friendList.length===0">
          <div class="col-12 mt-3">
            <span >Vous n'avez pas encore d'amis</span>
          </div>
        </template>
        <template v-else>
          <div class="col-6 offset-3 mt-3">
            <table class="table table-striped">
            <tbody>
            <tr v-for="request in playerSocial.friendList">
              <td >{{request.contactUsername}}</td>
              <td >
                <div v-if="request.active===false"><span >En attente de confirmation</span></div>
                <span v-else><div class="btn btn-sm btn-danger fa-pull-right" @click="blockContact(request.id)">Bloquer</div></span>
              </td>
              <td >
                <div v-if="request.active===true" class="btn btn-sm btn-danger fa-pull-right" @click="openDeleteContactModal(request)">Supprimer</div>
              </td>
            </tr>
            </tbody>
          </table>
          </div>
        </template>
      </template>
    </TabAreaComponent>
    <TabAreaComponent title="Contacts bloqués">
      <template v-slot:tab-area-content>
        <alert-message-component :alert="unBlockContactResponse" @update:close="unBlockContactResponse = null"/>
        <alert-message-component :alert="deleteBlockedContactResponse" @update:close="deleteBlockedContactResponse = null"/>
        <template v-if="this.playerSocial==null ||  this.playerSocial.blockedList ==null || this.playerSocial.blockedList.length===0">
          <div class="col-12 mt-3">
            <span >Aucun contact bloqué</span>
          </div>
        </template>
        <template v-else>
          <div class="col-6 offset-3 mt-3">
            <table class="table table-striped">
              <tbody>
              <tr v-for="request in playerSocial.blockedList">
                <td >{{request.contactUsername}}</td>
                <td >
                  <div class="btn btn-sm btn-primary fa-pull-right" @click="unBlockContact(request.id)">Débloquer</div>
                </td>
                <td >
                  <div class="btn btn-sm btn-danger fa-pull-right" @click="openDeleteContactModal(request)">Supprimer</div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </template>
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
import ContactApiService from "@/services/api/contactApiService.js";
import AlertMessageComponent from "@/components/AlertMessageComponent.vue";
import DeleteModalComponent from "@/components/modal/DeleteModalComponent.vue";

export default {
  name: 'PlayerSocialTabComponent',
  components: {DeleteModalComponent, AlertMessageComponent, AddFriendModalComponent, TabAreaComponent},
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
      showDeleteContactModal: false,
      contactToDelete : null,
      isFriendAdded: false,
      addFriendResponse : null,
      rejectFriendResponse : null,
      blockContactResponse : null,
      unBlockContactResponse : null,
      deleteFriendResponse : null,
      deleteBlockedContactResponse : null,
    }
  },
  computed: {
    ...mapGetters(['isTestMode',]),
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
    async hideAddFriendModal(){
      if(this.isFriendAdded){
        await this.loadPlayerSocial();
        this.isFriendAdded = false;
      }
      this.showAddFriendModal = false;
      //loadPlayerSocial
    },
    async handleResponse(response){
      if(response.status){
        await this.loadPlayerSocial();
      }
      else{
        this.setLoading(false);
      }
    },
    resetResponseList(){
      this.addFriendResponse = null;
      this.rejectFriendResponse = null;
      this.blockContactResponse = null;
      this.unBlockContactResponse = null;
    },
    async acceptFriendRequest(requestId){
      this.setLoading(true);
      await ContactApiService.acceptContact(requestId).then((result) => {
        this.resetResponseList();
        this.addFriendResponse =result;
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      this.handleResponse(this.addFriendResponse);
    },
    async rejectFriendRequest(requestId){
      this.setLoading(true);
      await ContactApiService.rejectContact(requestId).then((result) => {
        this.resetResponseList();
        this.rejectFriendResponse =result;
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      this.handleResponse(this.rejectFriendResponse);
    },
    async blockContact(contactId){
      this.setLoading(true);
      await ContactApiService.blockContact(contactId).then((result) => {
        this.resetResponseList();
        this.blockContactResponse =result;
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      this.handleResponse(this.blockContactResponse);
    },
    async unBlockContact(contactId){
      this.setLoading(true);
      await ContactApiService.unblockContact(contactId).then((result) => {
        this.resetResponseList();
        this.unBlockContactResponse =result;
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      this.handleResponse(this.unBlockContactResponse);
    },
    openDeleteContactModal(contact){
      this.showDeleteContactModal = true;
      this.contactToDelete = contact;
    },
    hideDeleteContactModal(){
      this.showDeleteContactModal = false;
      this.contactToDelete = null;
    },
    async deleteContact() {
      this.setLoading(true);
      let isBlocked = this.contactToDelete.blocked;
      await ContactApiService.deleteContact(this.contactToDelete.id).then((result) => {
        this.resetResponseList();
        if(isBlocked){
          this.deleteBlockedContactResponse = result;
        }
        else{
          this.deleteFriendResponse = result;
        }
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      if(isBlocked){
        await this.handleResponse(this.deleteBlockedContactResponse);
      }
      else{
        await this.handleResponse(this.deleteFriendResponse);
      }
      this.hideDeleteContactModal();
    }

  },
  mounted() {
    this.loadPlayerSocial();
  }
}

</script>
<style scoped>

</style>