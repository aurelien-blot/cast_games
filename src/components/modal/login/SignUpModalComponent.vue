<template>
  <LoadingComponent :is-loading="isLoading"></LoadingComponent>
  <BasicModalComponent
      title="Connexion"
      :on-close="onClose">
    <template v-slot:body >
      <div class="alert alert-danger" v-if="errorMessage!=null">
        <span >{{errorMessage}}</span>
      </div>
      <Form novalidate @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="username" class="form-label">Nom d'utilisateur ou Email</label>
          <Field name="username" type="text" v-model="user.identifier"
                 class="form-control" label="Nom d'utilisateur ou Email"
                 id="username" rules="required|min:4" />
          <ErrorMessage name="username" class="text-danger" />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe</label>
          <Field name="password" type="password" class="form-control" v-model="user.password"
                 id="password" rules="required|min:8" label="Mot de passe"/>
          <ErrorMessage name="password" class="text-danger" />
        </div>
        <div class="small">
          <p><span><a href="#" @click="redirectToResetPassword">Mot de passe oublié ?</a></span></p>
          <p><span>Vous n'avez pas encore de compte ? <a href="#" @click="redirectToSignIn">Inscrivez-vous</a></span></p>
        </div>
      </Form>
    </template>
    <template v-slot:footer>
      <button type="button" class="btn btn-primary" :disabled="!canSubmit" @click="onSubmit()">Se connecter</button>
    </template>
  </BasicModalComponent>
</template>

<script >
import BasicModalComponent from "@/components/modal/BasicModalComponent.vue";
import {Field, defineRule, ErrorMessage, Form, configure} from 'vee-validate';
import { required, min } from '@vee-validate/rules';
import LoadingComponent from "@/components/game/LoadingComponent.vue";
import LoginApiService from "@/services/api/loginApiService.js";
import ErrorService from "@/services/errorService.js";
import {mapActions, mapGetters} from "vuex";
import UserApiService from "@/services/api/userApiService.js";

defineRule('required', required);
defineRule('min', min);

configure({
  generateMessage: (ctx) => {
    const messages = {
      required: `Le champ ${ctx.label} est requis.`,
      min: `Le champ ${ctx.label} doit comporter au moins ${ctx.rule.params[0]} caractères.`,
    };
    return messages[ctx.rule.name] ? messages[ctx.rule.name] : `Le champ ${ctx.label} est invalide.`;
  },
  validateOnInput: true,
});
export default {
  name: 'SignUpModalComponent',
  components: {LoadingComponent, Form, ErrorMessage, Field, BasicModalComponent},
  props: {
    onClose: {
      type: Function,
      required: true
    },
    redirectToSignIn: {
      type: Function,
      required: true
    },
    redirectToResetPassword: {
      type: Function,
      required: true
    },
  },
  data() {
    return {
      isLoading: false,
      user:{
        identifier: '',
        password: '',
      },
      errorMessage: null,
    }
  },
  computed: {
    ...mapGetters(['isTestMode']),
    canSubmit() {
      return this.user.identifier != null && this.user.identifier.length > 3
          && this.user.password != null && this.user.password.length > 7;
    },
  },
  methods: {
    ...mapActions('auth', ['login']),
    async onSubmit() {
      this.isLoading = true;
      let loginResponse = await this.login(this.user);
      this.isLoading = false;
      if(loginResponse.success===true){

        this.onClose();
      }
      else{
        this.errorMessage = loginResponse.message;
      }

    },
  },
  mounted() {
    if(this.isTestMode) {
      this.user = {
        identifier: 'Coco',
        password: '12345678',
      }
    }
  }
}

</script>

<style>

</style>