<template>
  <LoadingComponent :is-loading="isLoading"></LoadingComponent>
  <div>
    <h1>Vérification de l'adresse mail</h1>

    <div v-if="confirmation != null && confirmation.status===true">
      <p>Ton adresse mail a bien été vérifiée.</p>
    </div>
    <div v-if="confirmation != null && confirmation.status!==true">
      <p>{{confirmation.message}}</p>
    </div>
  </div>
</template>

<script>
import LoadingComponent from "@/components/game/LoadingComponent.vue";
import LoginApiService from "@/services/api/loginApiService.js";
import ErrorService from "@/services/errorService.js";
export default {
  name: 'MailConfirmation',
  components: {
    LoadingComponent,
  },
  data() {
    return {
      isLoading: true,
      confirmation : null,
    }
  },
  methods: {
    async confirmMail() {
      let token = this.$route.query.token;
      await LoginApiService.confirmMail(token).then((response) => {
        console.log(response)
        this.confirmation = response;
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      this.isLoading = false;
    }
  },
  mounted() {
    this.confirmMail();
  }
}

</script>

<style>

</style>
