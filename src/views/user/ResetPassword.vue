<template>
  <LoadingComponent/>
  <div class="container">
    <div>
      <h1 class="text-center mb-4">Réinitialisation du mot de passe</h1>
      <div class="row ">
        <div >
          <div v-if="passwordReset!=null && passwordReset.status===true" class="alert alert-success col-6 offset-3">
            <p>Votre mot de passe a bien été réinitialisé.</p>
            <p>Vous allez être redigiré vers la page d'accueil.</p>
          </div>
          <template v-if="passwordReset!=null && passwordReset.status===false">
            <div class="alert alert-danger col-6 offset-3">
              <p>Une erreur a été rencontrée : {{passwordReset.message}}</p>
              <p>Si cette erreur se répète, contactez l'administrateur.</p>
            </div>
            <div class="col-12 text-center">
              <button type="submit" class="btn btn-primary" @click="refresh()">Réessayer</button>
            </div>
          </template>
          <template v-if="passwordReset==null">
            <Form novalidate @submit.prevent="onSubmit" v-if="!passwordReset" class="col-6 offset-3">
              <div class="mb-3">
                <label for="password1" class="form-label">Mot de passe</label>
                <Field name="password1" type="password" class="form-control" v-model="password1"
                       id="password1" rules="required|min:8" label="Mot de passe"/>
                <ErrorMessage name="password1" class="text-danger" />
              </div>
              <div class="mb-3">
                <label for="password2" class="form-label">Confirmer mot de passe</label>
                <Field name="password2" type="password" class="form-control" v-model="password2"
                       id="password2" rules="required|min:8|confirmed:@password1" label="Confirmer mot de passe"/>
                <ErrorMessage name="password2" class="text-danger" />
              </div>
            </Form>
            <div class="col-12 text-center">
              <button type="submit" class="btn btn-primary" :disabled="!canSubmit" @click="onSubmit()">Réinitialiser</button>
            </div>
          </template>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
import LoadingComponent from "@/components/util/LoadingComponent.vue";
import LoginApiService from "@/services/api/loginApiService.js";
import {Field, defineRule, ErrorMessage, Form, configure} from 'vee-validate';
import { required, min,confirmed } from '@vee-validate/rules';
import ErrorService from "@/services/errorService.js";
import {mapActions, mapGetters} from "vuex";

defineRule('required', required);
defineRule('min', min);
defineRule('confirmed', confirmed);

configure({
  generateMessage: (ctx) => {
    const messages = {
      required: `Le champ ${ctx.label} est requis.`,
      confirmed: `Les mots de passe ne correspondent pas.`,
      min: `Le champ ${ctx.label} doit comporter au moins ${ctx.rule.params[0]} caractères.`
    };
    return messages[ctx.rule.name] ? messages[ctx.rule.name] : `Le champ ${ctx.label} est invalide.`;
  },
  validateOnInput: true,
});
export default {
  name: 'ResetPassword',
  components: {
    LoadingComponent,Form, ErrorMessage, Field,
  },
  data() {
    return {
      passwordReset : null,
      password1:null,
      password2:null,
      delayAftorReset: 5,
    }
  },
  computed:{
    ...mapGetters(['isTestMode']),
    canSubmit() {
      return this.password1 !=null && this.password1.length > 7
          && this.password2 !=null && this.password2.length > 7
          && this.password1 === this.password2;
    }
  },
  methods: {
    ...mapActions(['setLoading']),
    async onSubmit() {
      this.setLoading(true);
      let token = this.$route.query.token;
      let request = {
        token: token,
        password: this.password1,
      };
      await LoginApiService.resetPassword(request).then((response) => {
        this.passwordReset = response;
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      if(this.passwordReset.status===true){
        setTimeout(() => {
          this.$router.push({name: 'Home'});
        }, this.delayAftorReset * 1000);
      }
      this.setLoading(false);
    },
    refresh(){
      this.passwordReset = null;
    }
  },
  mounted() {
    if(this.isTestMode){
      this.password1 = "password";
      this.password2 = "password";
    }
  }
}

</script>

<style>

</style>
