<template>
  <div>
    <h1>PlayerHistoryTabComponent</h1>
  </div>
</template>
<script>

import {mapGetters} from "vuex";

export default {
  name: 'PlayerHistoryTabComponent',
  props: ['playerId'],
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['isTestMode', "isLoading"]),
    ...mapGetters("auth", ["connectedUser"]),
  },
  methods: {

  },
  mounted() {
  }
}

</script>
<style scoped>

</style>