<template>
  <BasicModalComponent
      title="Modification de l'adresse mail"
      :can-close="canClose"
      :on-close="onClose">
    <template v-slot:body >
      <template v-if="updateResponse!==null">
        <div class="alert alert-danger" v-if="updateResponse.status!==true">
          <span >{{updateResponse.message}}</span>
        </div>
        <div class="alert alert-success" v-else>
          <span >{{updateResponse.message}}</span>
          <p class="small">Cette fenêtre va se fermer automatiquement.</p>
        </div>
      </template>

      <Form novalidate @submit.prevent="onSubmit" v-if="updateResponse===null || updateResponse.status!==true">
        <div class="mb-3">
          <label for="email" class="form-label">Nouvelle adresse email</label>
          <Field name="email" type="email" class="form-control"  v-model="userNewMail"
                 id="email" rules="required|email" label="Nouvelle adresse email"/>
          <ErrorMessage name="email" class="text-danger" />
        </div>
        <div class="mb-3">
          <label for="password1" class="form-label">Mot de passe</label>
          <Field name="password1" type="password" class="form-control"  v-model="userPassword"
                 id="password1" rules="required" label="Mot de passe"/>
          <ErrorMessage name="password1" class="text-danger" />
        </div>
      </Form>
    </template>
    <template v-slot:footer>
      <button v-if="updateResponse===null || updateResponse.status!==true"
              type="button" class="btn btn-primary"
              :disabled="!canSubmit || !canClose" @click="onSubmit()">Réinitialiser</button>
    </template>
  </BasicModalComponent>
</template>

<script >
import BasicModalComponent from "@/components/modal/BasicModalComponent.vue";
import {Field, defineRule, ErrorMessage, Form, configure} from 'vee-validate';
import {required, email} from '@vee-validate/rules';
import LoadingComponent from "@/components/game/LoadingComponent.vue";
import {mapActions, mapGetters} from "vuex";
import ErrorService from "@/services/errorService.js";
import UserApiService from "@/services/api/userApiService.js";
import UtilService from "@/services/utilService.js";

defineRule('required', required);

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
  name: 'MailUpdateModalComponent',
  components: {ErrorMessage, LoadingComponent, Form, Field, BasicModalComponent},
  props: {
    onClose: {
      type: Function,
      required: true
    },
  },
  data() {
    return {
      userPassword : null,
      userNewMail : null,
      updateResponse: null,
      delayBeforeClose: 7,
      canClose: true,
    }
  },
  computed: {
    canSubmit() {
      return this.userPassword !=null && this.userNewMail !=null && this.userNewMail.length > 3 && UtilService.isEmail(this.userNewMail);
    },
  },
  methods: {
    ...mapActions(['setLoading']),
    ...mapActions('auth', ['logout']),
    async onSubmit() {
      this.setLoading(true);
      this.updateResponse = null;
      await UserApiService.updateUserMail(this.userPassword, this.userNewMail).then((response) => {
        this.updateResponse = response;
        this.setLoading(false);
        if(this.updateResponse.status===true){
          setTimeout(() => {
            this.onClose();
          }, this.delayBeforeClose*1000);
        }
        else if(this.updateResponse.code===403){
          this.canClose = false;
          setTimeout(() => {
            this.logout();
          }, this.delayBeforeClose*1000);
        }
      }).catch((error) => {
        this.errorMessage = ErrorService.showErrorInAlert(error);
      });
    },
  },
  mounted() {
  }
}

</script>

<style>

</style>