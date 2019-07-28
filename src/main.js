import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vuetify from 'vuetify';
import store from '@/store/store';
import './registerServiceWorker';
import 'vuetify/dist/vuetify.min.css';
import Vuelidate from 'vuelidate';
import moment from 'moment';
import UserMixins from '@/mixins/UserMixins';

Vue.use(Vuelidate);
Vue.use(Vuetify, {
  theme: {
    primary: '#3F51B5',
    secondary: '#303F9F',
    accent: '#FFC107',
    error: '#b71c1c'
  },
});

Vue.filter('time', function(value) {
  if (value) {
    return moment(String(value)).format('MM/DD/YYYY hh:mm')
  }
});

new Vue({
  router,
  store,
  mixnis: [UserMixins],
  render: h => h(App)
}).$mount('#app');