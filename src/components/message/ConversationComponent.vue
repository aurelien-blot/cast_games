<template>
  <div class="messenger-container message-area" v-if="activeConversation!=null">
    <div class="row hover" >
      <div class="col-9 offset-1" >{{activeConversationName}}</div>
      <div class="col-1 " @click="closeConversation">
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </div>
    </div>
    <div class="row">
      <div class="col-10 offset-1">
        <div class="row" >
          <div class="col-12" v-if="isNewConversation===true">
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
            <div class="message-list" ref="scrollContainer">
              <div class="message "  v-for="message in activeConversation.messages" :key="message.id" >
                <span :class="message.authorId===connectedUser.playerId ? 'user-message' : 'tierce-message'">{{ message.content }}</span>
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
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ErrorService from "@/services/errorService.js";
import ContactApiService from "@/services/api/contactApiService.js";
import MessageApiService from "@/services/api/messageApiService.js";
import ConversationApiService from "@/services/api/conversationApiService.js";
import MessageExchangeService from "@/services/messages/messageExchangeService.js";
import ConversationListComponent from "@/components/message/ConversationListComponent.vue";
export default {
  name: 'ConversationComponent',
  components: {},
  props: {
    activeConversation: {
      type: Object,
      required: false,
      default: () => null
    },
    closeConversation: {
      type: Function,
      required: true
    },
    playerContacts: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      newMessageContent: null,
    };
  },
  computed: {
    ...mapGetters("auth", ["connectedUser" ]),
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
    scrollToBottom() {
      this.$nextTick(() => {
        const element = this.$refs.scrollContainer;
        if (element) {
          element.scrollTop = element.scrollHeight;
        }
      });
    },
  },
}

</script>

<style scoped>


.message-area {
  min-height: 300px;
  right: 302px;
}

.message-list{
  max-height: 200px;
  overflow-y: scroll;
}

.user-message{
  background-color: #0073b1;
  color: white;
  border-radius: 5px;
}

.tierce-message{
  background-color: forestgreen;
  color: white;
  border-radius: 5px;
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