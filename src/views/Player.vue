<template>
  <BasicViewComponent >
    <template v-slot:content>
      <ul class="nav nav-tabs">
        <li class="nav-item" v-for="(tab, index) in tabList" :key="index">
          <a class="nav-link" v-if="tab.name!==selectedTab.name"
             @click="selectTab(tab)">{{tab.name}}</a>
          <a class="nav-link active" v-if="tab.name===selectedTab.name" aria-current="page"
             @click="selectTab(tab)">{{tab.name}}</a>
        </li>
      </ul>
    </template>
  </BasicViewComponent>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import BasicViewComponent from "@/components/BasicViewComponent.vue";
export default {
  name: 'Player',
  components: {
    BasicViewComponent
  },
  props: ['playerId'],
  data() {
    return {
      player: null,
      tabList :[],
      selectedTab: null,
      isPlayerConnectedPage: false,
    }
  },
  computed: {
    ...mapGetters(['isTestMode', "isLoading"]),
    ...mapGetters("auth", ["connectedUser"]),
  },
  methods: {
    initTabs(){
      if(this.playerId === this.connectedUser.playerId.toString()) {
        this.isPlayerConnectedPage = true;
        this.tabList = [
          {name: "Profil", component: "PlayerProfile"},
          {name: "Statistiques", component: "PlayerStats"},
          {name: "Historique", component: "PlayerHistory"},
          {name: "Paramètres", component: "PlayerSettings"},
        ];
      }
      else{
        this.tabList = [
          {name: "Profil public", component: "PlayerProfile"},
        ];
      }
      this.selectedTab = this.tabList[0];
    },
    selectTab(tab){
      this.selectedTab = tab;
    }
  },
  mounted() {
    this.initTabs();
  }
}

</script>

<style>
</style>