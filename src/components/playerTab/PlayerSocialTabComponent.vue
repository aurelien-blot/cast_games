<template>
  <div>
    <h1>PlayerSocialTabComponent</h1>
  </div>
</template>
<script>

import {mapGetters} from "vuex";

export default {
  name: 'PlayerSocialTabComponent',
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