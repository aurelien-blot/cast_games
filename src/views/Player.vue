<template>
  <BasicViewComponent >
    <template v-slot:content>
      <ul class="nav nav-tabs">
        <li class="nav-item hover" v-for="(tab, index) in tabList" :key="index">
          <a class="nav-link" v-if="tab.name!==selectedTab.name"
             @click="selectTab(tab)">{{tab.name}}</a>
          <a class="nav-link active" v-if="tab.name===selectedTab.name" aria-current="page"
             @click="selectTab(tab)">{{tab.name}}</a>
        </li>
      </ul>
      <template v-if="selectedTab!=null">
        <div class="tab-content" :key="currentPlayerId">
          <PlayerProfileTabComponent v-if="selectedTab.technicalName==='profile'"
                                     :playerId="currentPlayerId"/>
          <PlayerSocialTabComponent v-else-if="selectedTab.technicalName==='social'"></PlayerSocialTabComponent>
          <PlayerStatsTabComponent v-else-if="selectedTab.technicalName==='stats'"></PlayerStatsTabComponent>
          <PlayerHistoryTabComponent v-else-if="selectedTab.technicalName==='history'"></PlayerHistoryTabComponent>
          <PlayerSettingsTabComponent v-else-if="selectedTab.technicalName==='settings'"></PlayerSettingsTabComponent>
        </div>
      </template>
    </template>
  </BasicViewComponent>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import BasicViewComponent from "@/components/BasicViewComponent.vue";
import PlayerProfileTabComponent from "@/components/playerTab/PlayerProfileTabComponent.vue";
import PlayerSocialTabComponent from "@/components/playerTab/PlayerSocialTabComponent.vue";
import PlayerStatsTabComponent from "@/components/playerTab/PlayerStatsTabComponent.vue";
import PlayerHistoryTabComponent from "@/components/playerTab/PlayerHistoryTabComponent.vue";
import PlayerSettingsTabComponent from "@/components/playerTab/PlayerSettingsTabComponent.vue";
import {markRaw} from "vue";
export default {
  name: 'Player',
  components: {
    BasicViewComponent,
    PlayerProfileTabComponent,
    PlayerSocialTabComponent,
    PlayerStatsTabComponent,
    PlayerHistoryTabComponent,
    PlayerSettingsTabComponent,
  },
  props: ['playerId'],
  data() {
    return {
      currentPlayerId: this.playerId,
      player: null,
      tabList :[],
      selectedTab: null,
      isPlayerConnectedPage: false,
    }
  },
  watch: {
    /*'$route'(to, from) {
      if(to.params.playerId !== from.params.playerId) {
        this.initPlayer(to.params.playerId);
      }
    },*/
    playerId(newVal) {
      this.currentPlayerId = newVal;
      this.initTabs();
    }
  },
  computed: {
    ...mapGetters(['isTestMode', "isLoading"]),
    ...mapGetters("auth", ["connectedUser"]),
  },
  methods: {
    /*initPlayer(playerId) {
      this.playerId = playerId;
      this.initTabs();
    },*/
    initTabs(){
      if(this.currentPlayerId === this.connectedUser.playerId.toString()) {
        this.isPlayerConnectedPage = true;
        this.tabList = [
          {name: "Profil", technicalName: "profile"},
          {name: "Social", technicalName: "social"},
          {name: "Statistiques", technicalName: "stats"},
          {name: "Historique", technicalName: "history"},
          {name: "Paramètres", technicalName: "settings"},
        ];
      }
      else{
        this.tabList = [
          {name: "Profil public", technicalName: "profile"},
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