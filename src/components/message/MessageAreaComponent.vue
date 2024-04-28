<template>
  <div class="messenger-container message-area" v-if="showConversationArea">
    <div class="row hover" >
      <div class="col-9 offset-1" >{{activeConversationName}}</div>
      <div class="col-1 " @click="closeConversation">
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </div>
    </div>
    <div class="row">
      <div class="col-10 offset-1">
        <div class="row" >
          <div class="col-12">
            <v-autocomplete
                v-model="activeConversation.members"
                label="Ajouter des membres à la conversation"
                clearable
                multiple
                variant="outlined"
                color="blue-grey-lighten-2"
                item-title="username"
                :item-value="item => item"
                chips
                closable-chips
                :items="playerContacts"
                clear-icon="fa fa-times-circle"
                :append-outer-icon="'fa fa-user-plus'"
            ></v-autocomplete>
          </div>
        </div>
        <div class="row" v-if="isNewConversation!==true">
          <div class="col-11 offset-1">
            <div class="message-list">
              <div class="message" v-for="message in activeConversation.messages" :key="message.id">
                {{ message.content }}
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-10">
            <textarea placeholder="Entrez votre message" v-model="newMessageContent"/>
          </div>
          <div class="col-1">
            <button class="btn btn-primary" @click="sendMessage" :disabled="!canSendMessage">
              <font-awesome-icon icon="fa-solid fa-paper-plane" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="messenger-container message-list-area" :class="{ 'is-collapsed': isListAreaCollapsed }">
    <div class="row hover" >
      <div class="col-8 offset-1" @click="toggleListAreaCollapse">{{connectedUser.username}}</div>
      <div class="col-1" @click="createNewConversation">
        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
      </div>
      <div class="col-1" @click="toggleListAreaCollapse">
        <font-awesome-icon v-if="isListAreaCollapsed" icon="fa-solid fa-chevron-up" />
        <font-awesome-icon v-else icon="fa-solid fa-chevron-down" />
      </div>
    </div>
    <div class="conversation-list" v-if="!isListAreaCollapsed">
      <div v-for="(conversation, index) in conversations" :key="conversation.id"
           class="conversation hover" @click="selectConversation(index)"
      >
        {{ conversation.name }}
      </div>
    </div>
  </div>
</template>


<script>
import {mapActions, mapGetters} from "vuex";
import ErrorService from "@/services/errorService.js";
import ContactApiService from "@/services/api/contactApiService.js";
import MessageApiService from "@/services/api/messageApiService.js";
import ConversationApiService from "@/services/api/conversationApiService.js";
import MessageExchangeService from "@/services/messages/messageExchangeService.js";
export default {
  name: 'MessageAreaComponent',
  props: {
  },
  data() {
    return {
      isListAreaCollapsed: false,
      activeConversation: null,
      conversations: [],
      playerContacts: [],
      newMessageContent: null,
    };
  },
  computed: {
    ...mapGetters("auth", ["isLoggedIn", "connectedUser" ]),
    ...mapGetters(['isTestMode']),
    showConversationArea() {
      return this.activeConversation !== null;
    },
    activeConversationName() {
      return this.activeConversation ? this.activeConversation.name : '';
    },
    isNewConversation() {
      return this.activeConversation && !this.activeConversation.id;
    },
    canSendMessage() {
      return this.activeConversation!=null && this.activeConversation.members!=null &&
          this.activeConversation.members.length > 0 &&
          this.newMessageContent!=null && this.newMessageContent.length > 0;
    }
  },
  methods: {
    ...mapActions(["setLoading"]),
    async getContactList() {
        await this.setLoading(true);
        await ContactApiService.getActiveContacts(this.playerId).then((result) => {
          this.playerContacts =result;
        }).catch((error) => {
          ErrorService.showErrorInAlert(error);
        });
        await this.setLoading(false);
    },
    toggleListAreaCollapse() {
      this.isListAreaCollapsed = !this.isListAreaCollapsed;
    },
    async createNewConversation() {
      await this.getContactList();
      this.activeConversation={
        id: null,
        name : 'Nouvelle conversation',
        members :[],
        messages: []
      }
    },
    closeConversation() {
      this.activeConversation = null;
    },
    async sendMessage(){
      if(this.canSendMessage){
        await this.setLoading(true);
        let conversation = this.formatConversation();
        await MessageApiService.requestMessageSending(conversation).catch((error) => {
          ErrorService.showErrorInAlert(error);
        });
        this.resetNewMessage();
        await this.setLoading(false);
      }
    },
    formatConversation(){
      if(this.isNewConversation){
        return {
          conversationId: null,
          members : this.activeConversation.members,
          content: this.newMessageContent
        }
      }
      return {
        conversationId: this.activeConversation.id,
        content: this.newMessageContent
      }
    },
    resetNewMessage(){
      this.newMessageContent = null;
    },
    async connectToMessageExchangeService(){
      MessageExchangeService.connect(this.prepareConversationList);
    },
    prepareConversationList(data){
      this.conversations = data;
      console.log('conversations', this.conversations);
    },
    selectConversation(index){
      this.activeConversation = this.conversations[index];
    },
    /*async updatePlayerConversationList(){
      await this.setLoading(true);
      await ConversationApiService.requestConversationList().catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      await this.setLoading(false);
    },*/
  },
  async mounted() {
    await this.connectToMessageExchangeService();
    if(this.isTestMode){
      await this.createNewConversation();
      this.activeConversation.members.push(this.playerContacts[1]);
      this.activeConversation.members.push(this.playerContacts[2]);
      this.newMessageContent = 'Test message group';
    }
  },
  beforeDestroy() {
    MessageExchangeService.close();
  },
}

</script>

<style scoped>
.messenger-container {
  position: fixed;
  bottom: 0;
  width: 300px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.message-list-area {
  right: 0;
}
.message-area {
  min-height: 300px;
  right: 302px;
}

.messenger-container.is-collapsed {
  height: 40px;
  overflow: hidden;
}

.conversation-list {
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.conversation {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

button {
  all: unset;
  cursor: pointer;
  padding: 10px;
  text-align: center;
  background-color: #0073b1;
  color: white;
  border-radius: 5px;
  margin: 5px;
}
</style>