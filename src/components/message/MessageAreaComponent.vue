<template>
  <conversation-component :active-conversation="activeConversation"
                          :close-conversation="closeConversation"
                          :player-contacts="playerContacts"
      ref="conversationComponent"/>

  <conversation-list-component :create-conversation="createConversation"
                               :select-conversation="selectConversation"
                               :conversations="conversations"/>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ErrorService from "@/services/errorService.js";
import ContactApiService from "@/services/api/contactApiService.js";
import MessageApiService from "@/services/api/messageApiService.js";
import ConversationApiService from "@/services/api/conversationApiService.js";
import MessageExchangeService from "@/services/messages/messageExchangeService.js";
import ConversationListComponent from "@/components/message/ConversationListComponent.vue";
import ConversationComponent from "@/components/message/ConversationComponent.vue";
export default {
  name: 'MessageAreaComponent',
  components: {ConversationComponent, ConversationListComponent},
  data() {
    return {
      isListAreaCollapsed: false,
      activeConversation: null,
      conversations: [],
      playerContacts: [],
    };
  },
  computed: {
    ...mapGetters(['isTestMode']),
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
    async createConversation() {
      await this.getContactList();
      this.activeConversation={
        id: null,
        name : 'Nouvelle conversation',
        members :[],
        messages: []
      }
    },
    async connectToMessageExchangeService(){
      MessageExchangeService.connect(this.prepareConversationList, this.updateConversation);
    },
    closeConversation() {
      this.activeConversation = null;
    },
    prepareConversationList(conversationList){
      this.conversations = conversationList;
    },
    updateConversation(conversation){
      this.setLoading(true);
      let index = null;
      for(let i=0; i<this.conversations.length; i++){
        if(this.conversations[i].id === conversation.id){
          if(this.activeConversation && this.activeConversation.id === conversation.id){
            this.activeConversation = conversation;
            this.scrollToBottom();
          }
          index = i;
          break;
        }
      }
      if(index!==null){
        this.conversations[index] = conversation;
      }else{
        this.conversations.push(conversation);
      }
      this.setLoading(false);
    },
    selectConversation(index){
      this.activeConversation = this.conversations[index];
      this.scrollToBottom();
    },
    scrollToBottom() {
      this.$refs.conversationComponent.scrollToBottom();
    },
  },
  async mounted() {
    await this.connectToMessageExchangeService();
    if(this.isTestMode){
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

</style>