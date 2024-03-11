<template>
  <LoadingComponent :is-loading="isLoading"></LoadingComponent>
  <BasicModalComponent
      title="Créer un compte"
      :on-close="onClose">
    <template v-slot:body>
      <Form novalidate @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="username" class="form-label">Nom d'utilisateur</label>
          <Field name="username" type="text" v-model="user.username"
                 class="form-control" label="Nom d'utilisateur"
                 id="username" rules="required|min:4|alpha_num" />
          <ErrorMessage name="username" class="text-danger" />
        </div>
        <div class="mb-3">
          <label for="firstName" class="form-label">Prénom</label>
          <Field name="firstName" type="text" class="form-control" v-model="user.firstName"
                 id="firstName" rules="min:2|alpha" label="Prénom"/>
          <ErrorMessage name="firstName" class="text-danger" />
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Nom</label>
          <Field name="lastName" type="text" class="form-control" v-model="user.lastName"
                 id="lastName" rules="min:2|alpha" label="Nom"/>
          <ErrorMessage name="lastName" class="text-danger" />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Adresse email</label>
          <Field name="email" type="email" class="form-control"  v-model="user.email"
                 id="email" rules="required|email" label="Adresse email"/>
          <ErrorMessage name="email" class="text-danger" />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe</label>
          <Field name="password" type="password" class="form-control" v-model="user.password"
                 id="password" rules="required|min:8" label="Mot de passe"/>
          <ErrorMessage name="password" class="text-danger" />
        </div>
      </Form>
    </template>
    <template v-slot:footer>
      <button type="button" class="btn btn-primary" :disabled="!canSubmit" @click="onSubmit()">S'inscrire</button>
    </template>
  </BasicModalComponent>
</template>

<script >
import BasicModalComponent from "@/components/modal/BasicModalComponent.vue";
import {Field, defineRule, ErrorMessage, Form, configure} from 'vee-validate';
import { required, email, min,alpha, alpha_num } from '@vee-validate/rules';
import UtilService from "@/services/utilService.js";
import LoadingComponent from "@/components/game/LoadingComponent.vue";
import UserApiService from "@/services/api/userApiService.js";
import ErrorService from "@/services/errorService.js";

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('alpha_num', alpha_num);
defineRule('alpha', alpha);

configure({
  generateMessage: (ctx) => {
    const messages = {
      required: `Le champ ${ctx.label} est requis.`,
      min: `Le champ ${ctx.label} doit comporter au moins ${ctx.rule.params[0]} caractères.`,
      email: `Le champ ${ctx.label} doit être une adresse email valide.`,
      alpha: `Le champ ${ctx.label} ne doit contenir que des lettres.`,
      alpha_num: `Le champ ${ctx.label} ne doit contenir que des lettres et des chiffres.`
    };
    return messages[ctx.rule.name] ? messages[ctx.rule.name] : `Le champ ${ctx.label} est invalide.`;
  },
  validateOnInput: true,
});
export default {
  name: 'SignInModalComponent',
  components: {LoadingComponent, Form, ErrorMessage, Field, BasicModalComponent},
  props: {
    onClose: {
      type: Function,
      required: true
    },
  },
  data() {
    return {
      isLoading: false,
      user: {
        username: 'test',
        firstName: 'azeae',
        lastName: 'etete',
        email: 'azeea@frz.fr',
        password: '12345678',
      }
    }
  },
  computed:{
    canSubmit() {
      return this.user.username !=null && this.user.username.length > 3
          && this.user.firstName !=null && this.user.firstName.length > 1
          && this.user.lastName !=null && this.user.lastName.length > 1
          && this.user.email !=null && this.user.email.length > 3 && UtilService.isEmail(this.user.email)
          && this.user.password !=null && this.user.password.length > 7;
    }
  },
  methods:{
    async onSubmit(){
      this.isLoading = true;
      let usernameAvailable;
      await UserApiService.checkUsernameAvailability(this.user.username).then((result) => {
        usernameAvailable =result;
        console.log(usernameAvailable);
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      }).finally(() => {
        this.isLoading = false;
      });

    }
  }
}

</script>

<style>

</style>