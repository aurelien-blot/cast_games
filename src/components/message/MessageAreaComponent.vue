<template>
  <div class="messenger-container" :class="{ 'is-collapsed': isCollapsed }">
    <div class="row hover" >
      <div class="col-8 offset-1" @click="toggleCollapse">{{connectedUser.username}}</div>
      <div class="col-1" @click="createNewConversation">
        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
      </div>
      <div class="col-1" @click="toggleCollapse">
        <font-awesome-icon v-if="isCollapsed" icon="fa-solid fa-chevron-up" />
        <font-awesome-icon v-else icon="fa-solid fa-chevron-down" />
      </div>
    </div>
    <div class="conversation-list" v-if="!isCollapsed">
      <div v-for="conversation in conversations" :key="conversation.id" class="conversation">
        {{ conversation.name }}
      </div>
    </div>
  </div>
</template>


<script>
import {mapGetters} from "vuex";
export default {
  name: 'MessageAreaComponent',
  props: {
  },
  data() {
    return {
      isCollapsed: true,
      conversations: [
        { id: 1, name: 'Jane Doe' },
        { id: 2, name: 'John Smith' }
      ]
    };
  },
  computed: {
    ...mapGetters("auth", ["isLoggedIn", "connectedUser" ]),
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    createNewConversation() {
      console.log('Creating new conversation...');
      // Logic to create a new conversation
    }
  },
  mounted() {
    console.log('MessageAreaComponent mounted');
  }
}

</script>

<style scoped>
.messenger-container {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 300px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  transition: all 0.3s;
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