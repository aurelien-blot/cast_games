<template>
  <BasicModalComponent
      title="Créer un compte"
      :on-close="closeModal">
    <template v-slot:body >
      <div class="alert alert-danger" v-if="showAlertMessage">
        <span v-if="isMailAlreadyUsed">{{mailAvailabiltyStatus.message}}</span>
        <span v-if="isUsernameAlreadyUsed">{{usernameAvailabiltyStatus.message}}</span>
      </div>
      <div class="alert alert-success" v-if="isUserRegistered">
        <span >Le compte a bien été créé, vous allez être redirigé vers la fenêtre de connexion</span>
      </div>
      <Form novalidate @submit.prevent="onSubmit"  v-if="!isUserRegistered">
        <div class="mb-3">
          <label for="username" class="form-label">Nom d'utilisateur</label>
          <Field name="username" type="text" v-model="user.username"
                 class="form-control" label="Nom d'utilisateur"
                 :disabled="isUserRegistered"
                 id="username" rules="required|min:4|alpha_num" />
          <ErrorMessage name="username" class="text-danger" />
        </div>
        <div class="mb-3">
          <label for="firstName" class="form-label">Prénom</label>
          <Field name="firstName" type="text" class="form-control" v-model="user.firstName"
                 :disabled="isUserRegistered"
                 id="firstName" rules="min:2|alpha" label="Prénom"/>
          <ErrorMessage name="firstName" class="text-danger" />
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Nom</label>
          <Field name="lastName" type="text" class="form-control" v-model="user.lastName"
                 :disabled="isUserRegistered"
                 id="lastName" rules="min:2|alpha" label="Nom"/>
          <ErrorMessage name="lastName" class="text-danger" />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Adresse email</label>
          <Field name="email" type="email" class="form-control"  v-model="user.email"
                 :disabled="isUserRegistered"
                 id="email" rules="required|email" label="Adresse email"/>
          <ErrorMessage name="email" class="text-danger" />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Mot de passe</label>
          <Field name="password" type="password" class="form-control" v-model="user.password"
                 :disabled="isUserRegistered"
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
import LoadingComponent from "@/components/util/LoadingComponent.vue";
import LoginApiService from "@/services/api/loginApiService.js";
import ErrorService from "@/services/errorService.js";
import {mapActions} from "vuex";

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
      user: {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      },
      mailAvailabiltyStatus : null,
      usernameAvailabiltyStatus : null,
      isUserRegistered: false,
      secondsBeforeRedirect: 5,
    }
  },
  computed:{
    canSubmit() {
      return this.isUserRegistered!=true
          && this.user.username !=null && this.user.username.length > 3
          && this.user.firstName !=null && this.user.firstName.length > 1
          && this.user.lastName !=null && this.user.lastName.length > 1
          && this.user.email !=null && this.user.email.length > 3 && UtilService.isEmail(this.user.email)
          && this.user.password !=null && this.user.password.length > 7;
    },
    showAlertMessage(){
      return this.isMailAlreadyUsed || this.isUsernameAlreadyUsed;
    },
    isMailAlreadyUsed(){
      return this.mailAvailabiltyStatus!=null && this.mailAvailabiltyStatus.status===false;
    },
    isUsernameAlreadyUsed(){
      return this.usernameAvailabiltyStatus!=null && this.usernameAvailabiltyStatus.status===false;
    }
  },
  methods:{
    ...mapActions(['setLoading']),
    async onSubmit(){
      this.setLoading(true);
      this.mailAvailabiltyStatus=null;
      this.usernameAvailabiltyStatus=null;
      this.mailAvailabiltyStatus =await this.checkMailAvailability();
      if(this.isMailAlreadyUsed){
        this.setLoading(false);
        return;
      }
      this.usernameAvailabiltyStatus =await this.checkUsernameAvailability();
      if(this.isUsernameAlreadyUsed){
        this.setLoading(false);
        return;
      }
      await this.register();
      if(this.isUserRegistered){
        this.setLoading(false);
        await new Promise(r => setTimeout(r, this.secondsBeforeRedirect*1000));
        this.closeModal();
      }
      this.setLoading(false);
    },
    closeModal(){
      this.onClose(this.isUserRegistered);
    },
    async checkMailAvailability(){
      let mailAvailable =null;
      await LoginApiService.checkMailAvailability(this.user.email).then((result) => {
        mailAvailable =result;
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      return mailAvailable;
    },
    async checkUsernameAvailability(){
      let usernameAvailable =null;
      await LoginApiService.checkUsernameAvailability(this.user.username).then((result) => {
        usernameAvailable =result;
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      return usernameAvailable;
    },
    async register(){
      await LoginApiService.register(this.user).then((result) => {
        this.user =result;
        if(this.user.id!=null){
          this.isUserRegistered = true;
        }
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
    }
  }
}

</script>

<style>

</style>