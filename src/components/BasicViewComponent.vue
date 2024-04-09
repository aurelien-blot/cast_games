
<template>
  <LoadingComponent/>
  <SignInModalComponent v-if="showSignInModal"
                        :on-close="hideSignInModal"/>
  <SignUpModalComponent  v-if="showSignUpModal"
                         :on-close="hideSignUpModal"
                         :redirect-to-sign-in ="redirectToSignIn"
                         :redirect-to-reset-password ="redirectToResetPassword"/>
  <PasswordResetModalComponent :on-close="hidePasswordResetModal" v-if="showPasswordResetModal"/>
  <div class="container">
    <AppBarComponent  :game-list="gameList"
                      :sign-in="signIn" :sign-up="signUp" :logout="doLogOut"
    />
    <slot name="content"></slot>
  </div>
</template>

<script>
import gamesJson from '@/content/games.json';
import {mapActions, mapGetters} from "vuex";
import AppBarComponent from "@/components/AppBarComponent.vue";
import PasswordResetModalComponent from "@/components/modal/login/PasswordResetModalComponent.vue";
import WarningModalComponent from "@/components/modal/WarningModalComponent.vue";
import BasicModalComponent from "@/components/modal/BasicModalComponent.vue";
import SignInModalComponent from "@/components/modal/login/SignInModalComponent.vue";
import SignUpModalComponent from "@/components/modal/login/SignUpModalComponent.vue";
import LoadingComponent from "@/components/util/LoadingComponent.vue";

export default {
  name: 'BasicViewComponent',
  components: {
    AppBarComponent,
    PasswordResetModalComponent,
    WarningModalComponent,
    BasicModalComponent,
    SignInModalComponent,
    SignUpModalComponent,
    LoadingComponent,
  },
  data() {
    return {
      gameList: [],
      showSignUpModal: false,
      showSignInModal: false,
      showPasswordResetModal: false,
    }
  },
  computed: {
    ...mapGetters(['isTestMode']),
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions(['setLoading']),
    loadGameListFromJson() {
      this.gameList = gamesJson;
    },
    async doLogOut(){
      await this.setLoading(true);
      await this.logout();
      await this.setLoading(false);
    },
    signIn(){
      this.showSignInModal = true;
    },
    signUp(){
      this.showSignUpModal = true;
    },
    hideSignUpModal(){
      this.showSignUpModal = false;
    },
    hideSignInModal(isUserRegistered){
      this.showSignInModal = false;
      if(isUserRegistered){
        this.showSignUpModal = true;
      }
    },
    redirectToSignIn(){
      this.hideSignUpModal();
      this.showSignInModal = true;
    },
    redirectToResetPassword(){
      this.hideSignUpModal();
      this.showPasswordResetModal = true;
    },
    hidePasswordResetModal(){
      this.showPasswordResetModal = false;
    },
  },
  mounted() {
    this.loadGameListFromJson()
  }
}

</script>
