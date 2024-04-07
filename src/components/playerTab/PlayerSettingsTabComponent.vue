<template>
  <DeleteModalComponent v-if="showDeleteAccountModal"
      title="Suppression du compte"
      :canDelete="canDeleteAccount && canCloseDeleteAccountModal"
      :on-delete="onDeleteAccount"
      :can-close="canCloseDeleteAccountModalFromResponse && canCloseDeleteAccountModal"
      :on-close="hideDeleteAccountModal"  >
    <template v-slot:modalContent>
      <template v-if="deleteAccountResponse!=null && deleteAccountResponse.status===true">
        <div class="alert alert-success" role="alert">
          {{deleteAccountResponse.message}}
        </div>
      </template>
      <template v-else>
        <div class="alert alert-danger" role="alert" v-if="deleteAccountResponse!=null && deleteAccountResponse.status!==true">
          {{deleteAccountResponse.message}}
        </div>
        <div class="">Si vous êtes certain de vouloir supprimer votre compte, merci d'entre votre mot de passe puis de cliquer sur supprimer.</div>
        <Form novalidate @submit.prevent="onDeleteAccount">
          <div class="mb-3">
            <label for="password" class="form-label">Mot de passe</label>
            <Field name="password" type="password" class="form-control" v-model="deletePassword"
                   id="password" rules="required" label="Mot de passe"/>
            <ErrorMessage name="password" class="text-danger" />
          </div>
        </Form>
      </template>
    </template>
  </DeleteModalComponent>
  <PasswordResetModalComponent :on-close="hidePasswordResetModal" v-if="showPasswordResetModal"
                               :is-connected-user="true"/>
  <MailUpdateModalComponent :on-close="hideMailUpdateModal" v-if="showMailUpdateModal"/>
  <div>
    <TabAreaComponent title="Préférences">
      <template v-slot:tab-area-content>
        <div><span class="bold">Test : </span><span></span></div>
      </template>
    </TabAreaComponent>
    <TabAreaComponent title="Paramètres du compte">
      <template v-slot:tab-area-content>
        <div class="col-12 text-danger">
          <span class="bold">Suppression du compte</span>
          <button class="btn btn-sm btn-danger fa-pull-right" @click="deleteAccount">Supprimer</button>
        </div>
        <div class="col-12 mt-3">
          <span class="bold">Modification du mot de passe :</span>
          <button class="btn btn-sm btn-primary fa-pull-right" @click="resetPassword">Modifier</button>
        </div>
        <div class="col-12 mt-3">
          <span class="bold">Modification de l'adresse mail :</span>
          <button class="btn btn-sm btn-primary fa-pull-right" @click="updateMail">Modifier</button>
        </div>
      </template>
    </TabAreaComponent>
    <TabAreaComponent title="Sécurité">
      <template v-slot:tab-area-content>
        <div><span class="bold">Test : </span><span></span></div>
      </template>
    </TabAreaComponent>
  </div>
</template>
<script>

import {mapActions, mapGetters} from "vuex";
import TabAreaComponent from "@/components/TabAreaComponent.vue";
import {Field, Form, defineRule, ErrorMessage, configure} from 'vee-validate';
import DeleteModalComponent from "@/components/modal/DeleteModalComponent.vue";
import {required} from "@vee-validate/rules";
import UserApiService from "@/services/api/userApiService.js";
import ErrorService from "@/services/errorService.js";
import MailUpdateModalComponent from "@/components/modal/player/MailUpdateModalComponent.vue";
import PasswordResetModalComponent from "@/components/modal/login/PasswordResetModalComponent.vue";

defineRule('required', required);

configure({
  generateMessage: (ctx) => {
    const messages = {
      required: `Le champ ${ctx.label} est requis.`,
    };
    return messages[ctx.rule.name] ? messages[ctx.rule.name] : `Le champ ${ctx.label} est invalide.`;
  },
  validateOnInput: true,
});
export default {
  name: 'PlayerSettingsTabComponent',
  components: {
    PasswordResetModalComponent,
    MailUpdateModalComponent, ErrorMessage, Field, DeleteModalComponent,Form, TabAreaComponent},
  props: ['playerId'],
  data() {
    return {
      showDeleteAccountModal: false,
      showPasswordResetModal: false,
      showMailUpdateModal: false,
      deleteAccountResponse: null,
      deletePassword: null,
      delayAfterDeleteAccount : 5,
      canCloseDeleteAccountModal: true,
    }
  },
  computed: {
    ...mapGetters(['isTestMode']),
    ...mapGetters("auth", ["connectedUser"]),
    canCloseDeleteAccountModalFromResponse(){
      return this.deleteAccountResponse==null || this.deleteAccountResponse.status!==true;
    },
    canDeleteAccount(){
      return this.canCloseDeleteAccountModalFromResponse && this.deletePassword!=null && this.deletePassword!=='';
    }
  },
  methods: {
    ...mapActions(["setLoading"]),
    ...mapActions('auth', ['logout']),
    deleteAccount() {
      this.showDeleteAccountModal = true;
    },
    async onDeleteAccount() {
      this.setLoading(true);
      await UserApiService.deleteAccount(this.deletePassword).then((response) => {
        this.deleteAccountResponse = response;
      }).catch((error) => {
        ErrorService.showErrorInAlert(error);
      });
      this.setLoading(false);
      if(this.deleteAccountResponse.status===true){
        setTimeout(() => {
          this.$store.dispatch("auth/logout");
          this.$router.push({name: 'Home'});
        }, this.delayAfterDeleteAccount*1000);
      }
      else if(this.deleteAccountResponse.code===403){
        this.canCloseDeleteAccountModal = false;
        setTimeout(() => {
          this.logout();
        }, this.delayAfterDeleteAccount*1000);
      }
    },
    hideDeleteAccountModal() {
      this.deletePassword = null;
      this.deleteAccountResponse = null;
      this.showDeleteAccountModal = false;
    },
    resetPassword() {
      this.showPasswordResetModal=true;
    },
    hidePasswordResetModal() {
      this.showPasswordResetModal=false;
    },
    updateMail() {
      this.showMailUpdateModal=true;
    },
    hideMailUpdateModal() {
      this.showMailUpdateModal=false;
    }
  },
  mounted() {
  }
}

</script>
<style scoped>

</style>