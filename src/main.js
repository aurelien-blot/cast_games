import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store/store.js';

import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.css';
/* import the fontawesome core */

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

import { faDice, faDiceOne, faDiceTwo,
    faDiceThree, faDiceFour, faDiceFive,
    faDiceSix, faRightFromBracket, faChevronUp, faChevronDown,
    faPenToSquare,
    faCheck, faCross} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faDice)
library.add(faDiceOne)
library.add(faDiceTwo)
library.add(faDiceThree)
library.add(faDiceFour)
library.add(faDiceFive)
library.add(faDiceSix)
library.add(faCheck)
library.add(faCross)
library.add(faChevronUp)
library.add(faChevronDown)
library.add(faRightFromBracket)
library.add(faPenToSquare)

const app = createApp(App);
app.use(router);
app.use(store);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
