<template>
  <div class="messenger-container conversation-list-area" :class="{ 'is-collapsed': isListAreaCollapsed }">
    <div class="row hover" >
      <div class="col-8 offset-1" @click="toggleListAreaCollapse">{{connectedUser.username}}</div>
      <div class="col-1" @click="createConversation">
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
import {mapGetters} from "vuex";
export default {
  name: 'ConversationListComponent',
  props: {
    conversations: {
      type: Array,
      required: true,
      default: () => []
    },
    selectConversation : {
      type: Function,
      required: true
    },
    createConversation : {
      type: Function,
      required: true
    }

  },
  data() {
    return {
      isListAreaCollapsed: false,
    };
  },
  computed: {
    ...mapGetters("auth", ["connectedUser" ]),
  },
  methods: {
    toggleListAreaCollapse() {
      this.isListAreaCollapsed = !this.isListAreaCollapsed;
    },
  },
}

</script>

<style scoped>

.conversation-list-area {
  right: 0;
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
/*
button {
  all: unset;
  cursor: pointer;
  padding: 10px;
  text-align: center;
  background-color: #0073b1;
  color: white;
  border-radius: 5px;
  margin: 5px;
}*/
</style>