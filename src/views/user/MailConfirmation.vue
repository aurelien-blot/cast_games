<template>
  <LoadingComponent/>
  <div class="container">
    <div>
      <h1>Vérification de l'adresse mail</h1>

      <div v-if="confirmation != null && confirmation.status===true">
        <p>Ton adresse mail a bien été vérifiée.</p>
      </div>
      <div v-if="confirmation != null && confirmation.status!==true">
        <p>{{confirmation.message}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingComponent from "@/components/util/LoadingComponent.vue";
import LoginApiService from "@/services/api/loginApiService.js";
import ErrorService from "@/services/errorService.js";
import {mapActions} from "vuex";
export default {
  name: 'MailConfirmation',
  components: {
    LoadingComponent,
  },
  data() {
    return {
      confirmation : null,
    }
  },
  methods: {
    ...mapActions(['setLoading']),
    async confirmMail() {
      let token = this.$route.query.token;
      await LoginApiService.confirmMail(token).then((response) => {
        this.confirmation = response;
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      this.setLoading(false);
    }
  },
  mounted() {
    this.confirmMail();
  }
}

</script>

<style>

</style>
