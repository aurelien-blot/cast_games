<template>
  <LoadingComponent :is-loading="isLoading"></LoadingComponent>
  <h1>Player Area</h1>
</template>

<script>
import LoadingComponent from "@/components/game/LoadingComponent.vue";
import {mapGetters} from "vuex";
export default {
  name: 'Player',
  components: {
    LoadingComponent,
  },
  data() {
    return {
      player: null,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['isTestMode'])
  },
  methods: {
    loadPlayer(){
      this.player = null;
    },
  },
  mounted() {
    this.loadPlayer();
  }
}

</script>

<style>
</style>
