<template>
  <BasicModalComponent
      title="Réinitialisation du mot de passe"
      :on-close="onClose">
    <template v-slot:body >
      <div class="alert alert-danger" v-if="errorMessage!=null">
        <span >{{errorMessage}}</span>
      </div>
      <Form novalidate @submit.prevent="onSubmit" v-if="mailSubmitted===false">
        <div class="mb-3">
          <label for="email" class="form-label">Adresse email</label>
          <Field name="email" type="email" class="form-control"  v-model="mail" :disabled="isConnectedUser"
                 id="email" rules="required|email" label="Adresse email"/>
          <ErrorMessage name="email" class="text-danger" />
        </div>
      </Form>
      <div v-if="mailSubmitted===true">
        <span>Un email vous a été envoyé pour réinitialiser votre mot de passe</span>
      </div>
    </template>
    <template v-slot:footer>
      <button v-if="mailSubmitted===false"
              type="button" class="btn btn-primary"
              :disabled="!canSubmit" @click="onSubmit()">Réinitialiser</button>
    </template>
  </BasicModalComponent>
</template>

<script >
import BasicModalComponent from "@/components/modal/BasicModalComponent.vue";
import {Field, defineRule, ErrorMessage, Form, configure} from 'vee-validate';
import {required, min, email} from '@vee-validate/rules';
import LoadingComponent from "@/components/game/LoadingComponent.vue";
import LoginApiService from "@/services/api/loginApiService.js";
import ErrorService from "@/services/errorService.js";
import {mapActions, mapGetters} from "vuex";
import UserApiService from "@/services/api/userApiService.js";
import UtilService from "@/services/utilService.js";

defineRule('required', required);
defineRule('email', email);

configure({
  generateMessage: (ctx) => {
    const messages = {
      required: `Le champ ${ctx.label} est requis.`,
      email: `Le champ ${ctx.label} doit être une adresse email valide.`,
    };
    return messages[ctx.rule.name] ? messages[ctx.rule.name] : `Le champ ${ctx.label} est invalide.`;
  },
  validateOnInput: true,
});
export default {
  name: 'PasswordResetModalComponent',
  components: {ErrorMessage, LoadingComponent, Form, Field, BasicModalComponent},
  props: {
    onClose: {
      type: Function,
      required: true
    },
    isConnectedUser: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      mail : null,
      errorMessage: null,
      mailSubmitted: false,
    }
  },
  computed: {
    ...mapGetters(['isTestMode']),
    ...mapGetters("auth", ["connectedUser"]),
    canSubmit() {
      return this.mail !=null && this.mail.length > 3 && UtilService.isEmail(this.mail);
    },
  },
  methods: {
    ...mapActions(['setLoading']),
    async onSubmit() {
      this.setLoading(true);
      this.mailSubmitted = true;
      let resetResponse = await this.sendResetPasswordMail({email : this.mail});
      this.setLoading(false);
      if(resetResponse.status!==true){
        this.errorMessage = resetResponse.message;
      }
    },
    sendResetPasswordMail(userMailObject) {
      return LoginApiService.sendResetPasswordMail(userMailObject);
    }
  },
  mounted() {
    if(this.isConnectedUser===true){
      this.mail = this.connectedUser.email;
    }
    if(this.isConnectedUser!==true && this.isTestMode) {
      this.mail="ch07@hotmail.fr"
    }
  }
}

</script>

<style>

</style>